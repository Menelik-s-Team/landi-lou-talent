'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  User,
  Image as ImageIcon,
  FileText,
  Calendar,
  Briefcase,
  Folder,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Overview',     href: '/talent-portal',             icon: LayoutDashboard },
  { label: 'Profile',      href: '/talent-portal/profile',     icon: User },
  { label: 'Media',        href: '/talent-portal/media',       icon: ImageIcon },
  { label: 'Submissions',  href: '/talent-portal/submissions', icon: FileText },
  { label: 'Auditions',    href: '/talent-portal/auditions',   icon: Calendar },
  { label: 'Bookings',     href: '/talent-portal/bookings',    icon: Briefcase },
  { label: 'Documents',    href: '/talent-portal/documents',   icon: Folder },
  { label: 'Messages',     href: '/talent-portal/messages',    icon: MessageSquare },
  { label: 'Settings',     href: '/talent-portal/settings',    icon: Settings },
]

interface TalentSidebarProps {
  firstName: string
  lastName: string
  category: string
  headshotUrl: string | null
}

export default function TalentSidebar({ firstName, lastName, category, headshotUrl }: TalentSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  function isActive(href: string) {
    if (href === '/talent-portal') return pathname === '/talent-portal'
    return pathname.startsWith(href)
  }

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Profile section */}
      <div className="px-5 py-6 border-b border-[rgba(201,168,76,0.12)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#c9a84c]/30 bg-[#141929] flex-shrink-0">
            {headshotUrl ? (
              <Image src={headshotUrl} alt="Headshot" width={40} height={40} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={16} className="text-[#9ba9bb]" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[#f0ead8] text-sm font-semibold truncate">{firstName} {lastName}</p>
            <p className="text-[#9ba9bb] text-xs truncate">{category || 'Talent'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative group ${
                    active
                      ? 'text-[#c9a84c] bg-[#c9a84c]/8'
                      : 'text-[#9ba9bb] hover:text-[#f0ead8] hover:bg-white/4'
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#c9a84c] rounded-r" />
                  )}
                  <Icon size={16} className={active ? 'text-[#c9a84c]' : 'text-[#9ba9bb] group-hover:text-[#f0ead8]'} />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[rgba(201,168,76,0.12)]">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[#9ba9bb] hover:text-red-400 hover:bg-red-500/8 transition-all disabled:opacity-50"
        >
          <LogOut size={16} />
          {loggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-lg bg-[#0d1120] border border-[rgba(201,168,76,0.2)] text-[#9ba9bb] hover:text-[#c9a84c] transition-colors"
        aria-label="Toggle menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-40 h-full w-[260px] bg-[#0d1120] border-r border-[rgba(201,168,76,0.12)] transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-[260px] bg-[#0d1120] border-r border-[rgba(201,168,76,0.12)]">
        {sidebarContent}
      </aside>
    </>
  )
}
