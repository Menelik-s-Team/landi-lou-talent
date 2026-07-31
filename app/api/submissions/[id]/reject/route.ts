import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { notes } = await req.json()
  const supabase = createAdminClient()

  const { data: submission, error } = await supabase
    .from('talent_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !submission) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })
  }

  await supabase
    .from('talent_submissions')
    .update({ status: 'rejected', admin_notes: notes, reviewed_at: new Date().toISOString() })
    .eq('id', id)

  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: submission.email,
    subject: 'Update on Your Landi-Lou Talent Agency Application',
    html: `
      <div style="background:#06080f;color:#f0ead8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#c9a84c;font-size:24px;margin-bottom:8px;">Application Update</h1>
        <p style="margin-bottom:32px;color:#9ba9bb;">Thank you for your interest in Landi-Lou Talent Agency.</p>

        <p style="margin-bottom:16px;">Hi <strong>${submission.first_name}</strong>,</p>
        <p style="line-height:1.8;margin-bottom:24px;">
          After careful review of your submission, we are not moving forward at this time.
          This decision is not a reflection of your talent — it is simply a matter of fit
          with our current roster and strategic direction.
        </p>
        <p style="line-height:1.8;margin-bottom:32px;color:#9ba9bb;">
          We encourage you to continue developing your craft and to consider reapplying in the future.
          We wish you nothing but excellence.
        </p>

        <hr style="border-color:rgba(201,168,76,0.2);margin-bottom:24px;" />
        <p style="color:#9ba9bb;font-size:12px;">
          Landi-Lou Talent Agency &bull; Central Florida<br/>
          <a href="mailto:info@landiloutalentagency.com" style="color:#c9a84c;">info@landiloutalentagency.com</a>
        </p>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
