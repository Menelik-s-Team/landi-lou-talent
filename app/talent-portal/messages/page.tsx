import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { Bell, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Messages | Landi-Lou' }

type Notification = {
  id: string
  title: string
  message: string
  link?: string
  read: boolean
  created_at: string
}

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminClient = createAdminClient()
  const { data: notifications } = await adminClient
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const list: Notification[] = (notifications ?? []) as Notification[]
  const unread = list.filter(n => !n.read)
  const read   = list.filter(n => n.read)

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins  = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days  = Math.floor(diff / 86400000)
    if (mins < 1)   return 'just now'
    if (mins < 60)  return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7)   return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  function NotifCard({ n }: { n: Notification }) {
    const inner = (
      <div className={`glass-card rounded-xl p-5 flex gap-4 transition-all ${!n.read ? 'border border-[#c9a84c]/20' : 'border border-transparent opacity-70 hover:opacity-100'}`}>
        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.read ? 'bg-[#c9a84c]' : 'bg-transparent'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <p className="text-[#f0ead8] text-sm font-medium leading-snug">{n.title}</p>
            <span className="text-[#9ba9bb] text-[10px] shrink-0">{timeAgo(n.created_at)}</span>
          </div>
          <p className="text-[#9ba9bb] text-sm leading-relaxed">{n.message}</p>
        </div>
      </div>
    )
    if (n.link) return <Link href={n.link}>{inner}</Link>
    return inner
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Talent Portal</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Messages</h1>
          <p className="text-[#9ba9bb] text-sm mt-1">Agency updates and notifications</p>
        </div>
        {unread.length > 0 && (
          <div className="glass-card rounded-xl px-4 py-3 text-center">
            <p className="text-[#c9a84c] text-2xl font-bold">{unread.length}</p>
            <p className="text-[#9ba9bb] text-[10px] uppercase tracking-wide">Unread</p>
          </div>
        )}
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Bell size={36} className="text-[#9ba9bb] mb-4 opacity-30" />
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-2">All Caught Up</h2>
          <p className="text-[#9ba9bb] text-sm max-w-sm">
            No messages from your agency yet. You&apos;ll be notified here about auditions, bookings, and agency updates.
          </p>
        </div>
      ) : (
        <>
          {unread.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[#c9a84c] text-xs tracking-widest uppercase font-medium">New</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#c9a84c] text-[#06080f] font-bold">{unread.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {unread.map(n => <NotifCard key={n.id} n={n} />)}
              </div>
            </div>
          )}

          {read.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[#9ba9bb] text-xs tracking-widest uppercase font-medium">Earlier</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#141929] text-[#9ba9bb]">{read.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {read.map(n => <NotifCard key={n.id} n={n} />)}
              </div>
            </div>
          )}

          {unread.length === 0 && (
            <div className="flex items-center gap-2 text-[#9ba9bb] text-sm">
              <CheckCircle2 size={14} className="text-green-400" />
              <span>All messages read</span>
            </div>
          )}
        </>
      )}

      <div className="glass-card rounded-xl p-5 border border-[rgba(201,168,76,0.1)]">
        <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-2">Direct Contact</p>
        <p className="text-[#9ba9bb] text-sm leading-relaxed">
          For urgent matters, reach your agency directly at{' '}
          <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] hover:underline">
            info@landiloutalentagency.com
          </a>
        </p>
      </div>
    </div>
  )
}
