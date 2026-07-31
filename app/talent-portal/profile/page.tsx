'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, Save } from 'lucide-react'
import Image from 'next/image'

const CATEGORIES = ['Acting', 'Modeling', 'Influencer Marketing', 'Voice-Over', 'Singing', 'Dancing']

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
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setProfile(prev => prev ? { ...prev, [e.target.name]: e.target.value } : prev)
  }

  function toggleCategory(cat: string) {
    setProfile(prev => {
      if (!prev) return prev
      const cats = (prev.categories as string[]) || []
      return { ...prev, categories: cats.includes(cat) ? cats.filter(c => c !== cat) : [...cats, cat] }
    })
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
      let headshot_url = profile.headshot_url as string

      if (newHeadshot) {
        const { data: { user } } = await supabase.auth.getUser()
        const path = `headshots/${user!.id}-${Date.now()}.${newHeadshot.name.split('.').pop()}`
        const { error } = await supabase.storage.from('talent-media').upload(path, newHeadshot, { upsert: true })
        if (!error) {
          const { data } = supabase.storage.from('talent-media').getPublicUrl(path)
          headshot_url = data.publicUrl
        }
      }

      await supabase.from('talent_profiles').update({
        bio: profile.bio,
        phone: profile.phone,
        city: profile.city,
        state: profile.state,
        instagram: profile.instagram,
        tiktok: profile.tiktok,
        youtube: profile.youtube,
        website: profile.website,
        categories: profile.categories,
        is_available: profile.is_available,
        headshot_url,
      }).eq('id', profile.id as string)

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (!profile) return <div className="text-[#7a869a] text-sm">Loading...</div>

  const inputClass = "w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#7a869a] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
  const labelClass = "block text-[#7a869a] text-xs tracking-widest uppercase mb-2"

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">My Profile</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Edit Profile</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm hover:bg-[#e8c97a] transition-all disabled:opacity-50"
        >
          <Save size={15} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Headshot */}
        <div>
          <div className="glass-card rounded-xl overflow-hidden aspect-[3/4] relative bg-[#141929] mb-4">
            {(headshotPreview || profile.headshot_url) ? (
              <Image
                src={headshotPreview || (profile.headshot_url as string)}
                alt="Headshot"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#7a869a] text-sm">No headshot</div>
            )}
          </div>
          <label className="flex flex-col items-center gap-2 border border-dashed border-[rgba(201,168,76,0.3)] rounded-lg p-4 cursor-pointer hover:border-[#c9a84c]/60 transition-colors">
            <Upload size={18} className="text-[#c9a84c]" />
            <span className="text-[#7a869a] text-xs">Update headshot</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleHeadshotChange} />
          </label>

          <div className="mt-4">
            <label className={labelClass}>Availability</label>
            <button
              onClick={() => setProfile(prev => prev ? { ...prev, is_available: !prev.is_available } : prev)}
              className={`w-full py-2 rounded text-sm font-medium transition-all ${
                profile.is_available
                  ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                  : 'bg-[#141929] text-[#7a869a] border border-[rgba(201,168,76,0.2)]'
              }`}
            >
              {profile.is_available ? 'Available for Bookings' : 'Not Available'}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 flex flex-col gap-5">
          <div className="glass-card rounded-xl p-6 flex flex-col gap-4">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase">Basic Information</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input value={profile.first_name as string} disabled className={`${inputClass} opacity-50`} />
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input value={profile.last_name as string} disabled className={`${inputClass} opacity-50`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" name="phone" value={(profile.phone as string) || ''} onChange={handleChange} className={inputClass} placeholder="(555) 000-0000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input name="city" value={(profile.city as string) || ''} onChange={handleChange} className={inputClass} placeholder="City" />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input name="state" value={(profile.state as string) || ''} onChange={handleChange} className={inputClass} placeholder="FL" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Bio</label>
              <textarea name="bio" value={(profile.bio as string) || ''} onChange={handleChange} rows={4} className={inputClass} placeholder="Tell the world about yourself..." />
            </div>
          </div>

          {/* Categories */}
          <div className="glass-card rounded-xl p-6">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Categories</p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2.5 rounded border text-sm transition-all ${
                    (profile.categories as string[])?.includes(cat)
                      ? 'border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]'
                      : 'border-[rgba(201,168,76,0.2)] text-[#7a869a] hover:border-[#c9a84c]/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="glass-card rounded-xl p-6 flex flex-col gap-4">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase">Social & Web</p>
            <div>
              <label className={labelClass}>Instagram</label>
              <input name="instagram" value={(profile.instagram as string) || ''} onChange={handleChange} className={inputClass} placeholder="@handle" />
            </div>
            <div>
              <label className={labelClass}>TikTok</label>
              <input name="tiktok" value={(profile.tiktok as string) || ''} onChange={handleChange} className={inputClass} placeholder="@handle" />
            </div>
            <div>
              <label className={labelClass}>YouTube</label>
              <input name="youtube" value={(profile.youtube as string) || ''} onChange={handleChange} className={inputClass} placeholder="Channel URL" />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input name="website" value={(profile.website as string) || ''} onChange={handleChange} className={inputClass} placeholder="https://yoursite.com" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
