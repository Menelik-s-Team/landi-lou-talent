'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Save, Check } from 'lucide-react'
import Image from 'next/image'

// ─── Option lists ─────────────────────────────────────────────────────────────

const EXPERIENCE_CATEGORIES = [
  'Acting', 'Modeling', 'Influencer Marketing', 'Voice-Over',
  'Singing', 'Dancing', 'Commercial', 'Print', 'Runway',
  'Extra / Background', 'Hosting / MC', 'Sports / Athletics',
]

const SKILLS_LIST = [
  // Performance
  'Stage Combat', 'Improv', 'Stand-Up Comedy', 'Sketch Comedy',
  'Method Acting', 'Commercial Acting', 'Soap Opera', 'Shakespeare',
  // Music & Dance
  'Ballet', 'Hip-Hop Dance', 'Contemporary Dance', 'Jazz Dance',
  'Ballroom Dance', 'Tap Dance', 'Salsa / Latin', 'Pole Fitness',
  'Opera Singing', 'R&B Singing', 'Gospel Singing', 'Rap / Hip-Hop',
  // Physical / Sports
  'Yoga / Pilates', 'Gymnastics', 'Cheerleading', 'Martial Arts',
  'Swimming', 'Horseback Riding', 'Rock Climbing', 'Boxing / MMA',
  'Basketball', 'Football', 'Soccer', 'Tennis',
  // Specialty
  'Stunt Work', 'Aerial / Acrobatics', 'Fire Performance', 'Magic',
  'Puppeteering', 'Mime', 'Costume Character',
  // Media / Tech
  'Voiceover', 'Podcast Hosting', 'Live Streaming', 'Photography',
  'Videography', 'Social Media Content Creation',
  // Lifestyle
  'Cooking / Food Styling', 'Fashion Styling', 'Makeup Artistry',
  'Natural Hair Styling', 'Personal Training',
]

const ETHNICITY_OPTIONS = [
  'Black / African American', 'White / Caucasian', 'Hispanic / Latino',
  'Asian / Pacific Islander', 'Native American / Indigenous', 'Middle Eastern',
  'South Asian', 'Multiracial / Biracial', 'Other',
]

const HAIR_COLORS = ['Black', 'Brown', 'Blonde', 'Red', 'Auburn', 'Gray / Silver', 'White', 'Bald', 'Other']
const EYE_COLORS  = ['Brown', 'Black', 'Blue', 'Green', 'Hazel', 'Gray', 'Amber', 'Other']

const UNION_OPTIONS = [
  { value: 'non-union',     label: 'Non-Union' },
  { value: 'sag-aftra',     label: 'SAG-AFTRA' },
  { value: 'equity',        label: 'AEA / Equity' },
  { value: 'afm',           label: 'AFM' },
  { value: 'multiple',      label: 'Multiple Unions' },
]

const REPRESENTATION_OPTIONS = [
  { value: 'agency-only',   label: 'Agency Only' },
  { value: 'management',    label: 'Management' },
  { value: 'both',          label: 'Agency + Management' },
  { value: 'freelance',     label: 'Freelance' },
]

const EXPERIENCE_LEVELS = [
  { value: 'beginner',      label: 'Beginner (0–1 years)' },
  { value: 'intermediate',  label: 'Intermediate (2–4 years)' },
  { value: 'experienced',   label: 'Experienced (5–9 years)' },
  { value: 'veteran',       label: 'Veteran (10+ years)' },
]

const GENDER_OPTIONS = [
  { value: 'female',         label: 'Female' },
  { value: 'male',           label: 'Male' },
  { value: 'non-binary',     label: 'Non-Binary' },
  { value: 'prefer-not',     label: 'Prefer not to say' },
]

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputClass =
  'w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#9ba9bb] focus:outline-none focus:border-[#c9a84c]/60 transition-colors'

const selectClass =
  'w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors appearance-none cursor-pointer'

const labelClass = 'block text-[#9ba9bb] text-xs tracking-widest uppercase mb-2'

const sectionClass = 'glass-card rounded-xl p-6 flex flex-col gap-5'

const sectionTitle = 'text-[#c9a84c] text-xs tracking-widest uppercase'

