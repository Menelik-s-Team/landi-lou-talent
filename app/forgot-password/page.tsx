'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Server route handles link generation and branded Resend email.
    // Always returns neutral response — never reveals whether account exists.
    await fetch('/api/auth/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    })
    setSubmitted(true)
    setLoading(false)
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
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase">Portal Access</p>
        </div>

        <div className="glass-card rounded-xl p-8">
          {submitted ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-[#c9a84c]/10 flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">
                Check Your Email
              </h1>
              <p className="text-[#9ba9bb] text-sm leading-relaxed mb-6">
                If an account exists for that email address, you will receive a password reset link
                shortly. The link expires in 1 hour — use it promptly.
              </p>
              <Link href="/login" className="text-[#c9a84c] text-sm hover:text-[#e8c97a] transition-colors">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-2 text-center">
                Forgot Password
              </h1>
              <p className="text-[#9ba9bb] text-sm text-center mb-8">
                Enter the email address on your talent account. We&apos;ll send you a secure link to set a new password.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="email" className="block text-[#9ba9bb] text-xs tracking-widest uppercase mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#9ba9bb] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-[#9ba9bb] text-xs text-center mt-6">
                <Link href="/login" className="text-[#c9a84c] hover:text-[#e8c97a] transition-colors">
                  Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
