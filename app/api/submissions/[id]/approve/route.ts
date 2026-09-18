import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth-guard'
import { Resend } from 'resend'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { id } = await params
  const { notes } = await req.json()
  const supabase = createAdminClient()

  // Get submission
  const { data: submission, error: fetchError } = await supabase
    .from('talent_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !submission) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })
  }

  if (submission.status !== 'pending') {
    return NextResponse.json({ error: `This submission is already ${submission.status}.` }, { status: 409 })
  }

  // Create auth user for the talent
  const tempPassword = `Landi${Math.random().toString(36).slice(2, 10).toUpperCase()}!`

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: submission.email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { role: 'talent' },
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  // Upsert profile — handles both trigger-created and manual user creation
  await supabase
    .from('profiles')
    .upsert({
      id: authData.user.id,
      email: submission.email,
      role: 'talent',
      full_name: `${submission.first_name} ${submission.last_name}`,
    }, { onConflict: 'id' })

  // Create talent profile — copy all fields from submission
  const { data: talentProfile } = await supabase.from('talent_profiles').insert({
    user_id: authData.user.id,
    submission_id: id,
    first_name: submission.first_name,
    last_name: submission.last_name,
    stage_name: submission.stage_name,
    email: submission.email,
    phone: submission.phone,
    dob: submission.dob,
    city: submission.city,
    state: submission.state,
    bio: submission.bio,
    categories: submission.categories,
    representation_type: submission.representation_type,
    union_status: submission.union_status,
    experience_level: submission.experience_level,
    experience_categories: submission.experience_categories,
    gender: submission.gender,
    height: submission.height,
    weight: submission.weight,
    hair_color: submission.hair_color,
    eye_color: submission.eye_color,
    ethnicity: submission.ethnicity,
    wardrobe_sizes: submission.wardrobe_sizes,
    shoe_size: submission.shoe_size,
    skills: submission.skills,
    languages: submission.languages,
    dialects: submission.dialects,
    has_passport: submission.has_passport,
    has_drivers_license: submission.has_drivers_license,
    has_transportation: submission.has_transportation,
    will_travel: submission.will_travel,
    local_hire_markets: submission.local_hire_markets,
    instagram: submission.instagram,
    tiktok: submission.tiktok,
    youtube: submission.youtube,
    headshot_url: submission.headshot_url,
    commercial_headshot_url: submission.commercial_headshot_url,
    theatrical_headshot_url: submission.theatrical_headshot_url,
    full_body_url: submission.full_body_url,
    resume_url: submission.resume_url,
    demo_reel_url: submission.demo_reel_url,
    voice_reel_url: submission.voice_reel_url,
    portfolio_urls: submission.portfolio_urls,
    is_minor: submission.is_minor,
    guardian_name: submission.guardian_name,
    guardian_email: submission.guardian_email,
    guardian_phone: submission.guardian_phone,
    guardian_relationship: submission.guardian_relationship,
    // Approval starts onboarding. Talent must not appear bookable until the
    // portfolio is completed and countersigned by the agency.
    is_available: false,
  }).select('id').single()

  // Mark submission as approved
  await supabase
    .from('talent_submissions')
    .update({ status: 'approved', admin_notes: notes, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  // Create onboarding portfolio record and get the generated token
  const { data: portfolio, error: portfolioError } = await supabase
    .from('talent_onboarding_portfolios')
    .insert({
      submission_id: id,
      talent_profile_id: talentProfile?.id ?? null,
      legal_name: `${submission.first_name} ${submission.last_name}`,
    })
    .select('token')
    .single()

  if (portfolioError || !portfolio) {
    console.error('Failed to create onboarding portfolio:', portfolioError)
    // Don't fail the whole approval — just skip the onboarding email
    return NextResponse.json({ success: true, warning: 'Approved but onboarding portfolio creation failed.' })
  }

  const siteUrl = 'https://landiloutalentagency.com'
  const onboardingLink = `${siteUrl}/onboarding/${portfolio.token}`

  // Generate a one-click portal access link so talent can set their password and log in
  const { data: linkData } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: submission.email,
    options: { redirectTo: `${siteUrl}/talent-portal` },
  })
  const portalAccessLink = linkData?.properties?.action_link ?? `${siteUrl}/login`

  const resend = getResend()

  // Send onboarding + portal access email to talent
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    replyTo: 'info@landiloutalentagency.com',
    to: submission.email,
    subject: "You've Been Accepted to Landi-Lou Talent Agency",
    html: `
      <div style="background:#06080f;color:#f0ead8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:32px;">
          <img src="${siteUrl}/logo.png" alt="Landi-Lou Talent Agency" style="height:60px;margin:0 auto;" />
        </div>

        <h1 style="color:#c9a84c;font-size:30px;margin-bottom:8px;text-align:center;">You've Been Accepted</h1>
        <p style="color:#9ba9bb;text-align:center;letter-spacing:2px;font-size:12px;text-transform:uppercase;margin-bottom:36px;">Landi-Lou Talent Agency</p>

        <p style="margin-bottom:16px;">Hi <strong>${submission.first_name}</strong>,</p>
        <p style="line-height:1.8;margin-bottom:24px;">
          After careful review of your submission, we are pleased to officially welcome you to the
          <strong style="color:#c9a84c;">Landi-Lou Talent Agency</strong> family. You represent the excellence,
          authenticity, and vision that we stand for.
        </p>

        <p style="line-height:1.8;margin-bottom:32px;">
          You now have two things waiting for you — your <strong>Digital Onboarding Portfolio</strong>
          and your personal <strong>Talent Portal</strong>. Complete them in order.
        </p>

        <!-- Step 1: Onboarding -->
        <div style="background:#0d1120;border:1px solid rgba(201,168,76,0.3);border-radius:8px;padding:28px;margin-bottom:24px;">
          <p style="color:#c9a84c;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">Step 1 — Complete First</p>
          <p style="color:#f0ead8;font-size:17px;font-weight:bold;margin-bottom:8px;">Digital Onboarding Portfolio</p>
          <p style="color:#9ba9bb;font-size:13px;line-height:1.7;margin-bottom:20px;">
            Your representation agreement, W-9 tax form, and professional profile — all in one secure, electronic process.
            Have your social security number ready.
          </p>
          <div style="text-align:center;">
            <a href="${onboardingLink}"
               style="display:inline-block;background:#c9a84c;color:#06080f;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:bold;font-size:15px;letter-spacing:1px;">
              Complete Your Portfolio
            </a>
          </div>
          <p style="color:#9ba9bb;font-size:11px;text-align:center;margin-top:12px;">Link expires in 30 days &bull; You can save progress and return</p>
        </div>

        <!-- Step 2: Portal -->
        <div style="background:#0d1120;border:1px solid rgba(201,168,76,0.15);border-radius:8px;padding:28px;margin-bottom:32px;">
          <p style="color:#c9a84c;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">Step 2 — Your Personal Portal</p>
          <p style="color:#f0ead8;font-size:17px;font-weight:bold;margin-bottom:8px;">Talent Portal Account</p>
          <p style="color:#9ba9bb;font-size:13px;line-height:1.7;margin-bottom:20px;">
            Your portal is where you'll track bookings, auditions, agency updates, and your full profile.
            Click below to set your password and access your account.
          </p>
          <div style="text-align:center;">
            <a href="${portalAccessLink}"
               style="display:inline-block;background:transparent;color:#c9a84c;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:bold;font-size:15px;letter-spacing:1px;border:2px solid #c9a84c;">
              Set Up Portal Access
            </a>
          </div>
          <p style="color:#9ba9bb;font-size:11px;text-align:center;margin-top:12px;">
            Your login email: <strong style="color:#f0ead8;">${submission.email}</strong>
          </p>
        </div>

        <hr style="border-color:rgba(201,168,76,0.2);margin-bottom:24px;" />
        <p style="color:#9ba9bb;font-size:12px;text-align:center;">
          Landi-Lou Talent Agency &bull; Central Florida<br/>
          <a href="mailto:info@landiloutalentagency.com" style="color:#c9a84c;">info@landiloutalentagency.com</a>
        </p>
      </div>
    `,
  })

  // Also notify guardian if minor
  if (submission.is_minor && submission.guardian_email) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
    replyTo: 'info@landiloutalentagency.com',
      to: submission.guardian_email,
      subject: `${submission.first_name} Has Been Accepted to Landi-Lou Talent Agency`,
      html: `
        <div style="background:#06080f;color:#f0ead8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;">
          <h1 style="color:#c9a84c;font-size:24px;margin-bottom:8px;">Acceptance Notice</h1>
          <p style="margin-bottom:16px;">Hi ${submission.guardian_name},</p>
          <p style="line-height:1.8;margin-bottom:24px;">
            We are pleased to inform you that ${submission.first_name} ${submission.last_name} has been accepted
            to the Landi-Lou Talent Agency roster. As their parent/guardian, you will need to countersign
            the representation agreement during the onboarding process.
          </p>
          <p style="line-height:1.8;color:#9ba9bb;margin-bottom:24px;">
            An onboarding link has been sent to ${submission.email}. Please complete the portfolio together
            with ${submission.first_name}, as your signature will be required as parent/guardian.
          </p>
          <p style="color:#9ba9bb;font-size:13px;">
            Questions? Email us at <a href="mailto:info@landiloutalentagency.com" style="color:#c9a84c;">info@landiloutalentagency.com</a>
          </p>
        </div>
      `,
    })
  }

  return NextResponse.json({ success: true })
}
