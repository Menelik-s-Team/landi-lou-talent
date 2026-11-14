import { createAdminClient } from '@/lib/supabase/admin'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import DeleteTalentButton from './DeleteTalentButton'
import TalentFilters from './TalentFilters'

export const metadata = { title: 'Talent Roster | Admin' }

export default async function TalentRosterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const supabase = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = supabase.from('talent_profiles').select('*') as any

  if (params.search) {
    query = query.or(
      `first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,stage_name.ilike.%${params.search}%,email.ilike.%${params.search}%`
    )
  }
  if (params.category) {
    query = query.contains('categories', [params.category])
  }
  if (params.gender) {
    query = query.eq('gender', params.gender)
  }
  if (params.union) {
    query = query.eq('union_status', params.union)
  }
  if (params.available === 'true') {
    query = query.eq('is_available', true)
  }

  const { data: talent } = await query.order('created_at', { ascending: false })

  // Fetch onboarding status for all talent so we can distinguish "in pipeline"
  // from "explicitly unavailable" — both have is_available=false but mean different things.
  const talentIds = talent?.map((t: Record<string, unknown>) => t.id as string) ?? []
  const { data: portfolios } = talentIds.length > 0
    ? await supabase
        .from('talent_onboarding_portfolios')
        .select('talent_profile_id, agency_accepted')
        .in('talent_profile_id', talentIds)
    : { data: [] }

  // talent_profile_id → has been countersigned
  const countersigned = new Set(
    (portfolios ?? [])
      .filter((p: { talent_profile_id: string; agency_accepted: boolean }) => p.agency_accepted)
      .map((p: { talent_profile_id: string; agency_accepted: boolean }) => p.talent_profile_id)
  )
  // talent_profile_id → has any portfolio record (in onboarding pipeline)
  const inPipeline = new Set(
    (portfolios ?? []).map((p: { talent_profile_id: string; agency_accepted: boolean }) => p.talent_profile_id)
  )

  function talentStatus(t: Record<string, unknown>): { label: string; cls: string } {
    if (t.is_available) return { label: 'Available', cls: 'bg-green-500/10 text-green-400' }
    const id = t.id as string
    // Not countersigned + has a portfolio = still going through onboarding
    if (inPipeline.has(id) && !countersigned.has(id)) {
      return { label: 'Onboarding', cls: 'bg-[#c9a84c]/10 text-[#c9a84c]' }
    }
    return { label: 'Unavailable', cls: 'bg-[#9ba9bb]/10 text-[#9ba9bb]' }
  }

  const isFiltered = ['search', 'category', 'gender', 'union', 'available'].some(k => k in params)

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Approved Talent</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Talent Roster</h1>
        </div>
        <Link
          href="/admin/talent/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#c9a84c] text-[#06080f] font-bold rounded text-sm hover:bg-[#e8c97a] transition-all mt-2"
        >
          + Add Talent
        </Link>
      </div>

      <Suspense>
        <TalentFilters />
      </Suspense>

      {isFiltered && talent && (
        <p className="text-[#9ba9bb] text-sm mb-5">
          {talent.length} result{talent.length !== 1 ? 's' : ''} found
        </p>
      )}

      {talent && talent.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {talent.map((t: Record<string, unknown>) => (
            <div key={t.id as string} className="glass-card rounded-xl overflow-hidden group">
              <div className="aspect-[3/4] relative bg-[#141929]">
                {t.headshot_url ? (
                  <Image
                    src={t.headshot_url as string}
                    alt={`${t.first_name} ${t.last_name}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#9ba9bb] text-sm">No photo</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080f] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-[family-name:var(--font-playfair)] text-[#f0ead8] font-semibold">
                    {t.first_name as string} {t.last_name as string}
                  </p>
                  <p className="text-[#9ba9bb] text-xs mt-0.5">
                    {(t.categories as string[] | null)?.join(', ')}
                  </p>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${talentStatus(t).cls}`}>
                  {talentStatus(t).label}
                </span>
                <div className="flex items-center gap-3">
                  <DeleteTalentButton
                    id={t.id as string}
                    name={`${t.first_name} ${t.last_name}`}
                  />
                  <Link
                    href={`/admin/talent/${t.id}`}
                    className="text-xs text-[#c9a84c] hover:text-[#e8c97a] transition-colors"
                  >
                    Edit →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-16 text-center text-[#9ba9bb]">
          {isFiltered ? (
            'No talent matches these filters.'
          ) : (
            <>
              No approved talent yet.{' '}
              <Link href="/admin/submissions" className="text-[#c9a84c]">
                Review submissions →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
