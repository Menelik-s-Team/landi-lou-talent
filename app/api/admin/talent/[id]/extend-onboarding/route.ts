import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth-guard'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'

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
    .select('id, first_name, last_name, email, submission_id')
    .eq('id', id)
    .single()

  if (fetchError || !talent) {
    return NextResponse.json({ error: 'Talent profile not found.' }, { status: 404 })
  }

  if (!talent.submission_id) {
    return NextResponse.json({ error: 'No submission linked to this profile.' }, { status: 400 })
  }

  const { data: portfolio, error: portfolioError } = await supabase
    .from('talent_onboarding_portfolios')
    .select('id, status')
    .eq('submission_id', talent.submission_id)
    .single()

  if (portfolioError || !portfolio) {
    return NextResponse.json({ error: 'No onboarding portfolio found for this talent.' }, { status: 404 })
  }

  if (portfolio.status === 'completed') {
    return NextResponse.json({ error: 'This portfolio is already completed. No extension needed.' }, { status: 409 })
  }

  // Generate a new 64-char hex token (matches the DB default of encode(gen_random_bytes(32), 'hex'))
  const newToken = randomBytes(32).toString('hex')
  const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  const { error: updateError } = await supabase
    .from('talent_onboarding_portfolios')
    .update({ token: newToken, token_expires_at: newExpiry })
    .eq('id', portfolio.id)

  if (updateError) {
    console.error('[extend-onboarding] token update failed:', updateError.message, 'portfolio:', portfolio.id)
    return NextResponse.json({
      error: `Failed to generate new token: ${updateError.message}`,
    }, { status: 500 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://landiloutalentagency.com'
  const onboardingLink = `${siteUrl}/onboarding/${newToken}`

  const { error: emailError } = await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    replyTo: 'info@landiloutalentagency.com',
    to: talent.email,
    subject: 'Your Landi-Lou Onboarding Link Has Been Refreshed',
    html: `
      <div style="background:#06080f;color:#f0ead8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#c9a84c;font-size:24px;margin-bottom:8px;">New Onboarding Link</h1>
        <p style="color:#9ba9bb;margin-bottom:24px;">Landi-Lou Talent Agency</p>
        <p style="margin-bottom:16px;">Hi <strong>${talent.first_name}</strong>,</p>
        <p style="line-height:1.8;margin-bottom:24px;">
          Your Digital Onboarding Portfolio link has been refreshed. Click below to continue your onboarding.
          Any progress you already saved is preserved.
        </p>
        <div style="text-align:center;margin-bottom:24px;">
          <a href="${onboardingLink}"
             style="display:inline-block;background:#c9a84c;color:#06080f;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:bold;font-size:15px;">
            Continue Onboarding
          </a>
        </div>
        <p style="color:#9ba9bb;font-size:12px;text-align:center;margin-bottom:24px;">
          Link expires in 30 days &bull; You can save progress and return
        </p>
        <hr style="border-color:rgba(201,168,76,0.2);margin-bottom:16px;" />
        <p style="color:#9ba9bb;font-size:12px;">
          Landi-Lou Talent Agency &bull; <a href="mailto:info@landiloutalentagency.com" style="color:#c9a84c;">info@landiloutalentagency.com</a>
        </p>
      </div>
    `,
  })

  if (emailError) {
    console.error('[extend-onboarding] email send failed:', emailError.message, 'talent:', id)
    return NextResponse.json({
      error: `Token renewed but email failed to send: ${emailError.message}`,
    }, { status: 500 })
  }

  // Log the action
  await supabase.from('admin_recovery_log').insert({
    talent_profile_id: talent.id,
    talent_email: talent.email,
    talent_name: `${talent.first_name} ${talent.last_name}`,
    action_type: 'extend_onboarding',
    note: `New token set, expires ${newExpiry}`,
  })

  return NextResponse.json({ success: true })
}
