import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const rl = checkRateLimit(getRateLimitKey(req, 'submission'), { limit: 10, windowMs: 300_000 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })
    }

    const body = await req.json()

    // Honeypot
    if (body._gotcha) {
      return NextResponse.json({ id: crypto.randomUUID() })
    }

    const {
      first_name, last_name, email, phone, dob, city, state, bio,
      stage_name, representation_type, union_status, categories,
      gender, height, weight, hair_color, eye_color,
      ethnicity, ethnicity_other, wardrobe_sizes, shoe_size, skills,
      languages, dialects, instruments,
      demo_reel_url, voice_reel_url, instagram, tiktok, youtube,
      guardian_name, guardian_email, guardian_phone, guardian_relationship,
    } = body as Record<string, unknown>

    if (!String(first_name ?? '').trim() || !String(last_name ?? '').trim() || !String(email ?? '').trim()) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    const dobStr = String(dob ?? '')
    let is_minor = false
    if (dobStr) {
      const birth = new Date(dobStr)
      const today = new Date()
      let age = today.getFullYear() - birth.getFullYear()
      const m = today.getMonth() - birth.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
      is_minor = age < 18
    }

    const toArr = (v: unknown): string[] => Array.isArray(v) ? v : (typeof v === 'string' && v ? v.split(',').map(s => s.trim()).filter(Boolean) : [])

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('talent_submissions')
      .insert({
        first_name: String(first_name).trim(),
        last_name: String(last_name).trim(),
        email: String(email).trim(),
        phone: phone ? String(phone) : null,
        dob: dobStr || null,
        city: city ? String(city) : null,
        state: state ? String(state) : null,
        bio: bio ? String(bio) : null,
        stage_name: stage_name ? String(stage_name) : null,
        representation_type: representation_type ? String(representation_type) : null,
        union_status: union_status ? String(union_status) : null,
        categories: toArr(categories),
        gender: gender ? String(gender) : null,
        height: height ? String(height) : null,
        weight: weight ? String(weight) : null,
        hair_color: hair_color ? String(hair_color) : null,
        eye_color: eye_color ? String(eye_color) : null,
        ethnicity: toArr(ethnicity),
        ethnicity_other: ethnicity_other ? String(ethnicity_other) : null,
        wardrobe_sizes: (typeof wardrobe_sizes === 'object' && wardrobe_sizes !== null) ? wardrobe_sizes : {},
        shoe_size: shoe_size ? String(shoe_size) : null,
        skills: toArr(skills),
        languages: toArr(languages),
        dialects: toArr(dialects),
        instruments: instruments ? String(instruments) : null,
        demo_reel_url: demo_reel_url ? String(demo_reel_url) : null,
        voice_reel_url: voice_reel_url ? String(voice_reel_url) : null,
        instagram: instagram ? String(instagram) : null,
        tiktok: tiktok ? String(tiktok) : null,
        youtube: youtube ? String(youtube) : null,
        is_minor,
        guardian_name: is_minor && guardian_name ? String(guardian_name) : null,
        guardian_email: is_minor && guardian_email ? String(guardian_email) : null,
        guardian_phone: is_minor && guardian_phone ? String(guardian_phone) : null,
        guardian_relationship: is_minor && guardian_relationship ? String(guardian_relationship) : null,
        status: 'incomplete',
      })
      .select('id')
      .single()

    if (error) {
      console.error('[submissions/start] DB insert failed:', error.message)
      return NextResponse.json({ error: 'Could not start your application. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ id: data.id })
  } catch (err) {
    console.error('[submissions/start] unexpected:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
