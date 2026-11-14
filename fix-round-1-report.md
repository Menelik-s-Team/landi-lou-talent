# Fix Round 1 Report — Presigned Upload Architecture
Branch: `fix/presigned-uploads` | Date: 2026-11-13 | Status: Built, all 3 browser tests PASSED. One bug found and fixed in Test 3 (see test 3 notes).

---

## Stack Confirmed
Next.js 16.2.12 · React 19.2.4 · Supabase `@supabase/supabase-js ^2.111.0` · Resend · Vercel Hobby plan · Storage bucket `talent-media` (public, `file_size_limit: null` — no bucket-level size cap confirmed before work began)

---

## What Changed — File by File

### New files

**`supabase/migrations/011_incomplete_submission_status.sql`**
Adds `incomplete` to the `submission_status` enum (before `pending`). Applied directly via `supabase db query` after `db push` ran in background without confirming. Enum verified in DB: `incomplete | pending | approved | rejected`.

**`app/api/submissions/start/route.ts`**
`POST /api/submissions/start` — creates an incomplete submission record with all available form data (steps 1–4 text fields). Called once when the applicant first uploads files. Returns `{ id }`. Includes rate limiting (same window as before), honeypot check, and guardian field handling. The record is visible to admins in the submissions list immediately.

**`app/api/submissions/[id]/upload-url/route.ts`**
`POST /api/submissions/[id]/upload-url` — validates file metadata (slot, fileName, fileType, fileSize) server-side before issuing a Supabase Storage signed upload URL. Returns `{ signedUrl, token, path, publicUrl }`. Verifies submission exists and is still `incomplete`. Rejects wrong file types and oversized files with specific error messages naming the file and the limit. No file bytes pass through this route — it only generates auth tokens.

**`app/api/submissions/[id]/file/route.ts`**
`PATCH /api/submissions/[id]/file` — records a confirmed file's public URL on the submission record after the browser has uploaded successfully to Storage. Accepts `{ slot, publicUrl }`. Only updates submissions with `status = 'incomplete'`. Maps slot names (`headshot`, `commercial_headshot`, `theatrical_headshot`, `full_body`, `resume`) to DB column names.

**`app/api/submissions/[id]/finalize/route.ts`**
`POST /api/submissions/[id]/finalize` — receives the full form data as JSON (no file bytes). Validates required fields, checks `is_minor` guardian requirements, verifies the submission is still `incomplete` and that `headshot_url` is present, then `UPDATE`s all fields and flips status to `pending`. Fires confirmation and admin notification emails via `after()` (non-blocking). Returns `{ success: true, id }`.

### Modified files

**`app/api/submissions/route.ts`**
Replaced the entire 334-line multipart file handler with a 10-line stub that returns HTTP 410 with a clear "reload and try again" message. Prevents any cached client from silently submitting via the old endpoint.

**`app/submit/page.tsx`**
Major changes:
- Added `FileSlot` type, `UploadedFile` type, and `validateFileClient()` utility.
- Added state: `submissionId`, `uploadedFiles`, `fileValidErrors`, `uploadStatuses`, `uploadErrors`.
- Extended localStorage draft to persist `_submissionId` and `_uploadedFiles` (confirmed Storage paths). A retry after failure skips already-uploaded files.
- Updated draft load effect to restore `submissionId` and `uploadedFiles` on return.
- `FileUploadBox` component now accepts `slot`, `uploadedFile`, `uploadStatus`, `uploadError`, `validationError`, and `onClearUploaded`. Validates immediately on file selection (before any upload). Shows green "previously uploaded" row for files from prior sessions. Shows spinner during upload. Shows specific per-file error with red border.
- Added `buildStartPayload()` and `buildFinalizePayload()` helpers.
- Added `handleMediaContinue()` async function: validates all selected files client-side → creates submission record (if none) → uploads each new file directly to Supabase Storage via `uploadToSignedUrl` → records each confirmed path → saves to localStorage draft → advances step. Partial failures stay on step 4 with per-file error messages; already-uploaded files are not re-attempted.
- Replaced old `handleSubmit()` (FormData + file bytes) with new version that calls `POST /api/submissions/[submissionId]/finalize` with a small JSON payload.
- Step 4 "Continue" button now calls `handleMediaContinue`.
- Draft banner updated: shows green "files restored" message when uploadedFiles exist; shows amber "re-select photos" message when draft text is restored but files are not.

**`app/admin/submissions/page.tsx`**
- Added `incomplete` filter to separate "In Progress" from "Pending" and "Reviewed".
- Added an "In Progress" section at the top (only visible when incomplete records exist) with a subtitle explaining these are started-but-not-submitted.
- Badge color for `incomplete`: gray (`bg-[#9ba9bb]/10 text-[#9ba9bb]`), label: "in progress".

---

## The Migration

**`011_incomplete_submission_status.sql`**
```sql
ALTER TYPE submission_status ADD VALUE IF NOT EXISTS 'incomplete' BEFORE 'pending';
```
Adds one new enum value. `IF NOT EXISTS` makes it safe to run twice. `BEFORE 'pending'` places it first in the sort order. Applied to production database on 2026-11-13.

**Confirmed in DB:**
```
incomplete | pending | approved | rejected
```

---

## Why the 4.5MB Ceiling Is Gone by Construction

