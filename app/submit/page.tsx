'use client'

import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
import { useState } from 'react'
import { Upload, CheckCircle, Check } from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const TALENT_CATEGORIES = [
  'Actor', 'Commercial', 'Theatre', 'Print', 'Fashion', 'Lifestyle',
  'Voice Over', 'Singer', 'Dancer', 'Host', 'Influencer',
  'Children & Youth', 'Fitness', 'Specialty Talent',
]

const UNION_STATUSES = ['SAG-AFTRA', 'SAG-Eligible', 'Equity', 'EMC', 'Non-Union']

const ETHNICITIES = [
  'Black/African American', 'White/Caucasian', 'Hispanic/Latino',
  'Asian/Pacific Islander', 'Middle Eastern', 'Native American', 'Multiracial', 'Other',
]

const AVAILABILITY_OPTIONS = [
  'Local Hire Only', 'Available to Travel', 'Available Nationally', 'Available Internationally',
]

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Professional', 'Extensive Credits']

const STEP_LABELS = [
  'Personal Info',
  'Talent Details',
  'Attributes',
  'Media',
  'Experience',
  'Availability',
  'Review',
]

const SKILLS_GROUPS = [
  {
    group: 'Performance',
    skills: ['Dancing', 'Singing', 'Comedy', 'Improvisation', 'Public Speaking', 'Teleprompter'],
  },
  {
    group: 'Physical',
    skills: ['Firearms', 'Horseback Riding', 'Swimming', 'Scuba', 'Martial Arts', 'Stunts', 'Motorcycle', 'Driving'],
  },
  {
    group: 'Background',
    skills: ['Military Experience', 'Law Enforcement Experience', 'Medical Training'],
  },
]

// ─── Type ─────────────────────────────────────────────────────────────────────

