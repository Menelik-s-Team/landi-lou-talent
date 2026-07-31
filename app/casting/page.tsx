import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import BookingRequestButton from './BookingRequestButton'

export const metadata = { title: 'Search Talent | Casting Portal' }

const CATEGORIES = ['All', 'Acting', 'Modeling', 'Influencer Marketing', 'Voice-Over', 'Singing', 'Dancing']

export default async function CastingSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const { category, search } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: castingDirector } = await supabase
    .from('casting_directors')
    .select('id')
    .eq('user_id', user!.id)
    .single()

  let query = supabase.from('talent_profiles').select('*').eq('is_available', true)

  if (category && category !== 'All') {
    query = query.contains('categories', [category])
  }
  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,bio.ilike.%${search}%`)
  }

  const { data: talent } = await query.order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Discover</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Browse Talent</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form className="flex-1">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search by name or keyword..."
            className="w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#9ba9bb] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
          />
        </form>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <a
              key={cat}
              href={`/casting?category=${cat}`}
              className={`px-4 py-2 rounded text-xs tracking-wide transition-all ${
                (category || 'All') === cat
                  ? 'bg-[#c9a84c] text-[#06080f] font-semibold'
                  : 'border border-[rgba(201,168,76,0.2)] text-[#9ba9bb] hover:text-[#f0ead8] hover:border-[#c9a84c]/40'
              }`}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      {/* Results */}
      {talent && talent.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {talent.map(t => (
            <div key={t.id} className="glass-card rounded-xl overflow-hidden group">
              <div className="aspect-[3/4] relative bg-[#141929]">
                {t.headshot_url ? (
                  <Image src={t.headshot_url} alt={`${t.first_name} ${t.last_name}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#9ba9bb] text-xs">No photo</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080f] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-[family-name:var(--font-playfair)] text-[#f0ead8] font-semibold text-sm">
                    {t.first_name} {t.last_name}
                  </p>
                  <p className="text-[#9ba9bb] text-xs">{t.categories?.join(', ')}</p>
                  <p className="text-[#9ba9bb] text-xs">{t.city}, {t.state}</p>
                </div>
              </div>
              <div className="p-4">
                {t.bio && <p className="text-[#9ba9bb] text-xs leading-relaxed line-clamp-2 mb-3">{t.bio}</p>}
                {castingDirector && (
                  <BookingRequestButton talentId={t.id} talentName={`${t.first_name} ${t.last_name}`} castingDirectorId={castingDirector.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl py-20 text-center text-[#9ba9bb]">
          No talent found matching your criteria.
        </div>
      )}
    </div>
  )
}
