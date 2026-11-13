import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import type React from 'react'
import { ExternalLink, FileText, Video, Mic, ImageIcon } from 'lucide-react'

export const metadata = { title: 'My Media | Landi-Lou' }

type MediaItem = { url: string; label: string; type: 'image' | 'link' }

export default async function MediaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminClient = createAdminClient()
  const { data: p } = await adminClient
    .from('talent_profiles')
    .select('headshot_url, commercial_headshot_url, theatrical_headshot_url, full_body_url, portfolio_urls, resume_url, demo_reel_url, voice_reel_url, first_name, last_name')
    .eq('user_id', user.id)
    .single()

  if (!p) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ImageIcon size={36} className="text-[#9ba9bb] mb-4 opacity-30" />
        <p className="text-[#9ba9bb] text-sm">Profile not found. Contact your agency.</p>
      </div>
    )
  }

  const photos: MediaItem[] = [
    { url: p.headshot_url, label: 'Primary Headshot', type: 'image' },
    { url: p.commercial_headshot_url, label: 'Commercial Headshot', type: 'image' },
    { url: p.theatrical_headshot_url, label: 'Theatrical Headshot', type: 'image' },
    { url: p.full_body_url, label: 'Full Body', type: 'image' },
    ...((p.portfolio_urls as string[] | null) ?? []).map((url: string, i: number) => ({
      url, label: `Portfolio ${i + 1}`, type: 'image' as const
    })),
  ].filter(m => m.url) as MediaItem[]

  const reels = [
    p.resume_url    && { url: p.resume_url,    label: 'Resume / Résumé', icon: FileText },
    p.demo_reel_url && { url: p.demo_reel_url, label: 'Demo Reel',       icon: Video },
    p.voice_reel_url && { url: p.voice_reel_url, label: 'Voice Reel',    icon: Mic },
  ].filter(Boolean) as { url: string; label: string; icon: React.ElementType }[]

  const hasMedia = photos.length > 0 || reels.length > 0

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Talent Portal</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">My Media</h1>
        <p className="text-[#9ba9bb] text-sm mt-1">
          {photos.length} photo{photos.length !== 1 ? 's' : ''} · {reels.length} reel{reels.length !== 1 ? 's' : ''}
          {' '}· managed by your agency
        </p>
      </div>

      {!hasMedia ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ImageIcon size={36} className="text-[#9ba9bb] mb-4 opacity-30" />
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-2">No Media Yet</h2>
          <p className="text-[#9ba9bb] text-sm max-w-sm">
            Your agency uploads and manages your media. Contact{' '}
            <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] hover:underline">info@landiloutalentagency.com</a>{' '}
            to submit new photos or reels.
          </p>
        </div>
      ) : (
        <>
          {photos.length > 0 && (
            <div>
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Photos &amp; Headshots</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photos.map(({ url, label }) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-[rgba(201,168,76,0.15)] hover:border-[#c9a84c]/40 transition-all"
                  >
                    <Image src={url} alt={label} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                      <p className="text-white text-xs font-medium">{label}</p>
                      <div className="flex items-center gap-1 text-white/70 text-[10px] mt-0.5">
                        <ExternalLink size={9} /> Open full size
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {reels.length > 0 && (
            <div>
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Reels &amp; Documents</p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {reels.map(({ url, label, icon: Icon }) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-[#c9a84c]/40 border border-[rgba(201,168,76,0.15)] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-[#c9a84c]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[#f0ead8] text-sm font-medium">{label}</p>
                      <p className="text-[#9ba9bb] text-xs mt-0.5">Click to open</p>
                    </div>
                    <ExternalLink size={14} className="text-[#9ba9bb] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="glass-card rounded-xl p-5 border border-[rgba(201,168,76,0.15)]">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-2">Need to Update Your Media?</p>
            <p className="text-[#9ba9bb] text-sm leading-relaxed">
              All media is managed by your agency to maintain professional standards. To submit new headshots, portfolio images, or reels,
              email{' '}
              <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] hover:underline">
                info@landiloutalentagency.com
              </a>{' '}
              with your files and the agency will update your profile.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

