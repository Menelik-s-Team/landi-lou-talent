-- Migration: 010_availability_type.sql
-- Adds availability_type column to talent_submissions and talent_profiles.
-- This field stores checkboxes like "Local Hire Only", "Available to Travel", etc.

BEGIN;

ALTER TABLE talent_submissions
  ADD COLUMN IF NOT EXISTS availability_type text[] DEFAULT '{}';

ALTER TABLE talent_profiles
  ADD COLUMN IF NOT EXISTS availability_type text[] DEFAULT '{}';

COMMIT;
