import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth-guard'

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const body = await req.json()
  const supabase = createAdminClient()

  const { create_account, ...fields } = body

  if (!fields.first_name || !fields.last_name) {
    return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 })
  }

  let user_id: string | null = null

  if (create_account && fields.email) {
    const tempPassword = `Landi${Math.random().toString(36).slice(2, 10).toUpperCase()}!`
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: fields.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { role: 'talent' },
    })
    if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })
    user_id = authData.user.id
    await supabase.from('profiles').upsert({
      id: user_id,
      email: fields.email,
      role: 'talent',
      full_name: `${fields.first_name} ${fields.last_name}`,
    }, { onConflict: 'id' })
  }

  const allowedFields = [
    'first_name', 'last_name', 'stage_name', 'email', 'phone', 'dob',
    'city', 'state', 'bio', 'gender', 'categories', 'representation_type',
    'union_status', 'experience_level', 'experience_categories',
    'height', 'weight', 'hair_color', 'eye_color', 'ethnicity',
    'wardrobe_sizes', 'shoe_size', 'skills', 'languages', 'dialects',
    'has_passport', 'has_drivers_license', 'has_transportation',
    'will_travel', 'local_hire_markets', 'instagram', 'tiktok', 'youtube',
    'headshot_url', 'commercial_headshot_url', 'theatrical_headshot_url',
    'full_body_url', 'resume_url', 'demo_reel_url', 'voice_reel_url',
    'is_available', 'is_minor', 'guardian_name', 'guardian_email',
    'guardian_phone', 'guardian_relationship',
    'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
    'plays_age_min', 'plays_age_max', 'work_authorization',
    'actors_access_profile', 'backstage_profile', 'commercial_conflicts',
    'acting_training', 'previous_agency',
    'measurements', 'skin_tone', 'tattoos_markings', 'swim_ability',
    'contract_start_date', 'contract_end_date', 'commission_rate',
    'day_rate', 'agent_notes',
  ]

  const VALID_REPRESENTATION = new Set(['Exclusive', 'Non-Exclusive'])
  const VALID_UNION = new Set(['SAG-AFTRA', 'SAG-Eligible', 'Equity', 'EMC', 'Non-Union', 'Other'])
  const VALID_EXPERIENCE = new Set(['Beginner', 'Intermediate', 'Professional', 'Extensive Credits'])

  if (fields.representation_type && !VALID_REPRESENTATION.has(fields.representation_type)) {
    return NextResponse.json({ error: `Invalid representation type "${fields.representation_type}". Must be Exclusive or Non-Exclusive.` }, { status: 400 })
  }
  if (fields.union_status && !VALID_UNION.has(fields.union_status)) {
    return NextResponse.json({ error: `Invalid union status "${fields.union_status}".` }, { status: 400 })
  }
  if (fields.experience_level && !VALID_EXPERIENCE.has(fields.experience_level)) {
    return NextResponse.json({ error: `Invalid experience level "${fields.experience_level}".` }, { status: 400 })
  }

  // Direct additions begin as internal drafts. Availability is granted only
  // after onboarding and agency countersignature.
  const insertData: Record<string, unknown> = { user_id, is_available: false }
  for (const f of allowedFields) {
    if (f in fields && fields[f] !== '' && fields[f] !== null && fields[f] !== undefined) {
      insertData[f] = fields[f]
    }
  }

  const { data: profile, error } = await supabase
    .from('talent_profiles')
    .insert(insertData)
    .select('id')
    .single()

  if (error) {
    // Retry without new columns if they don't exist yet in the DB
    const newCols = [
      'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
      'plays_age_min', 'plays_age_max', 'work_authorization', 'actors_access_profile',
      'backstage_profile', 'commercial_conflicts', 'acting_training', 'previous_agency',
      'measurements', 'skin_tone', 'tattoos_markings', 'swim_ability',
      'contract_start_date', 'contract_end_date', 'commission_rate', 'day_rate', 'agent_notes',
    ]
    if (newCols.some(c => error.message.includes(c))) {
      for (const c of newCols) delete insertData[c]
      const { data: p2, error: e2 } = await supabase.from('talent_profiles').insert(insertData).select('id').single()
      if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })
      return NextResponse.json({ success: true, id: p2?.id, warning: 'Some new fields not saved — run DB migration.' })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: profile?.id })
}
