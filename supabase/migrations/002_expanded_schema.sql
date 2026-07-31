-- =============================================================================
-- Migration: 002_expanded_schema.sql
-- Description: Expands talent_profiles and talent_submissions with full
--              industry-standard fields; adds talent_requests and
--              talent_auditions tables with RLS policies and indexes.
-- =============================================================================

BEGIN;

-- =============================================================================
-- SECTION 1: Expand talent_profiles
-- =============================================================================

-- Identity / representation
ALTER TABLE talent_profiles
  ADD COLUMN IF NOT EXISTS stage_name             text,
  ADD COLUMN IF NOT EXISTS union_status            text
    CHECK (union_status IN ('SAG-AFTRA', 'SAG-Eligible', 'Equity', 'EMC', 'Non-Union')),
  ADD COLUMN IF NOT EXISTS representation_type     text
    CHECK (representation_type IN ('Exclusive', 'Non-Exclusive'));

-- Physical stats
ALTER TABLE talent_profiles
  ADD COLUMN IF NOT EXISTS height                  text,
  ADD COLUMN IF NOT EXISTS weight                  text,
  ADD COLUMN IF NOT EXISTS hair_color              text,
  ADD COLUMN IF NOT EXISTS eye_color               text,
  ADD COLUMN IF NOT EXISTS ethnicity               text[],
  ADD COLUMN IF NOT EXISTS gender                  text,
  ADD COLUMN IF NOT EXISTS wardrobe_sizes          jsonb    DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS shoe_size               text;

