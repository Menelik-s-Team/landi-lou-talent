'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function saveContentField(key: string, value: string) {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('site_content')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key)

    if (error) return { success: false }

    // Revalidate public pages that use this content
    revalidatePath('/')
    revalidatePath('/about')
    revalidatePath('/representation')
    revalidatePath('/for-clients')

    return { success: true }
  } catch {
    return { success: false }
  }
}
