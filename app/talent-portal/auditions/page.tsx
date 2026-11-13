import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { Star, MapPin, Building2, Calendar } from 'lucide-react'

export const metadata = { title: 'My Auditions | Landi-Lou' }

const STATUS_STYLES: Record<string, string> = {
  upcoming:  'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30',
  callback:  'bg-[#7c3aad]/10 text-[#7c3aad] border-[#7c3aad]/30',
  booked:    'bg-green-500/10 text-green-400 border-green-500/30',
  completed: 'bg-[#9ba9bb]/10 text-[#9ba9bb] border-[#9ba9bb]/20',
  passed:    'bg-red-500/10 text-red-400 border-red-500/20',
}

type Audition = {
  id: string
  title: string
  project_type?: string
  casting_company?: string
  audition_date?: string
  location?: string
  status?: string
  notes?: string
}

function AuditionCard({ a }: { a: Audition }) {
  const dateStr = a.audition_date
    ? new Date(a.audition_date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
    : null
  const timeStr = a.audition_date
    ? new Date(a.audition_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : null
  const status = a.status ?? 'upcoming'
  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[#f0ead8] font-semibold">{a.title}</h3>
          {a.project_type && (
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded border border-[rgba(201,168,76,0.2)] text-[#9ba9bb]">
              {a.project_type}
            </span>
          )}
        </div>
        <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.upcoming}`}>
          {status}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 text-sm">
        {a.casting_company && (
          <div className="flex items-center gap-2 text-[#9ba9bb]">
            <Building2 size={13} className="shrink-0" /><span>{a.casting_company}</span>
          </div>
        )}
        {dateStr && (
          <div className="flex items-center gap-2 text-[#9ba9bb]">
            <Calendar size={13} className="shrink-0" /><span>{dateStr}{timeStr ? ` · ${timeStr}` : ''}</span>
          </div>
        )}
        {a.location && (
          <div className="flex items-center gap-2 text-[#9ba9bb]">
            <MapPin size={13} className="shrink-0" /><span>{a.location}</span>
          </div>
        )}
      </div>
      {a.notes && (
        <p className="text-[#9ba9bb] text-xs leading-relaxed border-t border-[rgba(201,168,76,0.08)] pt-3">{a.notes}</p>
      )}
    </div>
  )
}

function Section({ title, items, accent }: { title: string; items: Audition[]; accent?: string }) {
  if (items.length === 0) return null
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <p className={`text-xs tracking-widest uppercase font-medium ${accent ?? 'text-[#c9a84c]'}`}>{title}</p>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#141929] text-[#9ba9bb]">{items.length}</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map(a => <AuditionCard key={a.id} a={a} />)}
      </div>
    </div>
  )
}

export default async function AuditionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('talent_profiles').select('id').eq('user_id', user.id).single()

  const { data: auditions } = profile
    ? await adminClient.from('talent_auditions').select('*').eq('talent_id', profile.id).order('audition_date', { ascending: false })
    : { data: [] }

  const list: Audition[] = (auditions ?? []) as Audition[]
  const upcoming  = list.filter(a => a.status === 'upcoming')
  const callbacks = list.filter(a => a.status === 'callback')
  const booked    = list.filter(a => a.status === 'booked')
  const past      = list.filter(a => a.status === 'completed' || a.status === 'passed')

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Talent Portal</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">My Auditions</h1>
          <p className="text-[#9ba9bb] text-sm mt-1">{list.length} total · managed by your agency</p>
        </div>
        <div className="flex gap-3 text-center">
          {[
            { label: 'Total', count: list.length },
            { label: 'Upcoming', count: upcoming.length },
            { label: 'Callbacks', count: callbacks.length },
            { label: 'Booked', count: booked.length },
          ].map(({ label, count }) => (
            <div key={label} className="glass-card rounded-xl px-4 py-3 min-w-[60px]">
              <p className="text-[#f0ead8] text-xl font-bold">{count}</p>
              <p className="text-[#9ba9bb] text-[10px] uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Star size={36} className="text-[#9ba9bb] mb-4 opacity-30" />
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-2">No Auditions Yet</h2>
          <p className="text-[#9ba9bb] text-sm max-w-sm">
            Your agency will add auditions here as they&apos;re scheduled. Keep your profile updated so casting can find you.
          </p>
        </div>
      ) : (
        <>
          <Section title="Upcoming" items={upcoming} />
          <Section title="Callbacks" items={callbacks} accent="text-[#7c3aad]" />
          <Section title="Booked" items={booked} accent="text-green-400" />
          <Section title="Past Auditions" items={past} accent="text-[#9ba9bb]" />
        </>
      )}
    </div>
  )
}
