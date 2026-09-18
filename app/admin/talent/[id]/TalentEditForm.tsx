'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X, Pencil, ChevronDown, ChevronUp, Trash2, Upload } from 'lucide-react'

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

interface TalentData {
  id: string
  first_name?: string | null; last_name?: string | null; stage_name?: string | null
  email?: string | null; phone?: string | null; dob?: string | null
  city?: string | null; state?: string | null; bio?: string | null; gender?: string | null
  height?: string | null; weight?: string | null; hair_color?: string | null
  eye_color?: string | null; shoe_size?: string | null; skin_tone?: string | null
  measurements?: string | null; tattoos_markings?: string | null; swim_ability?: string | null
  instagram?: string | null; tiktok?: string | null; youtube?: string | null
  headshot_url?: string | null; commercial_headshot_url?: string | null
  theatrical_headshot_url?: string | null; full_body_url?: string | null
  resume_url?: string | null; demo_reel_url?: string | null; voice_reel_url?: string | null
  union_status?: string | null; experience_level?: string | null; representation_type?: string | null
  work_authorization?: string | null; plays_age_min?: number | null; plays_age_max?: number | null
  acting_training?: string | null; previous_agency?: string | null
  notable_credits?: string | null; instruments?: string | null
  actors_access_profile?: string | null; backstage_profile?: string | null
  commercial_conflicts?: string[] | null; contract_start_date?: string | null
  contract_end_date?: string | null; commission_rate?: number | null
  day_rate?: string | null; agent_notes?: string | null
  talent_tier?: 'Tier 1' | 'Tier 2' | null
  primary_specialty?: string | null
  categories?: string[] | null; skills?: string[] | null; languages?: string[] | null
  ethnicity?: string[] | null; local_hire_markets?: string[] | null
  dialects?: string[] | null; wardrobe_sizes?: string[] | null
  is_available?: boolean | null; will_travel?: boolean | null; has_passport?: boolean | null
  has_drivers_license?: boolean | null; has_transportation?: boolean | null; is_minor?: boolean | null
  emergency_contact_name?: string | null; emergency_contact_phone?: string | null
  emergency_contact_relationship?: string | null
  guardian_name?: string | null; guardian_relationship?: string | null
  guardian_email?: string | null; guardian_phone?: string | null
}

const inputCls = "w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-3 py-2 text-[#f0ead8] text-sm placeholder-[#9ba9bb]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
const selectCls = `${inputCls} appearance-none`

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[#9ba9bb] text-xs tracking-widest uppercase">{label}</label>
      {children}
    </div>
  )
}

function SectionHeader({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      className="w-full flex items-center justify-between text-[#c9a84c] text-xs tracking-widest uppercase mb-4 hover:text-[#e8c97a] transition-colors">
      {label}
      {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
    </button>
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
      <label className="text-[#9ba9bb] text-xs tracking-widest uppercase block mb-2">{label}</label>
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
          <button type="button" onClick={() => add(input)} className="px-3 py-2 text-xs bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 rounded hover:bg-[#c9a84c]/30 transition-all">Add</button>
        </div>
      )}
    </div>
  )
}

