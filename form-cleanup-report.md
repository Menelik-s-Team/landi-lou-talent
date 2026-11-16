# Form Cleanup Report — Landi-Lou Talent Agency
Branch: fix/form-cleanup | November 2026 commitment to Donnette

---

## Step 1 — Form Map (Read Only)

### File
`app/submit/page.tsx` — 1,687 lines, single client component, 7-step wizard.

### Steps & Fields

**Step 1 — Personal Info**
- First Name (required), Last Name (required), Stage Name (optional)
- Email (required), Phone (optional)
- Date of Birth (required), City (required), State (required)
- Bio (optional)
- Guardian section — conditional on DOB showing minor:
  - Guardian Full Name (required if minor), Relationship, Guardian Email (required if minor), Guardian Phone

**Step 2 — Talent Details**
- Representation Type (required): Exclusive / Non-Exclusive
- Union Status (required): SAG-AFTRA / SAG-Eligible / Equity / EMC / Non-Union / Other
- Talent Categories (required, at least one): 16 options in flat 2-column grid — Actor, Commercial, Television, Theatre, Print, Fashion, Modeling, Lifestyle, Voice Over, Singer, Dancer, Host, Influencer, Children & Youth, Fitness, Specialty Talent

**Step 3 — Attributes & Skills**
- Gender (required): Male / Female / Non-Binary / Prefer not to say
- Height (optional), Weight (optional) — freetext, no unit hints
- Hair Color (optional), Eye Color (optional) — select dropdowns
- Ethnicity (optional): 8 checkbox options (Other included)
- Skin Tone (optional) — select dropdown — FLAGGED FOR REMOVAL
- Wardrobe Sizes (optional): gender-conditional sets; Male (neck, sleeve, jacket, pant waist, inseam, hat, shoe); Female (dress, shirt, pant, bust, waist, hip, shoe); Non-Binary/PNTS shows both
- Skills (optional): 4 groups × checkbox grid
- Languages Spoken (optional), Accents / Dialects (optional), Musical Instruments (optional)

**Step 4 — Media**
- Primary Headshot (required): JPG/PNG/WEBP, max 10 MB — no format hint on the label
- Commercial Headshot, Theatrical Headshot, Full Body Photo — optional, same formats
- Resume (PDF) — optional; no format/size hint on the label
- Demo Reel URL (optional), Voice Reel URL (optional)
- Social Handles: Instagram, TikTok, YouTube (all optional)

**Step 5 — Experience**
- Experience Categories (optional): same full 16-item flat list as Step 2 — REDUNDANT
- Experience Level (required): Beginner / Intermediate / Professional / Extensive Credits
- Notable Credits (optional): textarea

**Step 6 — Availability**
- Availability Type (optional): 4 options — "Local Hire Only", "Available to Travel", "Available Nationally", "Available Internationally" — FIRST TWO OVERLAP with will_travel + local_hire_markets
- Will travel boolean (optional), Has passport (optional), Has driver's license (optional), Has transportation (optional)
- Local Hire Markets (optional): freetext

**Step 7 — Review**
- Displays all prior data, renders "—" for empty values
- skin_tone shown — FLAGGED FOR REMOVAL
- will_travel NOT shown in Availability section — OVERSIGHT
- No Edit button per section — FLAGGED
- No ethnicity_other self-describe display

### API surface
- `POST /api/submissions/start` — creates the DB record, stores categories, skin_tone, etc.
- `POST /api/submissions/[id]/upload-url` — signs upload URLs
- `PATCH /api/submissions/[id]/file` — records confirmed file path
- `POST /api/submissions/[id]/finalize` — final submit with all fields; sends talent confirmation email + admin notification
  - Confirmation email body: "We will be in touch if there is a fit." + "Excellence is a practice." — NO next-steps passage

### Database notes
- `skin_tone` column: text, no constraint, exists in talent_submissions (migration 007) — 24 of 35 submissions carry values. DO NOT DROP.
- `ethnicity_other` column: does NOT yet exist — needs additive migration (013).
- `ethnicity`: text[], no CHECK constraint — safe to modify values.
- `availability_type`: text[], no CHECK constraint — safe to remove options from UI.

