import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth-guard'
import { Resend } from 'resend'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { id } = await params
  const supabase = createAdminClient()

  const { data: talent, error: fetchError } = await supabase
    .from('talent_profiles')
    .select('id, first_name, last_name, email, user_id')
    .eq('id', id)
    .single()

  if (fetchError || !talent) {
    return NextResponse.json({ error: 'Talent profile not found.' }, { status: 404 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://landiloutalentagency.com'
  const portalLinkExpiry = process.env.PORTAL_LINK_EXPIRY_LABEL ?? '1 hour'

  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: talent.email,
    options: { redirectTo: `${siteUrl}/auth/confirm?next=/talent-portal` },
  })

  if (linkError || !linkData?.properties?.action_link) {
    console.error('[resend-portal] generateLink failed:', linkError?.message, 'talent:', id)
    return NextResponse.json({
      error: `Failed to generate portal access link: ${linkError?.message ?? 'unknown error'}`,
    }, { status: 500 })
  }

  const portalAccessLink = linkData.properties.action_link

  const { error: emailError } = await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    replyTo: 'info@landiloutalentagency.com',
    to: talent.email,
    subject: 'Your Landi-Lou Talent Portal Access Link',
    html: `
      <div style="background:#06080f;color:#f0ead8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#c9a84c;font-size:24px;margin-bottom:8px;">Portal Access Link</h1>
        <p style="color:#9ba9bb;margin-bottom:24px;">Landi-Lou Talent Agency</p>
        <p style="margin-bottom:16px;">Hi <strong>${talent.first_name}</strong>,</p>
        <p style="line-height:1.8;margin-bottom:24px;">
          Here is your secure link to access your Talent Portal. Click below to sign in and set your password.
        </p>
        <div style="text-align:center;margin-bottom:24px;">
          <a href="${portalAccessLink}"
             style="display:inline-block;background:#c9a84c;color:#06080f;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:bold;font-size:15px;">
            Access My Portal
          </a>
        </div>
        <div style="background:#0d1120;border:1px solid rgba(201,168,76,0.1);border-radius:6px;padding:14px;margin-bottom:24px;">
          <p style="color:#9ba9bb;font-size:12px;line-height:1.7;margin:0;">
            <strong style="color:#f0ead8;">This link expires in ${portalLinkExpiry}.</strong>
            If it has expired, go to your Forgot Password page:<br/>
            <a href="${siteUrl}/forgot-password" style="color:#c9a84c;">${siteUrl}/forgot-password</a><br/>
            Your sign-in page: <a href="${siteUrl}/login" style="color:#c9a84c;">${siteUrl}/login</a>
          </p>
        </div>
        <hr style="border-color:rgba(201,168,76,0.2);margin-bottom:16px;" />
        <p style="color:#9ba9bb;font-size:12px;">
          Landi-Lou Talent Agency &bull; <a href="mailto:info@landiloutalentagency.com" style="color:#c9a84c;">info@landiloutalentagency.com</a>
        </p>
      </div>
    `,
  })

  if (emailError) {
    console.error('[resend-portal] email send failed:', emailError.message, 'talent:', id)
    return NextResponse.json({
      error: `Link generated but email failed to send: ${emailError.message}`,
    }, { status: 500 })
  }

  // Log the action
  await supabase.from('admin_recovery_log').insert({
    talent_profile_id: talent.id,
    talent_email: talent.email,
    talent_name: `${talent.first_name} ${talent.last_name}`,
    action_type: 'resend_portal',
  })

  return NextResponse.json({ success: true })
}
