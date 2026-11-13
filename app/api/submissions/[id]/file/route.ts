import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const SLOT_TO_COLUMN: Record<string, string> = {
  headshot: 'headshot_url',
  commercial_headshot: 'commercial_headshot_url',
  theatrical_headshot: 'theatrical_headshot_url',
  full_body: 'full_body_url',
  resume: 'resume_url',
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { slot, publicUrl } = await req.json() as { slot: string; publicUrl: string }

  const column = SLOT_TO_COLUMN[slot]
  if (!column) {
    return NextResponse.json({ error: 'Invalid file slot.' }, { status: 400 })
  }

  if (!publicUrl) {
    return NextResponse.json({ error: 'publicUrl is required.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('talent_submissions')
    .update({ [column]: publicUrl })
    .eq('id', id)
    .eq('status', 'incomplete')

  if (error) {
    console.error(`[submissions/${id}/file] update failed:`, error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
