import { createAdminClient } from '@/lib/supabase/admin'
import OnboardingFlow from './OnboardingFlow'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Talent Onboarding | Landi-Lou Talent Agency',
  robots: { index: false, follow: false },
}

interface Portfolio {
  id: string
  token: string
  status: string
  current_step: number
  token_expires_at: string
  legal_name: string | null
  talent_submissions: {
    first_name: string
    last_name: string
    email: string
    phone: string | null
    dob: string | null
    city: string | null
    state: string | null
    is_minor: boolean
    guardian_name: string | null
    guardian_relationship: string | null
  } | null
  [key: string]: unknown
}

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('talent_onboarding_portfolios')
    .select(
      '*, talent_submissions(first_name, last_name, email, phone, dob, city, state, is_minor, guardian_name, guardian_relationship)'
    )
    .eq('token', token)
    .single()

  // Not found
  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#06080f] flex items-center justify-center px-4">
        <div className="glass-card rounded-2xl p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-6">🔒</div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-4">
            Link Not Found
          </h1>
          <p className="text-[#9ba9bb] leading-relaxed">
            This onboarding link is invalid or does not exist. Please contact us at{' '}
            <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] hover:underline">
              info@landiloutalentagency.com
            </a>{' '}
            if you believe this is an error.
          </p>
        </div>
      </main>
    )
  }

  const portfolio = data as Portfolio

  // Expired
  if (portfolio.token_expires_at && new Date(portfolio.token_expires_at) < new Date()) {
    return (
      <main className="min-h-screen bg-[#06080f] flex items-center justify-center px-4">
        <div className="glass-card rounded-2xl p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-6">⏰</div>
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-4">
            Link Expired
          </h1>
          <p className="text-[#9ba9bb] leading-relaxed">
            Your onboarding link has expired. Please contact{' '}
            <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] hover:underline">
              info@landiloutalentagency.com
            </a>{' '}
            to request a new link.
          </p>
        </div>
      </main>
    )
  }

  // Completed
  if (portfolio.status === 'completed') {
    const submission = portfolio.talent_submissions
    const name = submission
      ? `${submission.first_name} ${submission.last_name}`
      : (portfolio.legal_name ?? 'Talent')
    return (
      <main className="min-h-screen bg-[#06080f] flex items-center justify-center px-4">
        <div className="glass-card rounded-2xl p-10 max-w-lg w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#f0ead8] mb-4">
            Portfolio Complete
          </h1>
          <p className="text-[#9ba9bb] leading-relaxed mb-6">
            Thank you, <strong className="text-[#f0ead8]">{name}</strong>. Your onboarding portfolio has
            been received. The Landi-Lou team will review your portfolio, countersign your agreement,
            and send you a confirmation email once representation is fully active.
          </p>
          <div className="bg-[#0d1120] rounded-lg p-4 text-left text-sm text-[#9ba9bb]">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-3">What was submitted</p>
            <ul className="space-y-1">
              <li>✓ Personal Information</li>
              <li>✓ Casting Profile &amp; Measurements</li>
              <li>✓ Skills &amp; Career Goals</li>
              <li>✓ Representation Agreement</li>
              <li>✓ Agency Standards Agreement</li>
              <li>✓ Commission &amp; Payment Policy</li>
              <li>✓ W-9 Tax Information</li>
              <li>✓ Final Acknowledgement &amp; Signature</li>
            </ul>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#06080f]">
      <OnboardingFlow portfolio={portfolio} token={token} />
    </main>
  )
}
