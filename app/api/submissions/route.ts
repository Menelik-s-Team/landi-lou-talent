import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

// ─── Helper: upload a file to Supabase storage and return its public URL ──────

async function uploadFile(
  supabase: ReturnType<typeof createAdminClient>,
  file: File,
  path: string,
): Promise<string> {
  const { error } = await supabase.storage
    .from('talent-media')
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) {
    console.error(`Upload error [${path}]:`, error)
    return ''
  }

  const { data } = supabase.storage.from('talent-media').getPublicUrl(path)
  return data.publicUrl
}

function slug(email: string): string {
  return email.replace(/[^a-z0-9]/gi, '_').slice(0, 40)
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
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
      stage_name: str('stage_name'),
      email: str('email'),
      phone: str('phone'),
      dob: str('dob'),
      city: str('city'),
      state: str('state'),
      bio: str('bio'),

      // Step 2 — Talent Details
      representation_type: str('representation_type'),
      union_status: str('union_status'),
      talent_categories: jsonArr('talent_categories'),

      // Step 3 — Attributes & Skills
      gender: str('gender'),
      height: str('height'),
      weight: str('weight'),
      hair_color: str('hair_color'),
      eye_color: str('eye_color'),
      ethnicity: jsonArr('ethnicity'),
      wardrobe_sizes: jsonObj('wardrobe_sizes'),
      shoe_size: str('shoe_size'),
      skills: jsonArr('skills'),
      languages: str('languages'),
      dialects: str('dialects'),
      instruments: str('instruments'),
      sports: str('sports'),

      // Step 4 — Media (URLs / text)
      demo_reel_url: str('demo_reel_url'),
      voice_reel_url: str('voice_reel_url'),
      instagram: str('instagram'),
      tiktok: str('tiktok'),
      youtube: str('youtube'),

      // Step 5 — Experience
      experience_categories: jsonArr('experience_categories'),
      experience_level: str('experience_level'),
      notable_credits: str('notable_credits'),

      // Step 6 — Availability
      availability_type: jsonArr('availability_type'),
      has_passport: bool('has_passport'),
      has_drivers_license: bool('has_drivers_license'),
      has_transportation: bool('has_transportation'),
      local_hire_markets: str('local_hire_markets'),
    }

    const emailSlug = slug(fields.email)

    // ── Upload photo files ─────────────────────────────────────────────────

    // Primary headshot (required)
    let headshot_url = ''
    const headshotFile = formData.get('headshot') as File | null
    if (headshotFile && headshotFile.size > 0) {
      const ext = headshotFile.name.split('.').pop()
      headshot_url = await uploadFile(
        supabase,
        headshotFile,
        `headshots/${ts}-${emailSlug}.${ext}`,
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
        `headshots/commercial/${ts}-${emailSlug}.${ext}`,
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
        `headshots/theatrical/${ts}-${emailSlug}.${ext}`,
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
        `photos/full-body/${ts}-${emailSlug}.${ext}`,
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
        `resumes/${ts}-${emailSlug}.${ext}`,
      )
    }

    // ── Insert into database ───────────────────────────────────────────────

    const { data: submission, error: dbError } = await supabase
      .from('talent_submissions')
      .insert({
        ...fields,
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

    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
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

    // ── Admin notification email ───────────────────────────────────────────

    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
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
            <tr><td style="padding:8px 0;color:#9ba9bb;">Categories</td><td>${fields.talent_categories.join(', ') || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Experience Level</td><td>${fields.experience_level || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Gender</td><td>${fields.gender || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Availability</td><td>${fields.availability_type.join(', ') || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Headshot</td><td>${headshot_url ? `<a href="${headshot_url}" style="color:#c9a84c;">View</a>` : 'None'}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Resume</td><td>${resume_url ? `<a href="${resume_url}" style="color:#c9a84c;">View</a>` : 'None'}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Demo Reel</td><td>${fields.demo_reel_url ? `<a href="${fields.demo_reel_url}" style="color:#c9a84c;">${fields.demo_reel_url}</a>` : 'N/A'}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Instagram</td><td>${fields.instagram || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">TikTok</td><td>${fields.tiktok || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Notable Credits</td><td>${fields.notable_credits || 'N/A'}</td></tr>
          </table>
          <br/>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/submissions/${submission.id}" style="background:#c9a84c;color:#06080f;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:600;display:inline-block;">
            Review Submission
          </a>
        </div>
      `,
    })

    return NextResponse.json({ success: true, id: submission.id })
  } catch (err) {
    console.error('Submission error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
