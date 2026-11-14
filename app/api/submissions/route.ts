// Superseded by the presigned-upload flow.
// New flow: POST /api/submissions/start → upload files via signed URLs → POST /api/submissions/[id]/finalize
// This stub remains to give a clear error to any cached client still hitting the old endpoint.
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint has been updated. Please reload the page and try your submission again.' },
    { status: 410 }
  )
}