### Issues found (all fixed in Steps 2–8)
1. Skin tone question — present in form, review screen; not in admin view — remove from form/review
2. Ethnicity missing self-describe — no ethnicity_other column or input
3. Category list asked twice (Step 2 and Step 5 identically) — Step 5 should filter to Step 2 selections
4. availability_type has redundant "Local Hire Only" / "Available to Travel" overlapping boolean fields
5. Height/weight lack unit hints or toggle
6. Wardrobe measurement placeholders lack unit labels
7. Resume upload: credits are optional but no note when resume makes credits redundant
8. Review screen: "—" instead of "Not provided" for empty values
9. Review screen: no Edit buttons per section
10. Review screen: will_travel not displayed in Availability section
11. No Required/Optional labels on form fields
12. No format/size info on upload fields
13. Confirmation email: no next-steps passage

---

## Step 2 — Remove Skin Tone

Removed from:
- `FormData` type (skin_tone field)
- Initial `formData` state
- Step 3 form (the select element and its wrapping div, lines 1103–1111)
- Review screen (Attributes & Skills section, skin_tone row)
- `buildStartPayload` (skin_tone key)
- `app/api/submissions/[id]/finalize/route.ts` (skin_tone update line)

NOT changed: DB column `skin_tone` retained as-is, stored values preserved.
Admin view: skin_tone was not rendered there — no change needed.

---

## Step 3 — Ethnicity Self-Describe

Migration: `supabase/migrations/013_ethnicity_other.sql`
- Adds `ethnicity_other text` to `talent_submissions`
- Additive only — no drops, no data modification

Form changes:
- `ethnicity_other: string` added to `FormData` type and initial state
- Text input shown below ethnicity checklist when "Other" is checked
- Placeholder: "Please describe"
- Added to `buildStartPayload` and finalize payload/update

Review screen: added `ethnicity_other` row under Ethnicity in Attributes & Skills (shows only when non-empty).

---

## Step 4 — Categories Asked Once

`GROUPED_CATEGORIES` constant replaces flat `TALENT_CATEGORIES` on Step 2:
- Disciplines: Actor, Singer, Dancer, Host, Voice Over, Influencer
- Work Types: Commercial, Television, Theatre, Print, Fashion, Modeling, Lifestyle, Fitness, Specialty Talent
- Age Markets: Children & Youth

Step 5 now shows only the categories selected in Step 2 (`formData.talent_categories`).
Pre-population: `useEffect` on step — when navigating to Step 5 with empty `experience_categories`, pre-populates from `talent_categories`.

---

## Step 5 — Travel Consolidation

`AVAILABILITY_OPTIONS` reduced from 4 to 2 — removed:
- "Local Hire Only" (overlaps with local_hire_markets text field)
- "Available to Travel" (overlaps with will_travel boolean)

Kept: "Available Nationally", "Available Internationally"
No DB migration needed — `availability_type` has no CHECK constraint.

---

## Step 6 — Measurement Fields with Units

Height and Weight fields: added `heightUnit` / `weightUnit` local state (default: imperial).
Toggle button (ft/in ↔ cm, lbs ↔ kg) appears inline with the label.
Placeholder updates dynamically based on selected unit.
Value stored as freetext — the user types in whatever they enter; the placeholder guides the format.

Wardrobe measurement placeholders updated to include units explicitly (e.g. "e.g. 16 in", "e.g. 36 in").

---

## Step 7 — Resume Makes Credits Optional

No validation change needed (notable_credits was already optional).
Review screen: Notable Credits row now shows "Resume uploaded — see Media" when `notable_credits` is empty and a resume has been uploaded.

---

## Step 8 — Polish

- Required/Optional labels added to all fields (inline spans in amber for Required, muted for Optional)
- Format/size info added to all upload slots
- Edit button added to each review section header (calls `setStep(n)`)
- "—" → "Not provided" throughout review screen
- `will_travel` added to Availability section of review screen
- Next-steps passage added to talent confirmation email:
  > What happens next: Our team reviews every profile personally. If your background matches an open opportunity, we will reach out directly by email. This process may take several weeks — we appreciate your patience.

---

## Migration Applied

`013_ethnicity_other.sql` — additive only, no drops.

---

## Verification — Step 9 Playwright Results

**32/32 passed — desktop Chrome + mobile Chrome (Pixel 5)**

