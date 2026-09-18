'use client'

import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
import { Mail, MapPin, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) setSent(true)
      else setError(data.error || 'Something went wrong. Please try again.')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#9ba9bb] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
  const labelClass = "block text-[#9ba9bb] text-xs tracking-widest uppercase mb-2"

  return (
    <>
      <Navbar />

      <main id="main-content">
      <section className="pt-40 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-[#0ea5c8]/5 blur-[100px]" />
        </div>
        <div className="relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Get In Touch</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#f0ead8] mb-6">
            Contact Us
          </h1>
          <div className="w-16 h-px bg-[#c9a84c]/40 mx-auto" />
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14">
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-8">
              Let&apos;s Connect
            </h2>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-[#c9a84c]" />
                </div>
                <div>
                  <p className="text-[#9ba9bb] text-xs tracking-widest uppercase mb-1">Email</p>
                  <a href="mailto:info@landiloutalentagency.com" className="text-[#f0ead8] hover:text-[#c9a84c] transition-colors">
                    info@landiloutalentagency.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-[#c9a84c]" />
                </div>
                <div>
                  <p className="text-[#9ba9bb] text-xs tracking-widest uppercase mb-1">Location</p>
                  <p className="text-[#f0ead8]">Central Florida</p>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-[rgba(201,168,76,0.15)]">
              <p className="text-[#9ba9bb] text-sm leading-relaxed">
                For talent submissions, please use our{' '}
                <a href="/submit" className="text-[#c9a84c] hover:text-[#e8c97a] transition-colors">submission form</a>.
                For casting director inquiries, contact us directly.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-lg p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-8 text-center">
                <CheckCircle size={48} className="text-[#c9a84c]" />
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#f0ead8]">Message Sent</h3>
                <p className="text-[#9ba9bb] text-sm">We&apos;ll get back to you within 1–2 business days. A confirmation was sent to your email.</p>
              </div>
            ) : (
              <>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#f0ead8] mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} method="post" className="flex flex-col gap-5" noValidate>
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>Email *</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className={inputClass}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className={labelClass}>Subject *</label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="What is this about?"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className={labelClass}>Message *</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`${inputClass} resize-none`}
                      placeholder="Your message..."
                    />
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </>
  )
}
