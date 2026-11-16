import { test, expect, Page } from '@playwright/test'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'

require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// ─── Temp test files ──────────────────────────────────────────────────────────

const tmpDir = os.tmpdir()

const HEADSHOT_PATH = path.join(tmpDir, 'e2e-headshot.jpg')
const LARGE_HEADSHOT_PATH = path.join(tmpDir, 'e2e-headshot-5mb.jpg')
const RESUME_PATH = path.join(tmpDir, 'e2e-resume.pdf')

// 1×1 JPEG
const minJpeg = Buffer.from([
  0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
  0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
  0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
  0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
  0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
  0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
  0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
  0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
  0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0xFF, 0xC4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3F, 0x00,
  0x7F, 0xFF, 0xD9,
])
fs.writeFileSync(HEADSHOT_PATH, minJpeg)

// 5 MB fake JPEG — JPEG magic at start, EOI at end
const largeBuf = Buffer.alloc(5 * 1024 * 1024)
minJpeg.copy(largeBuf, 0)
largeBuf[largeBuf.length - 2] = 0xFF
largeBuf[largeBuf.length - 1] = 0xD9
fs.writeFileSync(LARGE_HEADSHOT_PATH, largeBuf)

// Minimal valid PDF
fs.writeFileSync(RESUME_PATH, Buffer.from(
  '%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n' +
  '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n' +
  '3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\n' +
  'xref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n' +
  '0000000058 00000 n \n0000000115 00000 n \n' +
  'trailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF'
))

// ─── Supabase REST helpers ────────────────────────────────────────────────────

async function sbFetch(urlPath: string, opts: RequestInit = {}): Promise<Response> {
  return fetch(`${SB_URL}${urlPath}`, {
    ...opts,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(opts.headers as Record<string, string>),
    },
  })
}

async function queryByEmail(email: string): Promise<Record<string, unknown> | null> {
  const res = await sbFetch(
    `/rest/v1/talent_submissions?email=eq.${encodeURIComponent(email)}&select=id,ethnicity,notable_credits,resume_url,status,height_unit,weight_unit&order=created_at.desc&limit=1`
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`DB query failed ${res.status}: ${body}`)
  }
  const rows = await res.json() as Record<string, unknown>[]
  return rows[0] ?? null
}

async function deleteRecord(id: string): Promise<void> {
  await sbFetch(`/rest/v1/talent_submissions?id=eq.${id}`, { method: 'DELETE' })
}

async function deleteStorageFile(storagePath: string): Promise<void> {
  await fetch(`${SB_URL}/storage/v1/object/talent-media/${storagePath}`, {
    method: 'DELETE',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
  })
}

// ─── Form fill helpers ────────────────────────────────────────────────────────

async function clearDraftAndGo(page: Page): Promise<void> {
  await page.goto('/submit')
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => {
    try { localStorage.clear() } catch {}
  })
  await page.reload()
  await page.waitForLoadState('networkidle')
}

async function fillStep1(page: Page, email: string): Promise<void> {
  await page.fill('[name="first_name"]', 'TEST')
  await page.fill('[name="last_name"]', 'E2E')
  await page.fill('[name="email"]', email)
  await page.fill('[name="phone"]', '4075550000')
  await page.fill('[name="dob"]', '1995-06-15')
  await page.fill('[name="city"]', 'Orlando')
  await page.fill('[name="state"]', 'FL')
}

async function clickContinue(page: Page): Promise<void> {
  await page.click('button:has-text("Continue")')
  await page.waitForTimeout(400)
}

async function fillStep2(page: Page): Promise<void> {
  await page.locator('label').filter({ hasText: 'Non-Exclusive' }).click()
  await page.locator('label').filter({ hasText: 'Non-Union' }).click()
  await page.locator('label').filter({ hasText: 'Actor' }).first().click()
}

async function fillStep3(page: Page): Promise<void> {
  await page.selectOption('[name="gender"]', 'Male')
}

async function fillStep4WithResume(page: Page): Promise<void> {
  const inputs = page.locator('input[type="file"]')
  await inputs.nth(0).setInputFiles(HEADSHOT_PATH)
  await inputs.nth(4).setInputFiles(RESUME_PATH)
}

async function fillStep4HeadshotOnly(page: Page, headshotPath = HEADSHOT_PATH): Promise<void> {
  await page.locator('input[type="file"]').nth(0).setInputFiles(headshotPath)
}

async function fillStep5(page: Page): Promise<void> {
  await page.locator('label').filter({ hasText: 'Beginner' }).click()
}

async function fillStep6(_page: Page): Promise<void> {
  // All optional — skip
}

async function submitReview(page: Page): Promise<void> {
  // Check all three consent boxes
  await page.locator('input[name="confirmed_accurate"]').check({ force: true })
  await page.locator('input[name="accepted_privacy"]').check({ force: true })
  await page.locator('input[name="accepted_terms"]').check({ force: true })
  await page.waitForTimeout(200)
  await page.click('button:has-text("Submit Application")')
}

