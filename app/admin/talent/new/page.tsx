'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, ChevronDown, ChevronUp } from 'lucide-react'

const CATEGORIES = [
  'Actor', 'Model', 'Commercial', 'Voice Over', 'Singer', 'Dancer',
  'Influencer', 'Lifestyle', 'Comedian', 'Print', 'Background', 'Young Talent',
]
const SKILLS_OPTIONS = [
  'Acting', 'Modeling', 'Singing', 'Dancing', 'Voice Over', 'Comedy',
  'Improv', 'Athletics', 'Martial Arts', 'Horseback Riding', 'Swimming',
  'Gymnastics', 'Stunt Work', 'Spoken Word', 'Public Speaking',
]
const LANGUAGES = [
  'English', 'Spanish', 'French', 'Portuguese', 'Mandarin', 'Japanese',
  'Arabic', 'Italian', 'German', 'Creole', 'ASL',
]

const inputCls = "w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-3 py-2.5 text-[#f0ead8] text-sm placeholder-[#9ba9bb]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
const selectCls = `${inputCls} appearance-none`

function Section({ label, open, onToggle, children, accent }: {
  label: string; open: boolean; onToggle: () => void; children: React.ReactNode; accent?: boolean
}) {
  return (
    <div className={`glass-card rounded-xl p-6 ${accent ? 'border border-[#c9a84c]/15' : ''}`}>
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between text-[#c9a84c] text-xs tracking-widest uppercase mb-4 hover:text-[#e8c97a] transition-colors">
        {label}
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && children}
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#9ba9bb] text-xs tracking-wide uppercase">
        {label}{required && <span className="text-[#c9a84c] ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-3 py-2 rounded border text-xs transition-all ${
        checked ? 'bg-green-500/15 text-green-400 border-green-500/40' : 'bg-[#141929] text-[#9ba9bb] border-[rgba(201,168,76,0.2)]'
      }`}>
      <span className={`w-3 h-3 rounded-full ${checked ? 'bg-green-400' : 'bg-[#9ba9bb]/40'}`} />
      {label}
    </button>
  )
}

function TagInput({ label, value, options, onChange }: {
  label: string; value: string[]; options?: string[]; onChange: (v: string[]) => void
}) {
  const [input, setInput] = useState('')
  function add(item: string) {
    const t = item.trim()
    if (t && !value.includes(t)) onChange([...value, t])
    setInput('')
  }
  return (
    <div>
      <label className="text-[#9ba9bb] text-xs tracking-wide uppercase block mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(item => (
          <span key={item} className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#141929] border border-[rgba(201,168,76,0.3)] text-[#f0ead8] text-xs">
            {item}
            <button type="button" onClick={() => onChange(value.filter(v => v !== item))} className="text-[#9ba9bb] hover:text-red-400 ml-1">×</button>
          </span>
        ))}
      </div>
      {options ? (
        <select className={selectCls} value="" onChange={e => { if (e.target.value) add(e.target.value) }}>
          <option value="">+ Add {label.toLowerCase()}...</option>
          {options.filter(o => !value.includes(o)).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <div className="flex gap-2">
          <input className={inputCls} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(input) } }}
            placeholder="Type and press Enter..." />
          <button type="button" onClick={() => add(input)} className="px-3 py-2 text-xs bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 rounded hover:bg-[#c9a84c]/30 transition-all whitespace-nowrap">Add</button>
        </div>
      )}
    </div>
  )
}

type Form = {
  first_name: string; last_name: string; stage_name: string; email: string; phone: string
  dob: string; city: string; state: string; gender: string; bio: string
  union_status: string; experience_level: string; representation_type: string
  work_authorization: string; previous_agency: string; acting_training: string
  plays_age_min: string; plays_age_max: string
  actors_access_profile: string; backstage_profile: string
  height: string; weight: string; hair_color: string; eye_color: string; shoe_size: string
  measurements: string; skin_tone: string; tattoos_markings: string; swim_ability: string
  instagram: string; tiktok: string; youtube: string
  headshot_url: string; commercial_headshot_url: string; theatrical_headshot_url: string
  full_body_url: string; resume_url: string; demo_reel_url: string; voice_reel_url: string
  emergency_contact_name: string; emergency_contact_phone: string; emergency_contact_relationship: string
  guardian_name: string; guardian_email: string; guardian_phone: string; guardian_relationship: string
  contract_start_date: string; contract_end_date: string
  commission_rate: string; day_rate: string; agent_notes: string
  categories: string[]; skills: string[]; languages: string[]
  ethnicity: string[]; local_hire_markets: string[]; wardrobe_sizes: string[]
  dialects: string[]; commercial_conflicts: string[]
  is_available: boolean; will_travel: boolean; has_passport: boolean
  has_drivers_license: boolean; has_transportation: boolean; is_minor: boolean
  create_account: boolean
}

const empty: Form = {
  first_name: '', last_name: '', stage_name: '', email: '', phone: '',
  dob: '', city: '', state: '', gender: '', bio: '',
  union_status: '', experience_level: '', representation_type: '',
  work_authorization: '', previous_agency: '', acting_training: '',
  plays_age_min: '', plays_age_max: '',
  actors_access_profile: '', backstage_profile: '',
  height: '', weight: '', hair_color: '', eye_color: '', shoe_size: '',
  measurements: '', skin_tone: '', tattoos_markings: '', swim_ability: '',
  instagram: '', tiktok: '', youtube: '',
  headshot_url: '', commercial_headshot_url: '', theatrical_headshot_url: '',
  full_body_url: '', resume_url: '', demo_reel_url: '', voice_reel_url: '',
  emergency_contact_name: '', emergency_contact_phone: '', emergency_contact_relationship: '',
  guardian_name: '', guardian_email: '', guardian_phone: '', guardian_relationship: '',
  contract_start_date: '', contract_end_date: '',
  commission_rate: '', day_rate: '', agent_notes: '',
  categories: [], skills: [], languages: [],
  ethnicity: [], local_hire_markets: [], wardrobe_sizes: [],
  dialects: [], commercial_conflicts: [],
  is_available: false, will_travel: false, has_passport: false,
  has_drivers_license: false, has_transportation: false, is_minor: false,
  create_account: false,
}

export default function NewTalentPage() {
  const router = useRouter()
  const [form, setForm] = useState<Form>(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState({
    identity: true, emergency: true, professional: true, casting: true,
    physical: false, skills: true, availability: false,
    social: false, media: false, business: false, notes: false,
  })
  function toggle(s: keyof typeof open) { setOpen(prev => ({ ...prev, [s]: !prev[s] })) }
  function set<K extends keyof Form>(key: K, value: Form[K]) { setForm(prev => ({ ...prev, [key]: value })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.first_name || !form.last_name) { setError('First and last name are required.'); return }
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        plays_age_min: form.plays_age_min ? parseInt(form.plays_age_min) : null,
        plays_age_max: form.plays_age_max ? parseInt(form.plays_age_max) : null,
        commission_rate: form.commission_rate ? parseFloat(form.commission_rate) : null,
      }
      const res = await fetch('/api/admin/talent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok && data.id) {
        router.push(`/admin/talent/${data.id}`)
      } else {
        setError(data.error || 'Failed to create talent profile.')
      }
    } finally { setSaving(false) }
  }

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/talent" className="text-[#9ba9bb] text-xs hover:text-[#c9a84c] transition-colors mb-4 inline-block">
        ← Back to Roster
      </Link>
      <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Admin</p>
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#f0ead8] mb-8">Add Talent Directly</h1>

      {error && (
        <div className="mb-6 px-4 py-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-5">

        {/* Identity */}
        <Section label="Identity" open={open.identity} onToggle={() => toggle('identity')}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="First Name" required><input className={inputCls} value={form.first_name} onChange={e => set('first_name', e.target.value)} /></Field>
            <Field label="Last Name" required><input className={inputCls} value={form.last_name} onChange={e => set('last_name', e.target.value)} /></Field>
            <Field label="Stage Name"><input className={inputCls} value={form.stage_name} onChange={e => set('stage_name', e.target.value)} placeholder="Optional" /></Field>
            <Field label="Email"><input className={inputCls} type="email" value={form.email} onChange={e => set('email', e.target.value)} /></Field>
            <Field label="Phone"><input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} /></Field>
            <Field label="Date of Birth"><input className={inputCls} type="date" value={form.dob} onChange={e => set('dob', e.target.value)} /></Field>
            <Field label="City"><input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} /></Field>
            <Field label="State"><input className={inputCls} value={form.state} onChange={e => set('state', e.target.value)} placeholder="FL" /></Field>
            <Field label="Gender">
              <select className={selectCls} value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="">Select...</option>
                {['Male', 'Female', 'Non-Binary', 'Prefer not to say'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <div className="col-span-2 md:col-span-3">
              <Field label="Bio"><textarea className={`${inputCls} resize-none`} rows={3} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Short bio..." /></Field>
            </div>
          </div>
        </Section>

        {/* Emergency Contact */}
        <div className="glass-card rounded-xl p-6 border border-red-500/10">
          <button type="button" onClick={() => toggle('emergency')}
            className="w-full flex items-center justify-between text-[#c9a84c] text-xs tracking-widest uppercase mb-4 hover:text-[#e8c97a] transition-colors">
            Emergency Contact
            {open.emergency ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {open.emergency && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Name"><input className={inputCls} value={form.emergency_contact_name} onChange={e => set('emergency_contact_name', e.target.value)} placeholder="Full name" /></Field>
              <Field label="Phone"><input className={inputCls} value={form.emergency_contact_phone} onChange={e => set('emergency_contact_phone', e.target.value)} /></Field>
              <Field label="Relationship"><input className={inputCls} value={form.emergency_contact_relationship} onChange={e => set('emergency_contact_relationship', e.target.value)} placeholder="Parent, Spouse, etc." /></Field>
            </div>
          )}
        </div>

        {/* Professional */}
        <Section label="Professional" open={open.professional} onToggle={() => toggle('professional')}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Union Status">
              <select className={selectCls} value={form.union_status} onChange={e => set('union_status', e.target.value)}>
                <option value="">Select...</option>
                {['SAG-AFTRA', 'AEA', 'Non-Union', 'Fi-Core'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="Experience Level">
              <select className={selectCls} value={form.experience_level} onChange={e => set('experience_level', e.target.value)}>
                <option value="">Select...</option>
                {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Representation Type">
              <select className={selectCls} value={form.representation_type} onChange={e => set('representation_type', e.target.value)}>
                <option value="">Select...</option>
                {['Talent Only', 'Modeling Only', 'Full Service', 'Consulting'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Work Authorization">
              <select className={selectCls} value={form.work_authorization} onChange={e => set('work_authorization', e.target.value)}>
                <option value="">Select...</option>
                {['US Citizen', 'Permanent Resident', 'Work Visa', 'Student Visa', 'Other'].map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </Field>
            <Field label="Previous Agency"><input className={inputCls} value={form.previous_agency} onChange={e => set('previous_agency', e.target.value)} placeholder="Agency name or None" /></Field>
            <Field label="Acting Training / Coaches"><input className={inputCls} value={form.acting_training} onChange={e => set('acting_training', e.target.value)} placeholder="Schools, coaches, methods..." /></Field>
          </div>
        </Section>

        {/* Casting Info */}
        <Section label="Casting Info" open={open.casting} onToggle={() => toggle('casting')}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Plays Age Min"><input className={inputCls} type="number" value={form.plays_age_min} onChange={e => set('plays_age_min', e.target.value)} placeholder="e.g. 25" /></Field>
            <Field label="Plays Age Max"><input className={inputCls} type="number" value={form.plays_age_max} onChange={e => set('plays_age_max', e.target.value)} placeholder="e.g. 45" /></Field>
            <Field label="Actors Access Profile"><input className={inputCls} value={form.actors_access_profile} onChange={e => set('actors_access_profile', e.target.value)} placeholder="Username or URL" /></Field>
            <Field label="Backstage Profile"><input className={inputCls} value={form.backstage_profile} onChange={e => set('backstage_profile', e.target.value)} placeholder="Username or URL" /></Field>
            <div className="col-span-2">
              <TagInput label="Commercial Conflicts (Brands)" value={form.commercial_conflicts} onChange={v => set('commercial_conflicts', v)} />
            </div>
          </div>
        </Section>

        {/* Categories & Skills */}
        <Section label="Categories & Skills" open={open.skills} onToggle={() => toggle('skills')}>
          <div className="flex flex-col gap-5">
            <TagInput label="Categories" value={form.categories} options={CATEGORIES} onChange={v => set('categories', v)} />
            <TagInput label="Skills" value={form.skills} options={SKILLS_OPTIONS} onChange={v => set('skills', v)} />
            <TagInput label="Languages" value={form.languages} options={LANGUAGES} onChange={v => set('languages', v)} />
            <TagInput label="Dialects / Accents" value={form.dialects} onChange={v => set('dialects', v)} />
            <TagInput label="Ethnicity" value={form.ethnicity} onChange={v => set('ethnicity', v)} />
          </div>
        </Section>

        {/* Physical */}
        <Section label="Physical Attributes" open={open.physical} onToggle={() => toggle('physical')}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Height"><input className={inputCls} value={form.height} onChange={e => set('height', e.target.value)} placeholder='5&apos;8"' /></Field>
            <Field label="Weight"><input className={inputCls} value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="145 lbs" /></Field>
            <Field label="Hair Color"><input className={inputCls} value={form.hair_color} onChange={e => set('hair_color', e.target.value)} /></Field>
            <Field label="Eye Color"><input className={inputCls} value={form.eye_color} onChange={e => set('eye_color', e.target.value)} /></Field>
            <Field label="Shoe Size"><input className={inputCls} value={form.shoe_size} onChange={e => set('shoe_size', e.target.value)} /></Field>
            <Field label="Measurements (B/W/H)"><input className={inputCls} value={form.measurements} onChange={e => set('measurements', e.target.value)} placeholder="34-26-36" /></Field>
            <Field label="Skin Tone">
              <select className={selectCls} value={form.skin_tone} onChange={e => set('skin_tone', e.target.value)}>
                <option value="">Select...</option>
                {['Very Fair', 'Fair', 'Light', 'Light Medium', 'Medium', 'Medium Tan', 'Tan', 'Deep Tan', 'Brown', 'Dark Brown', 'Deep'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Swim Ability">
              <select className={selectCls} value={form.swim_ability} onChange={e => set('swim_ability', e.target.value)}>
                <option value="">Select...</option>
                {['None', 'Basic', 'Intermediate', 'Advanced', 'Competitive'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <div className="col-span-2 md:col-span-3">
              <Field label="Visible Tattoos / Piercings / Scars">
                <input className={inputCls} value={form.tattoos_markings} onChange={e => set('tattoos_markings', e.target.value)} placeholder="Describe any visible markings, or None" />
              </Field>
            </div>
            <div className="col-span-2 md:col-span-3">
              <TagInput label="Wardrobe Sizes" value={form.wardrobe_sizes} onChange={v => set('wardrobe_sizes', v)} />
            </div>
          </div>
        </Section>

        {/* Availability */}
        <Section label="Availability" open={open.availability} onToggle={() => toggle('availability')}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <Toggle label={form.is_available ? 'Available' : 'Draft — onboarding required'} checked={form.is_available} onChange={v => set('is_available', v)} />
              <Toggle label="Will Travel" checked={form.will_travel} onChange={v => set('will_travel', v)} />
              <Toggle label="Has Passport" checked={form.has_passport} onChange={v => set('has_passport', v)} />
              <Toggle label="Has Driver's License" checked={form.has_drivers_license} onChange={v => set('has_drivers_license', v)} />
              <Toggle label="Has Transportation" checked={form.has_transportation} onChange={v => set('has_transportation', v)} />
              <Toggle label="Is Minor" checked={form.is_minor} onChange={v => set('is_minor', v)} />
            </div>
            <TagInput label="Local Hire Markets" value={form.local_hire_markets} onChange={v => set('local_hire_markets', v)} />
          </div>
        </Section>

        {/* Social */}
        <Section label="Social Media" open={open.social} onToggle={() => toggle('social')}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Instagram Handle"><input className={inputCls} value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@handle" /></Field>
            <Field label="TikTok"><input className={inputCls} value={form.tiktok} onChange={e => set('tiktok', e.target.value)} /></Field>
            <Field label="YouTube URL"><input className={inputCls} value={form.youtube} onChange={e => set('youtube', e.target.value)} /></Field>
          </div>
        </Section>

        {/* Media */}
        <Section label="Media & File URLs" open={open.media} onToggle={() => toggle('media')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Primary Headshot URL"><input className={inputCls} value={form.headshot_url} onChange={e => set('headshot_url', e.target.value)} /></Field>
            <Field label="Commercial Headshot URL"><input className={inputCls} value={form.commercial_headshot_url} onChange={e => set('commercial_headshot_url', e.target.value)} /></Field>
            <Field label="Theatrical Headshot URL"><input className={inputCls} value={form.theatrical_headshot_url} onChange={e => set('theatrical_headshot_url', e.target.value)} /></Field>
            <Field label="Full Body URL"><input className={inputCls} value={form.full_body_url} onChange={e => set('full_body_url', e.target.value)} /></Field>
            <Field label="Resume URL"><input className={inputCls} value={form.resume_url} onChange={e => set('resume_url', e.target.value)} /></Field>
            <Field label="Demo Reel URL"><input className={inputCls} value={form.demo_reel_url} onChange={e => set('demo_reel_url', e.target.value)} /></Field>
            <Field label="Voice Reel URL"><input className={inputCls} value={form.voice_reel_url} onChange={e => set('voice_reel_url', e.target.value)} /></Field>
          </div>
        </Section>

        {/* Guardian — only shown when is_minor toggled */}
        {form.is_minor && (
          <div className="glass-card rounded-xl p-6 border border-[#c9a84c]/20">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Parent / Guardian</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name"><input className={inputCls} value={form.guardian_name} onChange={e => set('guardian_name', e.target.value)} /></Field>
              <Field label="Relationship"><input className={inputCls} value={form.guardian_relationship} onChange={e => set('guardian_relationship', e.target.value)} /></Field>
              <Field label="Email"><input className={inputCls} type="email" value={form.guardian_email} onChange={e => set('guardian_email', e.target.value)} /></Field>
              <Field label="Phone"><input className={inputCls} value={form.guardian_phone} onChange={e => set('guardian_phone', e.target.value)} /></Field>
            </div>
          </div>
        )}

        {/* Business / Contract */}
        <Section label="Business & Contract (Admin Only)" open={open.business} onToggle={() => toggle('business')} accent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Contract Start Date"><input className={inputCls} type="date" value={form.contract_start_date} onChange={e => set('contract_start_date', e.target.value)} /></Field>
            <Field label="Contract End / Renewal Date"><input className={inputCls} type="date" value={form.contract_end_date} onChange={e => set('contract_end_date', e.target.value)} /></Field>
            <Field label="Commission Rate (%)"><input className={inputCls} type="number" step="0.5" min="0" max="25" value={form.commission_rate} onChange={e => set('commission_rate', e.target.value)} placeholder="10" /></Field>
            <Field label="Day Rate"><input className={inputCls} value={form.day_rate} onChange={e => set('day_rate', e.target.value)} placeholder="e.g. $500/day" /></Field>
          </div>
        </Section>

        {/* Agent Notes */}
        <Section label="Agent Notes (Internal Only)" open={open.notes} onToggle={() => toggle('notes')} accent>
          <Field label="Notes">
            <textarea className={`${inputCls} resize-none`} rows={4} value={form.agent_notes} onChange={e => set('agent_notes', e.target.value)} placeholder="Internal notes — not visible to talent..." />
          </Field>
        </Section>

        {/* Portal account */}
        <div className="glass-card rounded-xl p-6 flex items-start gap-4">
          <button type="button" onClick={() => set('create_account', !form.create_account)}
            className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
              form.create_account ? 'bg-[#c9a84c] border-[#c9a84c]' : 'border-[rgba(201,168,76,0.4)] bg-transparent'
            }`}>
            {form.create_account && <span className="text-[#06080f] text-xs font-bold">✓</span>}
          </button>
          <div>
            <p className="text-[#f0ead8] text-sm font-medium">Create portal account</p>
            <p className="text-[#9ba9bb] text-xs mt-1">Gives this talent a login to access the talent portal. Requires an email address.</p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <Link href="/admin/talent" className="text-[#9ba9bb] text-sm hover:text-[#f0ead8] transition-colors">Cancel</Link>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-[#c9a84c] text-[#06080f] font-bold rounded text-sm hover:bg-[#e8c97a] transition-all disabled:opacity-50">
            <Save size={15} /> {saving ? 'Creating...' : 'Add to Roster'}
          </button>
        </div>

      </form>
    </div>
  )
}
