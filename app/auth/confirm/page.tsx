'use client'

import { Suspense, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthConfirmInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const next = searchParams.get('next') ?? '/talent-portal'
    const supabase = createClient()

    async function handle() {
      // PKCE flow: Supabase sends a one-time code in the query string
      const code = searchParams.get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          router.replace('/login?error=link-expired')
          return
        }
        router.replace(next)
        return
      }

      // Implicit flow: tokens arrive in the URL hash fragment.
      // createBrowserClient's getSession() picks up hash tokens automatically.
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.replace(next)
      } else {
        router.replace('/login?error=link-expired')
      }
    }

    handle()
  }, [router, searchParams])

  return (
    <main className="min-h-screen bg-[#06080f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#9ba9bb] text-sm">Setting up your account&hellip;</p>
      </div>
    </main>
  )
}

export default function AuthConfirmPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#06080f] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </main>
      }
    >
      <AuthConfirmInner />
    </Suspense>
  )
}
