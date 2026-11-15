-- Admin recovery action log
-- Records every use of Resend Portal Access and Extend Onboarding Link admin tools.
CREATE TABLE admin_recovery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_profile_id uuid REFERENCES talent_profiles(id) ON DELETE SET NULL,
  talent_email text NOT NULL,
  talent_name text,
  action_type text NOT NULL CHECK (action_type IN ('resend_portal', 'extend_onboarding')),
  performed_at timestamptz NOT NULL DEFAULT now(),
  note text
);

CREATE INDEX idx_admin_recovery_log_talent_profile ON admin_recovery_log(talent_profile_id);
CREATE INDEX idx_admin_recovery_log_performed_at ON admin_recovery_log(performed_at DESC);

ALTER TABLE admin_recovery_log ENABLE ROW LEVEL SECURITY;
-- Service role key (used by admin API routes) bypasses RLS.
-- Anon and authenticated talent/casting roles have no access.
CREATE POLICY "no public access" ON admin_recovery_log FOR ALL TO anon, authenticated USING (false);
