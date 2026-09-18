'use client'
import { useState, useCallback } from 'react'
import SignaturePad from '@/components/SignaturePad'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Submission {
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
}

interface Portfolio {
  id: string
  token: string
  status: string
  current_step: number
  legal_name: string | null
  talent_submissions: Submission | null
  [key: string]: unknown
}

interface Props {
  portfolio: Portfolio
  token: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 9

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-[#9ba9bb] mb-2">
        <span>Step {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-[#141929] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#c9a84c] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function StepCard({ children, title, subtitle }: {
  children: React.ReactNode
  title?: string
  subtitle?: string
}) {
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8">
      {title && (
        <div className="mb-6">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[#f0ead8] mb-1">
            {title}
          </h2>
          {subtitle && <p className="text-[#9ba9bb] text-sm">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#9ba9bb] text-xs tracking-widest uppercase">
        {label} {required && <span className="text-[#c9a84c]">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-3 text-[#f0ead8] text-sm placeholder-[#9ba9bb]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-colors'

const checkboxCls = 'w-4 h-4 accent-[#c9a84c] flex-shrink-0 mt-0.5'

function LegalSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0d1120] border-l-4 border-[#c9a84c]/50 rounded-r-lg p-5 text-[#f0ead8] text-sm leading-relaxed font-serif space-y-3 max-h-72 overflow-y-auto">
      {children}
    </div>
  )
}

function NavButtons({
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  loading = false,
}: {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
  loading?: boolean
}) {
  return (
    <div className="flex gap-3 pt-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 border border-[rgba(201,168,76,0.3)] text-[#c9a84c] rounded-lg text-sm font-semibold hover:bg-[#c9a84c]/10 transition-all"
        >
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || loading}
        className="flex-1 py-3 bg-[#c9a84c] text-[#06080f] rounded-lg text-sm font-bold hover:bg-[#e8c97a] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : nextLabel}
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function OnboardingFlow({ portfolio, token }: Props) {
  const submission = portfolio.talent_submissions
  const isMinor = submission?.is_minor ?? false
  const talentName = submission
    ? `${submission.first_name} ${submission.last_name}`
    : (portfolio.legal_name ?? '')

  const [step, setStep] = useState(Math.max(1, Math.min(portfolio.current_step ?? 1, TOTAL_STEPS)))
  const [saving, setSaving] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ─── Form Data State ───────────────────────────────────────────────────────

  // Step 2: Personal Info
  const [legalName, setLegalName] = useState((portfolio.legal_name ?? talentName) as string)
  const [stageName, setStageName] = useState((portfolio.stage_name ?? '') as string)
  const [preferredName, setPreferredName] = useState((portfolio.preferred_name ?? '') as string)
  const [pronouns, setPronouns] = useState((portfolio.pronouns ?? '') as string)
  const [streetAddress, setStreetAddress] = useState((portfolio.street_address ?? '') as string)
  const [zipCode, setZipCode] = useState((portfolio.zip_code ?? '') as string)
  const [emergencyName, setEmergencyName] = useState((portfolio.emergency_contact_name ?? '') as string)
  const [emergencyRel, setEmergencyRel] = useState((portfolio.emergency_contact_relationship ?? '') as string)
  const [emergencyPhone, setEmergencyPhone] = useState((portfolio.emergency_contact_phone ?? '') as string)

  // Step 3: Professional Goals
  const [careerGoals, setCareerGoals] = useState((portfolio.career_goals ?? '') as string)

  // Step 4: Representation Agreement
  const [repInitials, setRepInitials] = useState((portfolio.representation_initials ?? null) as string | null)

  // Step 5: Standards
  const [standardsInitials, setStandardsInitials] = useState((portfolio.standards_initials ?? null) as string | null)

  // Step 6: Commission
  const [commissionAcknowledged, setCommissionAcknowledged] = useState((portfolio.commission_acknowledged ?? false) as boolean)
  const [commissionAgreed, setCommissionAgreed] = useState((portfolio.commission_agreed ?? false) as boolean)

  // Step 7: Tiers
  const [tiersUnderstood, setTiersUnderstood] = useState(false)

  // Step 8: Privacy
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState((portfolio.privacy_acknowledged ?? false) as boolean)

  // Step 9: Final
  const [finalAck1, setFinalAck1] = useState((portfolio.final_ack_info_accurate ?? false) as boolean)
  const [finalAck2, setFinalAck2] = useState((portfolio.final_ack_read_agreement ?? false) as boolean)
  const [finalAck3, setFinalAck3] = useState((portfolio.final_ack_read_standards ?? false) as boolean)
  const [finalAck4, setFinalAck4] = useState((portfolio.final_ack_no_guarantee ?? false) as boolean)
  const [finalAck5, setFinalAck5] = useState((portfolio.final_ack_responsibility ?? false) as boolean)
  const [finalAck6, setFinalAck6] = useState((portfolio.final_ack_authorize ?? false) as boolean)
  const [talentPrintedName, setTalentPrintedName] = useState((portfolio.talent_printed_name ?? '') as string)
  const [talentSignature, setTalentSignature] = useState((portfolio.talent_signature_data ?? null) as string | null)
  const [guardianPrintedName, setGuardianPrintedName] = useState((portfolio.guardian_printed_name ?? '') as string)
  const [guardianSignature, setGuardianSignature] = useState((portfolio.guardian_signature_data ?? null) as string | null)
  const [guardianRelationship, setGuardianRelationship] = useState(
    ((portfolio.guardian_relationship ?? submission?.guardian_relationship) ?? '') as string
  )

  // ─── Save / Navigate ───────────────────────────────────────────────────────

  const saveStep = useCallback(async (stepNum: number, data: Record<string, unknown>) => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/onboarding/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: stepNum, data }),
      })
      if (!res.ok) {
        const j = await res.json()
        setError(j.error ?? 'Save failed. Please try again.')
        return false
      }
      return true
    } catch {
      setError('Network error. Please check your connection and try again.')
      return false
    } finally {
      setSaving(false)
    }
  }, [token])

  // ─── Step Renderers ────────────────────────────────────────────────────────

  const renderStep1 = () => (
    <StepCard>
      <div className="text-center py-4">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-3">Landi-Lou Talent Agency</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#f0ead8] mb-6">
          Welcome, {submission?.first_name ?? 'Talent'}
        </h1>
        <div className="max-w-lg mx-auto text-left space-y-4 text-[#f0ead8] text-sm leading-relaxed mb-8">
          <p>
            Thank you for your interest in joining the Landi-Lou Talent Agency family. We are excited
            to guide you through your digital onboarding portfolio — the first step toward activating
            your representation.
          </p>
          <p>
            This portfolio will collect your personal information, professional goals, and signed
            agreements in one secure, electronic process.
          </p>
          <div className="bg-[#0d1120] border border-[rgba(201,168,76,0.2)] rounded-lg p-4">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-3">Before you begin</p>
            <ul className="space-y-2 text-[#9ba9bb]">
              <li>• This process takes approximately 10&ndash;15 minutes</li>
              <li>• Your progress is saved automatically after each step</li>
              <li>• You will sign several agreements electronically</li>
              {isMinor && <li>• A parent or guardian signature is required (minor)</li>}
            </ul>
          </div>
          <p className="text-[#9ba9bb] text-xs">
            By completing this portfolio, you are formally initiating your representation agreement
            with Landi-Lou Talent Agency.
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            const ok = await saveStep(1, {})
            if (ok) setStep(2)
          }}
          disabled={saving}
          className="px-10 py-4 bg-[#c9a84c] text-[#06080f] rounded-lg font-bold text-base hover:bg-[#e8c97a] transition-all disabled:opacity-40"
        >
          {saving ? 'Loading...' : 'Begin Portfolio'}
        </button>
      </div>
    </StepCard>
  )

