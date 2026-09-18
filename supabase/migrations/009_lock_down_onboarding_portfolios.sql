-- Onboarding is served through the token-validated API routes. Anonymous
-- clients must not be able to read or modify arbitrary portfolio records.
DROP POLICY IF EXISTS "Token holders can read own portfolio" ON talent_onboarding_portfolios;
DROP POLICY IF EXISTS "Token holders can update own portfolio" ON talent_onboarding_portfolios;
