import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Users, UserCheck, Briefcase, Clock } from 'lucide-react'

export const metadata = { title: 'Admin Dashboard | Landi-Lou' }

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [
    { count: pendingCount },
    { count: talentCount },
    { count: castingCount },
    { count: bookingCount },
    { data: recentSubmissions },
  ] = await Promise.all([
    supabase.from('talent_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('talent_profiles').select('*', { count: 'exact', head: true }).eq('is_available', true),
    supabase.from('casting_directors').select('*', { count: 'exact', head: true }),
    supabase.from('booking_requests').select('*', { count: 'exact', head: true }).eq('status', 'requested'),
    supabase.from('talent_submissions').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'Pending Submissions', value: pendingCount ?? 0, icon: Clock, href: '/admin/submissions', color: '#c9a84c' },
    { label: 'Active Talent', value: talentCount ?? 0, icon: UserCheck, href: '/admin/talent', color: '#0ea5c8' },
    { label: 'Casting Directors', value: castingCount ?? 0, icon: Briefcase, href: '/admin/casting-directors', color: '#7c3aad' },
    { label: 'Pending Bookings', value: bookingCount ?? 0, icon: Users, href: '/admin/bookings', color: '#22c55e' },
  ]

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Overview</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Dashboard</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="glass-card rounded-xl p-6 flex flex-col gap-4 hover:border-[#c9a84c]/30 transition-all group">
            <div className="flex items-center justify-between">
              <p className="text-[#9ba9bb] text-xs tracking-wide">{label}</p>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <p className="text-4xl font-semibold text-[#f0ead8] group-hover:text-[#c9a84c] transition-colors">{value}</p>
          </Link>
        ))}
      </div>

      {/* Recent submissions */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[rgba(201,168,76,0.15)] flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#f0ead8]">Recent Submissions</h2>
          <Link href="/admin/submissions" className="text-[#c9a84c] text-xs hover:text-[#e8c97a] transition-colors">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-[rgba(201,168,76,0.08)]">
          {recentSubmissions && recentSubmissions.length > 0 ? recentSubmissions.map((s) => (
            <div key={s.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[#f0ead8] text-sm">{s.first_name} {s.last_name}</p>
                <p className="text-[#9ba9bb] text-xs mt-0.5">{s.categories?.join(', ')} &bull; {s.city}, {s.state}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full ${
                  s.status === 'pending' ? 'bg-[#c9a84c]/10 text-[#c9a84c]' :
                  s.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {s.status}
                </span>
                <Link href={`/admin/submissions/${s.id}`} className="text-xs text-[#9ba9bb] hover:text-[#c9a84c] transition-colors">
                  Review →
                </Link>
              </div>
            </div>
          )) : (
            <div className="px-6 py-10 text-center text-[#9ba9bb] text-sm">No submissions yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
