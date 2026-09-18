'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SignaturePad from '@/components/SignaturePad'

interface Props {
  portfolioId: string
  alreadySigned: boolean
  agencyRepName: string | null
  agencySignedAt: string | null
  agencySignatureData: string | null
}

export default function CountersignPanel({
  portfolioId,
  alreadySigned,
  agencyRepName,
  agencySignedAt,
  agencySignatureData,
}: Props) {
  const [repName, setRepName] = useState('')
  const [signature, setSignature] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  if (alreadySigned) {
    return (
      <div className="glass-card rounded-xl p-6 border border-emerald-500/30">
        <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-4">Agency Countersignature</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-emerald-400 text-lg">✓</span>
          <span className="text-emerald-400 font-semibold">Portfolio Countersigned &amp; Accepted</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[#9ba9bb] text-xs mb-1">Agency Representative</p>
            <p className="text-[#f0ead8]">{agencyRepName}</p>
          </div>
          <div>
            <p className="text-[#9ba9bb] text-xs mb-1">Signed</p>
            <p className="text-[#f0ead8]">{agencySignedAt ? new Date(agencySignedAt).toLocaleString() : '—'}</p>
          </div>
        </div>
        {agencySignatureData && (
          <div className="mt-4">
            <p className="text-[#9ba9bb] text-xs mb-1">Agency Signature</p>
            <div className="bg-[#0d1120] border border-[rgba(201,168,76,0.2)] rounded-lg p-2 inline-block">
              <Image src={agencySignatureData} alt="Agency signature" width={240} height={100} className="object-contain" unoptimized />
            </div>
          </div>
        )}
      </div>
    )
  }

  async function handleCountersign() {
    if (!repName.trim() || !signature) {
      setError('Please enter your name and provide your signature.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/portfolio/${portfolioId}/countersign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agency_rep_name: repName,
          agency_signature_data: signature,
        }),
      })
      if (!res.ok) {
        const j = await res.json()
        setError(j.error ?? 'Failed to save countersignature.')
        return
      }
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card rounded-xl p-6 border border-[#c9a84c]/30">
      <p className="text-[#c9a84c] text-xs tracking-widest uppercase mb-2">Agency Countersignature</p>
      <p className="text-[#9ba9bb] text-sm mb-6">
        Review the portfolio above, then sign below to accept this talent into representation.
      </p>

      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[#9ba9bb] text-xs tracking-widest uppercase">
            Agency Representative Name <span className="text-[#c9a84c]">*</span>
          </label>
          <input
            className="w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded-lg px-4 py-3 text-[#f0ead8] text-sm placeholder-[#9ba9bb]/50 focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
            value={repName}
            onChange={e => setRepName(e.target.value)}
            placeholder="Full name of signing representative"
          />
        </div>

        <SignaturePad
          onChange={setSignature}
          label="Agency Signature"
          placeholder="Sign to accept & countersign"
          height={160}
        />
        <p className="text-[#9ba9bb] text-xs">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="button"
          onClick={handleCountersign}
          disabled={loading || !repName.trim() || !signature}
          className="w-full py-3 bg-[#c9a84c] text-[#06080f] rounded-lg font-bold hover:bg-[#e8c97a] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Accept & Countersign Portfolio'}
        </button>
      </div>
    </div>
  )
}