  const renderStep2 = () => (
    <StepCard title="Personal Information" subtitle="Please complete all required fields">
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Legal Name" required>
          <input className={inputCls} value={legalName} onChange={e => setLegalName(e.target.value)} placeholder="First Middle Last" />
        </Field>
        <Field label="Stage Name">
          <input className={inputCls} value={stageName} onChange={e => setStageName(e.target.value)} placeholder="If different from legal name" />
        </Field>
        <Field label="Preferred Name">
          <input className={inputCls} value={preferredName} onChange={e => setPreferredName(e.target.value)} placeholder="What you like to be called" />
        </Field>
        <Field label="Pronouns">
          <input className={inputCls} value={pronouns} onChange={e => setPronouns(e.target.value)} placeholder="e.g. she/her, he/him, they/them" />
        </Field>
        <Field label="Date of Birth">
          <input className={`${inputCls} opacity-60`} value={submission?.dob ?? ''} readOnly />
        </Field>
        <Field label="Email">
          <input className={`${inputCls} opacity-60`} value={submission?.email ?? ''} readOnly />
        </Field>
        <Field label="Phone">
          <input className={`${inputCls} opacity-60`} value={submission?.phone ?? ''} readOnly />
        </Field>
        <Field label="City, State">
          <input className={`${inputCls} opacity-60`} value={`${submission?.city ?? ''}, ${submission?.state ?? ''}`} readOnly />
        </Field>
        <Field label="Street Address" required>
          <input className={inputCls} value={streetAddress} onChange={e => setStreetAddress(e.target.value)} placeholder="123 Main St" />
        </Field>
        <Field label="ZIP Code" required>
          <input className={inputCls} value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="32801" />
        </Field>
      </div>

      <div className="mt-6">
        <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Emergency Contact</p>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Name" required>
            <input className={inputCls} value={emergencyName} onChange={e => setEmergencyName(e.target.value)} placeholder="Full name" />
          </Field>
          <Field label="Relationship" required>
            <input className={inputCls} value={emergencyRel} onChange={e => setEmergencyRel(e.target.value)} placeholder="e.g. Mother, Spouse" />
          </Field>
          <Field label="Phone" required>
            <input className={inputCls} value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="(555) 000-0000" />
          </Field>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      <NavButtons
        onBack={() => setStep(1)}
        onNext={async () => {
          if (!legalName || !streetAddress || !zipCode || !emergencyName || !emergencyRel || !emergencyPhone) {
            setError('Please fill in all required fields.')
            return
          }
          const ok = await saveStep(2, {
            legal_name: legalName,
            stage_name: stageName,
            preferred_name: preferredName,
            pronouns,
            street_address: streetAddress,
            zip_code: zipCode,
            emergency_contact_name: emergencyName,
            emergency_contact_relationship: emergencyRel,
            emergency_contact_phone: emergencyPhone,
          })
          if (ok) setStep(3)
        }}
        loading={saving}
      />
    </StepCard>
  )

