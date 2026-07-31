'use client'

import { useState } from 'react'
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
import { CheckCircle, Search, Users, Send } from 'lucide-react'

const projectTypes = [
  'Film', 'Television', 'Commercial', 'Print', 'Lifestyle',
  'Theatre', 'Voice Over', 'Influencer/Digital', 'Event', 'Other',
]

const talentCategories = [
  'Actor', 'Model', 'Voice Over', 'Influencer', 'Dancer', 'Singer', 'Host',
]

const steps = [
  {
    icon: Send,
    number: '01',
    title: 'Submit your request',
    desc: 'Describe your project and talent needs in detail.',
  },
  {
    icon: Search,
    number: '02',
    title: 'We search privately',
    desc: 'Our team reviews our full database — no public browsing.',
  },
  {
    icon: Users,
    number: '03',
    title: 'You receive matches',
    desc: 'We present only the best-fit talent, curated for your project.',
  },
]

interface FormState {
  contact_name: string
  company: string
  email: string
  phone: string
  project_name: string
  project_type: string
  talent_categories: string[]
  gender_preference: string
  age_min: string
  age_max: string
  union_status: string
  dates_needed: string
  location: string
  budget_range: string
  notes: string
}

const initialForm: FormState = {
  contact_name: '',
  company: '',
  email: '',
  phone: '',
  project_name: '',
  project_type: '',
  talent_categories: [],
  gender_preference: 'Any',
  age_min: '',
  age_max: '',
  union_status: 'Any',
  dates_needed: '',
  location: '',
  budget_range: '',
  notes: '',
}

export default function ForClientsPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleCategoryToggle(cat: string) {
    setForm(prev => ({
      ...prev,
      talent_categories: prev.talent_categories.includes(cat)
        ? prev.talent_categories.filter(c => c !== cat)
        : [...prev.talent_categories, cat],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/talent-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#9ba9bb] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
  const labelClass = "block text-[#9ba9bb] text-xs tracking-widest uppercase mb-2"
  const selectClass = `${inputClass} appearance-none cursor-pointer`

  return (
    <>
      <Navbar />

      <section className="pt-36 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#0ea5c8]/5 blur-[100px]" />
        </div>
        <div className="relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">For Clients</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#f0ead8] mb-6">
            Book Talent
          </h1>
          <p className="text-[#9ba9bb] max-w-2xl mx-auto leading-relaxed">
            Tell us about your project. We&apos;ll search our private database and present only the talent who
            best fit your needs. No public browsing — just curated matches, delivered with precision.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-14">

          {/* Left: How it works */}
          <div className="md:col-span-2">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-8">
              How It Works
            </h2>
            <div className="flex flex-col gap-8">
              {steps.map(({ icon: Icon, number, title, desc }) => (
                <div key={number} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
                    <Icon size={18} className="text-[#c9a84c]" />
                  </div>
                  <div>
                    <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-1">{number}</p>
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#f0ead8] mb-1">{title}</h3>
                    <p className="text-[#9ba9bb] text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-[rgba(201,168,76,0.15)]">
              <p className="text-[#9ba9bb] text-sm leading-relaxed">
                For general inquiries, reach us at{' '}
                <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] hover:text-[#e8c97a] transition-colors">
                  info@landiloutalentagency.com
                </a>
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-3 glass-card rounded-lg p-8">
            {success ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
                <CheckCircle size={52} className="text-[#c9a84c]" />
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8]">Request Received</h3>
                <p className="text-[#9ba9bb] text-sm max-w-sm leading-relaxed">
                  Thank you. Our team will review your project details and respond with curated talent matches within 1–2 business days.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#f0ead8] mb-6">Talent Request Form</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

                  {/* Contact Name */}
                  <div>
                    <label htmlFor="contact_name" className={labelClass}>Contact Name *</label>
                    <input
                      id="contact_name"
                      type="text"
                      name="contact_name"
                      value={form.contact_name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className={inputClass}
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className={labelClass}>Company</label>
                    <input
                      id="company"
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      autoComplete="organization"
                      className={inputClass}
                      placeholder="Production company, agency, brand..."
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className={labelClass}>Email *</label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className={inputClass}
                        placeholder="you@company.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>Phone</label>
                      <input
                        id="phone"
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        className={inputClass}
                        placeholder="(555) 000-0000"
                      />
                    </div>
                  </div>

                  {/* Project Name + Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="project_name" className={labelClass}>Project Name *</label>
                      <input
                        id="project_name"
                        type="text"
                        name="project_name"
                        value={form.project_name}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder="Campaign, film, show title..."
                      />
                    </div>
                    <div>
                      <label htmlFor="project_type" className={labelClass}>Project Type *</label>
                      <select
                        id="project_type"
                        name="project_type"
                        value={form.project_type}
                        onChange={handleChange}
                        required
                        className={selectClass}
                      >
                        <option value="" disabled>Select type</option>
                        {projectTypes.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Talent Categories */}
                  <div>
                    <p className={labelClass}>Talent Categories Needed *</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {talentCategories.map(cat => {
                        const selected = form.talent_categories.includes(cat)
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleCategoryToggle(cat)}
                            className={`px-4 py-2 rounded text-xs font-medium tracking-wide border transition-all ${
                              selected
                                ? 'bg-[#c9a84c] text-[#06080f] border-[#c9a84c]'
                                : 'bg-transparent text-[#9ba9bb] border-[rgba(201,168,76,0.2)] hover:border-[#c9a84c]/50'
                            }`}
                          >
                            {cat}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Gender Preference + Union Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gender_preference" className={labelClass}>Gender Preference</label>
                      <select
                        id="gender_preference"
                        name="gender_preference"
                        value={form.gender_preference}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="Any">Any</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="union_status" className={labelClass}>Union Status</label>
                      <select
                        id="union_status"
                        name="union_status"
                        value={form.union_status}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="Any">Any</option>
                        <option value="SAG-AFTRA">SAG-AFTRA</option>
                        <option value="SAG-Eligible">SAG-Eligible</option>
                        <option value="Equity">Equity</option>
                        <option value="Non-Union">Non-Union</option>
                      </select>
                    </div>
                  </div>

                  {/* Age Range */}
                  <div>
                    <p className={labelClass}>Age Range</p>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        name="age_min"
                        value={form.age_min}
                        onChange={handleChange}
                        min={0}
                        className={inputClass}
                        placeholder="Min Age"
                      />
                      <input
                        type="number"
                        name="age_max"
                        value={form.age_max}
                        onChange={handleChange}
                        min={0}
                        className={inputClass}
                        placeholder="Max Age"
                      />
                    </div>
                  </div>

                  {/* Dates Needed + Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dates_needed" className={labelClass}>Dates Needed</label>
                      <input
                        id="dates_needed"
                        type="text"
                        name="dates_needed"
                        value={form.dates_needed}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="e.g. June 15–20, 2025"
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className={labelClass}>Location</label>
                      <input
                        id="location"
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="City, State or Remote"
                      />
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label htmlFor="budget_range" className={labelClass}>Budget Range</label>
                    <input
                      id="budget_range"
                      type="text"
                      name="budget_range"
                      value={form.budget_range}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e.g. $2,000–$5,000"
                    />
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label htmlFor="notes" className={labelClass}>Additional Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={4}
                      className={`${inputClass} resize-none`}
                      placeholder="Any additional details about your project, specific look requirements, previous talent worked with, etc."
                    />
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Talent Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
