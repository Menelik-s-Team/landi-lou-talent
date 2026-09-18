-- Fix union_status CHECK constraint on talent_submissions to include 'Other'
ALTER TABLE talent_submissions
  DROP CONSTRAINT IF EXISTS talent_submissions_union_status_check;

ALTER TABLE talent_submissions
  ADD CONSTRAINT talent_submissions_union_status_check
  CHECK (union_status IN ('SAG-AFTRA', 'SAG-Eligible', 'Equity', 'EMC', 'Non-Union', 'Other'));

-- Also fix talent_profiles if it has the same constraint
ALTER TABLE talent_profiles
  DROP CONSTRAINT IF EXISTS talent_profiles_union_status_check;

ALTER TABLE talent_profiles
  ADD CONSTRAINT talent_profiles_union_status_check
  CHECK (union_status IN ('SAG-AFTRA', 'SAG-Eligible', 'Equity', 'EMC', 'Non-Union', 'Other'));
