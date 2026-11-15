'use client'

import { useState } from 'react'

interface Props {
  talentId: string
  hasOnboarding: boolean
  onboardingCompleted: boolean
}

type ActionState = 'idle' | 'loading' | 'success' | 'error'

export default function AdminRecoveryActions({ talentId, hasOnboarding, onboardingCompleted }: Props) {
  const [portalState, setPortalState] = useState<ActionState>('idle')
  const [portalMsg, setPortalMsg] = useState('')
  const [onboardingState, setOnboardingState] = useState<ActionState>('idle')
  const [onboardingMsg, setOnboardingMsg] = useState('')

  async function resendPortal() {
    setPortalState('loading')
    setPortalMsg('')
    try {
      const res = await fetch(`/api/admin/talent/${talentId}/resend-portal`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) {
        setPortalState('error')
        setPortalMsg(json.error ?? 'Unknown error')
      } else {
        setPortalState('success')
        setPortalMsg('Portal access email sent.')
      }
    } catch {
      setPortalState('error')
      setPortalMsg('Network error — could not send.')
    }
  }

  async function extendOnboarding() {
    setOnboardingState('loading')
    setOnboardingMsg('')
    try {
      const res = await fetch(`/api/admin/talent/${talentId}/extend-onboarding`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) {
        setOnboardingState('error')
        setOnboardingMsg(json.error ?? 'Unknown error')
      } else {
        setOnboardingState('success')
        setOnboardingMsg('New onboarding link sent. Valid 30 days.')
      }
    } catch {
      setOnboardingState('error')
      setOnboardingMsg('Network error — could not extend.')
    }
  }

  return (
    <div className="glass-card rounded-xl p-6 border border-[rgba(201,168,76,0.15)]">
      <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Recovery Actions</p>
      <div className="flex flex-col gap-4">

        {/* Resend Portal Access */}
        <div>
          <button
            onClick={resendPortal}
            disabled={portalState === 'loading'}
            className="w-full py-2.5 px-4 text-sm font-semibold rounded border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 disabled:opacity-50 transition-all text-left"
          >
            {portalState === 'loading' ? 'Sending...' : 'Resend Portal Access'}
          </button>
          {portalMsg && (
            <p className={`text-xs mt-1.5 ${portalState === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {portalState === 'error' ? 'Failed: ' : ''}{portalMsg}
            </p>
          )}
          <p className="text-[#9ba9bb] text-xs mt-1">
            Sends a fresh portal access link to the talent&apos;s email address.
          </p>
        </div>

        {/* Extend Onboarding Link */}
        <div>
          <button
            onClick={extendOnboarding}
            disabled={onboardingState === 'loading' || !hasOnboarding || onboardingCompleted}
            className="w-full py-2.5 px-4 text-sm font-semibold rounded border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-left"
          >
            {onboardingState === 'loading' ? 'Extending...' : 'Extend Onboarding Link'}
          </button>
          {onboardingMsg && (
            <p className={`text-xs mt-1.5 ${onboardingState === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {onboardingState === 'error' ? 'Failed: ' : ''}{onboardingMsg}
            </p>
          )}
          <p className="text-[#9ba9bb] text-xs mt-1">
            {!hasOnboarding
              ? 'No onboarding portfolio found for this talent.'
              : onboardingCompleted
              ? 'Portfolio already completed — no extension needed.'
              : 'Issues a fresh 30-day onboarding token and emails the new link.'}
          </p>
        </div>

      </div>
    </div>
  )
}