export default function TalentEditForm({ talent }: { talent: TalentData }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>({})
  const [previewErrors, setPreviewErrors] = useState<Record<string, boolean>>({})
  const [form, setForm] = useState<TalentData>({ ...talent })
  const [open, setOpen] = useState({
    identity: true, professional: true, casting: true, physical: true,
    skills: false, social: false, availability: false, media: false,
    emergency: true, guardian: false, business: false, notes: false,
  })

  function toggleSection(s: keyof typeof open) {
    setOpen(prev => ({ ...prev, [s]: !prev[s] }))
  }
  function set<K extends keyof TalentData>(key: K, value: TalentData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/talent/${talent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setEditing(false)
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Save failed.')
      }
    } finally {
      setSaving(false)
    }
  }

  function cancel() {
    setForm({ ...talent })
    setEditing(false)
  }

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/admin/talent/${talent.id}`, { method: 'DELETE' })
    router.push('/admin/talent')
  }

  async function handleUpload(fileType: string, file: File) {
    setUploading(fileType)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('file_type', fileType)
      const res = await fetch(`/api/admin/talent/${talent.id}/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url && data.field) {
        set(data.field as keyof TalentData, data.url)
      }
    } finally {
      setUploading(null)
    }
  }

  if (!editing) {
    return (
      <button onClick={() => setEditing(true)}
        className="flex items-center gap-2 px-4 py-2 border border-[#c9a84c]/40 text-[#c9a84c] rounded text-xs hover:bg-[#c9a84c]/10 transition-all">
        <Pencil size={13} /> Edit Profile
      </button>
    )
  }

  return (
    <div className="mt-6 w-full max-w-5xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-[#c9a84c] text-xs tracking-widest uppercase">Editing Profile</p>
        <div className="flex gap-3 items-center flex-wrap">
          {/* Delete */}
          {confirmDelete ? (
            <>
              <span className="text-red-400 text-xs">Delete permanently?</span>
              <button onClick={handleDelete} disabled={deleting} className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 transition-all disabled:opacity-50">
                {deleting ? '...' : 'Yes, Delete'}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 text-[#9ba9bb] text-xs border border-[#9ba9bb]/30 rounded hover:bg-[#9ba9bb]/10 transition-all">
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/30 text-red-400 rounded text-xs hover:bg-red-500/10 transition-all">
              <Trash2 size={12} /> Delete Talent
            </button>
          )}
          <div className="w-px h-5 bg-[#9ba9bb]/20" />
          <button onClick={cancel} className="flex items-center gap-2 px-4 py-2 border border-[#9ba9bb]/30 text-[#9ba9bb] rounded text-xs hover:bg-[#9ba9bb]/10 transition-all">
            <X size={13} /> Cancel
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c] text-[#06080f] rounded text-xs font-bold hover:bg-[#e8c97a] transition-all disabled:opacity-50">
            <Save size={13} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">

        {/* Identity */}
        <div className="glass-card rounded-xl p-5">
          <SectionHeader label="Identity" open={open.identity} onToggle={() => toggleSection('identity')} />
          {open.identity && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="First Name"><input className={inputCls} value={form.first_name ?? ''} onChange={e => set('first_name', e.target.value)} /></Field>
              <Field label="Last Name"><input className={inputCls} value={form.last_name ?? ''} onChange={e => set('last_name', e.target.value)} /></Field>
              <Field label="Stage Name"><input className={inputCls} value={form.stage_name ?? ''} onChange={e => set('stage_name', e.target.value)} placeholder="Optional" /></Field>
              <Field label="Email"><input className={inputCls} type="email" value={form.email ?? ''} onChange={e => set('email', e.target.value)} /></Field>
              <Field label="Phone"><input className={inputCls} value={form.phone ?? ''} onChange={e => set('phone', e.target.value)} /></Field>
              <Field label="Date of Birth"><input className={inputCls} type="date" value={form.dob ?? ''} onChange={e => set('dob', e.target.value)} /></Field>
              <Field label="City"><input className={inputCls} value={form.city ?? ''} onChange={e => set('city', e.target.value)} /></Field>
              <Field label="State"><input className={inputCls} value={form.state ?? ''} onChange={e => set('state', e.target.value)} /></Field>
              <Field label="Gender">
                <select className={selectCls} value={form.gender ?? ''} onChange={e => set('gender', e.target.value)}>
                  <option value="">Select...</option>
                  {['Male', 'Female', 'Non-Binary', 'Prefer not to say'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <div className="col-span-2 md:col-span-3">
                <Field label="Bio">
                  <textarea className={`${inputCls} resize-none`} rows={3} value={form.bio ?? ''} onChange={e => set('bio', e.target.value)} />
                </Field>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="glass-card rounded-xl p-5 border border-red-500/10">
          <SectionHeader label="Emergency Contact" open={open.emergency} onToggle={() => toggleSection('emergency')} />
          {open.emergency && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Name"><input className={inputCls} value={form.emergency_contact_name ?? ''} onChange={e => set('emergency_contact_name', e.target.value)} placeholder="Full name" /></Field>
              <Field label="Phone"><input className={inputCls} value={form.emergency_contact_phone ?? ''} onChange={e => set('emergency_contact_phone', e.target.value)} /></Field>
              <Field label="Relationship"><input className={inputCls} value={form.emergency_contact_relationship ?? ''} onChange={e => set('emergency_contact_relationship', e.target.value)} placeholder="Parent, Spouse, etc." /></Field>
            </div>
          )}
        </div>

        {/* Professional */}
        <div className="glass-card rounded-xl p-5">
          <SectionHeader label="Professional" open={open.professional} onToggle={() => toggleSection('professional')} />
          {open.professional && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Union Status">
                <select className={selectCls} value={form.union_status ?? ''} onChange={e => set('union_status', e.target.value)}>
                  <option value="">Select...</option>
                  {['SAG-AFTRA', 'AEA', 'Non-Union', 'Fi-Core'].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </Field>
              <Field label="Experience Level">
                <select className={selectCls} value={form.experience_level ?? ''} onChange={e => set('experience_level', e.target.value)}>
                  <option value="">Select...</option>
                  {['Beginner', 'Intermediate', 'Advanced', 'Professional'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Representation Type">
                <select className={selectCls} value={form.representation_type ?? ''} onChange={e => set('representation_type', e.target.value)}>
                  <option value="">Select...</option>
                  {['Talent Only', 'Modeling Only', 'Full Service', 'Consulting'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Work Authorization">
                <select className={selectCls} value={form.work_authorization ?? ''} onChange={e => set('work_authorization', e.target.value)}>
                  <option value="">Select...</option>
                  {['US Citizen', 'Permanent Resident', 'Work Visa', 'Student Visa', 'Other'].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </Field>
              <Field label="Previous Agency"><input className={inputCls} value={form.previous_agency ?? ''} onChange={e => set('previous_agency', e.target.value)} placeholder="Agency name or None" /></Field>
              <Field label="Acting Training / Coaches"><input className={inputCls} value={form.acting_training ?? ''} onChange={e => set('acting_training', e.target.value)} placeholder="Schools, coaches, methods..." /></Field>
              <Field label="Talent Tier (Donet)">
                <select className={selectCls} value={form.talent_tier ?? ''} onChange={e => set('talent_tier', (e.target.value as 'Tier 1' | 'Tier 2') || null)}>
                  <option value="">Unassigned</option>
                  <option value="Tier 1">Tier 1</option>
                  <option value="Tier 2">Tier 2</option>
                </select>
              </Field>
              <Field label="Primary Specialty">
                <input className={inputCls} value={form.primary_specialty ?? ''} onChange={e => set('primary_specialty', e.target.value)} placeholder="e.g. Commercial Acting, Runway Modeling..." />
              </Field>
              <div>
                <label className="text-[#9ba9bb] text-xs tracking-widest uppercase block mb-1">Availability Status</label>
                <Toggle label={form.is_available ? 'Available' : 'Unavailable'} checked={!!form.is_available} onChange={v => set('is_available', v)} />
              </div>
            </div>
          )}
        </div>

        {/* Casting Info */}
        <div className="glass-card rounded-xl p-5">
          <SectionHeader label="Casting Info" open={open.casting} onToggle={() => toggleSection('casting')} />
          {open.casting && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Plays Age (Min)">
                <input className={inputCls} type="number" value={form.plays_age_min ?? ''} onChange={e => set('plays_age_min', e.target.value ? parseInt(e.target.value) : null)} placeholder="e.g. 25" />
              </Field>
              <Field label="Plays Age (Max)">
                <input className={inputCls} type="number" value={form.plays_age_max ?? ''} onChange={e => set('plays_age_max', e.target.value ? parseInt(e.target.value) : null)} placeholder="e.g. 45" />
              </Field>
              <Field label="Actors Access Profile"><input className={inputCls} value={form.actors_access_profile ?? ''} onChange={e => set('actors_access_profile', e.target.value)} placeholder="Username or URL" /></Field>
              <Field label="Backstage Profile"><input className={inputCls} value={form.backstage_profile ?? ''} onChange={e => set('backstage_profile', e.target.value)} placeholder="Username or URL" /></Field>
              <div className="col-span-2">
                <TagInput label="Commercial Conflicts (Brands)" value={form.commercial_conflicts ?? []} onChange={v => set('commercial_conflicts', v)} />
              </div>
            </div>
          )}
        </div>

        {/* Physical */}
        <div className="glass-card rounded-xl p-5">
          <SectionHeader label="Physical Attributes" open={open.physical} onToggle={() => toggleSection('physical')} />
          {open.physical && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Height"><input className={inputCls} value={form.height ?? ''} onChange={e => set('height', e.target.value)} placeholder='5&apos;8"' /></Field>
              <Field label="Weight"><input className={inputCls} value={form.weight ?? ''} onChange={e => set('weight', e.target.value)} placeholder="145 lbs" /></Field>
              <Field label="Hair Color"><input className={inputCls} value={form.hair_color ?? ''} onChange={e => set('hair_color', e.target.value)} /></Field>
              <Field label="Eye Color"><input className={inputCls} value={form.eye_color ?? ''} onChange={e => set('eye_color', e.target.value)} /></Field>
              <Field label="Shoe Size"><input className={inputCls} value={form.shoe_size ?? ''} onChange={e => set('shoe_size', e.target.value)} /></Field>
              <Field label="Measurements (B/W/H)"><input className={inputCls} value={form.measurements ?? ''} onChange={e => set('measurements', e.target.value)} placeholder="34-26-36" /></Field>
              <Field label="Skin Tone">
                <select className={selectCls} value={form.skin_tone ?? ''} onChange={e => set('skin_tone', e.target.value)}>
                  <option value="">Select...</option>
                  {['Very Fair', 'Fair', 'Light', 'Light Medium', 'Medium', 'Medium Tan', 'Tan', 'Deep Tan', 'Brown', 'Dark Brown', 'Deep'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Swim Ability">
                <select className={selectCls} value={form.swim_ability ?? ''} onChange={e => set('swim_ability', e.target.value)}>
                  <option value="">Select...</option>
                  {['None', 'Basic', 'Intermediate', 'Advanced', 'Competitive'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <div className="col-span-2 md:col-span-3">
                <Field label="Visible Tattoos / Piercings / Scars">
                  <input className={inputCls} value={form.tattoos_markings ?? ''} onChange={e => set('tattoos_markings', e.target.value)} placeholder="Describe any visible markings, or None" />
                </Field>
              </div>
            </div>
          )}
        </div>

        {/* Skills & Languages */}
        <div className="glass-card rounded-xl p-5">
          <SectionHeader label="Skills & Languages" open={open.skills} onToggle={() => toggleSection('skills')} />
          {open.skills && (
            <div className="flex flex-col gap-5">
              <TagInput label="Categories" value={form.categories ?? []} options={CATEGORIES} onChange={v => set('categories', v)} />
              <TagInput label="Skills" value={form.skills ?? []} options={SKILLS_OPTIONS} onChange={v => set('skills', v)} />
              <TagInput label="Languages" value={form.languages ?? []} options={LANGUAGES} onChange={v => set('languages', v)} />
              <TagInput label="Accents / Dialects" value={form.dialects ?? []} onChange={v => set('dialects', v)} />
              <TagInput label="Ethnicity" value={form.ethnicity ?? []} onChange={v => set('ethnicity', v)} />
              <Field label="Musical Instruments">
                <input className={inputCls} value={form.instruments ?? ''} onChange={e => set('instruments', e.target.value)} placeholder="e.g. Piano, Guitar, Drums" />
              </Field>
              <div className="col-span-full">
                <Field label="Notable Credits">
                  <textarea className={`${inputCls} resize-none`} rows={3} value={form.notable_credits ?? ''} onChange={e => set('notable_credits', e.target.value)} placeholder="TV shows, films, commercials, stage productions..." />
                </Field>
              </div>
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="glass-card rounded-xl p-5">
          <SectionHeader label="Availability" open={open.availability} onToggle={() => toggleSection('availability')} />
          {open.availability && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                <Toggle label="Will Travel" checked={!!form.will_travel} onChange={v => set('will_travel', v)} />
                <Toggle label="Has Passport" checked={!!form.has_passport} onChange={v => set('has_passport', v)} />
                <Toggle label="Has Driver's License" checked={!!form.has_drivers_license} onChange={v => set('has_drivers_license', v)} />
                <Toggle label="Has Transportation" checked={!!form.has_transportation} onChange={v => set('has_transportation', v)} />
                <Toggle label="Is Minor" checked={!!form.is_minor} onChange={v => set('is_minor', v)} />
              </div>
              <TagInput label="Local Hire Markets" value={form.local_hire_markets ?? []} onChange={v => set('local_hire_markets', v)} />
            </div>
          )}
        </div>

        {/* Social */}
        <div className="glass-card rounded-xl p-5">
          <SectionHeader label="Social Media" open={open.social} onToggle={() => toggleSection('social')} />
          {open.social && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Instagram Handle"><input className={inputCls} value={form.instagram ?? ''} onChange={e => set('instagram', e.target.value)} placeholder="@handle" /></Field>
              <Field label="TikTok"><input className={inputCls} value={form.tiktok ?? ''} onChange={e => set('tiktok', e.target.value)} /></Field>
              <Field label="YouTube URL"><input className={inputCls} value={form.youtube ?? ''} onChange={e => set('youtube', e.target.value)} /></Field>
            </div>
          )}
        </div>

        {/* Media */}
        <div className="glass-card rounded-xl p-5">
          <SectionHeader label="Media & File URLs" open={open.media} onToggle={() => toggleSection('media')} />
          {open.media && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {([
                { label: 'Primary Headshot', key: 'headshot_url', fileType: 'headshot', accept: 'image/*' },
                { label: 'Commercial Headshot', key: 'commercial_headshot_url', fileType: 'commercial_headshot', accept: 'image/*' },
                { label: 'Theatrical Headshot', key: 'theatrical_headshot_url', fileType: 'theatrical_headshot', accept: 'image/*' },
                { label: 'Full Body', key: 'full_body_url', fileType: 'full_body', accept: 'image/*' },
                { label: 'Resume (PDF)', key: 'resume_url', fileType: 'resume', accept: '.pdf' },
              ] as const).map(({ label, key, fileType, accept }) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-[#9ba9bb] text-xs tracking-widest uppercase">{label}</label>
                  {(localPreviews[fileType] || form[key]) && (
                    <div className="relative w-20 h-24 rounded overflow-hidden border border-[#c9a84c]/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={localPreviews[fileType] || (form[key] as string)}
                        alt={label}
                        className="w-full h-full object-cover object-top"
                        onError={() => setPreviewErrors(prev => ({ ...prev, [fileType]: true }))}
                      />
                      {uploading === fileType && (
                        <div className="absolute inset-0 bg-[#06080f]/70 flex items-center justify-center">
                          <span className="text-[#c9a84c] text-[9px]">Uploading...</span>
                        </div>
                      )}
                      {previewErrors[fileType] && (
                        <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center p-1">
                          <span className="text-red-300 text-[9px] text-center">Format issue — use JPG or PNG</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <label className={`flex items-center gap-1.5 px-3 py-2 rounded border border-[#c9a84c]/30 text-[#c9a84c] text-xs cursor-pointer hover:bg-[#c9a84c]/10 transition-all ${uploading === fileType ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload size={11} />
                      {uploading === fileType ? 'Uploading...' : 'Upload File'}
                      <input
                        type="file"
                        accept={accept}
                        className="hidden"
                        onChange={e => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  if (f.type.startsWith('image/')) {
                    const blobUrl = URL.createObjectURL(f)
                    setLocalPreviews(prev => ({ ...prev, [fileType]: blobUrl }))
                    setPreviewErrors(prev => ({ ...prev, [fileType]: false }))
                  }
                  handleUpload(fileType, f)
                }}
                      />
                    </label>
                    <input className={`${inputCls} text-xs`} value={form[key] ?? ''} onChange={e => set(key, e.target.value)} placeholder="or paste URL..." />
                  </div>
                </div>
              ))}
              <Field label="Demo Reel URL"><input className={inputCls} value={form.demo_reel_url ?? ''} onChange={e => set('demo_reel_url', e.target.value)} /></Field>
              <Field label="Voice Reel URL"><input className={inputCls} value={form.voice_reel_url ?? ''} onChange={e => set('voice_reel_url', e.target.value)} /></Field>
            </div>
          )}
        </div>

        {/* Business / Contract — admin only */}
        <div className="glass-card rounded-xl p-5 border border-[#c9a84c]/10">
          <SectionHeader label="Business & Contract (Admin Only)" open={open.business} onToggle={() => toggleSection('business')} />
          {open.business && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Contract Start Date"><input className={inputCls} type="date" value={form.contract_start_date ?? ''} onChange={e => set('contract_start_date', e.target.value)} /></Field>
              <Field label="Contract End / Renewal Date"><input className={inputCls} type="date" value={form.contract_end_date ?? ''} onChange={e => set('contract_end_date', e.target.value)} /></Field>
              <Field label="Commission Rate (%)">
                <input className={inputCls} type="number" step="0.5" min="0" max="25" value={form.commission_rate ?? ''} onChange={e => set('commission_rate', e.target.value ? parseFloat(e.target.value) : null)} placeholder="10" />
              </Field>
              <Field label="Day Rate"><input className={inputCls} value={form.day_rate ?? ''} onChange={e => set('day_rate', e.target.value)} placeholder="e.g. $500/day" /></Field>
            </div>
          )}
        </div>

        {/* Guardian */}
        {form.is_minor && (
          <div className="glass-card rounded-xl p-5 border border-[#c9a84c]/20">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Parent / Guardian</p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name"><input className={inputCls} value={form.guardian_name ?? ''} onChange={e => set('guardian_name', e.target.value)} /></Field>
              <Field label="Relationship"><input className={inputCls} value={form.guardian_relationship ?? ''} onChange={e => set('guardian_relationship', e.target.value)} /></Field>
              <Field label="Email"><input className={inputCls} type="email" value={form.guardian_email ?? ''} onChange={e => set('guardian_email', e.target.value)} /></Field>
              <Field label="Phone"><input className={inputCls} value={form.guardian_phone ?? ''} onChange={e => set('guardian_phone', e.target.value)} /></Field>
            </div>
          </div>
        )}

        {/* Agent Notes */}
        <div className="glass-card rounded-xl p-5 border border-[#c9a84c]/10">
          <SectionHeader label="Agent Notes (Internal Only)" open={open.notes} onToggle={() => toggleSection('notes')} />
          {open.notes && (
            <textarea className={`${inputCls} resize-none`} rows={4} value={form.agent_notes ?? ''} onChange={e => set('agent_notes', e.target.value)} placeholder="Internal notes — not visible to talent..." />
          )}
        </div>

      </div>

      <div className="flex justify-end gap-3 mt-6 pb-8">
        <button onClick={cancel} className="flex items-center gap-2 px-5 py-2.5 border border-[#9ba9bb]/30 text-[#9ba9bb] rounded text-sm hover:bg-[#9ba9bb]/10 transition-all">
          <X size={14} /> Cancel
        </button>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#c9a84c] text-[#06080f] rounded text-sm font-bold hover:bg-[#e8c97a] transition-all disabled:opacity-50">
          <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
