# Landi-Lou Talent Agency — Platform Diagnosis Report
Date: 2026-10-30 | Diagnosis only — no code, data, or deployment changes made.

---

## Stack Confirmation

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.2.12 |
| Runtime | React | 19.2.4 |
| Database / Auth / Storage | Supabase | @supabase/ssr ^0.12.4 |
| Email | Resend | latest |
| Deployment | Vercel | Hobby plan |
| Domain | landiloutalentagency.com | Live / production |

---

## One-Paragraph Summary

The platform has three compounding problems. First, the submission form sends all uploaded files in a single POST to a Vercel serverless function, which has a hard 4.5MB request body limit — large file submissions fail silently, files are lost, and talent must start over. Second, the portal access link sent on approval uses a Supabase `recovery` token that expires in 1 hour by default; because the email never warns about this window and the login page has no "forgot password" link, 27 of 30 talent have never accessed their portal and have no self-serve way back in. Third, 19 talent completed their entire onboarding portfolio but none of their portfolios have been countersigned by the agency — leaving them in permanent "Onboarding" limbo and invisible on the roster — while 4 other approved talent have no talent_profile in the database at all due to a silent insert failure in the approve route.

---

## Area 1 — Submission Failures and Lost Applications

### Root Cause 1 — CONFIRMED
**Vercel Hobby plan 4.5MB hard limit on HTTP request body size**

The submission form (`app/submit/page.tsx`) collects headshots, full-body photo, and resume in React state, then sends everything in a single `multipart/form-data` POST to `/api/submissions`. Vercel's Hobby tier imposes a 4.5MB maximum on the entire request body. The code allows up to 10MB per image and 5MB for the resume — a single standard headshot JPEG will often exceed 4.5MB on its own. When Vercel rejects the request, the serverless function never runs; the browser receives a 413 or a network-level error. No DB record is written. No file is saved.

Evidence: `next.config.ts` has no `api.bodyParser` override, `app/api/submissions/route.ts` validates file sizes after parsing, Vercel Hobby plan limit is 4.5MB.

### Root Cause 2 — CONFIRMED
**Files not persisted anywhere until final DB insert**

All file objects (headshots, resume) live exclusively in React `useState`. Text fields are saved to `localStorage` on every keystroke (`DRAFT_KEY = 'landi_lou_submission_draft'`), but files are not. If the submission fails (or the tab is closed, the page refreshes, or the user navigates away at any point), all file selections are gone. The form correctly warns "files cannot be saved" when restoring a draft, but talent have no indication of this before the failure occurs. They must re-select all files from scratch and retry.

### Contributing Factor — CONFIRMED
**20-second per-upload timeout in the API route**

`withTimeout` in `app/api/submissions/route.ts` aborts each file upload to Supabase Storage after 20 seconds. On a slow mobile connection, a 4MB headshot can easily take longer than 20 seconds to transfer. Any upload that exceeds this limit fails the entire submission.

### Contributing Factor — CONFIRMED (non-harmful)
**Rate limiter non-functional on serverless**

`lib/rate-limit.ts` uses an in-memory `Map` as its store. On Vercel serverless, each cold start creates a new Map instance. The rate limiter resets with every cold start and provides no actual protection, but it also means no legitimate submissions are being incorrectly rate-limited.

### Fix
Rewrite uploads to use direct presigned upload URLs: browser uploads each file directly to Supabase Storage (bypassing Vercel entirely), gets back a URL, then submits the form with URLs only. This removes the 4.5MB ceiling and the 20-second proxy timeout in one change. Persist selected file names (not blobs) in localStorage so talent at least know which files they had selected if something goes wrong.

---

## Area 2 — Approval Emails, Account Setup, and Expiring Links

### Root Cause 1 — CONFIRMED
**Portal access link expires in 1 hour; 27 of 30 talent have never logged in**

