'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  talentId: string
  talentName: string
  castingDirectorId: string
}

export default function BookingRequestButton({ talentId, talentName, castingDirectorId }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ project_name: '', project_type: '', description: '', date_needed: '', location: '', rate: '' })
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await supabase.from('booking_requests').insert({
        casting_director_id: castingDirectorId,
        talent_id: talentId,
        ...form,
      })
      setSent(true)
      setTimeout(() => { setSent(false); setOpen(false) }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-[#0d1120] border border-[rgba(201,168,76,0.2)] rounded px-3 py-2.5 text-[#f0ead8] text-sm placeholder-[#7a869a] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"

  if (sent) return <div className="text-green-400 text-xs text-center py-2">Request sent!</div>

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2 text-xs border border-[#c9a84c]/40 text-[#c9a84c] rounded hover:bg-[#c9a84c]/10 transition-all"
      >
        Request Booking
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="glass-card rounded-xl p-6 w-full max-w-md">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#f0ead8] mb-1">Request Booking</h3>
            <p className="text-[#7a869a] text-xs mb-5">For: {talentName}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input required value={form.project_name} onChange={e => setForm(p => ({...p, project_name: e.target.value}))} className={inputClass} placeholder="Project name *" />
              <input value={form.project_type} onChange={e => setForm(p => ({...p, project_type: e.target.value}))} className={inputClass} placeholder="Project type (Film, Ad, etc.)" />
              <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} rows={3} className={inputClass} placeholder="Project description..." />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.date_needed} onChange={e => setForm(p => ({...p, date_needed: e.target.value}))} className={inputClass} />
                <input value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))} className={inputClass} placeholder="Location" />
              </div>
              <input value={form.rate} onChange={e => setForm(p => ({...p, rate: e.target.value}))} className={inputClass} placeholder="Rate / Budget" />
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 border border-[rgba(201,168,76,0.2)] text-[#7a869a] rounded text-sm hover:text-[#f0ead8] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm hover:bg-[#e8c97a] transition-all disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
