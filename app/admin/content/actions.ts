'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { CONTENT_FIELDS } from './page'

export async function saveContentField(key: string, value: string) {
  try {
    const supabase = createAdminClient()

    const fieldDef = CONTENT_FIELDS.find(f => f.key === key)

    await supabase
      .from('site_content')
      .upsert({
        key,
        value,
        label: fieldDef?.label ?? key,
        section: fieldDef?.section ?? 'General',
        hint: fieldDef?.hint ?? null,
        is_multiline: fieldDef?.multiline ?? false,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' })

    revalidatePath('/')
    revalidatePath('/about')
    revalidatePath('/representation')
    revalidatePath('/for-clients')

    return { success: true }
  } catch {
    return { success: false }
  }
}
