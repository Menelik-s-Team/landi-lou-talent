'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SetNewPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState<boolean | null>(null)

  useEffect(() => {
    // Verify there is an active recovery session before showing the form.
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setSessionReady(!!data.session)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    router.replace('/talent-portal?welcome=1')
  }

  if (sessionReady === null) {
    return (
      <main className="min-h-screen bg-[#06080f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (!sessionReady) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#06080f]">
        <div className="glass-card rounded-xl p-10 max-w-md w-full text-center">
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-4">
            Link Expired or Invalid
          </h1>
          <p className="text-[#9ba9bb] text-sm leading-relaxed mb-6">
            This password reset link has expired or has already been used. Request a new one below.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block px-6 py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm hover:bg-[#e8c97a] transition-all"
          >
            Request New Link
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-[#06080f] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[100vw] h-[600px] max-h-[100vw] rounded-full bg-[#c9a84c]/4 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Landi-Lou Talent Agency"
              width={80}
              height={80}
              priority
              className="mx-auto mb-4 rounded-full ring-1 ring-[#c9a84c]/30"
            />
          </Link>
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase">Set Your Password</p>
        </div>

        <div className="glass-card rounded-xl p-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-2 text-center">
            Create Password
          </h1>
          <p className="text-[#9ba9bb] text-sm text-center mb-8">
            Choose a password for your talent portal account.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="password" className="block text-[#9ba9bb] text-xs tracking-widest uppercase mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#9ba9bb] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                placeholder="Minimum 8 characters"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="block text-[#9ba9bb] text-xs tracking-widest uppercase mb-2">
                Confirm Password
              </label>
              <input
                id="confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#9ba9bb] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                placeholder="Repeat your password"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded px-4 py-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Set Password & Enter Portal'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