-- Skills & languages
ALTER TABLE talent_profiles
  ADD COLUMN IF NOT EXISTS skills                  text[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS languages               text[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS dialects                text[]   DEFAULT '{}';

-- Experience
ALTER TABLE talent_profiles
  ADD COLUMN IF NOT EXISTS experience_categories   text[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS experience_level        text
    CHECK (experience_level IN ('Beginner', 'Intermediate', 'Professional', 'Extensive Credits'));

-- Availability / logistics
ALTER TABLE talent_profiles
  ADD COLUMN IF NOT EXISTS will_travel             boolean  DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_passport            boolean  DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_drivers_license     boolean  DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_transportation      boolean  DEFAULT false,
  ADD COLUMN IF NOT EXISTS local_hire_markets      text[]   DEFAULT '{}';

-- Media assets
ALTER TABLE talent_profiles
  ADD COLUMN IF NOT EXISTS commercial_headshot_url text,
  ADD COLUMN IF NOT EXISTS theatrical_headshot_url text,
  ADD COLUMN IF NOT EXISTS full_body_url           text,
  ADD COLUMN IF NOT EXISTS lifestyle_urls          text[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS resume_url              text,
  ADD COLUMN IF NOT EXISTS demo_reel_url           text,
  ADD COLUMN IF NOT EXISTS voice_reel_url          text,
  ADD COLUMN IF NOT EXISTS slate_url               text,
  ADD COLUMN IF NOT EXISTS intro_video_url         text;

-- Admin / roster fields
ALTER TABLE talent_profiles
  ADD COLUMN IF NOT EXISTS is_featured             boolean  DEFAULT false,
  ADD COLUMN IF NOT EXISTS previous_bookings_count integer  DEFAULT 0;


-- =============================================================================
-- SECTION 2: Expand talent_submissions
-- (mirrors talent_profiles so approved submissions carry all data forward)
-- =============================================================================

-- Identity / representation
ALTER TABLE talent_submissions
  ADD COLUMN IF NOT EXISTS stage_name             text,
  ADD COLUMN IF NOT EXISTS union_status            text,
  ADD COLUMN IF NOT EXISTS representation_type     text;

-- Physical stats
ALTER TABLE talent_submissions
  ADD COLUMN IF NOT EXISTS height                  text,
  ADD COLUMN IF NOT EXISTS weight                  text,
  ADD COLUMN IF NOT EXISTS hair_color              text,
  ADD COLUMN IF NOT EXISTS eye_color               text,
  ADD COLUMN IF NOT EXISTS ethnicity               text[],
  ADD COLUMN IF NOT EXISTS gender                  text,
  ADD COLUMN IF NOT EXISTS wardrobe_sizes          jsonb    DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS shoe_size               text;

-- Skills & languages
ALTER TABLE talent_submissions
  ADD COLUMN IF NOT EXISTS skills                  text[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS languages               text[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS dialects                text[]   DEFAULT '{}';

-- Experience
ALTER TABLE talent_submissions
  ADD COLUMN IF NOT EXISTS experience_categories   text[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS experience_level        text;

-- Availability / logistics
ALTER TABLE talent_submissions
  ADD COLUMN IF NOT EXISTS will_travel             boolean  DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_passport            boolean  DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_drivers_license     boolean  DEFAULT false,
  ADD COLUMN IF NOT EXISTS has_transportation      boolean  DEFAULT false,
  ADD COLUMN IF NOT EXISTS local_hire_markets      text[]   DEFAULT '{}';

-- Media assets
ALTER TABLE talent_submissions
  ADD COLUMN IF NOT EXISTS commercial_headshot_url text,
  ADD COLUMN IF NOT EXISTS theatrical_headshot_url text,
  ADD COLUMN IF NOT EXISTS full_body_url           text,
  ADD COLUMN IF NOT EXISTS lifestyle_urls          text[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS resume_url              text,
  ADD COLUMN IF NOT EXISTS demo_reel_url           text,
  ADD COLUMN IF NOT EXISTS voice_reel_url          text;


-- =============================================================================
-- SECTION 3: Create talent_requests table
-- Casting directors / clients submit talent requests via a public-facing form.
-- =============================================================================

CREATE TABLE IF NOT EXISTS talent_requests (
  id                      uuid         DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name            text         NOT NULL,
  project_type            text,
  contact_name            text         NOT NULL,
  company                 text,
  email                   text         NOT NULL,
  phone                   text,
  talent_categories       text[]       DEFAULT '{}',
  gender_preference       text,
  age_range_min           integer,
  age_range_max           integer,
  ethnicity_preference    text[],
  skills_required         text[],
  union_status_preference text,
  dates_needed            text,
  budget_range            text,
  location                text,
  additional_notes        text,
  status                  text         DEFAULT 'pending'
    CHECK (status IN ('pending', 'reviewing', 'matched', 'closed')),
  created_at              timestamptz  DEFAULT now()
);


-- =============================================================================
-- SECTION 4: Create talent_auditions table
-- Tracks audition history and callbacks for each talent profile.
-- =============================================================================

CREATE TABLE IF NOT EXISTS talent_auditions (
  id               uuid         DEFAULT gen_random_uuid() PRIMARY KEY,
  talent_id        uuid         REFERENCES talent_profiles(id) ON DELETE CASCADE,
  title            text         NOT NULL,
  project_type     text,
  casting_company  text,
  audition_date    timestamptz,
  location         text,
  status           text         DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'completed', 'callback', 'booked', 'passed')),
  notes            text,
  created_at       timestamptz  DEFAULT now()
);


-- =============================================================================
-- SECTION 5: Enable RLS on new tables
-- =============================================================================

ALTER TABLE talent_requests   ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_auditions  ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- SECTION 6: RLS Policies — talent_requests
-- Only service-role / admin users can read, insert, or update requests.
-- Public submissions go through a backend API route, not direct client writes.
-- =============================================================================

CREATE POLICY "Admins select talent requests"
  ON talent_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins insert talent requests"
  ON talent_requests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins update talent requests"
  ON talent_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- =============================================================================
-- SECTION 7: RLS Policies — talent_auditions
-- Talent can view their own auditions; admins have full access.
-- =============================================================================

-- Talent selects their own audition records
CREATE POLICY "Talent selects own auditions"
  ON talent_auditions FOR SELECT
  USING (
    talent_id = (
      SELECT id FROM talent_profiles WHERE user_id = auth.uid()
    )
  );

-- Admins have full access to all audition records
CREATE POLICY "Admins manage all auditions"
  ON talent_auditions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- =============================================================================
-- SECTION 8: Indexes for common talent_profiles search filters
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_talent_profiles_union_status
  ON talent_profiles (union_status);

CREATE INDEX IF NOT EXISTS idx_talent_profiles_is_featured
  ON talent_profiles (is_featured);

CREATE INDEX IF NOT EXISTS idx_talent_profiles_is_available
  ON talent_profiles (is_available);


COMMIT;
