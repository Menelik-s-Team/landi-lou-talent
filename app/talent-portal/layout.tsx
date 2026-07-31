import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import TalentLogout from './TalentLogout'

export default async function TalentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'talent') redirect('/login')

  return (
    <div className="min-h-screen bg-[#06080f]">
      <nav className="glass-card border-b border-[rgba(201,168,76,0.15)] px-6 h-16 flex items-center justify-between">
        <Link href="/talent-portal" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Landi-Lou" width={36} height={36} className="rounded-full ring-1 ring-[#c9a84c]/30" />
          <div>
            <p className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase leading-none">Talent Portal</p>
            <p className="text-[10px] text-[#9ba9bb] tracking-widest">Landi-Lou</p>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/talent-portal" className="text-sm text-[#9ba9bb] hover:text-[#f0ead8] transition-colors">Dashboard</Link>
          <Link href="/talent-portal/profile" className="text-sm text-[#9ba9bb] hover:text-[#f0ead8] transition-colors">My Profile</Link>
          <TalentLogout />
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
