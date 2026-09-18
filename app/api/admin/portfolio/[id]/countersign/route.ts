import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Verify admin session
  const serverSupabase = await createClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data: existing, error: existingError } = await supabase
    .from('talent_onboarding_portfolios')
    .select('status, talent_profile_id, guardian_signature_data, talent_submissions(is_minor)')
    .eq('id', id)
    .single()

  if (existingError || !existing) {
    return NextResponse.json({ error: 'Onboarding portfolio not found.' }, { status: 404 })
  }
  if (existing.status !== 'completed') {
    return NextResponse.json({ error: 'Talent must complete onboarding before countersignature.' }, { status: 409 })
  }
  const submission = existing.talent_submissions as { is_minor?: boolean } | null
  if (submission?.is_minor && !existing.guardian_signature_data) {
    return NextResponse.json({ error: 'Guardian signature is required for a minor before countersignature.' }, { status: 409 })
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { agency_rep_name, agency_signature_data } = body as {
    agency_rep_name: string
    agency_signature_data: string
  }

  if (!agency_rep_name || !agency_signature_data) {
    return NextResponse.json({ error: 'Name and signature are required.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('talent_onboarding_portfolios')
    .update({
      agency_rep_name,
      agency_signature_data,
      agency_signed_at: new Date().toISOString(),
      agency_accepted: true,
    })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (existing.talent_profile_id) {
    await supabase
      .from('talent_profiles')
      .update({ is_available: true })
      .eq('id', existing.talent_profile_id)
  }

  return NextResponse.json({ success: true })
}
