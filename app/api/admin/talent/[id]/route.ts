import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth-guard'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { id } = await params
  const body = await req.json()
  const supabase = createAdminClient()

  if (body.is_available === true) {
    const { data: portfolio } = await supabase
      .from('talent_onboarding_portfolios')
      .select('status, agency_accepted, guardian_signature_data, talent_submissions(is_minor)')
      .eq('talent_profile_id', id)
      .maybeSingle()

    const submission = portfolio?.talent_submissions as { is_minor?: boolean } | null
    const ready = portfolio?.status === 'completed' && portfolio.agency_accepted === true
    const guardianReady = !submission?.is_minor || Boolean(portfolio?.guardian_signature_data)
    if (!ready || !guardianReady) {
      return NextResponse.json(
        { error: 'Talent cannot be marked available until onboarding and agency countersignature are complete.' },
        { status: 409 }
      )
    }
  }

  const allowedFields = [
    'first_name', 'last_name', 'stage_name', 'email', 'phone', 'dob',
    'city', 'state', 'bio', 'categories', 'representation_type', 'union_status',
    'experience_level', 'experience_categories', 'gender', 'height', 'weight',
    'hair_color', 'eye_color', 'ethnicity', 'wardrobe_sizes', 'shoe_size',
    'skills', 'languages', 'dialects', 'has_passport', 'has_drivers_license',
    'has_transportation', 'will_travel', 'local_hire_markets', 'instagram',
    'tiktok', 'youtube', 'headshot_url', 'commercial_headshot_url',
    'theatrical_headshot_url', 'full_body_url', 'resume_url', 'demo_reel_url',
    'voice_reel_url', 'is_available', 'is_minor', 'guardian_name',
    'guardian_email', 'guardian_phone', 'guardian_relationship',
    // Agent-entered fields
    'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
    'plays_age_min', 'plays_age_max', 'work_authorization',
    'actors_access_profile', 'backstage_profile', 'commercial_conflicts',
    'acting_training', 'previous_agency',
    'measurements', 'skin_tone', 'tattoos_markings', 'swim_ability',
    'notable_credits', 'instruments',
    'contract_start_date', 'contract_end_date', 'commission_rate',
    'day_rate', 'agent_notes', 'talent_tier', 'primary_specialty',
  ]

  const updates: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in body) updates[field] = body[field]
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update.' }, { status: 400 })
  }

  const VALID_REPRESENTATION = new Set(['Exclusive', 'Non-Exclusive'])
  const VALID_UNION = new Set(['SAG-AFTRA', 'SAG-Eligible', 'Equity', 'EMC', 'Non-Union', 'Other'])
  const VALID_EXPERIENCE = new Set(['Beginner', 'Intermediate', 'Professional', 'Extensive Credits'])

  if (updates.representation_type != null && updates.representation_type !== '' && !VALID_REPRESENTATION.has(updates.representation_type as string)) {
    return NextResponse.json({ error: `Invalid representation type "${updates.representation_type}". Must be Exclusive or Non-Exclusive.` }, { status: 400 })
  }
  if (updates.union_status != null && updates.union_status !== '' && !VALID_UNION.has(updates.union_status as string)) {
    return NextResponse.json({ error: `Invalid union status "${updates.union_status}".` }, { status: 400 })
  }
  if (updates.experience_level != null && updates.experience_level !== '' && !VALID_EXPERIENCE.has(updates.experience_level as string)) {
    return NextResponse.json({ error: `Invalid experience level "${updates.experience_level}".` }, { status: 400 })
  }

  const { error } = await supabase
    .from('talent_profiles')
    .update(updates)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { id } = await params
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('talent_profiles')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
