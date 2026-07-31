'use client'

import { useState, useTransition } from 'react'
import { saveContentField } from './actions'
import { CheckCircle, Loader2 } from 'lucide-react'

type ContentRow = {
  key: string
  value: string
  label: string
  section: string
  hint: string | null
  multiline: boolean
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function Field({ row }: { row: ContentRow }) {
  const [value, setValue] = useState(row.value)
  const [state, setState] = useState<SaveState>('idle')
  const [, startTransition] = useTransition()

  function handleSave() {
    if (value === row.value) return
    setState('saving')
    startTransition(async () => {
      const result = await saveContentField(row.key, value)
      if (result.success) {
        setState('saved')
        setTimeout(() => setState('idle'), 2500)
      } else {
        setState('error')
        setTimeout(() => setState('idle'), 3000)
      }
    })
  }

  const inputClass = "w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <label className="text-[#f0ead8] text-sm font-medium">{row.label}</label>
          {row.hint && <p className="text-[#9ba9bb] text-xs mt-0.5">{row.hint}</p>}
        </div>
        <button
          onClick={handleSave}
          disabled={state === 'saving' || value === row.value}
          className={`flex items-center gap-1.5 text-xs px-4 py-1.5 rounded transition-all flex-shrink-0 ${
            state === 'saved'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : state === 'error'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : value !== row.value
              ? 'bg-[#c9a84c] text-[#06080f] font-semibold hover:bg-[#e8c97a]'
              : 'bg-[#141929] text-[#9ba9bb] border border-[rgba(201,168,76,0.1)] opacity-50 cursor-default'
          }`}
        >
          {state === 'saving' && <Loader2 size={12} className="animate-spin" />}
          {state === 'saved' && <CheckCircle size={12} />}
          {state === 'saving' ? 'Saving...' : state === 'saved' ? 'Saved!' : state === 'error' ? 'Error' : 'Save'}
        </button>
      </div>

      {row.multiline ? (
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          rows={4}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          className={inputClass}
          onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
        />
      )}
    </div>
  )
}

const SECTION_ORDER = ['Homepage', 'About', 'Representation', 'For Clients', 'Agency Info']

export default function ContentEditor({
  sections,
}: {
  sections: Record<string, ContentRow[]>
}) {
  const orderedKeys = [
    ...SECTION_ORDER.filter(s => sections[s]),
    ...Object.keys(sections).filter(s => !SECTION_ORDER.includes(s)),
  ]

  return (
    <div className="flex flex-col gap-8">
      {orderedKeys.map(section => (
        <div key={section} className="glass-card rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.04)]">
            <h2 className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase font-semibold">{section}</h2>
          </div>
          <div className="px-6 py-6 flex flex-col gap-6 divide-y divide-[rgba(201,168,76,0.07)]">
            {sections[section].map(row => (
              <div key={row.key} className="pt-6 first:pt-0">
                <Field row={row} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