  const renderStep3 = () => (
    <StepCard title="Professional Goals" subtitle="Tell us where you want your career to go">
      <div className="space-y-4">
        <p className="text-[#9ba9bb] text-sm leading-relaxed">
          Your goals help us know where to start your representation and which opportunities to prioritize for you.
          Be as specific or as broad as you like.
        </p>
        <Field label="Career Goals">
          <textarea
            className={`${inputCls} resize-none`}
            rows={6}
            value={careerGoals}
            onChange={e => setCareerGoals(e.target.value)}
            placeholder="Describe your short and long-term career goals in the industry — the types of roles, brands, or projects you want to be part of..."
          />
        </Field>
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      <NavButtons
        onBack={() => setStep(2)}
        onNext={async () => {
          const ok = await saveStep(3, { career_goals: careerGoals })
          if (ok) setStep(4)
        }}
        loading={saving}
      />
    </StepCard>
  )

  const renderStep4 = () => (
    <StepCard title="Representation Agreement" subtitle="Read the full agreement below, then initial at the bottom">
      <LegalSection>
        <p className="font-bold">LANDI-LOU TALENT AGENCY — REPRESENTATION AGREEMENT</p>
        <p>This Representation Agreement (&ldquo;Agreement&rdquo;) is entered into between Landi-Lou Talent Agency (&ldquo;Agency&rdquo;) and the talent signing below (&ldquo;Talent&rdquo;).</p>
        <p><strong>1. REPRESENTATION.</strong> Talent hereby grants Agency the exclusive right to represent, promote, and negotiate on behalf of Talent in the entertainment and modeling industries, including but not limited to film, television, theatre, commercials, print, digital media, voiceover, hosting, and brand partnerships.</p>
        <p><strong>2. TERM.</strong> This Agreement shall commence upon execution and continue for a period of one (1) year, automatically renewing annually unless either party provides written notice of termination at least thirty (30) days prior to renewal.</p>
        <p><strong>3. AGENCY AUTHORITY.</strong> Agency is authorized to negotiate, accept, and execute contracts on behalf of Talent, subject to Talent&apos;s approval of material terms. Agency shall act in good faith to secure opportunities consistent with Talent&apos;s goals and professional image.</p>
        <p><strong>4. TALENT OBLIGATIONS.</strong> Talent agrees to: (a) maintain professional conduct at all times; (b) notify Agency of any direct inquiries from industry professionals; (c) keep Agency informed of availability, contact information, and physical changes; (d) fulfill all bookings and commitments secured through Agency.</p>
        <p><strong>5. EXCLUSIVITY.</strong> During the term of this Agreement, Talent agrees not to engage any other talent agency or manager without prior written consent from Agency. Talent may not negotiate directly with clients introduced by Agency.</p>
        <p><strong>6. COMMISSIONS.</strong> Agency shall receive commissions as outlined in the Commission Structure section of this portfolio. Commissions are due within thirty (30) days of Talent receiving payment for a booking.</p>
        <p><strong>7. EXPENSES.</strong> Talent is responsible for all personal expenses related to their career development, including but not limited to: headshots, wardrobe, coaching, transportation, and composite cards unless otherwise agreed in writing.</p>
        <p><strong>8. TERMINATION.</strong> Either party may terminate this Agreement with thirty (30) days written notice. Upon termination, Agency shall continue to receive commissions on bookings secured prior to termination for the duration of those engagements.</p>
        <p><strong>9. GOVERNING LAW.</strong> This Agreement shall be governed by the laws of the State of Florida. Any disputes shall be resolved through mediation or binding arbitration in Orange County, Florida.</p>
        <p><strong>10. ENTIRE AGREEMENT.</strong> This Agreement, together with the Agency Standards & Professional Expectations and Commission Structure documents, constitutes the entire agreement between the parties and supersedes all prior agreements.</p>
      </LegalSection>

      <div className="mt-6 space-y-4">
        <SignaturePad
          onChange={setRepInitials}
          label="Initials — I have read and understand this Representation Agreement"
          placeholder="Initial here"
          height={120}
        />
        <p className="text-[#9ba9bb] text-xs">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      <NavButtons
        onBack={() => setStep(3)}
        nextDisabled={!repInitials}
        onNext={async () => {
          if (!repInitials) { setError('Please provide your initials to continue.'); return }
          const ok = await saveStep(4, {
            representation_initials: repInitials,
            representation_signed_at: new Date().toISOString(),
          })
          if (ok) setStep(5)
        }}
        loading={saving}
      />
    </StepCard>
  )