// ─── Helper sub-components ────────────────────────────────────────────────────

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-[#f0ead8] text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0 ${
          checked ? 'bg-[#c9a84c]' : 'bg-[#141929] border border-[rgba(201,168,76,0.3)]'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-4.5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  )
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[]
  selected: string[]
  onChange: (vals: string[]) => void
}) {
  function toggle(val: string) {
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded border text-xs transition-all ${
              active
                ? 'border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]'
                : 'border-[rgba(201,168,76,0.2)] text-[#9ba9bb] hover:border-[#c9a84c]/40'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TalentProfilePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newHeadshot, setNewHeadshot] = useState<File | null>(null)
  const [headshotPreview, setHeadshotPreview] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('talent_profiles').select('*').eq('user_id', user.id).single()
      if (data) setProfile(data)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Generic field setter
  function set(field: string, value: unknown) {
    setProfile(prev => prev ? { ...prev, [field]: value } : prev)
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    set(e.target.name, e.target.value)
  }

  function getStr(field: string): string {
    return (profile?.[field] as string) ?? ''
  }

  function getArr(field: string): string[] {
    return (profile?.[field] as string[]) ?? []
  }

  function getBool(field: string): boolean {
    return !!(profile?.[field])
  }

  function handleHeadshotChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setNewHeadshot(file)
    setHeadshotPreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    if (!profile) return
    setSaving(true)
    try {
      let headshot_url = getStr('headshot_url')

      if (newHeadshot) {
        const { data: { user } } = await supabase.auth.getUser()
        const ext = newHeadshot.name.split('.').pop()
        const path = `headshots/${user!.id}-${Date.now()}.${ext}`
        const { error } = await supabase.storage.from('talent-media').upload(path, newHeadshot, { upsert: true })
        if (!error) {
          const { data } = supabase.storage.from('talent-media').getPublicUrl(path)
          headshot_url = data.publicUrl
        }
      }

      await supabase.from('talent_profiles').update({
        // Basic
        stage_name:             getStr('stage_name'),
        phone:                  getStr('phone'),
        city:                   getStr('city'),
        state:                  getStr('state'),
        bio:                    getStr('bio'),
        // Professional
        union_status:           getStr('union_status'),
        representation_type:    getStr('representation_type'),
        experience_level:       getStr('experience_level'),
        categories:             getArr('categories'),
        // Physical
        gender:                 getStr('gender'),
        height:                 getStr('height'),
        weight:                 getStr('weight'),
        hair_color:             getStr('hair_color'),
        eye_color:              getStr('eye_color'),
        ethnicity:              getArr('ethnicity'),
        wardrobe_top:           getStr('wardrobe_top'),
        wardrobe_bottom:        getStr('wardrobe_bottom'),
        wardrobe_dress:         getStr('wardrobe_dress'),
        wardrobe_shoe:          getStr('wardrobe_shoe'),
        shoe_size:              getStr('shoe_size'),
        // Skills
        skills:                 getArr('skills'),
        languages:              getStr('languages'),
        dialects:               getStr('dialects'),
        // Availability
        will_travel:            getBool('will_travel'),
        has_passport:           getBool('has_passport'),
        has_drivers_license:    getBool('has_drivers_license'),
        has_transportation:     getBool('has_transportation'),
        local_hire_markets:     getStr('local_hire_markets'),
        is_available:           getBool('is_available'),
        // Social
        instagram:              getStr('instagram'),
        tiktok:                 getStr('tiktok'),
        youtube:                getStr('youtube'),
        website:                getStr('website'),
        // Media URLs
        demo_reel_url:          getStr('demo_reel_url'),
        voice_reel_url:         getStr('voice_reel_url'),
        // Headshot
        headshot_url,
      }).eq('id', profile.id as string)

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#9ba9bb] text-sm animate-pulse">Loading profile...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">My Profile</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Edit Profile</h1>
          <p className="text-[#9ba9bb] text-sm mt-2">Keep your information current — directors are always watching.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm hover:bg-[#e8c97a] transition-all disabled:opacity-60 shrink-0"
        >
          {saved ? <Check size={15} /> : <Save size={15} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── Headshot ──────────────────────────────────────────────────────── */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Headshot</p>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-40 flex-shrink-0">
              <div className="glass-card rounded-xl overflow-hidden aspect-[3/4] relative bg-[#141929] mb-3">
                {(headshotPreview || getStr('headshot_url')) ? (
                  <Image
                    src={headshotPreview || getStr('headshot_url')}
                    alt="Headshot"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#9ba9bb] text-xs">No headshot</div>
                )}
              </div>
              <label className="flex flex-col items-center gap-2 border border-dashed border-[rgba(201,168,76,0.3)] rounded-lg p-3 cursor-pointer hover:border-[#c9a84c]/60 transition-colors">
                <Upload size={16} className="text-[#c9a84c]" />
                <span className="text-[#9ba9bb] text-xs text-center">Update headshot</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleHeadshotChange} />
              </label>
            </div>
            <div className="flex-1">
              <p className="text-[#9ba9bb] text-xs leading-relaxed mb-4">
                Upload a high-resolution headshot (JPG or PNG). Minimum 1000x1333px recommended. Clean background preferred.
              </p>
              <ToggleSwitch
                label="Available for bookings"
                checked={getBool('is_available')}
                onChange={v => set('is_available', v)}
              />
            </div>
          </div>
        </div>

        {/* ── 1. Basic Info ─────────────────────────────────────────────────── */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Basic Information</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input value={getStr('first_name')} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input value={getStr('last_name')} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Stage / Performance Name</label>
            <input name="stage_name" value={getStr('stage_name')} onChange={handleInput} className={inputClass} placeholder="e.g. Zara D." />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" name="phone" value={getStr('phone')} onChange={handleInput} className={inputClass} placeholder="(555) 000-0000" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <input name="city" value={getStr('city')} onChange={handleInput} className={inputClass} placeholder="Atlanta" />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input name="state" value={getStr('state')} onChange={handleInput} className={inputClass} placeholder="GA" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              name="bio"
              value={getStr('bio')}
              onChange={handleInput}
              rows={5}
              className={inputClass}
              placeholder="Tell casting directors who you are, what drives you, and what makes you unforgettable..."
            />
          </div>
        </div>

        {/* ── 2. Professional ───────────────────────────────────────────────── */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Professional</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Union Status</label>
              <select name="union_status" value={getStr('union_status')} onChange={handleInput} className={selectClass}>
                <option value="">Select...</option>
                {UNION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Representation</label>
              <select name="representation_type" value={getStr('representation_type')} onChange={handleInput} className={selectClass}>
                <option value="">Select...</option>
                {REPRESENTATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Experience Level</label>
              <select name="experience_level" value={getStr('experience_level')} onChange={handleInput} className={selectClass}>
                <option value="">Select...</option>
                {EXPERIENCE_LEVELS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Experience Categories</label>
            <CheckboxGroup
              options={EXPERIENCE_CATEGORIES}
              selected={getArr('categories')}
              onChange={v => set('categories', v)}
            />
          </div>
        </div>

        {/* ── 3. Physical Attributes ────────────────────────────────────────── */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Physical Attributes</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Gender</label>
              <select name="gender" value={getStr('gender')} onChange={handleInput} className={selectClass}>
                <option value="">Select...</option>
                {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Height</label>
              <input name="height" value={getStr('height')} onChange={handleInput} className={inputClass} placeholder={`e.g. 5'7"`} />
            </div>
            <div>
              <label className={labelClass}>Weight</label>
              <input name="weight" value={getStr('weight')} onChange={handleInput} className={inputClass} placeholder="e.g. 140 lbs" />
            </div>
            <div>
              <label className={labelClass}>Hair Color</label>
              <select name="hair_color" value={getStr('hair_color')} onChange={handleInput} className={selectClass}>
                <option value="">Select...</option>
                {HAIR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Eye Color</label>
              <select name="eye_color" value={getStr('eye_color')} onChange={handleInput} className={selectClass}>
                <option value="">Select...</option>
                {EYE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Shoe Size</label>
              <input name="shoe_size" value={getStr('shoe_size')} onChange={handleInput} className={inputClass} placeholder="e.g. 8.5" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Ethnicity</label>
            <CheckboxGroup
              options={ETHNICITY_OPTIONS}
              selected={getArr('ethnicity')}
              onChange={v => set('ethnicity', v)}
            />
          </div>

          <div>
            <p className="text-[#9ba9bb] text-xs tracking-widest uppercase mb-3">Wardrobe Sizes</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'wardrobe_top',    placeholder: 'Top (S/M/L)' },
                { name: 'wardrobe_bottom', placeholder: 'Bottom (28/30…)' },
                { name: 'wardrobe_dress',  placeholder: 'Dress (2/4/6…)' },
                { name: 'wardrobe_shoe',   placeholder: 'Shoe size' },
              ].map(f => (
                <div key={f.name}>
                  <input
                    name={f.name}
                    value={getStr(f.name)}
                    onChange={handleInput}
                    className={inputClass}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4. Skills ─────────────────────────────────────────────────────── */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Skills</p>
          <CheckboxGroup
            options={SKILLS_LIST}
            selected={getArr('skills')}
            onChange={v => set('skills', v)}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Languages Spoken</label>
              <input name="languages" value={getStr('languages')} onChange={handleInput} className={inputClass} placeholder="English, Spanish, French…" />
            </div>
            <div>
              <label className={labelClass}>Dialects / Accents</label>
              <input name="dialects" value={getStr('dialects')} onChange={handleInput} className={inputClass} placeholder="Southern, British, New York…" />
            </div>
          </div>
        </div>

        {/* ── 5. Availability ───────────────────────────────────────────────── */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Availability & Travel</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <ToggleSwitch label="Will travel for work" checked={getBool('will_travel')} onChange={v => set('will_travel', v)} />
            <ToggleSwitch label="Has valid passport" checked={getBool('has_passport')} onChange={v => set('has_passport', v)} />
            <ToggleSwitch label="Has driver's license" checked={getBool('has_drivers_license')} onChange={v => set('has_drivers_license', v)} />
            <ToggleSwitch label="Has own transportation" checked={getBool('has_transportation')} onChange={v => set('has_transportation', v)} />
          </div>
          <div>
            <label className={labelClass}>Local Hire Markets</label>
            <input
              name="local_hire_markets"
              value={getStr('local_hire_markets')}
              onChange={handleInput}
              className={inputClass}
              placeholder="e.g. Atlanta GA, Orlando FL, Charlotte NC"
            />
          </div>
        </div>

        {/* ── 6. Social ─────────────────────────────────────────────────────── */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Social Media</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Instagram</label>
              <input name="instagram" value={getStr('instagram')} onChange={handleInput} className={inputClass} placeholder="@handle" />
            </div>
            <div>
              <label className={labelClass}>TikTok</label>
              <input name="tiktok" value={getStr('tiktok')} onChange={handleInput} className={inputClass} placeholder="@handle" />
            </div>
            <div>
              <label className={labelClass}>YouTube</label>
              <input name="youtube" value={getStr('youtube')} onChange={handleInput} className={inputClass} placeholder="Channel URL" />
            </div>
            <div>
              <label className={labelClass}>Website / Portfolio</label>
              <input name="website" value={getStr('website')} onChange={handleInput} className={inputClass} placeholder="https://yoursite.com" />
            </div>
          </div>
        </div>

        {/* ── 7. Media URLs ─────────────────────────────────────────────────── */}
        <div className={sectionClass}>
          <p className={sectionTitle}>Media Reels</p>
          <p className="text-[#9ba9bb] text-xs -mt-2">Paste YouTube or Vimeo links for your reels.</p>
          <div>
            <label className={labelClass}>Demo Reel URL</label>
            <input name="demo_reel_url" value={getStr('demo_reel_url')} onChange={handleInput} className={inputClass} placeholder="https://youtube.com/watch?v=..." />
          </div>
          <div>
            <label className={labelClass}>Voice Reel URL</label>
            <input name="voice_reel_url" value={getStr('voice_reel_url')} onChange={handleInput} className={inputClass} placeholder="https://youtube.com/watch?v=..." />
          </div>
        </div>

      </div>

      {/* Floating save bar on mobile */}
      <div className="sticky bottom-4 mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3.5 bg-[#c9a84c] text-[#06080f] font-semibold rounded-lg text-sm hover:bg-[#e8c97a] transition-all disabled:opacity-60 shadow-lg shadow-black/40"
        >
          {saved ? <Check size={15} /> : <Save size={15} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
