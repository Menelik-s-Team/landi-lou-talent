import { NextRequest, NextResponse } from 'next/server'

function getResend() {
  const { Resend } = require('resend')
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_FROM_EMAIL!,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="background:#0d1120;color:#f0ead8;font-family:sans-serif;padding:32px;max-width:600px;">
          <h2 style="color:#c9a84c;margin-bottom:4px;">New Contact Message</h2>
          <p style="color:#9ba9bb;font-size:13px;margin-bottom:24px;">Via landiloutalentagency.com</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#9ba9bb;width:100px;">From</td><td>${name}</td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Email</td><td><a href="mailto:${email}" style="color:#0ea5c8;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#9ba9bb;">Subject</td><td>${subject}</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#141929;border-radius:6px;border-left:3px solid #c9a84c;">
            <p style="margin:0;line-height:1.7;">${message.replace(/\n/g, '<br/>')}</p>
          </div>
        </div>
      `,
    })

    // Auto-reply to sender
    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: 'We received your message — Landi-Lou Talent Agency',
      html: `
        <div style="background:#06080f;color:#f0ead8;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto;">
          <h1 style="color:#c9a84c;font-size:24px;margin-bottom:8px;">Message Received</h1>
          <p style="margin-bottom:16px;">Hi ${name},</p>
          <p style="line-height:1.8;color:#9ba9bb;margin-bottom:32px;">
            Thank you for reaching out to Landi-Lou Talent Agency. We have received your message
            and will respond within 1–2 business days.
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
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
