import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createAdminClient()

  // Fetch portfolio + submission data
  const { data: portfolio, error: fetchError } = await supabase
    .from('talent_onboarding_portfolios')
    .select('*, talent_submissions(first_name, last_name, email)')
    .eq('token', token)
    .single()

  if (fetchError || !portfolio) {
    return NextResponse.json({ error: 'Portfolio not found.' }, { status: 404 })
  }

  if (portfolio.token_expires_at && new Date(portfolio.token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'This onboarding link has expired.' }, { status: 410 })
  }

  if (portfolio.status === 'completed') {
    return NextResponse.json({ error: 'Already completed.' }, { status: 409 })
  }

  // Mark as completed
  const { error: updateError } = await supabase
    .from('talent_onboarding_portfolios')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      current_step: 13,
    })
    .eq('token', token)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const submission = portfolio.talent_submissions as {
    first_name: string
    last_name: string
    email: string
  } | null

  const talentName = submission
    ? `${submission.first_name} ${submission.last_name}`
    : (portfolio.legal_name ?? 'Talent')
  const talentEmail = submission?.email ?? ''

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://landiloutalentagency.com'
  const resend = getResend()

  // Confirmation email to talent
  if (talentEmail) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
    replyTo: 'info@landiloutalentagency.com',
      to: talentEmail,
      subject: 'Portfolio Received — Landi-Lou Talent Agency',
      html: `
        <div style="background:#06080f;color:#f0ead8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;">
          <div style="text-align:center;margin-bottom:32px;">
            <img src="${siteUrl}/logo.png" alt="Landi-Lou Talent Agency" style="height:60px;margin:0 auto;" />
          </div>
          <h1 style="color:#c9a84c;font-size:26px;margin-bottom:8px;text-align:center;">Portfolio Received</h1>
          <p style="color:#9ba9bb;text-align:center;margin-bottom:32px;">Thank you for completing your digital portfolio.</p>

          <p style="margin-bottom:16px;">Hi <strong>${talentName}</strong>,</p>
          <p style="line-height:1.8;margin-bottom:24px;">
            We have received your completed onboarding portfolio. Our team will review your information,
            countersign your representation agreement, and be in touch within 3&ndash;5 business days to
            confirm your representation is fully active.
          </p>

          <div style="background:#0d1120;border:1px solid rgba(201,168,76,0.3);border-radius:8px;padding:24px;margin-bottom:32px;">
            <p style="color:#c9a84c;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;">What happens next</p>
            <ul style="color:#f0ead8;line-height:2;padding-left:20px;margin:0;">
              <li>Agency review of your submitted portfolio</li>
              <li>Digital countersignature from agency director</li>
              <li>Confirmation email that representation is active</li>
            </ul>
          </div>

          <hr style="border-color:rgba(201,168,76,0.2);margin-bottom:24px;" />
          <p style="color:#9ba9bb;font-size:12px;text-align:center;">
            Landi-Lou Talent Agency &bull; Central Florida<br/>
            <a href="mailto:info@landiloutalentagency.com" style="color:#c9a84c;">info@landiloutalentagency.com</a>
          </p>
        </div>
      `,
    })
  }

  // Notification to admin
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    replyTo: 'info@landiloutalentagency.com',
    to: 'info@landiloutalentagency.com',
    subject: `Portfolio Completed — ${talentName}`,
    html: `
      <div style="background:#06080f;color:#f0ead8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#c9a84c;font-size:22px;margin-bottom:8px;">Portfolio Ready for Review</h1>
        <p style="margin-bottom:16px;"><strong>${talentName}</strong> has completed their onboarding portfolio and is awaiting your countersignature.</p>
        <a href="${siteUrl}/admin/portfolio/${portfolio.id}"
           style="display:inline-block;background:#c9a84c;color:#06080f;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:bold;font-size:14px;letter-spacing:1px;">
          Review &amp; Countersign Portfolio
        </a>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
