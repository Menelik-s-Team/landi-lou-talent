import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import CountersignPanel from './CountersignPanel'

export const metadata = { title: 'View Portfolio | Admin' }

function SigDisplay({ data, label }: { data: string | null; label: string }) {
  if (!data) return null
  return (
    <div className="mt-3">
      <p className="text-[#9ba9bb] text-xs mb-1">{label}</p>
      <div className="bg-[#0d1120] border border-[rgba(201,168,76,0.2)] rounded-lg p-2 inline-block">
        <Image src={data} alt={label} width={240} height={100} className="object-contain" unoptimized />
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | boolean | null | undefined }) {
  if (value === null || value === undefined || value === '') return null
  const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)
  return (
    <div>
      <p className="text-[#9ba9bb] text-xs mb-1">{label}</p>
      <p className="text-[#f0ead8] text-sm">{display}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-xl p-6">
      <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">{title}</p>
      {children}
    </div>
  )
}

export default async function AdminPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: p, error } = await supabase
    .from('talent_onboarding_portfolios')
    .select('*, talent_submissions(first_name, last_name, email, phone, dob, city, state, is_minor)')
    .eq('id', id)
    .single()

  if (error || !p) notFound()

  const submission = p.talent_submissions as {
    first_name: string
    last_name: string
    email: string
    phone: string | null
    dob: string | null
    city: string | null
    state: string | null
    is_minor: boolean
  } | null

  const name = submission ? `${submission.first_name} ${submission.last_name}` : (p.legal_name ?? 'Talent')
  const measurements = (p.measurements ?? {}) as Record<string, string>

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Onboarding Portfolio</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">{name}</h1>
          {submission?.email && <p className="text-[#9ba9bb] text-sm mt-1">{submission.email}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-sm px-4 py-2 rounded-full ${
            p.status === 'completed'
              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
              : 'bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30'
          }`}>
            {p.status}
          </span>
          {p.agency_accepted && (
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Agency Countersigned
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">

        {/* Personal Info */}
        <Section title="Personal Information">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
            <InfoRow label="Legal Name" value={p.legal_name} />
            <InfoRow label="Stage Name" value={p.stage_name} />
            <InfoRow label="Preferred Name" value={p.preferred_name} />
            <InfoRow label="Pronouns" value={p.pronouns} />
            <InfoRow label="Date of Birth" value={submission?.dob} />
            <InfoRow label="Email" value={submission?.email} />
            <InfoRow label="Phone" value={submission?.phone} />
            <InfoRow label="City, State" value={submission ? `${submission.city}, ${submission.state}` : null} />
            <InfoRow label="Street Address" value={p.street_address} />
            <InfoRow label="ZIP Code" value={p.zip_code} />
          </div>
          <div className="mt-4 pt-4 border-t border-[rgba(201,168,76,0.1)]">
            <p className="text-[#9ba9bb] text-xs mb-3">Emergency Contact</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <InfoRow label="Name" value={p.emergency_contact_name} />
              <InfoRow label="Relationship" value={p.emergency_contact_relationship} />
              <InfoRow label="Phone" value={p.emergency_contact_phone} />
            </div>
          </div>
        </Section>

        {/* Casting Profile */}
        <Section title="Casting Profile">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
            <InfoRow label="Union Status" value={p.union_status} />
            <InfoRow label="Height" value={p.height} />
            <InfoRow label="Weight" value={p.weight} />
            <InfoRow label="Hair Color" value={p.hair_color} />
            <InfoRow label="Eye Color" value={p.eye_color} />
            <InfoRow label="Driver&apos;s License" value={p.has_drivers_license} />
            <InfoRow label="Passport" value={p.has_passport} />
            <InfoRow label="Willing to Travel" value={p.willing_to_travel} />
            <InfoRow label="Local Hire Markets" value={p.local_hire_markets} />
          </div>
          {p.availability?.length > 0 && (
            <div className="mt-4">
              <p className="text-[#9ba9bb] text-xs mb-2">Availability</p>
              <div className="flex flex-wrap gap-2">
                {(p.availability as string[]).map((a: string) => (
                  <span key={a} className="px-3 py-1 rounded-full bg-[#141929] border border-[rgba(201,168,76,0.2)] text-[#f0ead8] text-xs">{a}</span>
                ))}
              </div>
            </div>
          )}
          {Object.keys(measurements).length > 0 && (
            <div className="mt-4 pt-4 border-t border-[rgba(201,168,76,0.1)]">
              <p className="text-[#9ba9bb] text-xs mb-3">Measurements</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {Object.entries(measurements).map(([key, val]) => (
                  <div key={key}>
                    <p className="text-[#9ba9bb] text-xs mb-1">{key.replace(/_/g, ' ').replace(/^(men|women) /, '')}</p>
                    <p className="text-[#f0ead8]">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Skills */}
        <Section title="Skills & Career">
          {p.performance_skills?.length > 0 && (
            <div className="mb-4">
              <p className="text-[#9ba9bb] text-xs mb-2">Performance Skills</p>
              <div className="flex flex-wrap gap-2">
                {(p.performance_skills as string[]).map((s: string) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-[#141929] border border-[rgba(201,168,76,0.2)] text-[#f0ead8] text-xs">{s}</span>
                ))}
              </div>
            </div>
          )}
          {p.music_dance_skills?.length > 0 && (
            <div className="mb-4">
              <p className="text-[#9ba9bb] text-xs mb-2">Music & Dance</p>
              <div className="flex flex-wrap gap-2">
                {(p.music_dance_skills as string[]).map((s: string) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-[#141929] border border-[rgba(201,168,76,0.2)] text-[#f0ead8] text-xs">{s}</span>
                ))}
              </div>
            </div>
          )}
          {p.special_skills?.length > 0 && (
            <div className="mb-4">
              <p className="text-[#9ba9bb] text-xs mb-2">Special Skills</p>
              <div className="flex flex-wrap gap-2">
                {(p.special_skills as string[]).map((s: string) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-[#141929] border border-[rgba(201,168,76,0.2)] text-[#f0ead8] text-xs">{s}</span>
                ))}
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <InfoRow label="Musical Instruments" value={p.musical_instruments} />
            <InfoRow label="Languages Spoken" value={p.languages_spoken} />
            <InfoRow label="Other Special Skills" value={p.other_special_skills} />
          </div>
          <div className="mt-4 pt-4 border-t border-[rgba(201,168,76,0.1)]">
            <p className="text-[#9ba9bb] text-xs mb-3">Professional Materials</p>
            <div className="flex flex-wrap gap-3 text-sm">
              {[
                ['Resume', p.has_resume],
                ['Demo Reel', p.has_demo_reel],
                ['Headshots', p.has_headshots],
                ['Digitals', p.has_digitals],
                ['Comp Card', p.has_comp_card],
              ].map(([label, val]) => val ? (
                <span key={label as string} className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 text-xs">{label as string}</span>
              ) : null)}
            </div>
          </div>
          {p.career_goals && (
            <div className="mt-4 pt-4 border-t border-[rgba(201,168,76,0.1)]">
              <p className="text-[#9ba9bb] text-xs mb-2">Career Goals</p>
              <p className="text-[#f0ead8] text-sm leading-relaxed">{p.career_goals}</p>
            </div>
          )}
        </Section>

        {/* Signed Agreements */}
        <Section title="Signed Agreements">
          <div className="space-y-6">
            <div>
              <p className="text-[#9ba9bb] text-xs mb-1">Representation Agreement</p>
              <SigDisplay data={p.representation_initials} label="Initials" />
              {p.representation_signed_at && (
                <p className="text-[#9ba9bb] text-xs mt-1">Signed: {new Date(p.representation_signed_at).toLocaleString()}</p>
              )}
            </div>
            <div>
              <p className="text-[#9ba9bb] text-xs mb-1">Agency Standards & Professional Expectations</p>
              <SigDisplay data={p.standards_initials} label="Initials" />
              {p.standards_signed_at && (
                <p className="text-[#9ba9bb] text-xs mt-1">Signed: {new Date(p.standards_signed_at).toLocaleString()}</p>
              )}
            </div>
            <div>
              <p className="text-[#9ba9bb] text-xs mb-1">Commission Structure</p>
              <p className="text-[#f0ead8] text-sm">
                Acknowledged: {p.commission_acknowledged ? 'Yes' : 'No'} &nbsp;|&nbsp;
                Agreed: {p.commission_agreed ? 'Yes' : 'No'}
              </p>
              {p.commission_signed_at && (
                <p className="text-[#9ba9bb] text-xs mt-1">Signed: {new Date(p.commission_signed_at).toLocaleString()}</p>
              )}
            </div>
            <div>
              <p className="text-[#9ba9bb] text-xs mb-1">Direct Payments Policy</p>
              <SigDisplay data={p.direct_payments_initials} label="Initials" />
              {p.direct_payments_signed_at && (
                <p className="text-[#9ba9bb] text-xs mt-1">Signed: {new Date(p.direct_payments_signed_at).toLocaleString()}</p>
              )}
            </div>
          </div>
        </Section>

        {/* Payment & W-9 */}
        <Section title="Payment & Tax Information">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
            <InfoRow label="Payment Method" value={p.payment_method} />
            {p.payment_method === 'Direct Deposit ACH' && (
              <>
                <InfoRow label="Financial Institution" value={p.financial_institution} />
                <InfoRow label="Account Type" value={p.account_type} />
                <InfoRow label="Routing Number" value={p.routing_number} />
                <InfoRow label="Account Number" value={p.account_number ? '••••••' + String(p.account_number).slice(-4) : null} />
              </>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-[rgba(201,168,76,0.1)]">
            <p className="text-[#9ba9bb] text-xs mb-3">W-9 Information</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
              <InfoRow label="Name on W-9" value={p.w9_name} />
              <InfoRow label="Business Name" value={p.w9_business_name} />
              <InfoRow label="Tax Classification" value={p.w9_tax_classification} />
              <InfoRow label="Address" value={p.w9_address} />
              <InfoRow label="City/State/ZIP" value={p.w9_city_state_zip} />
              <InfoRow label="TIN Type" value={p.w9_tin_type} />
              <InfoRow label="TIN" value={p.w9_tin ? '***-**-' + String(p.w9_tin).slice(-4) : null} />
            </div>
            <SigDisplay data={p.w9_signature_data} label="W-9 Signature" />
            {p.w9_signed_at && (
              <p className="text-[#9ba9bb] text-xs mt-1">Signed: {new Date(p.w9_signed_at).toLocaleString()}</p>
            )}
          </div>
        </Section>

        {/* Final Acknowledgement */}
        <Section title="Final Acknowledgement & Signature">
          <div className="space-y-2 mb-4 text-sm">
            {[
              ['Information accurate', p.final_ack_info_accurate],
              ['Read Representation Agreement', p.final_ack_read_agreement],
              ['Read Agency Standards', p.final_ack_read_standards],
              ['Understands no employment guarantee', p.final_ack_no_guarantee],
              ['Understands info maintenance responsibility', p.final_ack_responsibility],
              ['Authorizes Agency representation', p.final_ack_authorize],
            ].map(([label, val]) => (
              <div key={label as string} className="flex items-center gap-2">
                <span className={val ? 'text-green-400' : 'text-red-400'}>{val ? '✓' : '✗'}</span>
                <span className="text-[#f0ead8]">{label as string}</span>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <InfoRow label="Talent Printed Name" value={p.talent_printed_name} />
              <SigDisplay data={p.talent_signature_data} label="Talent Signature" />
              {p.talent_signed_at && (
                <p className="text-[#9ba9bb] text-xs mt-1">Signed: {new Date(p.talent_signed_at).toLocaleString()}</p>
              )}
            </div>
            {submission?.is_minor && p.guardian_printed_name && (
              <div>
                <InfoRow label="Guardian Printed Name" value={p.guardian_printed_name} />
                <InfoRow label="Relationship" value={p.guardian_relationship} />
                <SigDisplay data={p.guardian_signature_data} label="Guardian Signature" />
                {p.guardian_signed_at && (
                  <p className="text-[#9ba9bb] text-xs mt-1">Signed: {new Date(p.guardian_signed_at).toLocaleString()}</p>
                )}
              </div>
            )}
          </div>
        </Section>

        {/* Agency Countersign */}
        <CountersignPanel portfolioId={id} alreadySigned={p.agency_accepted} agencyRepName={p.agency_rep_name} agencySignedAt={p.agency_signed_at} agencySignatureData={p.agency_signature_data} />

      </div>
    </div>
  )
}
