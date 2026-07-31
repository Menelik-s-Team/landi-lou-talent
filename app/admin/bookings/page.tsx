import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Bookings | Admin' }

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: bookings } = await supabase
    .from('booking_requests')
    .select(`
      *,
      talent_profiles (first_name, last_name, headshot_url, categories),
      casting_directors (company, email)
    `)
    .order('created_at', { ascending: false })

  const statusColors: Record<string, string> = {
    requested: 'bg-[#c9a84c]/10 text-[#c9a84c]',
    under_review: 'bg-blue-500/10 text-blue-400',
    confirmed: 'bg-green-500/10 text-green-400',
    declined: 'bg-red-500/10 text-red-400',
    completed: 'bg-[#7a869a]/10 text-[#7a869a]',
  }

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Booking Management</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Bookings</h1>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {bookings && bookings.length > 0 ? (
          <div className="divide-y divide-[rgba(201,168,76,0.08)]">
            {bookings.map(b => (
              <div key={b.id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                  <p className="text-[#f0ead8] text-sm font-medium">{b.project_name}</p>
                  <p className="text-[#7a869a] text-xs mt-1">
                    Talent: {b.talent_profiles?.first_name} {b.talent_profiles?.last_name} &bull; {b.talent_profiles?.categories?.[0]}
                  </p>
                  <p className="text-[#7a869a] text-xs">
                    Requested by: {b.casting_directors?.company || b.casting_directors?.email}
                  </p>
                  {b.date_needed && (
                    <p className="text-[#7a869a] text-xs">Date: {new Date(b.date_needed).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-3 py-1 rounded-full ${statusColors[b.status] || 'bg-[#141929] text-[#7a869a]'}`}>
                    {b.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center text-[#7a869a] text-sm">No booking requests yet.</div>
        )}
      </div>
    </div>
  )
}