async function waitForSuccess(page: Page): Promise<void> {
  await page.waitForSelector('h1:has-text("Application Received")', { timeout: 30_000 })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('E2E Submissions — Real Supabase', () => {
  test.setTimeout(120_000)

  // ── Test A: Resume uploaded, credits empty → review shows fallback ──────────
  test('Test A — resume + empty credits → review fallback, DB confirms resume_url + null credits', async ({ page }) => {
    const email = `e2e-a-${Date.now()}@throwaway.example.com`
    let submissionId: string | null = null

    try {
      await clearDraftAndGo(page)

      // Step 1
      await fillStep1(page, email)
      await clickContinue(page)

      // Step 2
      await fillStep2(page)
      await clickContinue(page)

      // Step 3
      await fillStep3(page)
      await clickContinue(page)

      // Step 4 — headshot + resume, no credits typed
      await fillStep4WithResume(page)
      await page.click('button:has-text("Continue")')
      // Wait for upload chain + step 5
      await page.waitForSelector('h2:has-text("Experience")', { timeout: 60_000 })

      // Step 5
      await fillStep5(page)
      // notable_credits intentionally left empty
      await clickContinue(page)

      // Step 6
      await fillStep6(page)
      await clickContinue(page)

      // Step 7 — Review
      await page.waitForSelector('text="Review"', { timeout: 10_000 })
      // Verify fallback text on review screen
      await expect(page.getByText('Resume uploaded — see Media')).toBeVisible()

      // Submit
      await submitReview(page)
      await waitForSuccess(page)

      // Query DB
      const record = await queryByEmail(email)
      expect(record, 'record not found in DB').not.toBeNull()
      submissionId = record!.id as string

      // Assertions
      expect(record!.resume_url, 'resume_url should be set').toBeTruthy()
      expect(record!.notable_credits ?? null, 'notable_credits should be null/empty').toBeFalsy()

      console.log(`Test A record ID: ${submissionId}`)

    } finally {
      if (submissionId) {
        await deleteRecord(submissionId)
        await deleteStorageFile(`headshots/${submissionId}-headshot.jpg`)
        await deleteStorageFile(`resumes/${submissionId}-resume.pdf`)
      }
    }
  })

  // ── Test B: Credits typed, no resume → submit succeeds ─────────────────────
  test('Test B — credits typed, no resume → submit succeeds', async ({ page }) => {
    const email = `e2e-b-${Date.now()}@throwaway.example.com`
    let submissionId: string | null = null

    try {
      await clearDraftAndGo(page)

      await fillStep1(page, email)
      await clickContinue(page)

      await fillStep2(page)
      await clickContinue(page)

      await fillStep3(page)
      await clickContinue(page)

      await fillStep4HeadshotOnly(page)
      await page.click('button:has-text("Continue")')
      await page.waitForSelector('h2:has-text("Experience")', { timeout: 60_000 })

      await fillStep5(page)
      await page.fill('[name="notable_credits"]', 'Lead in test film 2024')
      await clickContinue(page)

      await fillStep6(page)
      await clickContinue(page)

      await submitReview(page)
      await waitForSuccess(page)

      const record = await queryByEmail(email)
      expect(record, 'record not found in DB').not.toBeNull()
      submissionId = record!.id as string

      expect(record!.status).toBe('pending')
      expect(record!.notable_credits).toBe('Lead in test film 2024')

      console.log(`Test B record ID: ${submissionId}`)

    } finally {
      if (submissionId) {
        await deleteRecord(submissionId)
        await deleteStorageFile(`headshots/${submissionId}-headshot.jpg`)
      }
    }
  })

  // ── Test C: Zero ethnicity → stored ethnicity is [] ────────────────────────
  test('Test C — zero ethnicity selected → DB stores empty ethnicity array', async ({ page }) => {
    const email = `e2e-c-${Date.now()}@throwaway.example.com`
    let submissionId: string | null = null

    try {
      await clearDraftAndGo(page)

      await fillStep1(page, email)
      await clickContinue(page)

      await fillStep2(page)
      await clickContinue(page)

      // Step 3 — gender only, no ethnicity checkboxes touched
      await fillStep3(page)
      await clickContinue(page)

      await fillStep4HeadshotOnly(page)
      await page.click('button:has-text("Continue")')
      await page.waitForSelector('h2:has-text("Experience")', { timeout: 60_000 })

      await fillStep5(page)
      await clickContinue(page)

      await fillStep6(page)
      await clickContinue(page)

      await submitReview(page)
      await waitForSuccess(page)

      const record = await queryByEmail(email)
      expect(record, 'record not found in DB').not.toBeNull()
      submissionId = record!.id as string

      const ethnicity = record!.ethnicity as string[]
      expect(Array.isArray(ethnicity), 'ethnicity should be an array').toBe(true)
      expect(ethnicity.length, 'ethnicity should be empty').toBe(0)

      console.log(`Test C record ID: ${submissionId}`)

    } finally {
      if (submissionId) {
        await deleteRecord(submissionId)
        await deleteStorageFile(`headshots/${submissionId}-headshot.jpg`)
      }
    }
  })

  // ── Test D: Headshot > 4.5 MB → upload succeeds (10 MB limit) ──────────────
  test('Test D — headshot 5 MB (> old 4.5 MB limit) → upload succeeds', async ({ page }) => {
    const email = `e2e-d-${Date.now()}@throwaway.example.com`
    let submissionId: string | null = null

    try {
      await clearDraftAndGo(page)

      await fillStep1(page, email)
      await clickContinue(page)

      await fillStep2(page)
      await clickContinue(page)

      await fillStep3(page)
      await clickContinue(page)

      // Use the 5 MB headshot
      await fillStep4HeadshotOnly(page, LARGE_HEADSHOT_PATH)
      await page.click('button:has-text("Continue")')
      // Large upload may take longer
      await page.waitForSelector('h2:has-text("Experience")', { timeout: 60_000 })

      await fillStep5(page)
      await clickContinue(page)

      await fillStep6(page)
      await clickContinue(page)

      await submitReview(page)
      await waitForSuccess(page)

      const record = await queryByEmail(email)
      expect(record, 'record not found in DB').not.toBeNull()
      submissionId = record!.id as string
      expect(record!.status).toBe('pending')

      console.log(`Test D record ID: ${submissionId}`)

    } finally {
      if (submissionId) {
        await deleteRecord(submissionId)
        await deleteStorageFile(`headshots/${submissionId}-headshot.jpg`)
      }
    }
  })
})
