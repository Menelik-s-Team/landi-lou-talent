ALTER TABLE talent_submissions ADD COLUMN IF NOT EXISTS height_unit text;
ALTER TABLE talent_submissions ADD COLUMN IF NOT EXISTS weight_unit text;
ALTER TABLE talent_profiles    ADD COLUMN IF NOT EXISTS height_unit text;
ALTER TABLE talent_profiles    ADD COLUMN IF NOT EXISTS weight_unit text;