type FormData = {
  // Step 1
  first_name: string
  last_name: string
  stage_name: string
  email: string
  phone: string
  dob: string
  city: string
  state: string
  bio: string
  // Step 2
  representation_type: string
  union_status: string
  talent_categories: string[]
  // Step 3
  gender: string
  height: string
  weight: string
  hair_color: string
  eye_color: string
  ethnicity: string[]
  top_size: string
  bottom_size: string
  dress_size: string
  shoe_size: string
  skills: string[]
  languages: string
  dialects: string
  instruments: string
  sports: string
  // Step 4
  demo_reel_url: string
  voice_reel_url: string
  instagram: string
  tiktok: string
  youtube: string
  // Step 5
  experience_categories: string[]
  experience_level: string
  notable_credits: string
  // Step 6
  availability_type: string[]
  has_passport: boolean
  has_drivers_license: boolean
  has_transportation: boolean
  local_hire_markets: string
  // Step 7
  confirmed_accurate: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubmitPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // File states
  const [headshot, setHeadshot] = useState<File | null>(null)
  const [commercialHeadshot, setCommercialHeadshot] = useState<File | null>(null)
  const [theatricalHeadshot, setTheatricalHeadshot] = useState<File | null>(null)
  const [fullBody, setFullBody] = useState<File | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const [formData, setFormData] = useState<FormData>({
    first_name: '', last_name: '', stage_name: '', email: '', phone: '',
    dob: '', city: '', state: 'FL', bio: '',
    representation_type: '', union_status: '', talent_categories: [],
    gender: '', height: '', weight: '', hair_color: '', eye_color: '',
    ethnicity: [], top_size: '', bottom_size: '', dress_size: '', shoe_size: '',
    skills: [], languages: '', dialects: '', instruments: '', sports: '',
    demo_reel_url: '', voice_reel_url: '', instagram: '', tiktok: '', youtube: '',
    experience_categories: [], experience_level: '', notable_credits: '',
    availability_type: [], has_passport: false, has_drivers_license: false,
    has_transportation: false, local_hire_markets: '',
    confirmed_accurate: false,
  })

  // ── Helpers ────────────────────────────────────────────────────────────────

  const inputClass =
    'w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#9ba9bb] focus:outline-none focus:border-[#c9a84c]/60 transition-colors'
  const labelClass = 'block text-[#9ba9bb] text-xs tracking-widest uppercase mb-2'
  const sectionTitle = 'font-[family-name:var(--font-playfair)] text-xl text-[#f0ead8] mb-1'
  const sectionSub = 'text-[#9ba9bb] text-sm mb-5'

  function set(field: keyof FormData, value: unknown) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function handleText(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    set(e.target.name as keyof FormData, e.target.value)
  }

  function toggleArrayItem(field: keyof FormData, item: string) {
    setFormData(prev => {
      const arr = prev[field] as string[]
      return { ...prev, [field]: arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item] }
    })
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  function validateStep(s: number): string[] {
    const errs: string[] = []
    if (s === 1) {
      if (!formData.first_name.trim()) errs.push('First Name is required.')
      if (!formData.last_name.trim()) errs.push('Last Name is required.')
      if (!formData.email.trim()) errs.push('Email is required.')
      if (!formData.dob) errs.push('Date of Birth is required.')
      if (!formData.city.trim()) errs.push('City is required.')
      if (!formData.state.trim()) errs.push('State is required.')
    }
    if (s === 2) {
      if (!formData.representation_type) errs.push('Representation Type is required.')
      if (!formData.union_status) errs.push('Union Status is required.')
      if (formData.talent_categories.length === 0) errs.push('Select at least one Talent Category.')
    }
    if (s === 3) {
      if (!formData.gender) errs.push('Gender is required.')
    }
    if (s === 4) {
      if (!headshot) errs.push('Primary Headshot is required.')
    }
    if (s === 5) {
      if (!formData.experience_level) errs.push('Experience Level is required.')
    }
    if (s === 7) {
      if (!formData.confirmed_accurate) errs.push('Please confirm all information is accurate.')
    }
    return errs
  }

  function advance() {
    const errs = validateStep(step)
    if (errs.length > 0) { setErrors(errs); return }
    setErrors([])
    setStep(s => s + 1)
  }

  function back() {
    setErrors([])
    setStep(s => s - 1)
  }

  // ── Submission ─────────────────────────────────────────────────────────────

  async function handleSubmit() {
    const errs = validateStep(7)
    if (errs.length > 0) { setErrors(errs); return }
    setErrors([])
    setLoading(true)

    try {
      const body = new FormData()

      // Text fields
      const textFields: (keyof typeof formData)[] = [
        'first_name', 'last_name', 'stage_name', 'email', 'phone', 'dob', 'city', 'state', 'bio',
        'representation_type', 'union_status', 'gender', 'height', 'weight', 'hair_color', 'eye_color',
        'top_size', 'bottom_size', 'dress_size', 'shoe_size',
        'languages', 'dialects', 'instruments', 'sports',
        'demo_reel_url', 'voice_reel_url', 'instagram', 'tiktok', 'youtube',
        'experience_level', 'notable_credits', 'local_hire_markets',
      ]
      textFields.forEach(f => body.append(f, (formData[f] as string) || ''))

      // Boolean fields
      body.append('has_passport', String(formData.has_passport))
      body.append('has_drivers_license', String(formData.has_drivers_license))
      body.append('has_transportation', String(formData.has_transportation))

      // JSON arrays
      body.append('talent_categories', JSON.stringify(formData.talent_categories))
      body.append('ethnicity', JSON.stringify(formData.ethnicity))
      body.append('skills', JSON.stringify(formData.skills))
      body.append('experience_categories', JSON.stringify(formData.experience_categories))
      body.append('availability_type', JSON.stringify(formData.availability_type))

      // Wardrobe sizes as JSON
      body.append('wardrobe_sizes', JSON.stringify({
        top: formData.top_size,
        bottom: formData.bottom_size,
        dress: formData.dress_size,
        shoe: formData.shoe_size,
      }))

      // Files
      if (headshot) body.append('headshot', headshot)
      if (commercialHeadshot) body.append('commercial_headshot', commercialHeadshot)
      if (theatricalHeadshot) body.append('theatrical_headshot', theatricalHeadshot)
      if (fullBody) body.append('full_body', fullBody)
      if (resumeFile) body.append('resume_file', resumeFile)

      const res = await fetch('/api/submissions', { method: 'POST', body })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json()
        setErrors([data.error || 'Submission failed. Please try again.'])
      }
    } catch {
      setErrors(['Something went wrong. Please try again.'])
    } finally {
      setLoading(false)
    }
  }

  // ── Sub-components ─────────────────────────────────────────────────────────

  function FileUploadBox({
    label,
    required,
    accept,
    file,
    onFile,
  }: {
    label: string
    required?: boolean
    accept: string
    file: File | null
    onFile: (f: File | null) => void
  }) {
    return (
      <div>
        <label className={labelClass}>
          {label} {required && <span className="text-[#c9a84c]">*</span>}
        </label>
        <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-[rgba(201,168,76,0.35)] rounded-lg p-7 cursor-pointer hover:border-[#c9a84c]/70 transition-colors">
          <Upload size={22} className="text-[#c9a84c]" />
          <span className="text-[#9ba9bb] text-sm text-center">
            {file ? file.name : 'Click to upload'}
          </span>
          {file && (
            <span className="text-[#c9a84c] text-xs">{(file.size / 1024).toFixed(0)} KB</span>
          )}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={e => onFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>
    )
  }

  function GoldCheckbox({
    checked,
    onChange,
    label,
  }: {
    checked: boolean
    onChange: (v: boolean) => void
    label: string
  }) {
    return (
      <label className="flex items-center gap-3 cursor-pointer group">
        <div
          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
            checked
              ? 'bg-[#c9a84c] border-[#c9a84c]'
              : 'border-[rgba(201,168,76,0.3)] bg-[#141929] group-hover:border-[#c9a84c]/60'
          }`}
          onClick={() => onChange(!checked)}
        >
          {checked && <Check size={10} className="text-[#06080f]" strokeWidth={3} />}
        </div>
        <span className="text-[#f0ead8] text-sm">{label}</span>
      </label>
    )
  }

  function GoldRadio({
    checked,
    onChange,
    label,
  }: {
    checked: boolean
    onChange: () => void
    label: string
  }) {
    return (
      <label className="flex items-center gap-3 cursor-pointer group">
        <div
          className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
            checked
              ? 'border-[#c9a84c]'
              : 'border-[rgba(201,168,76,0.3)] bg-[#141929] group-hover:border-[#c9a84c]/60'
          }`}
          onClick={onChange}
        >
          {checked && <div className="w-2 h-2 rounded-full bg-[#c9a84c]" />}
        </div>
        <span className="text-[#f0ead8] text-sm">{label}</span>
      </label>
    )
  }

  function NavButtons({ onContinue, continueLabel }: { onContinue?: () => void; continueLabel?: string }) {
    return (
      <div className="flex gap-3 pt-2">
        {step > 1 && (
          <button
            type="button"
            onClick={back}
            className="flex-1 py-3 border border-[rgba(201,168,76,0.2)] text-[#9ba9bb] rounded text-sm hover:text-[#f0ead8] hover:border-[#c9a84c]/40 transition-colors"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onContinue || advance}
          disabled={loading}
          className="flex-1 py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all disabled:opacity-40"
        >
          {loading ? 'Submitting...' : (continueLabel || 'Continue')}
        </button>
      </div>
    )
  }

  function ErrorBanner() {
    if (errors.length === 0) return null
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3">
        {errors.map((e, i) => (
          <p key={i} className="text-red-400 text-sm">{e}</p>
        ))}
      </div>
    )
  }

  // ── Success screen ─────────────────────────────────────────────────────────

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
            <p className="text-[#9ba9bb] leading-relaxed mb-8">
              We review every submission personally. We&apos;ll be in touch if there&apos;s a fit.
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

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="pt-36 pb-8 px-6 text-center">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Join the Roster</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-5xl text-[#f0ead8] mb-4">
          Submit Your Talent
        </h1>
        <p className="text-[#9ba9bb] max-w-xl mx-auto text-sm leading-relaxed">
          We review every submission personally. Complete the form below — we&apos;ll be in touch if there&apos;s a fit.
        </p>
      </section>

      {/* Stepper */}
      <section className="pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {STEP_LABELS.map((label, idx) => {
              const s = idx + 1
              const isCompleted = step > s
              const isCurrent = step === s
              return (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all flex-shrink-0 ${
                        isCompleted
                          ? 'bg-[#c9a84c] text-[#06080f]'
                          : isCurrent
                          ? 'bg-[#c9a84c] text-[#06080f] ring-2 ring-[#c9a84c]/30'
                          : 'bg-[#141929] text-[#9ba9bb] border border-[rgba(201,168,76,0.2)]'
                      }`}
                    >
                      {isCompleted ? <Check size={12} strokeWidth={3} /> : s}
                    </div>
                    <span
                      className={`text-[10px] tracking-wide text-center leading-tight ${
                        isCurrent ? 'text-[#c9a84c]' : 'text-[#9ba9bb]'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {s < 7 && (
                    <div
                      className={`flex-1 h-px mx-1 mb-5 transition-all ${
                        step > s ? 'bg-[#c9a84c]' : 'bg-[rgba(201,168,76,0.15)]'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Form body */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto">

          {/* ── Step 1: Personal Info ── */}
          {step === 1 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-5">
              <div>
                <h2 className={sectionTitle}>Personal Information</h2>
                <p className={sectionSub}>Tell us the basics.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name <span className="text-[#c9a84c]">*</span></label>
                  <input name="first_name" value={formData.first_name} onChange={handleText} className={inputClass} placeholder="First" />
                </div>
                <div>
                  <label className={labelClass}>Last Name <span className="text-[#c9a84c]">*</span></label>
                  <input name="last_name" value={formData.last_name} onChange={handleText} className={inputClass} placeholder="Last" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Stage Name (if any)</label>
                <input name="stage_name" value={formData.stage_name} onChange={handleText} className={inputClass} placeholder="Professional or stage name" />
              </div>
              <div>
                <label className={labelClass}>Email <span className="text-[#c9a84c]">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleText} className={inputClass} placeholder="your@email.com" />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleText} className={inputClass} placeholder="(555) 000-0000" />
              </div>
              <div>
                <label className={labelClass}>Date of Birth <span className="text-[#c9a84c]">*</span></label>
                <input type="date" name="dob" value={formData.dob} onChange={handleText} className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City <span className="text-[#c9a84c]">*</span></label>
                  <input name="city" value={formData.city} onChange={handleText} className={inputClass} placeholder="City" />
                </div>
                <div>
                  <label className={labelClass}>State <span className="text-[#c9a84c]">*</span></label>
                  <input name="state" value={formData.state} onChange={handleText} className={inputClass} placeholder="FL" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Bio / Tell Us About Yourself</label>
                <textarea name="bio" value={formData.bio} onChange={handleText} rows={4} className={inputClass} placeholder="Brief background, experience, goals..." />
              </div>
              <ErrorBanner />
              <NavButtons />
            </div>
          )}

          {/* ── Step 2: Talent Details ── */}
          {step === 2 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
              <div>
                <h2 className={sectionTitle}>Talent Details</h2>
                <p className={sectionSub}>Tell us how you work and where you fit.</p>
              </div>

              <div>
                <label className={labelClass}>Representation Type <span className="text-[#c9a84c]">*</span></label>
                <div className="flex gap-5 mt-1">
                  {['Exclusive', 'Non-Exclusive'].map(opt => (
                    <GoldRadio
                      key={opt}
                      checked={formData.representation_type === opt}
                      onChange={() => set('representation_type', opt)}
                      label={opt}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Union Status <span className="text-[#c9a84c]">*</span></label>
                <div className="flex flex-col gap-3 mt-1">
                  {UNION_STATUSES.map(opt => (
                    <GoldRadio
                      key={opt}
                      checked={formData.union_status === opt}
                      onChange={() => set('union_status', opt)}
                      label={opt}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Talent Categories <span className="text-[#c9a84c]">*</span></label>
                <p className="text-[#9ba9bb] text-xs mb-3">Select all that apply (at least one required).</p>
                <div className="grid grid-cols-2 gap-2">
                  {TALENT_CATEGORIES.map(cat => (
                    <GoldCheckbox
                      key={cat}
                      checked={formData.talent_categories.includes(cat)}
                      onChange={() => toggleArrayItem('talent_categories', cat)}
                      label={cat}
                    />
                  ))}
                </div>
              </div>

              <ErrorBanner />
              <NavButtons />
            </div>
          )}

          {/* ── Step 3: Attributes & Skills ── */}
          {step === 3 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
              <div>
                <h2 className={sectionTitle}>Attributes & Skills</h2>
                <p className={sectionSub}>Physical attributes and special abilities.</p>
              </div>

              <div>
                <label className={labelClass}>Gender <span className="text-[#c9a84c]">*</span></label>
                <select name="gender" value={formData.gender} onChange={handleText} className={inputClass}>
                  <option value="">Select gender</option>
                  {['Male', 'Female', 'Non-Binary', 'Prefer not to say'].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Height</label>
                  <input name="height" value={formData.height} onChange={handleText} className={inputClass} placeholder="5'10&quot;" />
                </div>
                <div>
                  <label className={labelClass}>Weight</label>
                  <input name="weight" value={formData.weight} onChange={handleText} className={inputClass} placeholder="155 lbs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Hair Color</label>
                  <select name="hair_color" value={formData.hair_color} onChange={handleText} className={inputClass}>
                    <option value="">Select</option>
                    {['Black', 'Brown', 'Blonde', 'Red', 'Auburn', 'Gray', 'White', 'Other'].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Eye Color</label>
                  <select name="eye_color" value={formData.eye_color} onChange={handleText} className={inputClass}>
                    <option value="">Select</option>
                    {['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Other'].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Ethnicity</label>
                <p className="text-[#9ba9bb] text-xs mb-3">Select all that apply.</p>
                <div className="grid grid-cols-1 gap-2">
                  {ETHNICITIES.map(e => (
                    <GoldCheckbox
                      key={e}
                      checked={formData.ethnicity.includes(e)}
                      onChange={() => toggleArrayItem('ethnicity', e)}
                      label={e}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Wardrobe Sizes</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { field: 'top_size', placeholder: 'Top Size (e.g. M, L, 42R)' },
                    { field: 'bottom_size', placeholder: 'Bottom Size (e.g. 32x30)' },
                    { field: 'dress_size', placeholder: 'Dress Size (e.g. 6, 8)' },
                    { field: 'shoe_size', placeholder: 'Shoe Size (e.g. 10.5)' },
                  ].map(({ field, placeholder }) => (
                    <div key={field}>
                      <input
                        name={field}
                        value={formData[field as keyof FormData] as string}
                        onChange={handleText}
                        className={inputClass}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Skills</label>
                {SKILLS_GROUPS.map(({ group, skills }) => (
                  <div key={group} className="mb-5">
                    <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-2">{group}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {skills.map(skill => (
                        <GoldCheckbox
                          key={skill}
                          checked={formData.skills.includes(skill)}
                          onChange={() => toggleArrayItem('skills', skill)}
                          label={skill}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                <div className="mb-4">
                  <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-3">Other</p>
                  <div className="flex flex-col gap-3">
                    {[
                      { name: 'languages', placeholder: 'Languages spoken (e.g. Spanish, French)' },
                      { name: 'dialects', placeholder: 'Dialects / Accents (e.g. British, Southern)' },
                      { name: 'instruments', placeholder: 'Instruments (e.g. Piano, Guitar)' },
                      { name: 'sports', placeholder: 'Sports (e.g. Basketball, Soccer)' },
                    ].map(({ name, placeholder }) => (
                      <div key={name}>
                        <label className={labelClass}>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
                        <input name={name} value={formData[name as keyof FormData] as string} onChange={handleText} className={inputClass} placeholder={placeholder} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <ErrorBanner />
              <NavButtons />
            </div>
          )}

          {/* ── Step 4: Media ── */}
          {step === 4 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
              <div>
                <h2 className={sectionTitle}>Media</h2>
                <p className={sectionSub}>Upload your photos and share your links. JPG/PNG for photos, PDF for resume.</p>
              </div>

              <FileUploadBox
                label="Primary Headshot"
                required
                accept="image/jpeg,image/png"
                file={headshot}
                onFile={setHeadshot}
              />
              <FileUploadBox
                label="Commercial Headshot"
                accept="image/jpeg,image/png"
                file={commercialHeadshot}
                onFile={setCommercialHeadshot}
              />
              <FileUploadBox
                label="Theatrical Headshot"
                accept="image/jpeg,image/png"
                file={theatricalHeadshot}
                onFile={setTheatricalHeadshot}
              />
              <FileUploadBox
                label="Full Body Photo"
                accept="image/jpeg,image/png"
                file={fullBody}
                onFile={setFullBody}
              />
              <FileUploadBox
                label="Resume (PDF)"
                accept=".pdf"
                file={resumeFile}
                onFile={setResumeFile}
              />

              <div>
                <label className={labelClass}>Demo Reel URL</label>
                <input name="demo_reel_url" value={formData.demo_reel_url} onChange={handleText} className={inputClass} placeholder="YouTube or Vimeo link" />
              </div>
              <div>
                <label className={labelClass}>Voice Reel URL</label>
                <input name="voice_reel_url" value={formData.voice_reel_url} onChange={handleText} className={inputClass} placeholder="YouTube or SoundCloud link" />
              </div>

              <div>
                <label className={labelClass}>Social Handles</label>
                <div className="flex flex-col gap-3">
                  <input name="instagram" value={formData.instagram} onChange={handleText} className={inputClass} placeholder="@instagram" />
                  <input name="tiktok" value={formData.tiktok} onChange={handleText} className={inputClass} placeholder="@tiktok" />
                  <input name="youtube" value={formData.youtube} onChange={handleText} className={inputClass} placeholder="YouTube channel URL" />
                </div>
              </div>

              <ErrorBanner />
              <NavButtons />
            </div>
          )}

          {/* ── Step 5: Experience ── */}
          {step === 5 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
              <div>
                <h2 className={sectionTitle}>Experience</h2>
                <p className={sectionSub}>Where have you worked and what&apos;s your level?</p>
              </div>

              <div>
                <label className={labelClass}>Where Do You Have Experience?</label>
                <p className="text-[#9ba9bb] text-xs mb-3">Select all categories you have active experience in.</p>
                <div className="grid grid-cols-2 gap-2">
                  {TALENT_CATEGORIES.map(cat => (
                    <GoldCheckbox
                      key={cat}
                      checked={formData.experience_categories.includes(cat)}
                      onChange={() => toggleArrayItem('experience_categories', cat)}
                      label={cat}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Experience Level <span className="text-[#c9a84c]">*</span></label>
                <div className="flex flex-col gap-3 mt-1">
                  {EXPERIENCE_LEVELS.map(lvl => (
                    <GoldRadio
                      key={lvl}
                      checked={formData.experience_level === lvl}
                      onChange={() => set('experience_level', lvl)}
                      label={lvl}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Notable Credits / Resume Highlights</label>
                <textarea
                  name="notable_credits"
                  value={formData.notable_credits}
                  onChange={handleText}
                  rows={5}
                  className={inputClass}
                  placeholder="Describe your top credits, projects, brands worked with, productions, etc."
                />
              </div>

              <ErrorBanner />
              <NavButtons />
            </div>
          )}

          {/* ── Step 6: Availability ── */}
          {step === 6 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
              <div>
                <h2 className={sectionTitle}>Availability</h2>
                <p className={sectionSub}>Let us know where and how you can work.</p>
              </div>

              <div>
                <label className={labelClass}>Availability Type</label>
                <div className="flex flex-col gap-3 mt-1">
                  {AVAILABILITY_OPTIONS.map(opt => (
                    <GoldCheckbox
                      key={opt}
                      checked={formData.availability_type.includes(opt)}
                      onChange={() => toggleArrayItem('availability_type', opt)}
                      label={opt}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <GoldCheckbox
                  checked={formData.has_passport}
                  onChange={v => set('has_passport', v)}
                  label="I have a valid passport"
                />
                <GoldCheckbox
                  checked={formData.has_drivers_license}
                  onChange={v => set('has_drivers_license', v)}
                  label="I have a valid driver's license"
                />
                <GoldCheckbox
                  checked={formData.has_transportation}
                  onChange={v => set('has_transportation', v)}
                  label="I have reliable transportation"
                />
              </div>

              <div>
                <label className={labelClass}>Local Hire Markets</label>
                <input
                  name="local_hire_markets"
                  value={formData.local_hire_markets}
                  onChange={handleText}
                  className={inputClass}
                  placeholder="e.g. Orlando, Tampa, Jacksonville (comma-separated)"
                />
              </div>

              <ErrorBanner />
              <NavButtons />
            </div>
          )}

          {/* ── Step 7: Review ── */}
          {step === 7 && (
            <div className="glass-card rounded-xl p-8 flex flex-col gap-6">
              <div>
                <h2 className={sectionTitle}>Review Your Application</h2>
                <p className={sectionSub}>Look everything over before submitting.</p>
              </div>

              {/* Review sections */}
              {[
                {
                  title: 'Personal Info',
                  rows: [
                    ['Name', `${formData.first_name} ${formData.last_name}${formData.stage_name ? ` (${formData.stage_name})` : ''}`],
                    ['Email', formData.email],
                    ['Phone', formData.phone || '—'],
                    ['Date of Birth', formData.dob || '—'],
                    ['Location', `${formData.city}, ${formData.state}`],
                    ['Bio', formData.bio || '—'],
                  ],
                },
                {
                  title: 'Talent Details',
                  rows: [
                    ['Representation', formData.representation_type || '—'],
                    ['Union Status', formData.union_status || '—'],
                    ['Categories', formData.talent_categories.join(', ') || '—'],
                  ],
                },
                {
                  title: 'Attributes & Skills',
                  rows: [
                    ['Gender', formData.gender || '—'],
                    ['Height / Weight', `${formData.height || '—'} / ${formData.weight || '—'}`],
                    ['Hair / Eyes', `${formData.hair_color || '—'} / ${formData.eye_color || '—'}`],
                    ['Ethnicity', formData.ethnicity.join(', ') || '—'],
                    ['Wardrobe', `Top: ${formData.top_size || '—'}, Bottom: ${formData.bottom_size || '—'}, Dress: ${formData.dress_size || '—'}, Shoe: ${formData.shoe_size || '—'}`],
                    ['Skills', formData.skills.join(', ') || '—'],
                    ['Languages', formData.languages || '—'],
                    ['Dialects', formData.dialects || '—'],
                    ['Instruments', formData.instruments || '—'],
                    ['Sports', formData.sports || '—'],
                  ],
                },
                {
                  title: 'Media',
                  rows: [
                    ['Primary Headshot', headshot?.name || '—'],
                    ['Commercial Headshot', commercialHeadshot?.name || '—'],
                    ['Theatrical Headshot', theatricalHeadshot?.name || '—'],
                    ['Full Body', fullBody?.name || '—'],
                    ['Resume', resumeFile?.name || '—'],
                    ['Demo Reel', formData.demo_reel_url || '—'],
                    ['Voice Reel', formData.voice_reel_url || '—'],
                    ['Instagram', formData.instagram || '—'],
                    ['TikTok', formData.tiktok || '—'],
                    ['YouTube', formData.youtube || '—'],
                  ],
                },
                {
                  title: 'Experience',
                  rows: [
                    ['Experience Categories', formData.experience_categories.join(', ') || '—'],
                    ['Experience Level', formData.experience_level || '—'],
                    ['Notable Credits', formData.notable_credits || '—'],
                  ],
                },
                {
                  title: 'Availability',
                  rows: [
                    ['Availability', formData.availability_type.join(', ') || '—'],
                    ['Passport', formData.has_passport ? 'Yes' : 'No'],
                    ["Driver's License", formData.has_drivers_license ? 'Yes' : 'No'],
                    ['Transportation', formData.has_transportation ? 'Yes' : 'No'],
                    ['Local Markets', formData.local_hire_markets || '—'],
                  ],
                },
              ].map(section => (
                <div key={section.title} className="border border-[rgba(201,168,76,0.15)] rounded-lg overflow-hidden">
                  <div className="bg-[rgba(201,168,76,0.06)] px-5 py-3 border-b border-[rgba(201,168,76,0.15)]">
                    <p className="text-[#c9a84c] text-xs tracking-widest uppercase">{section.title}</p>
                  </div>
                  <div className="divide-y divide-[rgba(201,168,76,0.08)]">
                    {section.rows.map(([key, val]) => (
                      <div key={key} className="flex px-5 py-3 gap-4">
                        <span className="text-[#9ba9bb] text-xs w-36 flex-shrink-0 pt-0.5">{key}</span>
                        <span className="text-[#f0ead8] text-sm break-words flex-1">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border border-[#c9a84c]/30 rounded-lg p-5">
                <GoldCheckbox
                  checked={formData.confirmed_accurate}
                  onChange={v => set('confirmed_accurate', v)}
                  label="I confirm all information is accurate and complete."
                />
              </div>

              <ErrorBanner />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={back}
                  className="flex-1 py-3 border border-[rgba(201,168,76,0.2)] text-[#9ba9bb] rounded text-sm hover:text-[#f0ead8] hover:border-[#c9a84c]/40 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all disabled:opacity-40"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </>
  )
}
