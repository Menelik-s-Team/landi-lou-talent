import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { FileText, CheckCircle2, Clock, XCircle } from 'lucide-react'

export const metadata = { title: 'My Submission | Landi-Lou' }

export default async function SubmissionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('talent_profiles')
    .select('submission_id, first_name, last_name, email')
    .eq('user_id', user.id)
    .single()

  const { data: submission } = profile?.submission_id
    ? await adminClient
        .from('talent_submissions')
        .select('*')
        .eq('id', profile.submission_id)
        .single()
    : { data: null }

  const STATUS = {
    approved: { label: 'Approved', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
    pending:  { label: 'Pending Review', icon: Clock,        color: 'text-[#c9a84c]', bg: 'bg-[#c9a84c]/10 border-[#c9a84c]/30' },
    rejected: { label: 'Not Selected',   icon: XCircle,      color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20' },
  }
  const status = STATUS[(submission?.status as keyof typeof STATUS) ?? 'pending'] ?? STATUS.pending

  function Row({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null
    return (
      <div>
        <p className="text-[#9ba9bb] text-xs mb-0.5">{label}</p>
        <p className="text-[#f0ead8] text-sm">{value}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Talent Portal</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">My Submission</h1>
        <p className="text-[#9ba9bb] text-sm mt-1">Your original talent application to Landi-Lou</p>
      </div>

      {!submission ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileText size={36} className="text-[#9ba9bb] mb-4 opacity-30" />
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-2">No Submission Found</h2>
          <p className="text-[#9ba9bb] text-sm max-w-sm">
            Contact your agency at{' '}
            <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] hover:underline">
              info@landiloutalentagency.com
            </a>{' '}
            if you believe this is an error.
          </p>
        </div>
      ) : (
        <>
          {/* Status */}
          <div className={`glass-card rounded-xl p-5 flex items-center gap-4 border ${status.bg}`}>
            <status.icon size={22} className={status.color} />
            <div>
              <p className={`font-semibold ${status.color}`}>{status.label}</p>
              <p className="text-[#9ba9bb] text-xs mt-0.5">
                Submitted {new Date(submission.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {submission.reviewed_at ? ` · Reviewed ${new Date(submission.reviewed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : ''}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Headshot */}
            {submission.headshot_url && (
              <div className="md:col-span-1">
                <div className="glass-card rounded-xl overflow-hidden aspect-[3/4]">
                  <Image
                    src={submission.headshot_url}
                    alt="Submission headshot"
                    width={400}
                    height={533}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className={submission.headshot_url ? 'md:col-span-2' : 'md:col-span-3'}>
              <div className="flex flex-col gap-5">
                {/* Personal */}
                <div className="glass-card rounded-xl p-5">
                  <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Personal Information</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Row label="Name" value={`${submission.first_name} ${submission.last_name}`} />
                    <Row label="Stage Name" value={submission.stage_name} />
                    <Row label="Email" value={submission.email} />
                    <Row label="Phone" value={submission.phone} />
                    <Row label="Location" value={submission.city && submission.state ? `${submission.city}, ${submission.state}` : null} />
                    <Row label="Date of Birth" value={submission.dob ? new Date(submission.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null} />
                  </div>
                </div>

                {/* Talent info */}
                <div className="glass-card rounded-xl p-5">
                  <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Talent Profile</p>
                  <div className="flex flex-col gap-3">
                    {((submission.categories as string[] | null) ?? []).length > 0 && (
                      <div>
                        <p className="text-[#9ba9bb] text-xs mb-2">Categories</p>
                        <div className="flex flex-wrap gap-2">
                          {(submission.categories as string[]).map((c: string) => (
                            <span key={c} className="px-2.5 py-1 rounded-full bg-[#141929] border border-[rgba(201,168,76,0.2)] text-[#f0ead8] text-xs">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <Row label="Union Status" value={submission.union_status} />
                      <Row label="Experience Level" value={submission.experience_level} />
                      <Row label="Representation" value={submission.representation_type} />
                      <Row label="Height" value={submission.height} />
                    </div>
                    {submission.bio && (
                      <div>
                        <p className="text-[#9ba9bb] text-xs mb-1">Bio</p>
                        <p className="text-[#f0ead8] text-sm leading-relaxed">{submission.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social */}
                {(submission.instagram || submission.tiktok || submission.youtube) && (
                  <div className="glass-card rounded-xl p-5">
                    <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Social Media Submitted</p>
                    <div className="flex flex-col gap-2 text-sm">
                      {submission.instagram && <p className="text-[#9ba9bb]">Instagram: <span className="text-[#f0ead8]">{submission.instagram}</span></p>}
                      {submission.tiktok    && <p className="text-[#9ba9bb]">TikTok: <span className="text-[#f0ead8]">{submission.tiktok}</span></p>}
                      {submission.youtube   && <p className="text-[#9ba9bb]">YouTube: <span className="text-[#f0ead8]">{submission.youtube}</span></p>}
                    </div>
                  </div>
                )}

                {/* Admin note (only if approved/has note) */}
                {submission.admin_notes && (
                  <div className="glass-card rounded-xl p-5 border border-[rgba(201,168,76,0.15)]">
                    <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-2">Note from Agency</p>
                    <p className="text-[#9ba9bb] text-sm leading-relaxed">{submission.admin_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
