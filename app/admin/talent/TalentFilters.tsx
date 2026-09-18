'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

const CATEGORIES = [
  'Actor', 'Model', 'Commercial', 'Voice Over', 'Singer', 'Dancer',
  'Influencer', 'Lifestyle', 'Host', 'Print', 'Fitness', 'Young Talent',
]

const inputCls = 'bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-3 py-2 text-sm text-[#f0ead8] focus:outline-none focus:border-[#c9a84c]/60 transition-colors'

export default function TalentFilters() {
  const router = useRouter()
  const params = useSearchParams()

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.push(`/admin/talent?${next.toString()}`)
  }

  const hasFilters = ['search', 'category', 'gender', 'union', 'available'].some(k => params.has(k))

  return (
    <div className="mb-6 flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ba9bb] pointer-events-none" />
        <input
          defaultValue={params.get('search') ?? ''}
          onChange={e => update('search', e.target.value)}
          placeholder="Search by name or email..."
          className={`w-full pl-8 pr-4 ${inputCls}`}
        />
      </div>

      <select
        value={params.get('category') ?? ''}
        onChange={e => update('category', e.target.value)}
        className={inputCls}
      >
        <option value="">All Categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select
        value={params.get('gender') ?? ''}
        onChange={e => update('gender', e.target.value)}
        className={inputCls}
      >
        <option value="">All Genders</option>
        {['Male', 'Female', 'Non-Binary'].map(g => <option key={g} value={g}>{g}</option>)}
      </select>

      <select
        value={params.get('union') ?? ''}
        onChange={e => update('union', e.target.value)}
        className={inputCls}
      >
        <option value="">All Union Status</option>
        {['SAG-AFTRA', 'SAG-Eligible', 'Equity', 'EMC', 'Non-Union', 'Other'].map(u => <option key={u} value={u}>{u}</option>)}
      </select>

      <button
        onClick={() => update('available', params.get('available') === 'true' ? '' : 'true')}
        className={`px-3 py-2 rounded border text-xs transition-all ${
          params.get('available') === 'true'
            ? 'bg-green-500/15 text-green-400 border-green-500/40'
            : 'bg-[#141929] text-[#9ba9bb] border-[rgba(201,168,76,0.2)] hover:border-[#c9a84c]/40'
        }`}
      >
        Available Only
      </button>

      {hasFilters && (
        <button
          onClick={() => router.push('/admin/talent')}
          className="flex items-center gap-1.5 px-3 py-2 rounded border border-red-500/20 text-red-400 text-xs hover:bg-red-500/10 transition-all"
        >
          <X size={12} /> Clear Filters
        </button>
      )}
    </div>
  )
}
