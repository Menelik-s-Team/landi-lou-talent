import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { FileText, CheckCircle2, Clock, AlertCircle, ExternalLink, Shield } from 'lucide-react'

export const metadata = { title: 'My Documents | Landi-Lou' }

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminClient = createAdminClient()

  const { data: profile } = await adminClient
    .from('talent_profiles')
    .select('id, submission_id, first_name')
    .eq('user_id', user.id)
    .single()

  const { data: portfolio } = profile?.submission_id
    ? await adminClient
        .from('talent_onboarding_portfolios')
        .select('id, status, current_step, completed_at, agency_accepted, agency_signature_data, talent_signature_data, token, token_expires_at')
        .eq('submission_id', profile.submission_id)
        .single()
    : { data: null }

  const siteUrl = 'https://landiloutalentagency.com'
  const onboardingLink = portfolio ? `${siteUrl}/onboarding/${portfolio.token}` : null
  const tokenExpired = portfolio?.token_expires_at ? new Date(portfolio.token_expires_at) < new Date() : false

  const steps = [
    { num: 1,  label: 'Personal Information' },
    { num: 2,  label: 'Casting Profile' },
    { num: 3,  label: 'Physical Stats' },
    { num: 4,  label: 'Skills & Performance' },
    { num: 5,  label: 'Wardrobe & Sizing' },
    { num: 6,  label: 'Experience & Credits' },
    { num: 7,  label: 'Availability & Travel' },
    { num: 8,  label: 'Social Media & Brand' },
    { num: 9,  label: 'Emergency Contact' },
    { num: 10, label: 'W-9 Tax Form' },
    { num: 11, label: 'Representation Agreement' },
    { num: 12, label: 'Talent Signature' },
    { num: 13, label: 'Guardian Signature (if minor)' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Talent Portal</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">My Documents</h1>
        <p className="text-[#9ba9bb] text-sm mt-1">Onboarding portfolio &amp; representation agreement</p>
      </div>

      {!portfolio ? (
        <div className="glass-card rounded-xl p-8 flex flex-col items-center text-center gap-4">
          <AlertCircle size={32} className="text-[#c9a84c] opacity-60" />
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#f0ead8] mb-2">No Documents Found</h2>
            <p className="text-[#9ba9bb] text-sm max-w-sm">
              Your onboarding portfolio hasn&apos;t been created yet. Contact your agency at{' '}
              <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] hover:underline">
                info@landiloutalentagency.com
              </a>.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Status banner */}
          <div className={`glass-card rounded-xl p-6 border ${
            portfolio.agency_accepted
              ? 'border-green-500/30'
              : portfolio.status === 'completed'
              ? 'border-[#c9a84c]/30'
              : 'border-[rgba(201,168,76,0.15)]'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                portfolio.agency_accepted ? 'bg-green-500/20' : portfolio.status === 'completed' ? 'bg-[#c9a84c]/20' : 'bg-[#141929]'
              }`}>
                {portfolio.agency_accepted
                  ? <CheckCircle2 size={20} className="text-green-400" />
                  : portfolio.status === 'completed'
                  ? <Clock size={20} className="text-[#c9a84c]" />
                  : <FileText size={20} className="text-[#9ba9bb]" />}
              </div>
              <div className="flex-1">
                <h2 className="text-[#f0ead8] font-semibold mb-1">
                  {portfolio.agency_accepted
                    ? 'Representation Agreement Active'
                    : portfolio.status === 'completed'
                    ? 'Portfolio Submitted — Pending Agency Review'
                    : portfolio.status === 'in_progress'
                    ? `Onboarding In Progress (Step ${portfolio.current_step} of 13)`
                    : 'Onboarding Portfolio Pending'}
                </h2>
                <p className="text-[#9ba9bb] text-sm leading-relaxed">
                  {portfolio.agency_accepted
                    ? `Your representation agreement is fully executed and on file. You are officially represented by Landi-Lou Talent Agency. Completed ${portfolio.completed_at ? new Date(portfolio.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}.`
                    : portfolio.status === 'completed'
                    ? 'Your portfolio has been submitted. The agency is reviewing your agreement and will countersign shortly. You\'ll receive an email once it\'s complete.'
                    : 'Complete your onboarding portfolio to activate your representation. This includes your W-9 tax form and representation agreement.'}
                </p>
              </div>
            </div>

            {portfolio.status !== 'completed' && onboardingLink && !tokenExpired && (
              <a
                href={onboardingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded-lg text-sm hover:bg-[#e8c97a] transition-all"
              >
                <FileText size={15} /> Continue Onboarding Portfolio
              </a>
            )}
            {tokenExpired && portfolio.status !== 'completed' && (
              <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={14} />
                <span>Your onboarding link has expired. Contact your agency to get a new one.</span>
              </div>
            )}
          </div>

          {/* Progress tracker */}
          <div className="glass-card rounded-xl p-6">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-5">Onboarding Progress</p>
            <div className="flex flex-col gap-2">
              {steps.map(step => {
                const done = portfolio.status === 'completed' || (portfolio.current_step ?? 0) > step.num
                const active = (portfolio.current_step ?? 0) === step.num && portfolio.status !== 'completed'
                return (
                  <div key={step.num} className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${active ? 'bg-[#c9a84c]/5' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      done
                        ? 'bg-green-500/20 text-green-400'
                        : active
                        ? 'bg-[#c9a84c] text-[#06080f]'
                        : 'bg-[#141929] text-[#9ba9bb]'
                    }`}>
                      {done ? '✓' : step.num}
                    </div>
                    <span className={`text-sm ${done ? 'text-[#9ba9bb] line-through' : active ? 'text-[#f0ead8] font-medium' : 'text-[#9ba9bb]'}`}>
                      {step.label}
                    </span>
                    {active && <span className="ml-auto text-[#c9a84c] text-xs">In Progress</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Signatures */}
          {(portfolio.talent_signature_data || portfolio.agency_signature_data) && (
            <div className="glass-card rounded-xl p-6">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Signatures on File</p>
              <div className="flex flex-col gap-3">
                {portfolio.talent_signature_data && (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                    <span className="text-[#f0ead8] text-sm">Talent signature captured</span>
                  </div>
                )}
                {portfolio.agency_signature_data ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                    <span className="text-[#f0ead8] text-sm">Agency countersignature complete</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-[#c9a84c] shrink-0" />
                    <span className="text-[#9ba9bb] text-sm">Agency countersignature pending</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security note */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[#141929] border border-[rgba(201,168,76,0.1)]">
            <Shield size={14} className="text-[#9ba9bb] mt-0.5 shrink-0" />
            <p className="text-[#9ba9bb] text-xs leading-relaxed">
              Your documents are stored securely. Your W-9 information is encrypted and only accessible by authorized agency staff.
              Questions? Email <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] hover:underline">info@landiloutalentagency.com</a>.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
