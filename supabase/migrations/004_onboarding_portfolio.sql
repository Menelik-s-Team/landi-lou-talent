CREATE TABLE talent_onboarding_portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES talent_submissions(id) ON DELETE CASCADE,
  talent_profile_id uuid REFERENCES talent_profiles(id) ON DELETE SET NULL,
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  token_expires_at timestamptz DEFAULT (now() + interval '30 days'),
  status text NOT NULL DEFAULT 'pending', -- pending, in_progress, completed
  current_step int DEFAULT 1,
  completed_at timestamptz,

  -- Personal info
  legal_name text,
  stage_name text,
  preferred_name text,
  pronouns text,
  street_address text,
  zip_code text,
  emergency_contact_name text,
  emergency_contact_relationship text,
  emergency_contact_phone text,

  -- Casting profile
  union_status text,
  height text,
  weight text,
  hair_color text,
  eye_color text,
  has_drivers_license boolean,
  has_passport boolean,
  willing_to_travel boolean,
  local_hire_markets text,
  availability text[],

  -- Measurements (stored as JSONB)
  measurements jsonb DEFAULT '{}',

  -- Skills
  performance_skills text[],
  music_dance_skills text[],
  special_skills text[],
  musical_instruments text,
  languages_spoken text,
  other_special_skills text,

  -- Professional materials
  has_resume boolean DEFAULT false,
  has_demo_reel boolean DEFAULT false,
  has_headshots boolean DEFAULT false,
  has_digitals boolean DEFAULT false,
  has_comp_card boolean DEFAULT false,

  -- Career
  career_goals text,
  skills_to_develop text[],
  skill_to_develop_other text,

  -- Payment info
  payment_method text,
  payment_method_other text,
  financial_institution text,
  account_type text,
  routing_number text,
  account_number text,

  -- W-9
  w9_name text,
  w9_business_name text,
  w9_tax_classification text,
  w9_address text,
  w9_city_state_zip text,
  w9_tin_type text,
  w9_tin text,
  w9_certify_1 boolean DEFAULT false,
  w9_certify_2 boolean DEFAULT false,
  w9_certify_3 boolean DEFAULT false,
  w9_certify_4 boolean DEFAULT false,
  w9_signature_data text,
  w9_signed_at timestamptz,

  -- Agreement initials & dates
  representation_initials text,
  representation_signed_at timestamptz,
  standards_initials text,
  standards_signed_at timestamptz,
  commission_acknowledged boolean DEFAULT false,
  commission_agreed boolean DEFAULT false,
  commission_signed_at timestamptz,
  direct_payments_initials text,
  direct_payments_signed_at timestamptz,

  -- Privacy
  privacy_acknowledged boolean DEFAULT false,
  privacy_acknowledged_at timestamptz,

  -- Final acknowledgement
  final_ack_info_accurate boolean DEFAULT false,
  final_ack_read_agreement boolean DEFAULT false,
  final_ack_read_standards boolean DEFAULT false,
  final_ack_no_guarantee boolean DEFAULT false,
  final_ack_responsibility boolean DEFAULT false,
  final_ack_authorize boolean DEFAULT false,
  talent_printed_name text,
  talent_signature_data text,
  talent_signed_at timestamptz,

  -- Parent/guardian (minors)
  guardian_printed_name text,
  guardian_signature_data text,
  guardian_relationship text,
  guardian_signed_at timestamptz,

  -- Agency countersign (admin)
  agency_rep_name text,
  agency_signature_data text,
  agency_signed_at timestamptz,
  agency_accepted boolean DEFAULT false,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX ON talent_onboarding_portfolios(token);
CREATE INDEX ON talent_onboarding_portfolios(submission_id);
CREATE INDEX ON talent_onboarding_portfolios(status);

ALTER TABLE talent_onboarding_portfolios ENABLE ROW LEVEL SECURITY;

-- Public access via token (no auth required)
CREATE POLICY "Token holders can read own portfolio"
  ON talent_onboarding_portfolios FOR SELECT
  USING (true);

CREATE POLICY "Token holders can update own portfolio"
  ON talent_onboarding_portfolios FOR UPDATE
  USING (true);

-- Admins can do everything
CREATE POLICY "Admins manage portfolios"
  ON talent_onboarding_portfolios FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER onboarding_portfolios_updated_at
  BEFORE UPDATE ON talent_onboarding_portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
