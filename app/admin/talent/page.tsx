import { createAdminClient } from '@/lib/supabase/admin'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = { title: 'Talent Roster | Admin' }

export default async function TalentRosterPage() {
  const supabase = createAdminClient()
  const { data: talent } = await supabase
    .from('talent_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Approved Talent</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Talent Roster</h1>
      </div>

      {talent && talent.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {talent.map(t => (
            <div key={t.id} className="glass-card rounded-xl overflow-hidden group">
              <div className="aspect-[3/4] relative bg-[#141929]">
                {t.headshot_url ? (
                  <Image src={t.headshot_url} alt={`${t.first_name} ${t.last_name}`} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#7a869a] text-sm">No photo</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080f] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-[family-name:var(--font-playfair)] text-[#f0ead8] font-semibold">
                    {t.first_name} {t.last_name}
                  </p>
                  <p className="text-[#7a869a] text-xs mt-0.5">{t.categories?.join(', ')}</p>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${t.is_available ? 'bg-green-500/10 text-green-400' : 'bg-[#7a869a]/10 text-[#7a869a]'}`}>
                  {t.is_available ? 'Available' : 'Unavailable'}
                </span>
                <Link href={`/admin/talent/${t.id}`} className="text-xs text-[#c9a84c] hover:text-[#e8c97a] transition-colors">
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-16 text-center text-[#7a869a]">
          No approved talent yet. <Link href="/admin/submissions" className="text-[#c9a84c]">Review submissions →</Link>
        </div>
      )}
    </div>
  )
}
