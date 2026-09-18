import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit'
import { Resend } from 'resend'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_RESUME_BYTES = 5 * 1024 * 1024
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png'])

function validateUpload(file: File, kind: 'image' | 'resume') {
  const max = kind === 'resume' ? MAX_RESUME_BYTES : MAX_IMAGE_BYTES
  if (file.size > max) {
    throw new Error(`${kind === 'resume' ? 'Resume' : 'Image'} files must be ${kind === 'resume' ? '5MB' : '10MB'} or smaller.`)
  }
  if (kind === 'resume' && file.type !== 'application/pdf') throw new Error('Resume must be a PDF file.')
  if (kind === 'image' && !IMAGE_TYPES.has(file.type)) throw new Error('Photos must be JPG or PNG files.')
}

// ─── Helper: upload a file to Supabase storage ───────────────────────────────

async function uploadFile(
  supabase: ReturnType<typeof createAdminClient>,
  file: File,
  path: string,
): Promise<string> {
  validateUpload(file, file.type === 'application/pdf' ? 'resume' : 'image')
  const { error } = await supabase.storage
    .from('talent-media')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) {
    console.error(`Upload error [${path}]:`, error)
    throw new Error(`File upload failed: ${error.message}`)
  }

  const { data } = supabase.storage.from('talent-media').getPublicUrl(path)
  return data.publicUrl
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const rl = checkRateLimit(getRateLimitKey(req, 'submission'), { limit: 10, windowMs: 300_000 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })
    }

    const formData = await req.formData()

    // Honeypot: bots fill this hidden field
    if (formData.get('_gotcha')) {
      return NextResponse.json({ success: true })
    }

    const supabase = createAdminClient()
    const ts = Date.now()

    // ── Parse text fields ──────────────────────────────────────────────────

    const str = (key: string) => (formData.get(key) as string | null) ?? ''
    const bool = (key: string) => formData.get(key) === 'true'
    const jsonArr = (key: string): string[] => {
      try { return JSON.parse(str(key)) } catch { return [] }
    }
    const jsonObj = (key: string): Record<string, string> => {
      try { return JSON.parse(str(key)) } catch { return {} }
    }

    const fields = {
      // Step 1 — Personal Info
      first_name: str('first_name'),
      last_name: str('last_name'),
      stage_name: str('stage_name') || null,
      email: str('email'),
      phone: str('phone') || null,
      dob: str('dob') || null,
      city: str('city') || null,
      state: str('state') || null,
      bio: str('bio') || null,

      // Step 2 — Talent Details
      representation_type: str('representation_type') || null,
      union_status: str('union_status') || null,
      categories: jsonArr('talent_categories'),

      // Step 3 — Attributes & Skills
      gender: str('gender') || null,
      height: str('height') || null,
      weight: str('weight') || null,
      hair_color: str('hair_color') || null,
      eye_color: str('eye_color') || null,
      skin_tone: str('skin_tone') || null,
      ethnicity: jsonArr('ethnicity'),
      wardrobe_sizes: jsonObj('wardrobe_sizes'),
      shoe_size: str('shoe_size'),
      skills: jsonArr('skills'),
      languages: str('languages') ? str('languages').split(',').map(s => s.trim()).filter(Boolean) : [],
      dialects: str('dialects') ? str('dialects').split(',').map(s => s.trim()).filter(Boolean) : [],
      instruments: str('instruments') || null,

      // Step 4 — Media (URLs / text)
      demo_reel_url: str('demo_reel_url'),
      voice_reel_url: str('voice_reel_url'),
      instagram: str('instagram'),
      tiktok: str('tiktok'),
      youtube: str('youtube'),

      // Step 5 — Experience
      experience_categories: jsonArr('experience_categories'),
      experience_level: str('experience_level') || null,
      notable_credits: str('notable_credits') || null,

      // Step 6 — Availability
      has_passport: bool('has_passport'),
      has_drivers_license: bool('has_drivers_license'),
      has_transportation: bool('has_transportation'),
      will_travel: bool('will_travel'),
      local_hire_markets: str('local_hire_markets') ? str('local_hire_markets').split(',').map(s => s.trim()).filter(Boolean) : [],

      // Guardian (minors)
      guardian_name: str('guardian_name') || null,
      guardian_email: str('guardian_email') || null,
      guardian_phone: str('guardian_phone') || null,
      guardian_relationship: str('guardian_relationship') || null,
    }

    const requiredMissing = [
      ['First name', fields.first_name],
      ['Last name', fields.last_name],
      ['Email', fields.email],
      ['Date of birth', fields.dob],
      ['City', fields.city],
      ['State', fields.state],
    ].filter(([, value]) => !String(value ?? '').trim()).map(([label]) => label)
    if (requiredMissing.length || fields.categories.length === 0) {
      if (fields.categories.length === 0) requiredMissing.push('at least one talent category')
      return NextResponse.json({ error: `Please complete: ${requiredMissing.join(', ')}.` }, { status: 400 })
    }

    // Derive is_minor from DOB
    const dobStr = str('dob')
    let is_minor = false
    if (dobStr) {
      const birth = new Date(dobStr)
      const today = new Date()
      let age = today.getFullYear() - birth.getFullYear()
      const m = today.getMonth() - birth.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
      is_minor = age < 18
    }

    if (is_minor && (!fields.guardian_name || !fields.guardian_email || !fields.guardian_relationship)) {
      return NextResponse.json({ error: 'Guardian name, email, and relationship are required for applicants under 18.' }, { status: 400 })
    }

    const fileKey = `${ts}-${crypto.randomUUID()}`

    // ── Upload photo files ─────────────────────────────────────────────────

    // Primary headshot (required)
    let headshot_url = ''
    const headshotFile = formData.get('headshot') as File | null
    if (!headshotFile || headshotFile.size === 0) {
      return NextResponse.json({ error: 'A primary headshot photo is required.' }, { status: 400 })
    }
    if (headshotFile && headshotFile.size > 0) {
      const ext = headshotFile.name.split('.').pop()
      headshot_url = await uploadFile(
        supabase,
        headshotFile,
        `headshots/${fileKey}.${ext}`,
      )
    }

    // Commercial headshot (optional)
    let commercial_headshot_url = ''
    const commercialFile = formData.get('commercial_headshot') as File | null
    if (commercialFile && commercialFile.size > 0) {
      const ext = commercialFile.name.split('.').pop()
      commercial_headshot_url = await uploadFile(
        supabase,
        commercialFile,
        `headshots/commercial/${fileKey}.${ext}`,
      )
    }

    // Theatrical headshot (optional)
    let theatrical_headshot_url = ''
    const theatricalFile = formData.get('theatrical_headshot') as File | null
    if (theatricalFile && theatricalFile.size > 0) {
      const ext = theatricalFile.name.split('.').pop()
      theatrical_headshot_url = await uploadFile(
        supabase,
        theatricalFile,
        `headshots/theatrical/${fileKey}.${ext}`,
      )
    }

    // Full body photo (optional)
    let full_body_url = ''
    const fullBodyFile = formData.get('full_body') as File | null
    if (fullBodyFile && fullBodyFile.size > 0) {
      const ext = fullBodyFile.name.split('.').pop()
      full_body_url = await uploadFile(
        supabase,
        fullBodyFile,
        `photos/full-body/${fileKey}.${ext}`,
      )
    }

    // Resume PDF (optional)
    let resume_url = ''
    const resumeFile = formData.get('resume_file') as File | null
    if (resumeFile && resumeFile.size > 0) {
      const ext = resumeFile.name.split('.').pop() || 'pdf'
      resume_url = await uploadFile(
        supabase,
        resumeFile,
        `resumes/${fileKey}.${ext}`,
      )
    }

    // ── Insert into database ───────────────────────────────────────────────

    const { data: submission, error: dbError } = await supabase
      .from('talent_submissions')
      .insert({
        ...fields,
        is_minor,
        headshot_url,
        commercial_headshot_url,
        theatrical_headshot_url,
        full_body_url,
        resume_url,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 })
    }

    // ── Confirmation email to talent ───────────────────────────────────────

    try {
      await getResend().emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        replyTo: 'info@landiloutalentagency.com',
        to: fields.email,
        subject: 'Your Landi-Lou Talent Agency Application Was Received',
        html: `
          <div style="background:#06080f;color:#f0ead8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;">
            <img src="${process.env.NEXT_PUBLIC_SITE_URL}/logo.png" alt="Landi-Lou" style="width:80px;border-radius:50%;margin-bottom:24px;" />
            <h1 style="color:#c9a84c;font-size:28px;margin-bottom:8px;">Application Received</h1>
            <p style="color:#9ba9bb;margin-bottom:24px;">Thank you for submitting your talent profile.</p>
            <p style="margin-bottom:16px;">Hi <strong>${fields.first_name}</strong>,</p>
            <p style="line-height:1.7;margin-bottom:24px;">
              We have received your submission to Landi-Lou Talent Agency. Our team reviews every profile
              personally and with intention. We will be in touch if there is a fit.
            </p>
            <p style="line-height:1.7;color:#9ba9bb;margin-bottom:32px;">
              In the meantime, we invite you to continue developing your craft. Excellence is a practice.
            </p>
            <hr style="border-color:rgba(201,168,76,0.2);margin-bottom:24px;" />
            <p style="color:#9ba9bb;font-size:12px;">
              Landi-Lou Talent Agency &bull; Central Florida<br/>
              <a href="mailto:info@landiloutalentagency.com" style="color:#c9a84c;">info@landiloutalentagency.com</a>
            </p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Talent confirmation email failed:', emailErr)
    }

    // ── Admin notification email ───────────────────────────────────────────

    try {
      await getResend().emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        replyTo: 'info@landiloutalentagency.com',
        to: process.env.RESEND_FROM_EMAIL!,
        subject: `New Talent Submission: ${fields.first_name} ${fields.last_name}`,
        html: `
          <div style="background:#0d1120;color:#f0ead8;font-family:sans-serif;padding:32px;max-width:680px;">
            <h2 style="color:#c9a84c;">New Submission</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;color:#9ba9bb;width:180px;">Name</td><td>${fields.first_name} ${fields.last_name}${fields.stage_name ? ` (${fields.stage_name})` : ''}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Email</td><td>${fields.email}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Phone</td><td>${fields.phone || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Location</td><td>${fields.city}, ${fields.state}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">DOB</td><td>${fields.dob || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Representation</td><td>${fields.representation_type || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Union Status</td><td>${fields.union_status || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Categories</td><td>${fields.categories.join(', ') || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Experience Level</td><td>${fields.experience_level || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Gender</td><td>${fields.gender || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Will Travel</td><td>${fields.will_travel ? 'Yes' : 'No'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Headshot</td><td>${headshot_url ? `<a href="${headshot_url}" style="color:#c9a84c;">View</a>` : 'None'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Resume</td><td>${resume_url ? `<a href="${resume_url}" style="color:#c9a84c;">View</a>` : 'None'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Demo Reel</td><td>${fields.demo_reel_url ? `<a href="${fields.demo_reel_url}" style="color:#c9a84c;">${fields.demo_reel_url}</a>` : 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Instagram</td><td>${fields.instagram || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">TikTok</td><td>${fields.tiktok || 'N/A'}</td></tr>
            </table>
            <br/>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/submissions/${submission.id}" style="background:#c9a84c;color:#06080f;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:600;display:inline-block;">
              Review Submission
            </a>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Admin notification email failed:', emailErr)
    }

    return NextResponse.json({ success: true, id: submission.id })
  } catch (err) {
    console.error('Submission error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
