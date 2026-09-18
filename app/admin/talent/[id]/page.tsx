import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Mail, Phone } from 'lucide-react'
import TalentEditForm from './TalentEditForm'

export const metadata = { title: 'Talent Profile | Admin' }

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <p className="text-[#9ba9bb] text-xs mb-1">{label}</p>
      <p className="text-[#f0ead8] text-sm">{value}</p>
    </div>
  )
}

function TagList({ label, items }: { label: string; items?: string[] | null }) {
  if (!items?.length) return null
  return (
    <div>
      <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span key={item} className="px-3 py-1 rounded-full bg-[#141929] border border-[rgba(201,168,76,0.2)] text-[#f0ead8] text-xs">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default async function TalentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: t } = await supabase
    .from('talent_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!t) notFound()

  const { data: portfolio } = await supabase
    .from('talent_onboarding_portfolios')
    .select('id, status, current_step, completed_at')
    .eq('submission_id', t.submission_id)
    .maybeSingle()

  const name = `${t.first_name} ${t.last_name}`
  const location = [t.city, t.state].filter(Boolean).join(', ')

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href="/admin/talent" className="text-[#9ba9bb] text-xs hover:text-[#c9a84c] transition-colors mb-3 inline-block">
            ← Back to Roster
          </Link>
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Talent Profile</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">{name}</h1>
          {t.stage_name && <p className="text-[#9ba9bb] text-sm mt-1">Stage name: {t.stage_name}</p>}
        </div>
        <div className="flex items-center gap-3">
          <TalentEditForm talent={t} />
          <span className={`text-xs px-3 py-1.5 rounded-full border ${t.is_available ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-[#9ba9bb]/10 text-[#9ba9bb] border-[#9ba9bb]/30'}`}>
            {t.is_available ? 'Available' : 'Unavailable'}
          </span>
          {t.union_status && (
            <span className="text-xs px-3 py-1.5 rounded-full border bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30">
              {t.union_status}
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left — headshot + contact */}
        <div className="md:col-span-1 flex flex-col gap-4">
          {/* Headshot */}
          <div className="glass-card rounded-xl overflow-hidden aspect-[3/4] relative">
            {t.headshot_url ? (
              <Image src={t.headshot_url} alt={name} fill className="object-cover object-top" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#9ba9bb] text-sm">No photo</div>
            )}
          </div>

          {/* Contact */}
          <div className="glass-card rounded-xl p-5 flex flex-col gap-3">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase">Contact</p>
            {t.email && (
              <a href={`mailto:${t.email}`} className="flex items-center gap-2 text-[#f0ead8] text-sm hover:text-[#c9a84c] transition-colors">
                <Mail size={13} className="text-[#9ba9bb] shrink-0" /> {t.email}
              </a>
            )}
            {t.phone && (
              <a href={`tel:${t.phone}`} className="flex items-center gap-2 text-[#f0ead8] text-sm hover:text-[#c9a84c] transition-colors">
                <Phone size={13} className="text-[#9ba9bb] shrink-0" /> {t.phone}
              </a>
            )}
            {location && (
              <p className="flex items-center gap-2 text-[#9ba9bb] text-sm">
                <MapPin size={13} className="shrink-0" /> {location}
              </p>
            )}
          </div>

          {/* Social */}
          {(t.instagram || t.tiktok || t.youtube) && (
            <div className="glass-card rounded-xl p-5 flex flex-col gap-3">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase">Social Media</p>
              {t.instagram && (
                <a href={`https://instagram.com/${t.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer"
                  className="text-[#f0ead8] text-sm hover:text-[#c9a84c] transition-colors">
                  Instagram: {t.instagram}
                </a>
              )}
              {t.tiktok && (
                <p className="text-[#9ba9bb] text-sm">TikTok: {t.tiktok}</p>
              )}
              {t.youtube && (
                <a href={t.youtube} target="_blank" rel="noopener noreferrer"
                  className="text-[#f0ead8] text-sm hover:text-[#c9a84c] transition-colors">
                  YouTube ↗
                </a>
              )}
            </div>
          )}

          {/* Onboarding status */}
          {portfolio && (
            <div className="glass-card rounded-xl p-5">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-3">Onboarding</p>
              <span className={`text-xs px-3 py-1 rounded-full border ${
                portfolio.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : portfolio.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                : 'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30'
              }`}>
                {portfolio.status === 'completed' ? 'Portfolio Complete'
                  : portfolio.status === 'in_progress' ? `In Progress (Step ${portfolio.current_step}/13)`
                  : 'Pending'}
              </span>
              {portfolio.status === 'completed' && (
                <Link href={`/admin/portfolio/${portfolio.id}`}
                  className="mt-3 block text-center text-xs py-2 px-4 bg-[#c9a84c] text-[#06080f] rounded-lg font-bold hover:bg-[#e8c97a] transition-all">
                  View Portfolio
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right — details */}
        <div className="md:col-span-2 flex flex-col gap-5">

          {/* Categories */}
          {t.categories?.length > 0 && (
            <div className="glass-card rounded-xl p-6">
              <TagList label="Categories" items={t.categories} />
            </div>
          )}

          {/* Personal Info */}
          <div className="glass-card rounded-xl p-6">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Personal Information</p>
            <div className="grid grid-cols-2 gap-4">
              <Row label="Date of Birth" value={t.dob} />
              <Row label="Gender" value={t.gender} />
              <Row label="Experience Level" value={t.experience_level} />
              <Row label="Representation Type" value={t.representation_type} />
              <Row label="Union Status" value={t.union_status} />
              <Row label="Minor" value={t.is_minor ? 'Yes' : 'No'} />
            </div>
          </div>

          {/* Bio */}
          {t.bio && (
            <div className="glass-card rounded-xl p-6">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-3">Bio</p>
              <p className="text-[#f0ead8] text-sm leading-relaxed">{t.bio}</p>
            </div>
          )}

          {/* Physical Attributes */}
          {(t.height || t.weight || t.hair_color || t.eye_color || t.shoe_size) && (
            <div className="glass-card rounded-xl p-6">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Physical Attributes</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Row label="Height" value={t.height} />
                <Row label="Weight" value={t.weight} />
                <Row label="Hair Color" value={t.hair_color} />
                <Row label="Eye Color" value={t.eye_color} />
                <Row label="Shoe Size" value={t.shoe_size} />
              </div>
            </div>
          )}

          {/* Skills & Languages */}
          {(t.skills?.length || t.languages?.length || t.ethnicity?.length) && (
            <div className="glass-card rounded-xl p-6 flex flex-col gap-5">
              <TagList label="Skills" items={t.skills} />
              <TagList label="Languages" items={t.languages} />
              <TagList label="Ethnicity" items={t.ethnicity} />
            </div>
          )}

          {/* Availability */}
          <div className="glass-card rounded-xl p-6">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Availability</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {[
                ['Will Travel', t.will_travel ? 'Yes' : 'No'],
                ['Has Passport', t.has_passport ? 'Yes' : 'No'],
                ['Has Drivers License', t.has_drivers_license ? 'Yes' : 'No'],
                ['Has Transportation', t.has_transportation ? 'Yes' : 'No'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[#9ba9bb] text-xs mb-1">{label}</p>
                  <p className={value === 'Yes' ? 'text-green-400' : 'text-[#9ba9bb]'}>{value}</p>
                </div>
              ))}
            </div>
            {t.local_hire_markets?.length > 0 && (
              <div className="mt-4">
                <p className="text-[#9ba9bb] text-xs mb-2">Local Hire Markets</p>
                <p className="text-[#f0ead8] text-sm">{t.local_hire_markets.join(', ')}</p>
              </div>
            )}
          </div>

          {/* Media links */}
          {(t.headshot_url || t.commercial_headshot_url || t.theatrical_headshot_url || t.resume_url || t.demo_reel_url || t.voice_reel_url) && (
            <div className="glass-card rounded-xl p-6">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Media & Files</p>
              <div className="flex flex-wrap gap-3">
                {t.headshot_url && <a href={t.headshot_url} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-lg border border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all">Primary Headshot ↗</a>}
                {t.commercial_headshot_url && <a href={t.commercial_headshot_url} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-lg border border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all">Commercial Headshot ↗</a>}
                {t.theatrical_headshot_url && <a href={t.theatrical_headshot_url} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-lg border border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all">Theatrical Headshot ↗</a>}
                {t.resume_url && <a href={t.resume_url} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-lg border border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all">Resume ↗</a>}
                {t.demo_reel_url && <a href={t.demo_reel_url} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-lg border border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all">Demo Reel ↗</a>}
                {t.voice_reel_url && <a href={t.voice_reel_url} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-lg border border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all">Voice Reel ↗</a>}
              </div>
            </div>
          )}

          {/* Guardian info */}
          {t.is_minor && t.guardian_name && (
            <div className="glass-card rounded-xl p-6 border border-[#c9a84c]/20">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Parent / Guardian</p>
              <div className="grid grid-cols-2 gap-4">
                <Row label="Name" value={t.guardian_name} />
                <Row label="Relationship" value={t.guardian_relationship} />
                <Row label="Email" value={t.guardian_email} />
                <Row label="Phone" value={t.guardian_phone} />
              </div>
            </div>
          )}

          {/* Original submission link */}
          {t.submission_id && (
            <Link href={`/admin/submissions/${t.submission_id}`}
              className="glass-card rounded-xl p-4 text-center text-[#9ba9bb] text-xs hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition-all border border-transparent">
              View Original Submission →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
