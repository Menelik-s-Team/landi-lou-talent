import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const supabase = createAdminClient()

    // Parse form fields
    const fields = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      dob: formData.get('dob') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      bio: formData.get('bio') as string,
      instagram: formData.get('instagram') as string,
      tiktok: formData.get('tiktok') as string,
      youtube: formData.get('youtube') as string,
      is_minor: formData.get('is_minor') === 'true',
      guardian_name: formData.get('guardian_name') as string,
      guardian_email: formData.get('guardian_email') as string,
      guardian_phone: formData.get('guardian_phone') as string,
      guardian_relationship: formData.get('guardian_relationship') as string,
      categories: JSON.parse(formData.get('categories') as string || '[]'),
    }

    // Upload headshot
    let headshot_url = ''
    const headshotFile = formData.get('headshot') as File | null
    if (headshotFile) {
      const ext = headshotFile.name.split('.').pop()
      const path = `headshots/${Date.now()}-${fields.email}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('talent-media')
        .upload(path, headshotFile, { contentType: headshotFile.type })
      if (!uploadError) {
        const { data } = supabase.storage.from('talent-media').getPublicUrl(path)
        headshot_url = data.publicUrl
      }
    }

    // Upload portfolio files
    const portfolioUrls: string[] = []
    const portfolioFiles = formData.getAll('portfolio') as File[]
    for (const file of portfolioFiles) {
      const ext = file.name.split('.').pop()
      const path = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('talent-media')
        .upload(path, file, { contentType: file.type })
      if (!uploadError) {
        const { data } = supabase.storage.from('talent-media').getPublicUrl(path)
        portfolioUrls.push(data.publicUrl)
      }
    }

    // Insert submission record
    const { data: submission, error: dbError } = await supabase
      .from('talent_submissions')
      .insert({
        ...fields,
        headshot_url,
        portfolio_urls: portfolioUrls,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 })
    }

    // Send confirmation email to talent
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

    // Notify admin
    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_FROM_EMAIL!,
      subject: `New Talent Submission: ${fields.first_name} ${fields.last_name}`,
      html: `
        <div style="background:#0d1120;color:#f0ead8;font-family:sans-serif;padding:32px;max-width:600px;">
          <h2 style="color:#c9a84c;">New Submission</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#9ba9bb;">Name</td><td>${fields.first_name} ${fields.last_name}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Email</td><td>${fields.email}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Phone</td><td>${fields.phone || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Location</td><td>${fields.city}, ${fields.state}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Categories</td><td>${fields.categories.join(', ')}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Minor</td><td>${fields.is_minor ? 'Yes' : 'No'}</td></tr>
          </table>
          <br/>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/submissions/${submission.id}" style="background:#c9a84c;color:#06080f;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:600;">
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
