import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ApproveRejectButtons from './ApproveRejectButtons'

export const metadata = { title: 'Review Submission | Admin' }

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: s } = await supabase
    .from('talent_submissions')
    .select('*')
    .eq('id', id)
    .single()

  if (!s) notFound()

  // Fetch onboarding portfolio if exists
  const { data: portfolio } = await supabase
    .from('talent_onboarding_portfolios')
    .select('id, status, current_step, completed_at, created_at')
    .eq('submission_id', id)
    .maybeSingle()

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Submission Review</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">
            {s.first_name} {s.last_name}
          </h1>
        </div>
        <span className={`text-sm px-4 py-2 rounded-full ${
          s.status === 'pending' ? 'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30' :
          s.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
          'bg-red-500/10 text-red-400 border border-red-500/30'
        }`}>
          {s.status}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Headshot */}
        <div className="md:col-span-1">
          {s.headshot_url ? (
            <div className="glass-card rounded-xl overflow-hidden aspect-[3/4]">
              <Image
                src={s.headshot_url}
                alt={`${s.first_name} headshot`}
                width={400}
                height={533}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="glass-card rounded-xl aspect-[3/4] flex items-center justify-center text-[#9ba9bb] text-sm">
              No headshot
            </div>
          )}

          {/* Portfolio */}
          {s.portfolio_urls?.length > 0 && (
            <div className="mt-4">
              <p className="text-[#9ba9bb] text-xs tracking-widest uppercase mb-3">Portfolio</p>
              <div className="grid grid-cols-2 gap-2">
                {s.portfolio_urls.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <Image src={url} alt={`Portfolio ${i + 1}`} width={150} height={150} className="rounded-lg object-cover w-full aspect-square" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:col-span-2 flex flex-col gap-5">
          {/* Basic info */}
          <div className="glass-card rounded-xl p-6">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Basic Information</p>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              {[
                ['Email', s.email],
                ['Phone', s.phone || 'N/A'],
                ['Date of Birth', s.dob],
                ['Location', `${s.city}, ${s.state}`],
                ['Minor', s.is_minor ? 'Yes' : 'No'],
                ['Submitted', new Date(s.created_at).toLocaleDateString()],
                ...(s.height ? [['Height', s.height_unit ? `${s.height} (${s.height_unit})` : s.height]] : []),
                ...(s.weight ? [['Weight', s.weight_unit ? `${s.weight} (${s.weight_unit})` : s.weight]] : []),
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="text-[#9ba9bb] text-xs mb-1">{label}</p>
                  <p className="text-[#f0ead8]">{value as string}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="glass-card rounded-xl p-6">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Categories</p>
            <div className="flex flex-wrap gap-2">
              {s.categories?.map((cat: string) => (
                <span key={cat} className="px-3 py-1 rounded-full bg-[#141929] border border-[rgba(201,168,76,0.2)] text-[#f0ead8] text-xs">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          {s.bio && (
            <div className="glass-card rounded-xl p-6">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Bio</p>
              <p className="text-[#f0ead8] text-sm leading-relaxed">{s.bio}</p>
            </div>
          )}

          {/* Social */}
          {(s.instagram || s.tiktok || s.youtube) && (
            <div className="glass-card rounded-xl p-6">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Social Media</p>
              <div className="flex flex-col gap-2 text-sm">
                {s.instagram && <p className="text-[#f0ead8]">Instagram: {s.instagram}</p>}
                {s.tiktok && <p className="text-[#f0ead8]">TikTok: {s.tiktok}</p>}
                {s.youtube && <p className="text-[#f0ead8]">YouTube: {s.youtube}</p>}
              </div>
            </div>
          )}

          {/* Guardian info */}
          {s.is_minor && (
            <div className="glass-card rounded-xl p-6 border border-[#c9a84c]/20">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Parent / Guardian</p>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div><p className="text-[#9ba9bb] text-xs mb-1">Name</p><p className="text-[#f0ead8]">{s.guardian_name}</p></div>
                <div><p className="text-[#9ba9bb] text-xs mb-1">Relationship</p><p className="text-[#f0ead8]">{s.guardian_relationship}</p></div>
                <div><p className="text-[#9ba9bb] text-xs mb-1">Email</p><p className="text-[#f0ead8]">{s.guardian_email}</p></div>
                <div><p className="text-[#9ba9bb] text-xs mb-1">Phone</p><p className="text-[#f0ead8]">{s.guardian_phone}</p></div>
              </div>
            </div>
          )}

          {/* Onboarding Portfolio section (appears after approval) */}
          {s.status === 'approved' && (
            <div className="glass-card rounded-xl p-6 border border-[rgba(201,168,76,0.2)]">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Onboarding Portfolio</p>
              {!portfolio ? (
                <p className="text-[#9ba9bb] text-sm">No portfolio record found. The approval email may not have triggered correctly.</p>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        portfolio.status === 'completed'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : portfolio.status === 'in_progress'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30'
                      }`}>
                        {portfolio.status === 'completed' ? 'Completed' : portfolio.status === 'in_progress' ? `In Progress (Step ${portfolio.current_step}/13)` : 'Pending'}
                      </span>
                    </div>
                    {portfolio.completed_at && (
                      <p className="text-[#9ba9bb] text-xs">
                        Completed: {new Date(portfolio.completed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    )}
                    {portfolio.status !== 'completed' && (
                      <p className="text-[#9ba9bb] text-xs mt-1">Onboarding link sent to talent on approval.</p>
                    )}
                  </div>
                  {portfolio.status === 'completed' && (
                    <Link
                      href={`/admin/portfolio/${portfolio.id}`}
                      className="px-4 py-2 bg-[#c9a84c] text-[#06080f] rounded-lg text-sm font-bold hover:bg-[#e8c97a] transition-all"
                    >
                      View Portfolio
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          {s.status === 'pending' && <ApproveRejectButtons submissionId={s.id} submissionData={s} />}
        </div>
      </div>
    </div>
  )
}