  const renderStep5 = () => (
    <StepCard title="Agency Standards & Professional Expectations" subtitle="Read the full standards document below, then initial">
      <LegalSection>
        <p className="font-bold">LANDI-LOU TALENT AGENCY — AGENCY STANDARDS & PROFESSIONAL EXPECTATIONS</p>
        <p>All talent represented by Landi-Lou Talent Agency are expected to adhere to the following standards of professional conduct:</p>
        <p><strong>PROFESSIONALISM.</strong> Talent shall conduct themselves with the highest level of professionalism at all times — on set, at auditions, during meetings, and in public. You are an ambassador of the Agency.</p>
        <p><strong>PUNCTUALITY.</strong> Talent must arrive on time or early for all auditions, bookings, and agency meetings. Repeated tardiness may result in termination of representation.</p>
        <p><strong>COMMUNICATION.</strong> Talent must respond to Agency communications within 24 hours. All direct booking inquiries from industry professionals must be immediately referred to the Agency.</p>
        <p><strong>APPEARANCE & MAINTENANCE.</strong> Talent is expected to maintain their physical appearance consistent with their submitted materials. Any significant changes (weight, hair color, piercings, tattoos) must be reported to the Agency immediately so materials can be updated.</p>
        <p><strong>SOCIAL MEDIA.</strong> Talent shall not post content that could be deemed offensive, controversial, or damaging to the Agency&apos;s reputation or the talent&apos;s professional image. Talent is encouraged to maintain an active, positive presence across social platforms.</p>
        <p><strong>CONFLICTS OF INTEREST.</strong> Talent shall disclose any potential conflicts of interest, including competing brand relationships, prior agency agreements, or personal connections to clients, promptly and fully to the Agency.</p>
        <p><strong>CONDUCT ON SET.</strong> Talent shall follow all directions of the director, photographer, and production team. Talent shall not engage in behavior that creates a hostile environment for crew or other talent.</p>
        <p><strong>SUBSTANCE & SAFETY.</strong> Talent shall not report to any booking under the influence of alcohol or controlled substances. Talent reserves the right to decline assignments that compromise personal safety or ethical standards.</p>
        <p><strong>FINANCIAL OBLIGATIONS.</strong> Talent shall honor all commission obligations and notify the Agency of all income related to bookings secured through the Agency.</p>
        <p><strong>CONSEQUENCE OF NON-COMPLIANCE.</strong> Failure to meet these standards may result in a formal warning, suspension, or termination of representation at the Agency&apos;s discretion.</p>
      </LegalSection>

      <div className="mt-6 space-y-4">
        <SignaturePad
          onChange={setStandardsInitials}
          label="Initials — I have read and understand the Agency Standards & Professional Expectations"
          placeholder="Initial here"
          height={120}
        />
        <p className="text-[#9ba9bb] text-xs">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      <NavButtons
        onBack={() => setStep(4)}
        nextDisabled={!standardsInitials}
        onNext={async () => {
          if (!standardsInitials) { setError('Please provide your initials to continue.'); return }
          const ok = await saveStep(5, {
            standards_initials: standardsInitials,
            standards_signed_at: new Date().toISOString(),
          })
          if (ok) setStep(6)
        }}
        loading={saving}
      />
    </StepCard>
  )

