import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import SearchFilters from './SearchFilters'

export const metadata = { title: 'Agency Search | Landi-Lou Admin' }

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    ethnicity?: string
    union_status?: string
    experience_level?: string
    gender?: string
    skills?: string
  }>
}

type TalentProfile = {
  id: string
  first_name: string
  last_name: string
  categories: string[] | null
  headshot_url: string | null
  city: string | null
  state: string | null
  union_status: string | null
  ethnicity: string | null
  experience_level: string | null
  gender: string | null
  skills: string[] | null
  is_available: boolean | null
}

function UnionBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'SAG-AFTRA': 'bg-blue-500/10 text-blue-400 border-blue-400/20',
    'SAG-Eligible': 'bg-sky-500/10 text-sky-400 border-sky-400/20',
    Equity: 'bg-purple-500/10 text-purple-400 border-purple-400/20',
    EMC: 'bg-violet-500/10 text-violet-400 border-violet-400/20',
    'Non-Union': 'bg-[#9ba9bb]/10 text-[#9ba9bb] border-[#9ba9bb]/20',
  }
  const cls = colors[status] ?? 'bg-[#9ba9bb]/10 text-[#9ba9bb] border-[#9ba9bb]/20'
  return (
    <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full border ${cls}`}>
      {status}
    </span>
  )
}

export default async function AgencySearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const q = params.q?.trim() ?? ''
  const category = params.category?.trim() ?? ''
  const ethnicity = params.ethnicity?.trim() ?? ''
  const union_status = params.union_status?.trim() ?? ''
  const experience_level = params.experience_level?.trim() ?? ''
  const gender = params.gender?.trim() ?? ''

  const supabase = createAdminClient()

  let query = supabase
    .from('talent_profiles')
    .select(
      'id, first_name, last_name, categories, headshot_url, city, state, union_status, ethnicity, experience_level, gender, skills, is_available'
    )

  if (category && category !== 'All Categories') {
    query = query.contains('categories', [category])
  }

  if (union_status) {
    query = query.eq('union_status', union_status)
  }

  if (experience_level) {
    query = query.eq('experience_level', experience_level)
  }

  if (gender) {
    query = query.eq('gender', gender)
  }

  if (ethnicity) {
    query = query.contains('ethnicity', [ethnicity])
  }

  query = query.order('created_at', { ascending: false })

  const { data: talent, error } = await query

  // Search the canonical roster taxonomy as well as names. Supabase cannot
  // reliably ilike text[] columns, so apply the keyword match after fetching
  // the already-authorized admin result set.
  const keyword = q.toLowerCase()
  const results: TalentProfile[] = ((talent as TalentProfile[]) ?? []).filter(person => {
    if (!keyword) return true
    return [
      person.first_name,
      person.last_name,
      ...(person.categories ?? []),
      ...(person.skills ?? []),
    ].some(value => value?.toLowerCase().includes(keyword))
  })

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Private Database</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Agency Search</h1>
      </div>

      {/* Filter bar */}
      <div className="glass-card rounded-xl p-5 mb-6">
        <SearchFilters
          q={q}
          category={category}
          ethnicity={ethnicity}
          union_status={union_status}
          experience_level={experience_level}
          gender={gender}
        />
      </div>

      {/* Results count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[#9ba9bb] text-sm">
          <span className="text-[#f0ead8] font-semibold">{results.length}</span>{' '}
          {results.length === 1 ? 'Result' : 'Results'}
        </p>
        {error && (
          <p className="text-red-400 text-xs">Error loading results. Please try again.</p>
        )}
      </div>

      {/* Talent grid */}
      {results.length === 0 ? (
        <div className="glass-card rounded-xl py-20 flex flex-col items-center justify-center gap-3">
          <p className="text-[#f0ead8] text-lg font-[family-name:var(--font-playfair)]">No talent found</p>
          <p className="text-[#9ba9bb] text-sm">Try adjusting your filters or search query.</p>
          <Link
            href="/admin/search"
            className="mt-2 text-[#c9a84c] text-xs tracking-widest uppercase hover:text-[#e8c97a] transition-colors"
          >
            Clear all filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {results.map((person) => (
            <TalentCard key={person.id} talent={person} />
          ))}
        </div>
      )}
    </div>
  )
}

function TalentCard({ talent }: { talent: TalentProfile }) {
  const name = `${talent.first_name} ${talent.last_name}`
  const location = [talent.city, talent.state].filter(Boolean).join(', ')
  const categoriesDisplay = talent.categories?.join(', ') ?? ''

  return (
    <Link
      href={`/admin/talent/${talent.id}`}
      className="glass-card rounded-xl overflow-hidden group hover:border-[#c9a84c]/30 transition-all flex flex-col"
    >
      {/* Headshot — 3/4 aspect ratio */}
      <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
        {talent.headshot_url ? (
          <Image
            src={talent.headshot_url}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-[#141929] flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ba9bb"
              strokeWidth={1.5}
              className="opacity-40"
            >
              <circle cx="12" cy="8" r="4" />
              <path strokeLinecap="round" d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
            </svg>
          </div>
        )}

        {/* Availability dot */}
        {talent.is_available !== null && (
          <div className="absolute top-2.5 right-2.5">
            <span
              className={`block w-2.5 h-2.5 rounded-full ring-2 ring-[#06080f] ${
                talent.is_available ? 'bg-green-400' : 'bg-[#9ba9bb]'
              }`}
              title={talent.is_available ? 'Available' : 'Unavailable'}
            />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Name */}
        <p className="text-[#f0ead8] font-semibold text-sm leading-tight group-hover:text-[#c9a84c] transition-colors">
          {name}
        </p>

        {/* Categories */}
        {categoriesDisplay && (
          <p className="text-[#c9a84c] text-[11px] leading-snug line-clamp-1">{categoriesDisplay}</p>
        )}

        {/* Location */}
        {location && (
          <p className="text-[#9ba9bb] text-[11px] flex items-center gap-1">
            <MapPin size={11} className="shrink-0" />
            {location}
          </p>
        )}

        {/* Union badge */}
        {talent.union_status && (
          <div className="mt-1">
            <UnionBadge status={talent.union_status} />
          </div>
        )}

        {/* View Profile button */}
        <div className="mt-auto pt-3">
          <span className="block w-full text-center text-[10px] tracking-[0.2em] uppercase font-semibold py-2 rounded-lg bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20 group-hover:bg-[#c9a84c] group-hover:text-[#06080f] transition-all">
            View Profile
          </span>
        </div>
      </div>
    </Link>
  )
}