The approve route (`app/api/submissions/[id]/approve/route.ts`) generates the portal link with:
```ts
await supabase.auth.admin.generateLink({ type: 'recovery', email, options: { redirectTo: '/talent-portal' } })
```
Supabase `recovery` tokens expire in **1 hour** by default. The approval email presents this link as a "Set Up Portal Access" button with no expiry warning. 27 of 30 talent (90%) have never logged into the portal. The oldest waiting account is 95 days old.

The login page (`app/login/page.tsx`) has no "forgot password" link. The temp password created during account setup is never shown to the talent. Once the recovery link expires, there is no self-serve path back in — talent are locked out permanently until an admin manually sends a new reset link from the Supabase dashboard.

**Portal activation summary (27 never logged in):**

| Days waiting | Count |
|-------------|-------|
| 90+ days | 3 |
| 60–89 days | 7 |
| 30–59 days | 3 |
| 15–29 days | 8 |
| 1–14 days | 6 |

Full list with names and emails: `portal-activation-list.md`

### Root Cause 2 — CONFIRMED
**5 talent have expired onboarding portfolio tokens — cannot complete onboarding**

The onboarding link token expires 30 days after the approval. Five talent were approved in August–October and never opened the onboarding link before it expired:

| Name | Approved | Token Expired |
|------|---------|--------------|
| Richard Frank Robert Thole | 2026-08-10 | 2026-09-09 |
| James Duncan | 2026-08-31 | 2026-09-30 |
| Alira Wilson | 2026-09-02 | 2026-10-02 |
| Travell Dickerson | 2026-10-12 | 2026-11-11 |
| Sophia Brown | 2026-10-14 | 2026-11-13 |

There is no "resend onboarding link" function in the admin dashboard. Admin must manually update `token_expires_at` in Supabase's Table Editor to extend the window.

### LIKELY
**2 talent stuck mid-onboarding since October 28**

Nadia Flowers and Donna Sidman both began onboarding on 2026-10-28, reached step 3 of 13, and have not progressed. Their tokens are still valid (expire Nov 14/18 respectively). They may have encountered a form issue, gotten confused, or simply not returned. Admin should follow up directly.

### Missing Feature
No "Resend Portal Access" or "Extend Onboarding Link" button exists in the admin dashboard. All manual remediation currently requires Supabase dashboard access.

### Fix
1. Increase the Supabase recovery token lifetime (Auth Settings → JWT Settings → "OTP expiry"). Set to 7 days minimum. The email should also explicitly state the expiry window.
2. Add "Forgot Password" link to the login page — a separate `/forgot-password` route that calls `supabase.auth.resetPasswordForEmail()`.
3. Add "Resend Portal Access" and "Extend Onboarding Link" buttons to the admin talent detail page.
4. Immediately: use the Supabase dashboard to send new password reset emails to the 27 talent in `portal-activation-list.md`.

---

## Area 3 — Roster Count Discrepancy

### Root Cause 1 — CONFIRMED
**19 completed onboarding portfolios have never been countersigned**

| Completed portfolios | Countersigned (agency_accepted=true) | Not countersigned |
|---------------------|-------------------------------------|------------------|
| 20 | 1 | 19 |

When a talent completes their portfolio, `is_available` remains `false` until the agency countersigns (`agency_accepted` flips to `true`). 19 talent completed their full onboarding — representation agreement, W-9, full profile — and have been waiting for the agency to countersign. They show as "Onboarding" on the admin roster (from the Nov 1 fix) but are invisible on the public-facing talent pool. If all 19 were countersigned today, the available roster would jump from 12 to 31.

This is an operational backlog, not a software bug. The admin portfolio countersign interface exists at `/admin/portfolio/[id]`.

### Root Cause 2 — CONFIRMED
**4 approved submissions have no talent_profile in the database**

The approve route creates the talent_profile with a silent failure — `profileError` is logged to console but does not block the approval or alert the admin. These four people received their approval email and onboarding link, but no profile exists:

