'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Route based on role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') router.push('/admin')
    else if (profile?.role === 'casting_director') router.push('/casting')
    else router.push('/talent-portal')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#06080f]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c9a84c]/4 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Landi-Lou Talent Agency"
              width={80}
              height={80}
              className="mx-auto mb-4 rounded-full ring-1 ring-[#c9a84c]/30"
            />
          </Link>
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase">Portal Login</p>
        </div>

        <div className="glass-card rounded-xl p-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-[#7a869a] text-sm text-center mb-8">
            Sign in to your talent, casting, or admin portal.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-[#7a869a] text-xs tracking-widest uppercase mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#7a869a] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-[#7a869a] text-xs tracking-widest uppercase mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#7a869a] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-[#7a869a] text-xs text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/submit" className="text-[#c9a84c] hover:text-[#e8c97a] transition-colors">
              Submit your talent profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
