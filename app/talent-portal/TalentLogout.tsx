'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export default function TalentLogout() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-[#7a869a] hover:text-red-400 transition-colors">
      <LogOut size={14} />
      Sign Out
    </button>
  )
}
