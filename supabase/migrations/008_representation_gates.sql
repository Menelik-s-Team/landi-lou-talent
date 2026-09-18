-- Representation gates: talent cannot make themselves bookable. Only a
-- completed onboarding portfolio with agency countersignature can do so.
BEGIN;

DROP POLICY IF EXISTS "Talent updates own profile" ON talent_profiles;

CREATE POLICY "Talent updates own profile"
  ON talent_profiles FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND (
      is_available = false
      OR EXISTS (
        SELECT 1
        FROM talent_onboarding_portfolios p
        WHERE p.talent_profile_id = talent_profiles.id
          AND p.status = 'completed'
          AND p.agency_accepted = true
          AND (
            NOT talent_profiles.is_minor
            OR p.guardian_signature_data IS NOT NULL
          )
      )
    )
  );

COMMIT;
