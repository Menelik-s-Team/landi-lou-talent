-- Add notable_credits, instruments, and skin_tone to submissions
ALTER TABLE talent_submissions
  ADD COLUMN IF NOT EXISTS skin_tone       text,
  ADD COLUMN IF NOT EXISTS notable_credits text,
  ADD COLUMN IF NOT EXISTS instruments     text;

-- Add to profiles (skin_tone already exists, add the rest)
ALTER TABLE talent_profiles
  ADD COLUMN IF NOT EXISTS notable_credits text,
  ADD COLUMN IF NOT EXISTS instruments     text;