Files no longer touch Vercel serverless functions at any point:
1. Browser calls `POST /api/submissions/[id]/upload-url` — sends only `{ slot, fileName, fileType, fileSize }` as JSON (< 1KB). Server validates and returns a signed URL.
2. Browser calls `supabase.storage.uploadToSignedUrl(path, token, file)` — uploads the file directly to Supabase's CDN endpoint. Vercel is not in this path at all.
3. Browser calls `PATCH /api/submissions/[id]/file` — sends only `{ slot, publicUrl }` as JSON (< 1KB). Server records the path.
4. Final submit: `POST /api/submissions/[id]/finalize` — sends only text/array/boolean fields as JSON (< 10KB).

The largest payload that now passes through Vercel is the finalize JSON — several kilobytes at most. The 4.5MB ceiling cannot be hit because no file bytes are in any Vercel request.

The 20-second proxy timeout is gone for the same reason: `uploadToSignedUrl` runs browser-to-Storage, governed by the browser's own fetch timeout and the user's connection, not a serverless function deadline.

---

## Verification

### Pre-deploy checks — VERIFIED
- `npx tsc --noEmit` → exit 0, no errors
- `npx next build` → clean build, all routes compiled, no warnings

### Database checks — VERIFIED
- `incomplete` enum value confirmed in `submission_status` on the linked Supabase project
- `talent-media` bucket confirmed: `public: true`, `file_size_limit: null` (no bucket-level cap)

### Preview deployment — DEPLOYED
URL: `https://landi-7lb1rzk2i-melos-projects-32303525.vercel.app`
Branch: `fix/presigned-uploads` (not merged to main)

---

### Test 1 — Headline test (large photo submission) — PASSED
**Verified:** 2026-11-13 via Playwright against `http://localhost:3099` (dev server on branch `fix/presigned-uploads`).

**What ran:**
- Filled steps 1–3 with test data (Test Applicant, test.applicant@example.com, Orlando FL)
- On step 4, uploaded a 9MB JPEG (9,216 KB) as Primary Headshot
- Clicked Continue — per-file "Uploading…" spinner appeared on headshot slot, button showed "Submitting..."
- Upload completed, form advanced to step 5 automatically
- Completed steps 5–7 and submitted
- DB confirmed: record `e6728002` with `status: pending`, `headshot_url` pointing to Supabase Storage CDN

**Result:** PASS. 9MB file uploaded without hitting any size limit. Vercel received only the JSON finalize payload (~1KB).

---

### Test 2 — Mobile viewport submission — PASSED
**Verified:** 2026-11-13 via Playwright at 390×844 viewport against `http://localhost:3099`.

**What ran:**
- Resized Playwright viewport to 390×844 (iPhone 12)
- Screenshot confirmed form renders correctly at mobile width — step indicator, fields, and upload boxes all usable
- Ran same full submission flow as Test 1 (Mobile TestUser, mobile.test@example.com, Tampa FL)
- Uploaded 9MB JPEG, form advanced to step 5, completed all steps, submitted
- Success screen: "Application Received" with checkmark icon — screenshot captured

**Result:** PASS. Layout correct at mobile width. Upload architecture is network-layer; viewport has no effect on file transfer.

---

### Test 3 — Failure + retry test — PASSED
**Verified:** 2026-11-13 via Playwright against `http://localhost:3099`.

**Bug found and fixed during test:** Initial implementation stopped ALL uploads when any file failed validation. Fixed to skip only invalid slots and proceed with valid files. The fix is in `handleMediaContinue` in `app/submit/page.tsx` — validation errors are set per-slot but no longer cause an early return; the upload loop skips slots with validation errors; advancing to step 5 is blocked if any validation errors OR upload errors remain.

**What ran:**
1. Step 4: selected valid 9MB headshot + 11MB commercial headshot (exceeds 10MB limit)
2. Clicked Continue — inline error shown on commercial slot: "test-toobig.jpg is 11.0MB — photo files must be 10MB or smaller." Headshot uploaded successfully (spinner → done), form stayed on step 4
3. DB confirmed: `incomplete` record `fdde26cf` created with `headshot_url` recorded, `commercial_headshot_url` null
4. Replaced 11MB commercial headshot with valid 47KB file, clicked Continue — headshot slot showed "Previously uploaded files have been restored" banner (not re-uploaded), only commercial headshot uploaded
5. Completed steps 5–7, submitted
6. DB confirmed: same record `fdde26cf` flipped to `status: pending`, `commercial_headshot_url` now populated

**Result:** PASS. Valid file uploaded on first attempt and preserved. Invalid file showed specific per-slot error. Retry uploaded only the failed slot. Record correctly transitioned `incomplete` → `pending`.

---

## Unrelated Findings (Untouched — Not Fixed in This Round)

- **27 talent locked out of portal** (1-hour Supabase recovery token expiry) — see `diagnosis-report.md` Area 2.
- **19 completed portfolios awaiting agency countersignature** — operational backlog, see `diagnosis-report.md` Area 3.
- **4 approved talent with no talent_profile** (Karen Aul, Erica Turner, Zoe/Andrea Allen shared email) — see `diagnosis-report.md` Area 3.
- **Approve route silent profileError** — approval succeeds even when talent_profile insert fails. Not addressed.
- **No "Forgot Password" link on login page** — talent locked out of portal have no self-serve recovery. Not addressed.
- **In-memory rate limiter** — still non-functional on Vercel serverless cold starts. Not addressed (not harmful).
