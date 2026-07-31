'use client'

import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
import { useState } from 'react'
import { Upload, CheckCircle } from 'lucide-react'

const CATEGORIES = ['Acting', 'Modeling', 'Influencer Marketing', 'Voice-Over', 'Singing', 'Dancing']

export default function SubmitPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isMinor, setIsMinor] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [headshot, setHeadshot] = useState<File | null>(null)
  const [portfolio, setPortfolio] = useState<File[]>([])
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', dob: '',
    city: '', state: '', bio: '', instagram: '', tiktok: '', youtube: '',
    guardian_name: '', guardian_email: '', guardian_phone: '', guardian_relationship: '',
  })

  function toggleCategory(cat: string) {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const body = new FormData()
      Object.entries(form).forEach(([k, v]) => body.append(k, v))
      body.append('categories', JSON.stringify(selectedCategories))
      body.append('is_minor', String(isMinor))
      if (headshot) body.append('headshot', headshot)
      portfolio.forEach(f => body.append('portfolio', f))

      const res = await fetch('/api/submissions', { method: 'POST', body })
      if (res.ok) setSubmitted(true)
      else {
        const data = await res.json()
        alert(data.error || 'Submission failed. Please try again.')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#7a869a] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
  const labelClass = "block text-[#7a869a] text-xs tracking-widest uppercase mb-2"

  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-lg">
            <CheckCircle size={56} className="text-[#c9a84c] mx-auto mb-6" />
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8] mb-4">
              Application Received
            </h1>
            <p className="text-[#7a869a] leading-relaxed mb-8">
              Thank you for submitting your talent profile to Landi-Lou Talent Agency.
              We&apos;ve sent a confirmation to your email. Our team will review your submission
              and be in touch if there is a fit.
            </p>
            <a href="/" className="text-[#c9a84c] hover:text-[#e8c97a] transition-colors text-sm">
              Return to Home
            </a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <section className="pt-36 pb-10 px-6 text-center">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Join the Roster</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-5xl text-[#f0ead8] mb-4">
          Submit Your Talent
        </h1>
        <p className="text-[#7a869a] max-w-xl mx-auto text-sm leading-relaxed">
          We review every submission personally. Complete the form below — we&apos;ll be in touch if there&apos;s a fit.
        </p>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step >= s ? 'bg-[#c9a84c] text-[#06080f]' : 'bg-[#141929] text-[#7a869a] border border-[rgba(201,168,76,0.2)]'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-16 h-px ${step > s ? 'bg-[#c9a84c]' : 'bg-[rgba(201,168,76,0.2)]'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-16 mt-2">
          {['Basic Info', 'Categories', 'Media'].map((label, i) => (
            <p key={label} className={`text-xs ${step === i + 1 ? 'text-[#c9a84c]' : 'text-[#7a869a]'}`}>{label}</p>
          ))}
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="glass-card rounded-xl p-8 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <input name="first_name" value={form.first_name} onChange={handleChange} required className={inputClass} placeholder="First" />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input name="last_name" value={form.last_name} onChange={handleChange} required className={inputClass} placeholder="Last" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="your@email.com" />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="(555) 000-0000" />
                </div>
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input type="date" name="dob" value={form.dob} onChange={(e) => {
                    handleChange(e)
                    const age = new Date().getFullYear() - new Date(e.target.value).getFullYear()
                    setIsMinor(age < 18)
                  }} required className={inputClass} />
                  {isMinor && (
                    <p className="text-[#c9a84c] text-xs mt-2">Parent/Guardian information will be required in the next step.</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input name="city" value={form.city} onChange={handleChange} required className={inputClass} placeholder="City" />
                  </div>
                  <div>
                    <label className={labelClass}>State *</label>
                    <input name="state" value={form.state} onChange={handleChange} required className={inputClass} placeholder="FL" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Bio / Tell Us About Yourself</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} className={inputClass} placeholder="Brief background, experience, goals..." />
                </div>
                <div>
                  <label className={labelClass}>Social Handles (optional)</label>
                  <div className="flex flex-col gap-3">
                    <input name="instagram" value={form.instagram} onChange={handleChange} className={inputClass} placeholder="@instagram" />
                    <input name="tiktok" value={form.tiktok} onChange={handleChange} className={inputClass} placeholder="@tiktok" />
                    <input name="youtube" value={form.youtube} onChange={handleChange} className={inputClass} placeholder="YouTube channel" />
                  </div>
                </div>

                {/* Parent/Guardian section for minors */}
                {isMinor && (
                  <div className="border border-[#c9a84c]/30 rounded-lg p-6 flex flex-col gap-4">
                    <p className="text-[#c9a84c] text-xs tracking-widest uppercase">Parent / Guardian Information</p>
                    <div>
                      <label className={labelClass}>Guardian Full Name *</label>
                      <input name="guardian_name" value={form.guardian_name} onChange={handleChange} required className={inputClass} placeholder="Full name" />
                    </div>
                    <div>
                      <label className={labelClass}>Guardian Email *</label>
                      <input type="email" name="guardian_email" value={form.guardian_email} onChange={handleChange} required className={inputClass} placeholder="guardian@email.com" />
                    </div>
                    <div>
                      <label className={labelClass}>Guardian Phone *</label>
                      <input type="tel" name="guardian_phone" value={form.guardian_phone} onChange={handleChange} required className={inputClass} placeholder="(555) 000-0000" />
                    </div>
                    <div>
                      <label className={labelClass}>Relationship to Talent *</label>
                      <input name="guardian_relationship" value={form.guardian_relationship} onChange={handleChange} required className={inputClass} placeholder="Parent, Legal Guardian, etc." />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!form.first_name || !form.last_name || !form.email || !form.dob || !form.city || !form.state}
                  className="w-full py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Categories */}
            {step === 2 && (
              <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#f0ead8] mb-2">Select Your Categories</h2>
                  <p className="text-[#7a869a] text-sm">Choose all that apply.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-4 py-3 rounded border text-sm tracking-wide transition-all ${
                        selectedCategories.includes(cat)
                          ? 'border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]'
                          : 'border-[rgba(201,168,76,0.2)] text-[#7a869a] hover:border-[#c9a84c]/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border border-[rgba(201,168,76,0.2)] text-[#7a869a] rounded text-sm hover:text-[#f0ead8] transition-colors">
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={selectedCategories.length === 0}
                    className="flex-1 py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all disabled:opacity-40"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Media */}
            {step === 3 && (
              <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#f0ead8] mb-2">Upload Your Media</h2>
                  <p className="text-[#7a869a] text-sm">Add a headshot and portfolio pieces. Accepted: JPG, PNG, PDF, MP4.</p>
                </div>

                {/* Headshot */}
                <div>
                  <label className={labelClass}>Headshot *</label>
                  <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-[rgba(201,168,76,0.3)] rounded-lg p-8 cursor-pointer hover:border-[#c9a84c]/60 transition-colors">
                    <Upload size={24} className="text-[#c9a84c]" />
                    <span className="text-[#7a869a] text-sm">
                      {headshot ? headshot.name : 'Click to upload headshot'}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={e => setHeadshot(e.target.files?.[0] || null)} />
                  </label>
                </div>

                {/* Portfolio */}
                <div>
                  <label className={labelClass}>Portfolio (up to 5 files)</label>
                  <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-[rgba(201,168,76,0.3)] rounded-lg p-8 cursor-pointer hover:border-[#c9a84c]/60 transition-colors">
                    <Upload size={24} className="text-[#c9a84c]" />
                    <span className="text-[#7a869a] text-sm">
                      {portfolio.length > 0 ? `${portfolio.length} file(s) selected` : 'Click to upload portfolio'}
                    </span>
                    <input type="file" multiple accept="image/*,video/*,.pdf" className="hidden" onChange={e => setPortfolio(Array.from(e.target.files || []).slice(0, 5))} />
                  </label>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border border-[rgba(201,168,76,0.2)] text-[#7a869a] rounded text-sm hover:text-[#f0ead8] transition-colors">
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !headshot}
                    className="flex-1 py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all disabled:opacity-40"
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </>
  )
}