| TC | Test | Desktop | Mobile |
|---|---|---|---|
| TC-01 | Page loads, 7-step stepper visible | PASS | PASS |
| TC-02 | Step 3 has no skin tone field | PASS | PASS |
| TC-03 | ethnicity_other input appears on "Other" check | PASS | PASS |
| TC-04 | Step 3 advances with no ethnicity selected | PASS | PASS |
| TC-05 | Step 2 categories show Disciplines/Work Types/Age Markets | PASS | PASS |
| TC-06 | Step 5 experience categories filtered to Step 2 selections | PASS | PASS |
| TC-07 | Step 6 availability only 2 options, removed options absent | PASS | PASS |
| TC-08 | Height/weight unit toggles change placeholder text | PASS | PASS |
| TC-09 | Required and Optional labels visible on Step 1 | PASS | PASS |
| TC-10 | Format hints in upload labels at Step 4 | PASS | PASS |
| TC-11 | Upload boxes show format and size hints | PASS | PASS |
| TC-12 | skin_tone absent from DOM; page source clean | PASS | PASS |
| TC-13 | skin_tone absent from initial HTML and page source | PASS | PASS |
| TC-14 | Mobile: form loads, step 1 usable on Pixel 5 | PASS | PASS |
| TC-15 | Mobile: height/weight toggles tappable | PASS | PASS |
| TC-16 | "Local Hire Only" and "Available to Travel" absent from DOM | PASS | PASS |

Playwright config: `playwright.config.ts` — headless Chromium, `Desktop Chrome` + `Pixel 5` projects, `baseURL: http://localhost:3000`.
Test file: `tests/form-cleanup.spec.ts`
Commits: `69cbf90` (feature changes), `10a0636` (Playwright tests)

---

---

## Send-Back — Fix 1 + Fix 2

### Fix 1: Height/Weight Unit Storage

**Migration**: `supabase/migrations/014_height_weight_unit.sql`
- Adds `height_unit text` and `weight_unit text` to `talent_submissions` and `talent_profiles` (additive, no drops)
- Applied to remote via `supabase db query --linked`

**Storage shape**: Two separate `text` columns (`height_unit`, `weight_unit`). Values: `'ft/in'` or `'cm'` for height; `'lbs'` or `'kg'` for weight. Stored verbatim with the submission so the value is unambiguous without unit inference. Existing submissions carry NULL — displayed as value-only in review and admin.

**FormData changes**:
- Removed `const [heightUnit, setHeightUnit] = useState<...>` and `weightUnit` from component state
- Added `height_unit: string` and `weight_unit: string` to `FormData` type
- Initial state: `height_unit: 'ft/in'`, `weight_unit: 'lbs'` (defaults shown on toggle button)
- Toggle buttons now call `set('height_unit', ...)` and `set('weight_unit', ...)` — values persist to localStorage draft

**API changes**:
- `buildStartPayload`: added `height_unit` and `weight_unit`
- `start/route.ts`: destructures + inserts both columns
- `finalize/route.ts`: updates both columns in final PATCH

**Review screen**: Height/Weight row shows `"5'10\" (ft/in) / 155 lbs (lbs)"` when units are present; falls back to value-only for NULL units (existing submissions).

**Admin detail page** (`app/admin/submissions/[id]/page.tsx`): Height and Weight rows added to Basic Information grid. Each row shows value with unit in parentheses if present; omitted entirely if `s.height` / `s.weight` is null.

---

### Fix 2: Real E2E Submissions — Results

All 8 tests passed — 4 scenarios × 2 viewports (Desktop Chrome, Mobile 390×844).

**Run**: `npx playwright test tests/e2e-submissions.spec.ts --project desktop-chrome --project mobile-390x844`
**Duration**: 57.9 s — 8/8 passed

| Test | Scenario | Desktop | Mobile 390×844 | Record IDs (deleted) |
|------|----------|---------|----------------|----------------------|
| A | Resume + empty credits → review shows "Resume uploaded — see Media", DB: resume_url set + notable_credits null | PASS | PASS | b4a26069, c304518e |
| B | Credits typed, no resume → submit succeeds, DB: notable_credits = typed value | PASS | PASS | 1473118c, 65d1ac68 |
| C | Zero ethnicity checkboxes → DB stores `ethnicity = []` | PASS | PASS | f14e2951, 8cf66ac4 |
| D | Headshot 5 MB (> old 4.5 MB limit) → upload succeeds with 10 MB limit | PASS | PASS | 61262d36, 2f84f1a7 |

All 16 records created, asserted, and deleted. No Storage files remain.

**playwright.config.ts**: dotenv loading added; `mobile-390x844` project added (viewport 390×844, isMobile, hasTouch, iPhone 14 UA).

---

### Migration notes
Migration 013 (`ethnicity_other`) was also missing from the remote DB and was applied alongside 014. Both confirmed present. PostgREST schema cache reloaded via `NOTIFY pgrst, 'reload schema'`.

---

*Gate cleared — ready for owner sign-off. Do not merge, do not deploy until owner confirms.*
