import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_RESUME_BYTES = 5 * 1024 * 1024
const IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])

const VALID_SLOTS = new Set(['headshot', 'commercial_headshot', 'theatrical_headshot', 'full_body', 'resume'])

const SLOT_PATH_PREFIX: Record<string, string> = {
  headshot: 'headshots',
  commercial_headshot: 'headshots/commercial',
  theatrical_headshot: 'headshots/theatrical',
  full_body: 'photos/full-body',
  resume: 'resumes',
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const body = await req.json()
  const { slot, fileName, fileType, fileSize } = body as {
    slot: string
    fileName: string
    fileType: string
    fileSize: number
  }

  if (!VALID_SLOTS.has(slot)) {
    return NextResponse.json({ error: 'Invalid file slot.' }, { status: 400 })
  }

  const isResume = slot === 'resume'
  const maxBytes = isResume ? MAX_RESUME_BYTES : MAX_IMAGE_BYTES
  const maxLabel = isResume ? '5MB' : '10MB'

  if (fileSize > maxBytes) {
    const sizeMB = (fileSize / 1024 / 1024).toFixed(1)
    return NextResponse.json({
      error: `${fileName} is ${sizeMB}MB — ${isResume ? 'resume' : 'photo'} files must be ${maxLabel} or smaller.`,
    }, { status: 400 })
  }

  if (isResume && fileType !== 'application/pdf') {
    return NextResponse.json({ error: `${fileName}: Resume must be a PDF file.` }, { status: 400 })
  }

  if (!isResume && !IMAGE_TYPES.has(fileType)) {
    return NextResponse.json({ error: `${fileName}: Photos must be JPG or PNG files.` }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: submission } = await supabase
    .from('talent_submissions')
    .select('status')
    .eq('id', id)
    .single()

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })
  }

  if (submission.status !== 'incomplete') {
    return NextResponse.json({ error: 'Submission is already finalized.' }, { status: 409 })
  }

  const ext = fileName.split('.').pop()?.toLowerCase() ?? (isResume ? 'pdf' : 'jpg')
  const path = `${SLOT_PATH_PREFIX[slot]}/${id}-${slot}.${ext}`

  const { data: signedData, error: signedError } = await supabase.storage
    .from('talent-media')
    .createSignedUploadUrl(path, { upsert: true })

  if (signedError || !signedData) {
    console.error('[upload-url] createSignedUploadUrl failed:', signedError?.message)
    return NextResponse.json({ error: 'Could not prepare upload. Please try again.' }, { status: 500 })
  }

  const { data: urlData } = supabase.storage.from('talent-media').getPublicUrl(path)

  return NextResponse.json({
    signedUrl: signedData.signedUrl,
    token: signedData.token,
    path,
    publicUrl: urlData.publicUrl,
  })
}
