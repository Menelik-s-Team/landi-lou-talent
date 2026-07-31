import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  // Update profile role
  await supabase
    .from('profiles')
    .update({ role: 'talent', full_name: `${submission.first_name} ${submission.last_name}` })
    .eq('id', authData.user.id)

  // Create talent profile
  await supabase.from('talent_profiles').insert({
    user_id: authData.user.id,
    submission_id: id,
    first_name: submission.first_name,
    last_name: submission.last_name,
    email: submission.email,
    phone: submission.phone,
    dob: submission.dob,
    city: submission.city,
    state: submission.state,
    bio: submission.bio,
    categories: submission.categories,
    instagram: submission.instagram,
    tiktok: submission.tiktok,
    youtube: submission.youtube,
    headshot_url: submission.headshot_url,
    portfolio_urls: submission.portfolio_urls,
    is_minor: submission.is_minor,
    guardian_name: submission.guardian_name,
    guardian_email: submission.guardian_email,
  })

  // Mark submission as approved
  await supabase
    .from('talent_submissions')
    .update({ status: 'approved', admin_notes: notes, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  // Send approval email with login credentials
  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: submission.email,
    subject: 'Congratulations — You Have Been Accepted to Landi-Lou Talent Agency',
    html: `
      <div style="background:#06080f;color:#f0ead8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#c9a84c;font-size:28px;margin-bottom:8px;">Welcome to the Roster</h1>
        <p style="color:#7a869a;margin-bottom:32px;">You have been accepted.</p>

        <p style="margin-bottom:16px;">Hi <strong>${submission.first_name}</strong>,</p>
        <p style="line-height:1.8;margin-bottom:24px;">
          After careful review, we are pleased to welcome you to the Landi-Lou Talent Agency family.
          You represent the excellence, authenticity, and vision that we stand for.
        </p>

        <div style="background:#0d1120;border:1px solid rgba(201,168,76,0.3);border-radius:8px;padding:24px;margin-bottom:32px;">
          <p style="color:#c9a84c;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;">Your Login Credentials</p>
          <p style="margin-bottom:8px;"><strong>Portal:</strong> <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login" style="color:#0ea5c8;">${process.env.NEXT_PUBLIC_SITE_URL}/login</a></p>
          <p style="margin-bottom:8px;"><strong>Email:</strong> ${submission.email}</p>
          <p style="margin-bottom:0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>

        <p style="color:#7a869a;font-size:13px;line-height:1.7;margin-bottom:32px;">
          Please log in and complete your talent profile. You will be prompted to change your password on first login.
        </p>

        <hr style="border-color:rgba(201,168,76,0.2);margin-bottom:24px;" />
        <p style="color:#7a869a;font-size:12px;">
          Landi-Lou Talent Agency &bull; Central Florida<br/>
          <a href="mailto:info@landiloutalentagency.com" style="color:#c9a84c;">info@landiloutalentagency.com</a>
        </p>
      </div>
    `,
  })

  // Also notify guardian if minor
  if (submission.is_minor && submission.guardian_email) {
    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: submission.guardian_email,
      subject: `${submission.first_name} Has Been Accepted to Landi-Lou Talent Agency`,
      html: `
        <div style="background:#06080f;color:#f0ead8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;">
          <h1 style="color:#c9a84c;font-size:24px;margin-bottom:8px;">Acceptance Notice</h1>
          <p style="margin-bottom:16px;">Hi ${submission.guardian_name},</p>
          <p style="line-height:1.8;margin-bottom:24px;">
            We are pleased to inform you that ${submission.first_name} ${submission.last_name} has been accepted
            to the Landi-Lou Talent Agency roster. As their parent/guardian, you will be kept informed of
            all opportunities and bookings.
          </p>
          <p style="line-height:1.8;color:#7a869a;">
            Login credentials have been sent to ${submission.email}. Please ensure ${submission.first_name}
            completes their profile setup.
          </p>
        </div>
      `,
    })
  }

  return NextResponse.json({ success: true })
}
