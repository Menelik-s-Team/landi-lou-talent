import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'My Requests | Casting Portal' }

export default async function CastingRequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: cd } = await supabase.from('casting_directors').select('id').eq('user_id', user!.id).single()

  const { data: requests } = await supabase
    .from('booking_requests')
    .select('*, talent_profiles(first_name, last_name, headshot_url, categories)')
    .eq('casting_director_id', cd?.id)
    .order('created_at', { ascending: false })

  const statusColors: Record<string, string> = {
    requested: 'bg-[#c9a84c]/10 text-[#c9a84c]',
    under_review: 'bg-blue-500/10 text-blue-400',
    confirmed: 'bg-green-500/10 text-green-400',
    declined: 'bg-red-500/10 text-red-400',
    completed: 'bg-[#9ba9bb]/10 text-[#9ba9bb]',
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">My Activity</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Booking Requests</h1>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {requests && requests.length > 0 ? (
          <div className="divide-y divide-[rgba(201,168,76,0.08)]">
            {requests.map(r => (
              <div key={r.id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                  <p className="text-[#f0ead8] text-sm font-medium">{r.project_name}</p>
                  <p className="text-[#9ba9bb] text-xs mt-1">
                    Talent: {r.talent_profiles?.first_name} {r.talent_profiles?.last_name}
                    {r.talent_profiles?.categories?.length > 0 && ` · ${r.talent_profiles.categories[0]}`}
                  </p>
                  {r.date_needed && (
                    <p className="text-[#9ba9bb] text-xs">Date: {new Date(r.date_needed).toLocaleDateString()}</p>
                  )}
                  {r.location && <p className="text-[#9ba9bb] text-xs">Location: {r.location}</p>}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full flex-shrink-0 ${statusColors[r.status] || 'bg-[#141929] text-[#9ba9bb]'}`}>
                  {r.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-[#9ba9bb] text-sm">
            No requests yet. <a href="/casting" className="text-[#c9a84c]">Browse talent →</a>
          </div>
        )}
      </div>
    </div>
  )
}
