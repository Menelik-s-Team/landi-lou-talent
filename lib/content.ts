import { createAdminClient } from '@/lib/supabase/admin'

type ContentRow = { key: string; value: string }

// Fetch multiple content keys at once, returns a key→value map.
// Falls back to the default string if the key isn't in the DB yet.
export async function getContent(
  keys: string[],
  defaults: Record<string, string> = {}
): Promise<Record<string, string>> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('site_content')
      .select('key, value')
      .in('key', keys)

    const map: Record<string, string> = { ...defaults }
    if (data) {
      for (const row of data as ContentRow[]) {
        map[row.key] = row.value
      }
    }
    return map
  } catch {
    return { ...defaults }
  }
}
