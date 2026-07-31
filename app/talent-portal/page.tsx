import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, User, CheckCircle } from 'lucide-react'

export const metadata = { title: 'Talent Dashboard | Landi-Lou' }

export default async function TalentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: bookings }, { data: notifications }] = await Promise.all([
    supabase.from('talent_profiles').select('*').eq('user_id', user!.id).single(),
    supabase.from('booking_requests').select('*, casting_directors(company)').eq('talent_id',
      supabase.from('talent_profiles').select('id').eq('user_id', user!.id)
    ).order('created_at', { ascending: false }).limit(10),
    supabase.from('notifications').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(5),
  ])

  const unreadCount = notifications?.filter(n => !n.read).length ?? 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#c9a84c]/30 bg-[#141929] flex-shrink-0">
          {profile?.headshot_url ? (
            <Image src={profile.headshot_url} alt="Headshot" width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><User size={24} className="text-[#7a869a]" /></div>
          )}
        </div>
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-1">Welcome back</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#f0ead8]">
            {profile?.first_name} {profile?.last_name}
          </h1>
          <p className="text-[#7a869a] text-sm mt-1">{profile?.categories?.join(', ')}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link href="/talent-portal/profile" className="glass-card rounded-xl p-6 flex items-center gap-4 hover:border-[#c9a84c]/30 transition-all group">
          <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
            <User size={18} className="text-[#c9a84c]" />
          </div>
          <div>
            <p className="text-[#f0ead8] text-sm font-medium">My Profile</p>
            <p className="text-[#7a869a] text-xs">Update your info & media</p>
          </div>
        </Link>

        <div className="glass-card rounded-xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0ea5c8]/10 flex items-center justify-center">
            <CheckCircle size={18} className="text-[#0ea5c8]" />
          </div>
          <div>
            <p className="text-[#f0ead8] text-sm font-medium">{bookings?.length ?? 0} Bookings</p>
            <p className="text-[#7a869a] text-xs">Total requests</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#7c3aad]/10 flex items-center justify-center relative">
            <Bell size={18} className="text-[#7c3aad]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c9a84c] text-[#06080f] text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <p className="text-[#f0ead8] text-sm font-medium">{unreadCount} Unread</p>
            <p className="text-[#7a869a] text-xs">Notifications</p>
          </div>
        </div>
      </div>

      {/* Booking requests */}
      <div className="glass-card rounded-xl overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-[rgba(201,168,76,0.15)]">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#f0ead8]">Booking Requests</h2>
        </div>
        {bookings && bookings.length > 0 ? (
          <div className="divide-y divide-[rgba(201,168,76,0.08)]">
            {bookings.map(b => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[#f0ead8] text-sm">{b.project_name}</p>
                  <p className="text-[#7a869a] text-xs mt-0.5">{b.casting_directors?.company} &bull; {b.project_type}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  b.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                  b.status === 'requested' ? 'bg-[#c9a84c]/10 text-[#c9a84c]' :
                  'bg-[#7a869a]/10 text-[#7a869a]'
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-[#7a869a] text-sm">No booking requests yet.</div>
        )}
      </div>

      {/* Notifications */}
      {notifications && notifications.length > 0 && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[rgba(201,168,76,0.15)]">
            <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#f0ead8]">Notifications</h2>
          </div>
          <div className="divide-y divide-[rgba(201,168,76,0.08)]">
            {notifications.map(n => (
              <div key={n.id} className={`px-6 py-4 flex items-start gap-3 ${!n.read ? 'bg-[#c9a84c]/3' : ''}`}>
                {!n.read && <div className="w-2 h-2 rounded-full bg-[#c9a84c] mt-1.5 flex-shrink-0" />}
                <div className={!n.read ? '' : 'ml-5'}>
                  <p className="text-[#f0ead8] text-sm">{n.title}</p>
                  <p className="text-[#7a869a] text-xs mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
