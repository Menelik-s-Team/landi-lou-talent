import { NextRequest, NextResponse, after } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

const VALID_REPRESENTATION = new Set(['Exclusive', 'Non-Exclusive'])
const VALID_UNION = new Set(['SAG-AFTRA', 'SAG-Eligible', 'Equity', 'EMC', 'Non-Union', 'Other'])
const VALID_EXPERIENCE = new Set(['Beginner', 'Intermediate', 'Professional', 'Extensive Credits'])

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: existing, error: fetchError } = await supabase
    .from('talent_submissions')
    .select('status, headshot_url, commercial_headshot_url, theatrical_headshot_url, full_body_url, resume_url')
    .eq('id', id)
    .single()

  if (fetchError || !existing) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })
  }

  if (existing.status !== 'incomplete') {
    return NextResponse.json({ error: 'This submission has already been finalized.' }, { status: 409 })
  }

  if (!existing.headshot_url) {
    return NextResponse.json({ error: 'A primary headshot photo is required.' }, { status: 400 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request format.' }, { status: 400 })
  }

  const str = (key: string) => String(body[key] ?? '').trim()
  const bool = (key: string) => body[key] === true || body[key] === 'true'
  const toArr = (key: string): string[] => {
    const v = body[key]
    if (Array.isArray(v)) return v
    if (typeof v === 'string' && v) return v.split(',').map(s => s.trim()).filter(Boolean)
    return []
  }
  const jsonObj = (key: string): Record<string, string> => {
    const v = body[key]
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) return v as Record<string, string>
    if (typeof v === 'string') { try { return JSON.parse(v) } catch { return {} } }
    return {}
  }

  const firstName = str('first_name')
  const lastName = str('last_name')
  const email = str('email')
  const dob = str('dob')
  const city = str('city')
  const state = str('state')
  const categories = toArr('categories')
  const experienceLevel = str('experience_level')

  const missing: string[] = []
  if (!firstName) missing.push('First name')
  if (!lastName) missing.push('Last name')
  if (!email) missing.push('Email')
  if (!dob) missing.push('Date of birth')
  if (!city) missing.push('City')
  if (!state) missing.push('State')
  if (categories.length === 0) missing.push('at least one talent category')
  if (!experienceLevel) missing.push('Experience level')

  if (missing.length > 0) {
    return NextResponse.json({ error: `Please complete: ${missing.join(', ')}.` }, { status: 400 })
  }

  let is_minor = false
  if (dob) {
    const birth = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    is_minor = age < 18
  }

  const guardianName = str('guardian_name')
  const guardianEmail = str('guardian_email')
  const guardianRelationship = str('guardian_relationship')

  if (is_minor && (!guardianName || !guardianEmail || !guardianRelationship)) {
    return NextResponse.json({ error: 'Guardian name, email, and relationship are required for applicants under 18.' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('talent_submissions')
    .update({
      first_name: firstName,
      last_name: lastName,
      stage_name: str('stage_name') || null,
      email,
      phone: str('phone') || null,
      dob: dob || null,
      city: city || null,
      state: state || null,
      bio: str('bio') || null,
      representation_type: VALID_REPRESENTATION.has(str('representation_type')) ? str('representation_type') : null,
      union_status: VALID_UNION.has(str('union_status')) ? str('union_status') : null,
      categories,
      gender: str('gender') || null,
      height: str('height') || null,
      height_unit: str('height_unit') || null,
      weight: str('weight') || null,
      weight_unit: str('weight_unit') || null,
      hair_color: str('hair_color') || null,
      eye_color: str('eye_color') || null,
      ethnicity: toArr('ethnicity'),
      ethnicity_other: str('ethnicity_other') || null,
      wardrobe_sizes: jsonObj('wardrobe_sizes'),
      shoe_size: str('shoe_size') || null,
      skills: toArr('skills'),
      languages: toArr('languages'),
      dialects: toArr('dialects'),
      instruments: str('instruments') || null,
      demo_reel_url: str('demo_reel_url') || null,
      voice_reel_url: str('voice_reel_url') || null,
      instagram: str('instagram') || null,
      tiktok: str('tiktok') || null,
      youtube: str('youtube') || null,
      experience_categories: toArr('experience_categories'),
      experience_level: VALID_EXPERIENCE.has(experienceLevel) ? experienceLevel : null,
      notable_credits: str('notable_credits') || null,
      availability_type: toArr('availability_type'),
      has_passport: bool('has_passport'),
      has_drivers_license: bool('has_drivers_license'),
      has_transportation: bool('has_transportation'),
      will_travel: bool('will_travel'),
      local_hire_markets: toArr('local_hire_markets'),
      is_minor,
      guardian_name: is_minor ? (guardianName || null) : null,
      guardian_email: is_minor ? (guardianEmail || null) : null,
      guardian_phone: is_minor ? (str('guardian_phone') || null) : null,
      guardian_relationship: is_minor ? (guardianRelationship || null) : null,
      status: 'pending',
    })
    .eq('id', id)
    .eq('status', 'incomplete')

  if (updateError) {
    console.error('[finalize] update failed:', updateError.message, 'submission:', id)
    return NextResponse.json({ error: 'Failed to save submission. Please try again.' }, { status: 500 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://landiloutalentagency.com'

  after(async () => {
    try {
      await getResend().emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        replyTo: 'info@landiloutalentagency.com',
        to: email,
        subject: 'Your Landi-Lou Talent Agency Application Was Received',
        html: `
          <div style="background:#06080f;color:#f0ead8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;">
            <h1 style="color:#c9a84c;font-size:28px;margin-bottom:8px;">Application Received</h1>
            <p style="color:#9ba9bb;margin-bottom:24px;">Thank you for submitting your talent profile.</p>
            <p style="margin-bottom:16px;">Hi <strong>${firstName}</strong>,</p>
            <p style="line-height:1.7;margin-bottom:24px;">
              We have received your submission to Landi-Lou Talent Agency. Our team reviews every profile
              personally and with intention. We will be in touch if there is a fit.
            </p>
            <p style="line-height:1.7;color:#9ba9bb;margin-bottom:16px;">
              In the meantime, we invite you to continue developing your craft. Excellence is a practice.
            </p>
            <p style="line-height:1.7;color:#9ba9bb;margin-bottom:32px;">
              <strong style="color:#f0ead8;">What happens next:</strong> Our team reviews every profile personally.
              If your background matches an open opportunity, we will reach out directly by email.
              This process may take several weeks — we appreciate your patience.
            </p>
            <hr style="border-color:rgba(201,168,76,0.2);margin-bottom:24px;" />
            <p style="color:#9ba9bb;font-size:12px;">
              Landi-Lou Talent Agency &bull; Central Florida<br/>
              <a href="mailto:info@landiloutalentagency.com" style="color:#c9a84c;">info@landiloutalentagency.com</a>
            </p>
          </div>
        `,
      })
    } catch (e) {
      console.error('[finalize] talent confirmation email failed:', e)
    }

    try {
      await getResend().emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        replyTo: 'info@landiloutalentagency.com',
        to: process.env.RESEND_FROM_EMAIL!,
        subject: `New Talent Submission: ${firstName} ${lastName}`,
        html: `
          <div style="background:#0d1120;color:#f0ead8;font-family:sans-serif;padding:32px;max-width:680px;">
            <h2 style="color:#c9a84c;">New Submission</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;color:#9ba9bb;width:180px;">Name</td><td>${firstName} ${lastName}${str('stage_name') ? ` (${str('stage_name')})` : ''}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Email</td><td>${email}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Phone</td><td>${str('phone') || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Location</td><td>${city}, ${state}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">DOB</td><td>${dob || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Categories</td><td>${categories.join(', ') || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Experience Level</td><td>${experienceLevel || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;color:#9ba9bb;">Headshot</td><td><a href="${existing.headshot_url}" style="color:#c9a84c;">View</a></td></tr>
              ${existing.resume_url ? `<tr><td style="padding:8px 0;color:#9ba9bb;">Resume</td><td><a href="${existing.resume_url}" style="color:#c9a84c;">View</a></td></tr>` : ''}
            </table>
            <br/>
            <a href="${siteUrl}/admin/submissions/${id}" style="background:#c9a84c;color:#06080f;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:600;display:inline-block;">
              Review Submission
            </a>
          </div>
        `,
      })
    } catch (e) {
      console.error('[finalize] admin notification email failed:', e)
    }
  })

  return NextResponse.json({ success: true, id })
}
