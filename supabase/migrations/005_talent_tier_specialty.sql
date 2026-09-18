-- Add Donet-managed tier flag and primary specialty to talent profiles

ALTER TABLE talent_profiles
  ADD COLUMN IF NOT EXISTS talent_tier text CHECK (talent_tier IN ('Tier 1', 'Tier 2')),
  ADD COLUMN IF NOT EXISTS primary_specialty text;