| Name | Email | Approved | Likely Cause |
|------|-------|---------|-------------|
| Karen Aul | auntiekaren75@gmail.com | 2026-09-04 | Silent `profileError` |
| Erica Turner | turnertalentvip@gmail.com | 2026-10-19 | Silent `profileError` |
| Zoe Allen | (no auth account) | 2026-10-31 | Shared email conflict (see below) |
| Andrea Allen | indigodee@hotmail.com | 2026-10-31 | Shared email → one auth user, one profile slot |

Zoe and Andrea Allen submitted using the same email address (indigodee@hotmail.com). The first approval created one auth user and one talent_profile. The second approval found the existing auth user, attempted to insert a second talent_profile with the same `user_id`, hit a unique constraint, and failed silently. Only Andrea Allen has a profile. Zoe Allen has no portal account.

### Result — CONFIRMED
**Crystal Rischer: no duplicate.** One record, `is_available=true`, active since 2026-08-04. Any earlier confusion about her roster status was caused by the binary badge issue (fixed Nov 1).

### Database Counts (as of 2026-10-30)

| Table | Count |
|-------|-------|
| talent_submissions — total | 34 |
| talent_submissions — approved | 33 |
| talent_submissions — pending | 1 |
| talent_profiles — total | 31 |
| talent_profiles — is_available=true | 12 |
| talent_profiles — is_available=false | 19 |
| talent_onboarding_portfolios — pending (never opened) | 11 |
| talent_onboarding_portfolios — in_progress | 2 |
| talent_onboarding_portfolios — completed | 20 |
| auth.users (talent role) | 30 |
| auth.users (talent, never logged in) | 27 |

### Fix
1. Manually insert talent_profiles for Karen Aul and Erica Turner via the Supabase Table Editor (all data is in the corresponding `talent_submissions` row).
2. Resolve the Allen family shared-email situation — one of them needs a unique email address for a separate auth account.
3. Add an error response to the approve route so the admin sees a failure when `profileError` occurs, rather than a silent success.
4. Process the 19 completed portfolios through `/admin/portfolio/[id]` to countersign and activate representation.

---

## Proposed Fix Order

| Priority | Fix | Type | Impact |
|----------|-----|------|--------|
| 1 | Send new portal access links to all 27 talent in `portal-activation-list.md` | Data / Supabase dashboard | Immediate talent experience |
| 2 | Countersign the 19 completed portfolios via `/admin/portfolio/[id]` | Operational | Unlocks 19 talent for booking |
| 3 | Increase Supabase recovery token lifetime to 7 days | Config (Supabase dashboard) | Prevents future lockouts |
| 4 | Add "Forgot Password" link to login page | Code | Self-serve recovery path |
| 5 | Add "Resend Portal Access" + "Extend Onboarding Link" to admin talent detail page | Code | Operational efficiency |
| 6 | Manually create missing profiles for Karen Aul and Erica Turner | Data | Recovers 2 lost approvals |
| 7 | Resolve Allen family shared-email conflict | Data + communication | Data integrity |
| 8 | Make profileError fatal in the approve route (return 500 if profile insert fails) | Code | Prevents silent data loss |
| 9 | Rewrite submission uploads to presigned direct-to-Storage URLs | Architecture | Fixes 4.5MB limit permanently |

---

## Additional Risks

**Shared email as family workaround.** The Allen case reveals a gap: a parent who submitted for two family members using one email will always collide in the auth system. Consider adding a "guardian email" vs "talent email" distinction at submission, or explicitly blocking duplicate emails with a user-visible error.

**No submission error visibility for talent.** When a submission fails (413, timeout, Supabase error), the error message is generic. Talent have no way to know whether their application was partially received. Adding a submission ID or confirmation number at the start of the process would let them follow up with the agency.

**Admin console shows success on partial failures.** The approve route returns `{ success: true }` even if the talent_profile insert fails. The approving admin sees "Approved" with no indication anything went wrong. Anywhere the route currently continues past a critical error should surface that failure to the admin.

**No "forgot password" on the login page.** This is blocked in both directions: talent can't get in if the recovery link expired, and the agency has no self-serve button to resend it. Until both are fixed, every locked-out talent requires a manual Supabase dashboard action.
