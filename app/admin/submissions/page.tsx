import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export const metadata = { title: 'Submissions | Admin' }

export default async function SubmissionsPage() {
  const supabase = createAdminClient()
  const { data: submissions } = await supabase
    .from('talent_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  const pending = submissions?.filter(s => s.status === 'pending') ?? []
  const reviewed = submissions?.filter(s => s.status !== 'pending') ?? []

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Review Queue</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Submissions</h1>
      </div>

      {/* Pending */}
      <div className="mb-10">
        <h2 className="text-[#f0ead8] text-sm tracking-widest uppercase mb-4">
          Pending <span className="text-[#c9a84c]">({pending.length})</span>
        </h2>
        <div className="glass-card rounded-xl overflow-hidden">
          {pending.length > 0 ? (
            <div className="divide-y divide-[rgba(201,168,76,0.08)]">
              {pending.map(s => <SubmissionRow key={s.id} s={s} />)}
            </div>
          ) : (
            <div className="px-6 py-10 text-center text-[#7a869a] text-sm">No pending submissions.</div>
          )}
        </div>
      </div>

      {/* Reviewed */}
      <div>
        <h2 className="text-[#f0ead8] text-sm tracking-widest uppercase mb-4">
          Reviewed <span className="text-[#7a869a]">({reviewed.length})</span>
        </h2>
        <div className="glass-card rounded-xl overflow-hidden">
          {reviewed.length > 0 ? (
            <div className="divide-y divide-[rgba(201,168,76,0.08)]">
              {reviewed.map(s => <SubmissionRow key={s.id} s={s} />)}
            </div>
          ) : (
            <div className="px-6 py-10 text-center text-[#7a869a] text-sm">No reviewed submissions yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function SubmissionRow({ s }: { s: Record<string, unknown> }) {
  return (
    <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <p className="text-[#f0ead8] text-sm font-medium">{s.first_name as string} {s.last_name as string}</p>
        <p className="text-[#7a869a] text-xs mt-0.5">
          {(s.categories as string[])?.join(', ')} &bull; {s.city as string}, {s.state as string}
          {Boolean(s.is_minor) && <span className="ml-2 text-[#c9a84c]">Minor</span>}
        </p>
        <p className="text-[#7a869a] text-xs">{s.email as string}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`text-xs px-3 py-1 rounded-full ${
          s.status === 'pending' ? 'bg-[#c9a84c]/10 text-[#c9a84c]' :
          s.status === 'approved' ? 'bg-green-500/10 text-green-400' :
          'bg-red-500/10 text-red-400'
        }`}>
          {s.status as string}
        </span>
        <Link
          href={`/admin/submissions/${s.id}`}
          className="text-xs px-4 py-2 border border-[rgba(201,168,76,0.2)] text-[#c9a84c] rounded hover:bg-[#c9a84c]/10 transition-all"
        >
          Review
        </Link>
      </div>
    </div>
  )
}
