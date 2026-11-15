import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

// Always returns the same neutral response — never reveals whether an account exists.
function neutralOk() { return NextResponse.json({ ok: true }) }

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email required' }, { status: 400 })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const supabase = createAdminClient()

  // Look up whether an account exists — silently skip if not found.
  const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const existing = users?.find(u => u.email?.toLowerCase() === normalizedEmail)

  if (!existing) {
    // No account — return neutral response, send nothing.
    return neutralOk()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://landiloutalentagency.com'
  const portalLinkExpiry = process.env.PORTAL_LINK_EXPIRY_LABEL ?? '1 hour'

  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: normalizedEmail,
    options: { redirectTo: `${siteUrl}/auth/callback?next=/set-new-password` },
  })

  if (linkError || !linkData?.properties?.action_link) {
    console.error('[request-reset] generateLink failed:', linkError?.message, 'email:', normalizedEmail)
    // Still return neutral — talent sees the same screen either way.
    return neutralOk()
  }

  const resetLink = linkData.properties.action_link

  const { error: emailError } = await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    replyTo: 'info@landiloutalentagency.com',
    to: normalizedEmail,
    subject: 'Reset Your Landi-Lou Talent Portal Password',
    html: `
      <div style="background:#06080f;color:#f0ead8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <img src="${siteUrl}/logo.png" alt="Landi-Lou Talent Agency" style="height:60px;margin:0 auto;" />
        </div>

        <h1 style="color:#c9a84c;font-size:28px;margin-bottom:8px;text-align:center;">Password Reset</h1>
        <p style="color:#9ba9bb;text-align:center;letter-spacing:2px;font-size:12px;text-transform:uppercase;margin-bottom:36px;">Landi-Lou Talent Agency</p>

        <p style="line-height:1.8;margin-bottom:24px;">
          We received a request to reset the password for your Landi-Lou Talent Portal account.
          Click the button below to set a new password.
        </p>

        <div style="text-align:center;margin-bottom:32px;">
          <a href="${resetLink}"
             style="display:inline-block;background:#c9a84c;color:#06080f;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:bold;font-size:15px;letter-spacing:1px;">
            Set New Password
          </a>
        </div>

        <div style="background:#0d1120;border:1px solid rgba(201,168,76,0.1);border-radius:6px;padding:14px;margin-bottom:32px;">
          <p style="color:#9ba9bb;font-size:12px;line-height:1.7;margin:0;">
            <strong style="color:#f0ead8;">This link expires in ${portalLinkExpiry}.</strong>
            If it has expired by the time you open it, request a new one at:<br/>
            <a href="${siteUrl}/forgot-password" style="color:#c9a84c;">${siteUrl}/forgot-password</a><br/>
            Your sign-in page: <a href="${siteUrl}/login" style="color:#c9a84c;">${siteUrl}/login</a>
          </p>
        </div>

        <p style="color:#9ba9bb;font-size:12px;line-height:1.7;">
          If you did not request a password reset, you can ignore this email — your account has not been changed.
        </p>

        <hr style="border-color:rgba(201,168,76,0.2);margin:24px 0;" />
        <p style="color:#9ba9bb;font-size:12px;text-align:center;">
          Landi-Lou Talent Agency &bull; Central Florida<br/>
          <a href="mailto:info@landiloutalentagency.com" style="color:#c9a84c;">info@landiloutalentagency.com</a>
        </p>
      </div>
    `,
  })

  if (emailError) {
    console.error('[request-reset] email send failed:', emailError.message, 'email:', normalizedEmail)
    // Still return neutral — the error is logged server-side only.
  } else {
    console.log('[request-reset] reset email sent to:', normalizedEmail, '| link generated:', resetLink.substring(0, 80) + '...')
  }

  return neutralOk()
}
