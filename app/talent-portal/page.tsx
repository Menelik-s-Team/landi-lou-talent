import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import Image from 'next/image'
import {
  User,
  Bell,
  Calendar,
  Briefcase,
  FileText,
  Star,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react'

export const metadata = { title: 'Talent Dashboard | Landi-Lou' }

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: 'bg-green-500/10 text-green-400 border border-green-500/20',
    requested:  'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20',
    pending:    'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20',
    cancelled:  'bg-red-500/10 text-red-400 border border-red-500/20',
    completed:  'bg-[#9ba9bb]/10 text-[#9ba9bb] border border-[#9ba9bb]/20',
  }
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${map[status] ?? map.pending}`}>
      {status}
    </span>
  )
}

export default async function TalentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const adminClient = createAdminClient()

  const { data: profile } = await adminClient
    .from('talent_profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  const talentId = profile?.id

  const [
    { data: bookings },
    { data: auditions },
    { data: notifications },
  ] = await Promise.all([
    talentId
      ? adminClient
          .from('booking_requests')
          .select('*, casting_directors(company)')
          .eq('talent_id', talentId)
          .order('created_at', { ascending: false })
          .limit(20)
      : Promise.resolve({ data: [] }),
    talentId
      ? adminClient
          .from('talent_auditions')
          .select('*')
          .eq('talent_id', talentId)
          .order('created_at', { ascending: false })
          .limit(20)
      : Promise.resolve({ data: [] }),
    adminClient
      .from('notifications')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const now = new Date()
  const confirmedUpcoming = (bookings ?? []).filter(
    b => b.status === 'confirmed' && b.event_date && new Date(b.event_date) >= now
  )
  const unreadCount = (notifications ?? []).filter(n => !n.read).length

  const statCards = [
    {
      label: 'Total Submissions',
      value: profile?.submissions_count ?? 0,
      icon: FileText,
      color: '#c9a84c',
      bg: 'bg-[#c9a84c]/10',
    },
    {
      label: 'Auditions',
      value: (auditions ?? []).length,
      icon: Star,
      color: '#7c3aad',
      bg: 'bg-[#7c3aad]/10',
    },
    {
      label: 'Bookings',
      value: (bookings ?? []).length,
      icon: Briefcase,
      color: '#0ea5c8',
      bg: 'bg-[#0ea5c8]/10',
    },
    {
      label: 'Upcoming',
      value: confirmedUpcoming.length,
      icon: Calendar,
      color: '#22c55e',
      bg: 'bg-green-500/10',
    },
  ]

  // Build unified upcoming list from confirmed bookings + auditions
  type UpcomingItem = {
    id: string
    type: 'Booking' | 'Audition'
    project: string
    date: string | null
    status: string
  }

  const upcomingItems: UpcomingItem[] = [
    ...(bookings ?? [])
      .filter(b => b.event_date && new Date(b.event_date) >= now)
      .map(b => ({
        id: b.id,
        type: 'Booking' as const,
        project: b.project_name ?? 'Untitled Project',
        date: b.event_date,
        status: b.status,
      })),
    ...(auditions ?? [])
      .filter(a => a.audition_date && new Date(a.audition_date) >= now)
      .map(a => ({
        id: a.id,
        type: 'Audition' as const,
        project: a.project_name ?? 'Audition',
        date: a.audition_date,
        status: a.status ?? 'scheduled',
      })),
  ].sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  }).slice(0, 8)

  const unreadNotifications = (notifications ?? []).filter(n => !n.read)

  const quickLinks = [
    { label: 'Update Profile',    href: '/talent-portal/profile',     icon: User },
    { label: 'Upload Media',      href: '/talent-portal/media',       icon: Star },
    { label: 'View Bookings',     href: '/talent-portal/bookings',    icon: Briefcase },
    { label: 'Agency Documents',  href: '/talent-portal/documents',   icon: FileText },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Welcome back</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8] mb-1">
          {profile?.first_name ?? 'Talent'}
        </h1>
        <p className="text-[#9ba9bb] text-sm">You&apos;re doing amazing.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-card rounded-xl p-5">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-[#f0ead8] text-2xl font-bold">{value}</p>
            <p className="text-[#9ba9bb] text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming section */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[rgba(201,168,76,0.15)] flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#f0ead8]">Upcoming</h2>
          <Clock size={15} className="text-[#9ba9bb]" />
        </div>
        {upcomingItems.length > 0 ? (
          <div className="divide-y divide-[rgba(201,168,76,0.08)]">
            {upcomingItems.map(item => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded border shrink-0 ${
                    item.type === 'Audition'
                      ? 'border-[#7c3aad]/30 text-[#7c3aad] bg-[#7c3aad]/8'
                      : 'border-[#0ea5c8]/30 text-[#0ea5c8] bg-[#0ea5c8]/8'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-[#f0ead8] text-sm truncate">{item.project}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {item.date && (
                    <span className="text-[#9ba9bb] text-xs">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-center">
            <CheckCircle2 size={28} className="text-[#9ba9bb] mx-auto mb-3 opacity-40" />
            <p className="text-[#9ba9bb] text-sm">No upcoming bookings or auditions yet.</p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Links */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[rgba(201,168,76,0.15)]">
            <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#f0ead8]">Quick Links</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {quickLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#141929] hover:bg-[#1a2035] border border-[rgba(201,168,76,0.1)] hover:border-[#c9a84c]/30 transition-all group"
              >
                <div className="w-7 h-7 rounded-md bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-[#c9a84c]" />
                </div>
                <span className="text-[#f0ead8] text-xs font-medium leading-tight group-hover:text-[#c9a84c] transition-colors">
                  {label}
                </span>
                <ArrowRight size={12} className="text-[#9ba9bb] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[rgba(201,168,76,0.15)] flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#f0ead8]">Notifications</h2>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#c9a84c] text-[#06080f] text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadNotifications.length > 0 ? (
            <div className="divide-y divide-[rgba(201,168,76,0.08)]">
              {unreadNotifications.slice(0, 5).map(n => (
                <div key={n.id} className="px-6 py-4 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#c9a84c] mt-1.5 shrink-0" />
                  <div>
                    <p className="text-[#f0ead8] text-sm">{n.title}</p>
                    {n.message && <p className="text-[#9ba9bb] text-xs mt-0.5">{n.message}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <Bell size={28} className="text-[#9ba9bb] mx-auto mb-3 opacity-40" />
              <p className="text-[#9ba9bb] text-sm">You&apos;re all caught up.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent booking requests (full list) */}
      {(bookings ?? []).length > 0 && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[rgba(201,168,76,0.15)]">
            <h2 className="font-[family-name:var(--font-playfair)] text-lg text-[#f0ead8]">Booking Requests</h2>
          </div>
          <div className="divide-y divide-[rgba(201,168,76,0.08)]">
            {(bookings ?? []).slice(0, 10).map(b => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[#f0ead8] text-sm truncate">{b.project_name}</p>
                  <p className="text-[#9ba9bb] text-xs mt-0.5">
                    {(b.casting_directors as { company?: string } | null)?.company}
                    {b.project_type ? ` · ${b.project_type}` : ''}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
