import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('talent_onboarding_portfolios')
    .select('*, talent_submissions(first_name, last_name, email, phone, dob, city, state, is_minor, guardian_name, guardian_relationship)')
    .eq('token', token)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Portfolio not found.' }, { status: 404 })
  }

  if (data.token_expires_at && new Date(data.token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'This onboarding link has expired.' }, { status: 410 })
  }

  return NextResponse.json(data)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const body = await req.json()
  const { step, data: stepData } = body as { step: number; data: Record<string, unknown> }

  const supabase = createAdminClient()

  // Verify the portfolio exists and is not completed or expired
  const { data: portfolio, error: fetchError } = await supabase
    .from('talent_onboarding_portfolios')
    .select('id, status, token_expires_at')
    .eq('token', token)
    .single()

  if (fetchError || !portfolio) {
    return NextResponse.json({ error: 'Portfolio not found.' }, { status: 404 })
  }

  if (portfolio.token_expires_at && new Date(portfolio.token_expires_at) < new Date()) {
    return NextResponse.json({ error: 'This onboarding link has expired.' }, { status: 410 })
  }

  if (portfolio.status === 'completed') {
    return NextResponse.json({ error: 'This portfolio has already been completed.' }, { status: 409 })
  }

  // Build update payload
  const updatePayload: Record<string, unknown> = {
    ...stepData,
    current_step: step,
    status: 'in_progress',
    updated_at: new Date().toISOString(),
  }

  const { error: updateError } = await supabase
    .from('talent_onboarding_portfolios')
    .update(updatePayload)
    .eq('token', token)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
