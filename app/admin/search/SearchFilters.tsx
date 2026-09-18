'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface SearchFiltersProps {
  q: string
  category: string
  ethnicity: string
  union_status: string
  experience_level: string
  gender: string
}

const CATEGORIES = [
  'All Categories',
  'Actor',
  'Modeling',
  'Commercial',
  'Theatre',
  'Print',
  'Fashion',
  'Lifestyle',
  'Voice Over',
  'Singer',
  'Dancer',
  'Host',
  'Influencer',
  'Children & Youth',
  'Fitness',
  'Specialty Talent',
]

const ETHNICITIES = [
  { label: 'All Ethnicities', value: '' },
  { label: 'Black/African American', value: 'Black/African American' },
  { label: 'White/Caucasian', value: 'White/Caucasian' },
  { label: 'Hispanic/Latino', value: 'Hispanic/Latino' },
  { label: 'Asian/Pacific Islander', value: 'Asian/Pacific Islander' },
  { label: 'Middle Eastern', value: 'Middle Eastern' },
  { label: 'Native American', value: 'Native American' },
  { label: 'Multiracial', value: 'Multiracial' },
]

const UNION_STATUSES = [
  { label: 'All Union Status', value: '' },
  { label: 'SAG-AFTRA', value: 'SAG-AFTRA' },
  { label: 'SAG-Eligible', value: 'SAG-Eligible' },
  { label: 'Equity', value: 'Equity' },
  { label: 'EMC', value: 'EMC' },
  { label: 'Non-Union', value: 'Non-Union' },
]

const EXPERIENCE_LEVELS = [
  { label: 'All Experience Levels', value: '' },
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Professional', value: 'Professional' },
  { label: 'Extensive Credits', value: 'Extensive Credits' },
]

const GENDERS = [
  { label: 'All Genders', value: '' },
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Non-Binary', value: 'Non-Binary' },
]

const selectClass =
  'bg-[#0d1120] border border-[rgba(201,168,76,0.2)] text-[#f0ead8] text-sm rounded-lg px-3 py-2.5 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all min-w-[160px]'

export default function SearchFilters({
  q,
  category,
  ethnicity,
  union_status,
  experience_level,
  gender,
}: SearchFiltersProps) {
  const router = useRouter()

  const buildUrl = useCallback(
    (overrides: Partial<SearchFiltersProps>) => {
      const params = new URLSearchParams()
      const merged = { q, category, ethnicity, union_status, experience_level, gender, ...overrides }
      if (merged.q) params.set('q', merged.q)
      if (merged.category && merged.category !== 'All Categories') params.set('category', merged.category)
      if (merged.ethnicity) params.set('ethnicity', merged.ethnicity)
      if (merged.union_status) params.set('union_status', merged.union_status)
      if (merged.experience_level) params.set('experience_level', merged.experience_level)
      if (merged.gender) params.set('gender', merged.gender)
      const qs = params.toString()
      return `/admin/search${qs ? `?${qs}` : ''}`
    },
    [q, category, ethnicity, union_status, experience_level, gender]
  )

  function onChange(key: keyof SearchFiltersProps, value: string) {
    router.push(buildUrl({ [key]: value }))
  }

  const hasFilters = !!(q || (category && category !== 'All Categories') || ethnicity || union_status || experience_level || gender)

  return (
    <div className="flex flex-col gap-4">
      {/* Text search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ba9bb] pointer-events-none"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or keyword..."
          defaultValue={q}
          onChange={(e) => onChange('q', e.target.value)}
          className="w-full bg-[#0d1120] border border-[rgba(201,168,76,0.2)] text-[#f0ead8] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/20 transition-all placeholder-[#9ba9bb]"
        />
      </div>

      {/* Dropdowns row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category */}
        <div className="relative">
          <select
            value={category || 'All Categories'}
            onChange={(e) => onChange('category', e.target.value)}
            className={selectClass}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ba9bb]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Ethnicity */}
        <div className="relative">
          <select
            value={ethnicity}
            onChange={(e) => onChange('ethnicity', e.target.value)}
            className={selectClass}
          >
            {ETHNICITIES.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ba9bb]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Union Status */}
        <div className="relative">
          <select
            value={union_status}
            onChange={(e) => onChange('union_status', e.target.value)}
            className={selectClass}
          >
            {UNION_STATUSES.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ba9bb]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Experience Level */}
        <div className="relative">
          <select
            value={experience_level}
            onChange={(e) => onChange('experience_level', e.target.value)}
            className={selectClass}
          >
            {EXPERIENCE_LEVELS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ba9bb]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Gender */}
        <div className="relative">
          <select
            value={gender}
            onChange={(e) => onChange('gender', e.target.value)}
            className={selectClass}
          >
            {GENDERS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ba9bb]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Clear All */}
        {hasFilters && (
          <button
            onClick={() => router.push('/admin/search')}
            className="text-sm text-[#9ba9bb] hover:text-[#c9a84c] transition-colors px-3 py-2.5 border border-[rgba(201,168,76,0.15)] rounded-lg hover:border-[#c9a84c]/30"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}
