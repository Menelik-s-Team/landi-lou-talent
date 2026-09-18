import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/auth-guard'

function getResend() {
  const { Resend } = require('resend')
  return new Resend(process.env.RESEND_API_KEY)
}

function row(label: string, value: string | undefined | null) {
  if (!value) return ''
  return `<tr>
    <td style="padding:8px 12px;color:#9ba9bb;white-space:nowrap;vertical-align:top;font-size:13px;">${label}</td>
    <td style="padding:8px 12px;color:#f0ead8;font-size:13px;">${value}</td>
  </tr>`
}

export async function POST(req: NextRequest) {
  try {
    const rl = checkRateLimit(getRateLimitKey(req, 'talent-request'), { limit: 5, windowMs: 300_000 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await req.json()

    // Honeypot
    if (body._gotcha) {
      return NextResponse.json({ success: true })
    }

    const {
      contact_name,
      company,
      email,
      phone,
      project_name,
      project_type,
      talent_categories,
      gender_preference,
      age_min,
      age_max,
      union_status,
      dates_needed,
      location,
      budget_range,
      notes,
    } = body

    // Validate required fields
    if (!contact_name || !email || !project_name) {
      return NextResponse.json(
        { error: 'Contact name, email, and project name are required.' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { error: dbError } = await supabase
      .from('talent_requests')
      .insert({
        contact_name,
        company: company || null,
        email,
        phone: phone || null,
        project_name,
        project_type: project_type || null,
        talent_categories: talent_categories || [],
        gender_preference: gender_preference || null,
        age_range_min: age_min ? parseInt(age_min, 10) : null,
        age_range_max: age_max ? parseInt(age_max, 10) : null,
        union_status_preference: union_status || null,
        dates_needed: dates_needed || null,
        location: location || null,
        budget_range: budget_range || null,
        additional_notes: notes || null,
      })

    if (dbError) {
      console.error('DB error inserting talent_request:', dbError)
      return NextResponse.json({ error: 'Failed to save request.' }, { status: 500 })
    }

    const categoriesDisplay = Array.isArray(talent_categories) && talent_categories.length > 0
      ? talent_categories.join(', ')
      : 'Not specified'

    const ageDisplay =
      age_min && age_max ? `${age_min}–${age_max}`
      : age_min ? `${age_min}+`
      : age_max ? `Up to ${age_max}`
      : 'Any'

    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: 'info@landiloutalentagency.com',
      replyTo: email,
      subject: `New Client Request: ${project_name}`,
      html: `
        <div style="background:#0d1120;color:#f0ead8;font-family:sans-serif;padding:32px;max-width:640px;">
          <h2 style="color:#c9a84c;margin-bottom:4px;font-size:22px;">New Client Talent Request</h2>
          <p style="color:#9ba9bb;font-size:13px;margin-bottom:24px;">Via landiloutalentagency.com/for-clients</p>
          <table style="width:100%;border-collapse:collapse;background:#141929;border-radius:6px;overflow:hidden;">
            ${row('Contact Name', contact_name)}
            ${row('Company', company)}
            ${row('Email', `<a href="mailto:${email}" style="color:#c9a84c;">${email}</a>`)}
            ${row('Phone', phone)}
            ${row('Project Name', project_name)}
            ${row('Project Type', project_type)}
            ${row('Talent Categories', categoriesDisplay)}
            ${row('Gender Preference', gender_preference)}
            ${row('Age Range', ageDisplay)}
            ${row('Union Status', union_status)}
            ${row('Dates Needed', dates_needed)}
            ${row('Location', location)}
            ${row('Budget Range', budget_range)}
          </table>
          ${notes ? `
          <div style="margin-top:20px;padding:16px;background:#141929;border-radius:6px;border-left:3px solid #c9a84c;">
            <p style="color:#9ba9bb;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Additional Notes</p>
            <p style="margin:0;line-height:1.7;font-size:13px;">${escapeHtml(String(notes).slice(0, 2000)).replace(/\n/g, '<br/>')}</p>
          </div>` : ''}
          <p style="color:#9ba9bb;font-size:12px;margin-top:24px;">
            Landi-Lou Talent Agency &bull; <a href="mailto:info@landiloutalentagency.com" style="color:#c9a84c;">info@landiloutalentagency.com</a>
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Talent request error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
