import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import CastingLogout from './CastingLogout'

export default async function CastingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'casting_director') redirect('/login')

  return (
    <div className="min-h-screen bg-[#06080f]">
      <nav className="glass-card border-b border-[rgba(201,168,76,0.15)] px-6 h-16 flex items-center justify-between">
        <Link href="/casting" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Landi-Lou" width={36} height={36} className="rounded-full ring-1 ring-[#c9a84c]/30" />
          <div>
            <p className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase leading-none">Casting Portal</p>
            <p className="text-[10px] text-[#7a869a] tracking-widest">Landi-Lou</p>
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/casting" className="text-sm text-[#7a869a] hover:text-[#f0ead8] transition-colors">Search Talent</Link>
          <Link href="/casting/requests" className="text-sm text-[#7a869a] hover:text-[#f0ead8] transition-colors">My Requests</Link>
          <CastingLogout />
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
