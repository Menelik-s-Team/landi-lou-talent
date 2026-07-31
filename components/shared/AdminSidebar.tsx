'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, UserCheck, Briefcase, Bell, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const links = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/submissions', icon: Users, label: 'Submissions' },
  { href: '/admin/talent', icon: UserCheck, label: 'Talent Roster' },
  { href: '/admin/casting-directors', icon: Briefcase, label: 'Casting Directors' },
  { href: '/admin/bookings', icon: Bell, label: 'Bookings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-[#0d1120] border-r border-[rgba(201,168,76,0.15)] flex flex-col">
      <div className="px-6 py-6 border-b border-[rgba(201,168,76,0.15)]">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Landi-Lou" width={40} height={40} className="rounded-full ring-1 ring-[#c9a84c]/30" />
          <div>
            <p className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase">Landi-Lou</p>
            <p className="text-[10px] text-[#7a869a] tracking-widest uppercase">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
        {links.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                active
                  ? 'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20'
                  : 'text-[#7a869a] hover:text-[#f0ead8] hover:bg-[#141929]'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-6 border-t border-[rgba(201,168,76,0.15)]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-[#7a869a] hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
