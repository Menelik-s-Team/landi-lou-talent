-- Add 'incomplete' to the submission_status enum.
-- Incomplete records are created when a talent applicant begins uploading files.
-- They become 'pending' when the applicant finalizes and submits the application.
ALTER TYPE submission_status ADD VALUE IF NOT EXISTS 'incomplete' BEFORE 'pending';
