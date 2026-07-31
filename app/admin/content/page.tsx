import { createAdminClient } from '@/lib/supabase/admin'
import ContentEditor from './ContentEditor'

export const metadata = { title: 'Edit Content | Admin' }

type ContentRow = {
  key: string
  value: string
  label: string
  section: string
  hint: string | null
  is_multiline: boolean
  updated_at: string
}

export default async function ContentPage() {
  const supabase = createAdminClient()
  const { data: rows } = await supabase
    .from('site_content')
    .select('*')
    .order('section')
    .order('key')

  const sections: Record<string, ContentRow[]> = {}
  for (const row of (rows ?? []) as ContentRow[]) {
    if (!sections[row.section]) sections[row.section] = []
    sections[row.section].push(row)
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-10">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Website Management</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Edit Content</h1>
        <p className="text-[#9ba9bb] text-sm mt-3">
          Changes save instantly and appear live on the website within seconds.
        </p>
      </div>

      <ContentEditor sections={sections} />
    </div>
  )
}
