-- Additive migration: add ethnicity_other self-describe field
-- Does not drop any column or modify existing data.

ALTER TABLE talent_submissions
  ADD COLUMN IF NOT EXISTS ethnicity_other text;

ALTER TABLE talent_profiles
  ADD COLUMN IF NOT EXISTS ethnicity_other text;