  const renderStep6 = () => (
    <StepCard title="Commission Structure" subtitle="Review the commission rates and confirm understanding">
      <LegalSection>
        <p className="font-bold">LANDI-LOU TALENT AGENCY — COMMISSION STRUCTURE</p>
        <p>The following commission rates apply to all bookings secured through Landi-Lou Talent Agency:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', color: '#c9a84c', padding: '8px 0', borderBottom: '1px solid rgba(201,168,76,0.3)' }}>Category</th>
              <th style={{ textAlign: 'right', color: '#c9a84c', padding: '8px 0', borderBottom: '1px solid rgba(201,168,76,0.3)' }}>Commission Rate</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Film & Television', '15%'],
              ['Commercial (National)', '15%'],
              ['Commercial (Regional/Local)', '15%'],
              ['Print Modeling', '15%'],
              ['Digital / Social Media', '15%'],
              ['Theatre / Live Performance', '15%'],
              ['Voiceover', '15%'],
              ['Brand Partnerships', '20%'],
              ['Personal Appearances', '15%'],
            ].map(([cat, rate]) => (
              <tr key={cat}>
                <td style={{ padding: '8px 0', borderBottom: '1px solid rgba(201,168,76,0.1)', color: '#f0ead8' }}>{cat}</td>
                <td style={{ padding: '8px 0', borderBottom: '1px solid rgba(201,168,76,0.1)', color: '#f0ead8', textAlign: 'right' }}>{rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4"><strong>Payment Terms:</strong> Commissions are due within thirty (30) days of Talent receiving payment for any booking.</p>
        <p><strong>Direct Payments:</strong> All payments from clients must flow through the Agency or be reported to the Agency immediately. Direct payments received by Talent from Agency clients are still subject to commission.</p>
        <p><strong>Expense Deductions:</strong> Any Agency-approved expenses advanced on Talent&apos;s behalf will be deducted from booking payments before commission is calculated.</p>
      </LegalSection>

      <div className="mt-6 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.3)] transition-colors">
          <input
            type="checkbox"
            checked={commissionAcknowledged}
            onChange={e => setCommissionAcknowledged(e.target.checked)}
            className={checkboxCls}
          />
          <span className="text-[#f0ead8] text-sm">I have read and understand the commission structure</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.3)] transition-colors">
          <input
            type="checkbox"
            checked={commissionAgreed}
            onChange={e => setCommissionAgreed(e.target.checked)}
            className={checkboxCls}
          />
          <span className="text-[#f0ead8] text-sm">I agree to the commission terms as a condition of representation</span>
        </label>
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      <NavButtons
        onBack={() => setStep(5)}
        nextDisabled={!commissionAcknowledged || !commissionAgreed}
        onNext={async () => {
          if (!commissionAcknowledged || !commissionAgreed) { setError('Please check both boxes to continue.'); return }
          const ok = await saveStep(6, {
            commission_acknowledged: commissionAcknowledged,
            commission_agreed: commissionAgreed,
            commission_signed_at: new Date().toISOString(),
          })
          if (ok) setStep(7)
        }}
        loading={saving}
      />
    </StepCard>
  )

