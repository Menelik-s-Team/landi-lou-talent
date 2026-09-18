import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth-guard'

const FIELD_MAP: Record<string, string> = {
  headshot: 'headshot_url',
  commercial_headshot: 'commercial_headshot_url',
  theatrical_headshot: 'theatrical_headshot_url',
  full_body: 'full_body_url',
  resume: 'resume_url',
}

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png'])
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_RESUME_BYTES = 5 * 1024 * 1024

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { id } = await params
  const formData = await req.formData()
  const fileType = formData.get('file_type') as string
  const file = formData.get('file') as File | null

  if (!file || file.size === 0) return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  if (!FIELD_MAP[fileType]) return NextResponse.json({ error: 'Invalid file type.' }, { status: 400 })
  const isResume = fileType === 'resume'
  if (file.size > (isResume ? MAX_RESUME_BYTES : MAX_IMAGE_BYTES)) {
    return NextResponse.json({ error: `${isResume ? 'Resume' : 'Image'} files are too large.` }, { status: 400 })
  }
  if (isResume ? file.type !== 'application/pdf' : !IMAGE_TYPES.has(file.type)) {
    return NextResponse.json({ error: isResume ? 'Resume must be a PDF.' : 'Photos must be JPG or PNG.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const ext = isResume ? 'pdf' : file.type === 'image/png' ? 'png' : 'jpg'
  const path = `admin-uploads/${id}/${fileType}-${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('talent-media')
    .upload(path, file, { contentType: file.type, upsert: true })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data } = supabase.storage.from('talent-media').getPublicUrl(path)
  const publicUrl = data.publicUrl

  const dbField = FIELD_MAP[fileType]
  await supabase.from('talent_profiles').update({ [dbField]: publicUrl }).eq('id', id)

  return NextResponse.json({ success: true, url: publicUrl, field: dbField })
}
