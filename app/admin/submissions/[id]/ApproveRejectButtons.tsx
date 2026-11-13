'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Props {
  submissionId: string
  submissionData: Record<string, unknown>
}

export default function ApproveRejectButtons({ submissionId, submissionData }: Props) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [notes, setNotes] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()

  async function handleAction(action: 'approve' | 'reject') {
    setLoading(action)
    setErrorMsg(null)
    try {
      const res = await fetch(`/api/submissions/${submissionId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      if (res.ok) {
        router.push('/admin/submissions')
        router.refresh()
      } else {
        const data = await res.json()
        setErrorMsg(data.error || 'Action failed. Please try again.')
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="glass-card rounded-xl p-6 flex flex-col gap-4 border border-[rgba(201,168,76,0.2)]">
      <p className="text-[#c9a84c] text-xs tracking-widest uppercase">Admin Decision</p>
      <div>
        <label className="block text-[#9ba9bb] text-xs tracking-widest uppercase mb-2">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          placeholder="Internal notes about this submission..."
          className="w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#9ba9bb] focus:outline-none focus:border-[#c9a84c]/60 transition-colors resize-none"
        />
      </div>
      {errorMsg && (
        <div className="flex items-start gap-2 px-4 py-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={() => handleAction('approve')}
          disabled={loading !== null}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-semibold rounded text-sm hover:bg-green-500 transition-all disabled:opacity-50"
        >
          <CheckCircle size={16} />
          {loading === 'approve' ? 'Approving...' : 'Approve & Send Login'}
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={loading !== null}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600/20 text-red-400 border border-red-500/30 font-semibold rounded text-sm hover:bg-red-600/30 transition-all disabled:opacity-50"
        >
          <XCircle size={16} />
          {loading === 'reject' ? 'Declining...' : 'Decline'}
        </button>
      </div>
    </div>
  )
}