  const renderStep7 = () => (
    <StepCard title="Talent Development Tiers" subtitle="Understanding your place in our representation structure">
      <LegalSection>
        <p className="font-bold">LANDI-LOU TALENT AGENCY — TALENT DEVELOPMENT TIER SYSTEM</p>
        <p>Landi-Lou Talent Agency places all represented talent into one of three tiers based on experience, professional materials, training, and market readiness. Tier placement determines the level of Agency resources dedicated to actively marketing you.</p>

        <div className="mt-2 space-y-4">
          <div className="border-l-2 border-[#c9a84c] pl-4">
            <p className="font-bold text-[#c9a84c]">TIER 1 — EMERGING TALENT</p>
            <p>New to the industry or early in your career. Agency will assist with foundational development including guidance on headshots, training, and first bookings. Submission frequency: As opportunities arise.</p>
          </div>
          <div className="border-l-2 border-[#c9a84c] pl-4">
            <p className="font-bold text-[#c9a84c]">TIER 2 — DEVELOPING TALENT</p>
            <p>Some professional experience with solid materials. Agency actively submits for applicable projects and auditions. Regular communication regarding opportunities. Submission frequency: Weekly to bi-weekly.</p>
          </div>
          <div className="border-l-2 border-[#c9a84c] pl-4">
            <p className="font-bold text-[#c9a84c]">TIER 3 — PREMIER TALENT</p>
            <p>Established professional with strong credits, exceptional materials, and market demand. Agency prioritizes Premier talent for high-value bookings and brand partnerships. Submission frequency: Ongoing/daily as applicable.</p>
          </div>
        </div>

        <p className="mt-4"><strong>TIER MOVEMENT:</strong> Talent may advance tiers based on bookings secured, training completed, and professional growth. Reviews occur every six months.</p>
        <p><strong>NOTE:</strong> Your placement will be determined by the Agency Director after reviewing your completed portfolio. Tier placement does not affect commission rates.</p>
      </LegalSection>

      <div className="mt-6">
        <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.3)] transition-colors">
          <input
            type="checkbox"
            checked={tiersUnderstood}
            onChange={e => setTiersUnderstood(e.target.checked)}
            className={checkboxCls}
          />
          <span className="text-[#f0ead8] text-sm">
            I understand the Landi-Lou Talent Agency Talent Development Tier system and accept that my tier placement will be determined by the Agency.
          </span>
        </label>
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      <NavButtons
        onBack={() => setStep(6)}
        nextDisabled={!tiersUnderstood}
        onNext={async () => {
          const ok = await saveStep(7, {})
          if (ok) setStep(8)
        }}
        loading={saving}
      />
    </StepCard>
  )

  const renderStep8 = () => (
    <StepCard title="Privacy Commitment" subtitle="How we handle and protect your personal information">
      <LegalSection>
        <p className="font-bold">LANDI-LOU TALENT AGENCY — PRIVACY COMMITMENT</p>
        <p>Landi-Lou Talent Agency is committed to protecting your personal information. This Privacy Commitment describes how we collect, use, and safeguard your data.</p>
        <p><strong>INFORMATION COLLECTED.</strong> We collect information you provide during the onboarding process including personal identification, contact information, and any financial or tax information collected separately by agency accounting. This information is necessary to represent you professionally and fulfill our legal obligations.</p>
        <p><strong>HOW WE USE YOUR INFORMATION.</strong> Your information is used to: submit you for auditions and bookings; communicate with industry professionals on your behalf; process and record payments; comply with IRS reporting requirements; maintain your talent profile.</p>
        <p><strong>WHO WE SHARE WITH.</strong> We share only the information necessary for specific submissions — typically your professional materials (headshots, resume, reel) and applicable stats. We do not sell or share your personal or financial information with third parties for marketing purposes.</p>
        <p><strong>DATA SECURITY.</strong> All sensitive information is encrypted at rest and in transit. We use industry-standard security protocols to protect your information from unauthorized access.</p>
        <p><strong>YOUR RIGHTS.</strong> You have the right to access, correct, or request deletion of your personal information at any time by contacting the Agency in writing. Deletion requests will be honored within 30 days, subject to legal retention obligations.</p>
        <p><strong>CONTACT.</strong> For privacy-related inquiries: info@landiloutalentagency.com</p>
      </LegalSection>

      <div className="mt-6">
        <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.3)] transition-colors">
          <input
            type="checkbox"
            checked={privacyAcknowledged}
            onChange={e => setPrivacyAcknowledged(e.target.checked)}
            className={checkboxCls}
          />
          <span className="text-[#f0ead8] text-sm">
            I have read and understand the Landi-Lou Talent Agency Privacy Commitment
          </span>
        </label>
      </div>

      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      <NavButtons
        onBack={() => setStep(7)}
        nextDisabled={!privacyAcknowledged}
        onNext={async () => {
          const ok = await saveStep(8, {
            privacy_acknowledged: privacyAcknowledged,
            privacy_acknowledged_at: new Date().toISOString(),
          })
          if (ok) setStep(9)
        }}
        loading={saving}
      />
    </StepCard>
  )

  const renderStep9 = () => {
    const allAcksChecked = finalAck1 && finalAck2 && finalAck3 && finalAck4 && finalAck5 && finalAck6
    const canSubmit = allAcksChecked && talentPrintedName.trim() && talentSignature &&
      (!isMinor || (guardianPrintedName.trim() && guardianSignature))

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    return (
      <StepCard title="Final Acknowledgement & Signature" subtitle="This is the final step — review and sign below">
        <div className="space-y-6">
          <div className="bg-[#0d1120] rounded-lg p-5">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Final Acknowledgements</p>
            <p className="text-[#9ba9bb] text-xs mb-4">All six statements must be checked to complete your portfolio:</p>
            <div className="space-y-3">
              {[
                [finalAck1, setFinalAck1, 'All information submitted in this portfolio is complete, accurate, and true to the best of my knowledge'],
                [finalAck2, setFinalAck2, 'I have read and understand the Landi-Lou Talent Agency Representation Agreement'],
                [finalAck3, setFinalAck3, 'I have read and understand the Agency Standards & Professional Expectations'],
                [finalAck4, setFinalAck4, 'I understand that representation by Landi-Lou Talent Agency does not guarantee employment or booking'],
                [finalAck5, setFinalAck5, 'I understand that it is my responsibility to keep my information, availability, and materials current with the Agency'],
                [finalAck6, setFinalAck6, 'I authorize Landi-Lou Talent Agency to represent me and act on my behalf in the entertainment industry'],
              ].map(([val, setter, text], i) => (
                <label key={i} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={val as boolean}
                    onChange={e => (setter as (v: boolean) => void)(e.target.checked)}
                    className={checkboxCls}
                  />
                  <span className="text-[#f0ead8] text-sm leading-relaxed">{text as string}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Talent Printed Name" required>
              <input className={inputCls} value={talentPrintedName} onChange={e => setTalentPrintedName(e.target.value)} placeholder="Print your full legal name" />
            </Field>
            <div>
              <p className="text-[#9ba9bb] text-xs tracking-widest uppercase mb-2">Date</p>
              <p className="text-[#f0ead8] text-sm py-3 px-4 bg-[#141929] rounded-lg border border-[rgba(201,168,76,0.2)]">{today}</p>
            </div>
          </div>

          <SignaturePad
            onChange={setTalentSignature}
            label="Talent Signature"
            placeholder="Sign your full signature"
            height={160}
          />

          {isMinor && (
            <div className="border border-[#c9a84c]/30 rounded-lg p-5 space-y-4">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase">Parent / Guardian Signature Required</p>
              <p className="text-[#9ba9bb] text-xs">As this talent is a minor, a parent or guardian must also sign this agreement.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Guardian Printed Name" required>
                  <input className={inputCls} value={guardianPrintedName} onChange={e => setGuardianPrintedName(e.target.value)} placeholder="Guardian full legal name" />
                </Field>
                <Field label="Relationship to Talent" required>
                  <input className={inputCls} value={guardianRelationship} onChange={e => setGuardianRelationship(e.target.value)} placeholder="e.g. Mother, Father, Legal Guardian" />
                </Field>
              </div>
              <SignaturePad
                onChange={setGuardianSignature}
                label="Parent/Guardian Signature"
                placeholder="Guardian signature"
                height={140}
              />
            </div>
          )}

          <div className="bg-[#0d1120] border border-dashed border-[rgba(201,168,76,0.3)] rounded-lg p-6 text-center">
            <p className="text-[#9ba9bb] text-xs tracking-widest uppercase mb-2">Agency Acceptance</p>
            <p className="text-[#9ba9bb] text-sm">Pending Agency Review</p>
            <p className="text-[#9ba9bb] text-xs mt-2">
              An authorized representative of Landi-Lou Talent Agency will review and countersign this agreement.
              You will receive a confirmation email once representation is fully activated.
            </p>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        <NavButtons
          onBack={() => setStep(8)}
          nextDisabled={!canSubmit}
          nextLabel="Submit Portfolio"
          onNext={async () => {
            if (!canSubmit) { setError('Please complete all fields and signatures.'); return }
            setSaving(true)
            setError(null)
            try {
              const saveOk = await saveStep(9, {
                final_ack_info_accurate: finalAck1,
                final_ack_read_agreement: finalAck2,
                final_ack_read_standards: finalAck3,
                final_ack_no_guarantee: finalAck4,
                final_ack_responsibility: finalAck5,
                final_ack_authorize: finalAck6,
                talent_printed_name: talentPrintedName,
                talent_signature_data: talentSignature,
                talent_signed_at: new Date().toISOString(),
                guardian_printed_name: guardianPrintedName || null,
                guardian_signature_data: guardianSignature || null,
                guardian_relationship: guardianRelationship || null,
                guardian_signed_at: guardianSignature ? new Date().toISOString() : null,
              })
              if (!saveOk) return

              const res = await fetch(`/api/onboarding/${token}/complete`, {
                method: 'POST',
              })
              if (!res.ok) {
                const j = await res.json()
                setError(j.error ?? 'Submission failed. Please try again.')
                return
              }
              setCompleted(true)
            } finally {
              setSaving(false)
            }
          }}
          loading={saving}
        />
      </StepCard>
    )
  }

  // ─── Completion Screen ────────────────────────────────────────────────────

  if (completed) {
    return (
      <div className="min-h-screen bg-[#06080f] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full">
          <div className="glass-card rounded-2xl p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-[#f0ead8] mb-4">Portfolio Complete</h1>
            <p className="text-[#9ba9bb] leading-relaxed mb-6">
              Thank you, <strong className="text-[#f0ead8]">{legalName}</strong>. Your onboarding portfolio has been
              successfully submitted. The Landi-Lou team will review your portfolio and countersign your
              representation agreement. You will receive a confirmation email once representation is fully active.
            </p>
            <div className="bg-[#0d1120] rounded-lg p-4 text-left text-sm text-[#9ba9bb] space-y-1.5">
              <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-3">What was submitted</p>
              <p>✓ Personal Information & Emergency Contact</p>
              <p>✓ Professional Goals</p>
              <p>✓ Signed Representation Agreement</p>
              <p>✓ Agency Standards Agreement</p>
              <p>✓ Commission Structure Acknowledgement</p>
              <p>✓ Talent Development Tier Acknowledgement</p>
              <p>✓ Privacy Acknowledgement</p>
              <p>✓ Final Acknowledgement & Signature</p>
              {isMinor && <p>✓ Parent/Guardian Signature</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Layout ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#06080f] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-1">Landi-Lou Talent Agency</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-xl text-[#f0ead8]">Digital Onboarding Portfolio</h1>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <ProgressBar current={step} total={TOTAL_STEPS} />
        </div>

        {/* Step content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
        {step === 6 && renderStep6()}
        {step === 7 && renderStep7()}
        {step === 8 && renderStep8()}
        {step === 9 && renderStep9()}
      </div>
    </div>
  )
}
