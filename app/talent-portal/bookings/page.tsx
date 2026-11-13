import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { Briefcase, MapPin, Calendar, DollarSign, Building2 } from 'lucide-react'

export const metadata = { title: 'My Bookings | Landi-Lou' }

const STATUS_STYLES: Record<string, string> = {
  requested:  'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30',
  confirmed:  'bg-green-500/10 text-green-400 border-green-500/30',
  completed:  'bg-[#9ba9bb]/10 text-[#9ba9bb] border-[#9ba9bb]/20',
  cancelled:  'bg-red-500/10 text-red-400 border-red-500/20',
  pending:    'bg-[#c9a84c]/10 text-[#c9a84c] border-[#c9a84c]/30',
}

type Booking = {
  id: string
  project_name: string
  project_type?: string
  description?: string
  date_needed?: string
  location?: string
  rate?: string
  status?: string
  admin_notes?: string
  created_at: string
  casting_directors?: { company?: string } | null
}

function BookingCard({ b }: { b: Booking }) {
  const status = b.status ?? 'requested'
  const dateStr = b.date_needed
    ? new Date(b.date_needed).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })
    : null
  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[#f0ead8] font-semibold">{b.project_name}</h3>
          {b.project_type && (
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded border border-[rgba(201,168,76,0.2)] text-[#9ba9bb]">
              {b.project_type}
            </span>
          )}
        </div>
        <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[status] ?? STATUS_STYLES.requested}`}>
          {status}
        </span>
      </div>

      {b.description && (
        <p className="text-[#9ba9bb] text-sm leading-relaxed">{b.description}</p>
      )}

      <div className="flex flex-col gap-1.5 text-sm">
        {b.casting_directors?.company && (
          <div className="flex items-center gap-2 text-[#9ba9bb]">
            <Building2 size={13} className="shrink-0" /><span>{b.casting_directors.company}</span>
          </div>
        )}
        {dateStr && (
          <div className="flex items-center gap-2 text-[#9ba9bb]">
            <Calendar size={13} className="shrink-0" /><span>{dateStr}</span>
          </div>
        )}
        {b.location && (
          <div className="flex items-center gap-2 text-[#9ba9bb]">
            <MapPin size={13} className="shrink-0" /><span>{b.location}</span>
          </div>
        )}
        {b.rate && (
          <div className="flex items-center gap-2 text-[#c9a84c]">
            <DollarSign size={13} className="shrink-0" /><span className="font-medium">{b.rate}</span>
          </div>
        )}
      </div>

      {b.admin_notes && (
        <div className="bg-[#141929] rounded-lg px-4 py-3 border border-[rgba(201,168,76,0.1)]">
          <p className="text-[#c9a84c] text-[10px] uppercase tracking-widest mb-1">Agency Note</p>
          <p className="text-[#9ba9bb] text-xs leading-relaxed">{b.admin_notes}</p>
        </div>
      )}

      <p className="text-[#9ba9bb] text-[10px]">
        Submitted {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
  )
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('talent_profiles').select('id').eq('user_id', user.id).single()

  const { data: bookings } = profile
    ? await adminClient
        .from('booking_requests')
        .select('*, casting_directors(company)')
        .eq('talent_id', profile.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  const list: Booking[] = (bookings ?? []) as Booking[]
  const active    = list.filter(b => b.status === 'confirmed' || b.status === 'requested' || b.status === 'pending')
  const completed = list.filter(b => b.status === 'completed')
  const cancelled = list.filter(b => b.status === 'cancelled')

  const totalEarnings = completed
    .map(b => parseFloat((b.rate ?? '').replace(/[^0-9.]/g, '')))
    .filter(n => !isNaN(n))
    .reduce((sum, n) => sum + n, 0)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Talent Portal</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">My Bookings</h1>
        <p className="text-[#9ba9bb] text-sm mt-1">Booking requests submitted by casting directors through your agency</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',     value: list.length },
          { label: 'Active',    value: active.length },
          { label: 'Completed', value: completed.length },
          { label: 'Cancelled', value: cancelled.length },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card rounded-xl p-4 text-center">
            <p className="text-[#f0ead8] text-2xl font-bold">{value}</p>
            <p className="text-[#9ba9bb] text-xs uppercase tracking-wide mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Briefcase size={36} className="text-[#9ba9bb] mb-4 opacity-30" />
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-2">No Bookings Yet</h2>
          <p className="text-[#9ba9bb] text-sm max-w-sm">
            Once casting directors request you through Landi-Lou, those bookings will appear here.
          </p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-medium">Active</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#141929] text-[#9ba9bb]">{active.length}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {active.map(b => <BookingCard key={b.id} b={b} />)}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[#9ba9bb] text-xs tracking-widest uppercase font-medium">Completed</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#141929] text-[#9ba9bb]">{completed.length}</span>
                {totalEarnings > 0 && (
                  <span className="text-xs text-[#c9a84c] ml-auto">${totalEarnings.toLocaleString()} total</span>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {completed.map(b => <BookingCard key={b.id} b={b} />)}
              </div>
            </div>
          )}
          {cancelled.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-red-400 text-xs tracking-widest uppercase font-medium">Cancelled</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#141929] text-[#9ba9bb]">{cancelled.length}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {cancelled.map(b => <BookingCard key={b.id} b={b} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
