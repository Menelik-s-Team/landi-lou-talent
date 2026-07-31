-- Site content table for admin-editable text
CREATE TABLE IF NOT EXISTS site_content (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  label text NOT NULL,
  section text NOT NULL,
  hint text,
  is_multiline boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write (using service role in server components)
CREATE POLICY "admin_all" ON site_content FOR ALL USING (true) WITH CHECK (true);

-- Seed default content
INSERT INTO site_content (key, label, section, hint, is_multiline, value) VALUES
  -- Homepage
  ('home_hero_eyebrow',    'Hero Eyebrow Label',       'Homepage', 'Small text above the headline', false, 'Landi-Lou Talent Agency'),
  ('home_hero_line1',      'Hero Headline Line 1',     'Homepage', NULL, false, 'Connecting Talent.'),
  ('home_hero_line2',      'Hero Headline Line 2',     'Homepage', NULL, false, 'Building Careers.'),
  ('home_hero_line3',      'Hero Headline Line 3 (Gold)', 'Homepage', 'Displays in gold gradient', false, 'Creating Opportunities.'),
  ('home_hero_subtext',    'Hero Subtext',             'Homepage', NULL, true, 'A boutique talent agency representing exceptional actors, models, and creatives across film, television, theatre, and beyond.'),
  ('home_philosophy_label','Philosophy Eyebrow',       'Homepage', NULL, false, 'Our Philosophy'),
  ('home_philosophy_quote','Philosophy Quote',         'Homepage', NULL, true, 'We are not a volume agency. We are a premier house of talent, vision, and opportunity — curating careers, building brands, and protecting legacy.'),
  ('home_cta_eyebrow',     'CTA Eyebrow',              'Homepage', NULL, false, 'Ready to Elevate?'),
  ('home_cta_heading',     'CTA Heading',              'Homepage', NULL, false, 'Your next chapter starts here.'),
  ('home_cta_subtext',     'CTA Subtext',              'Homepage', NULL, true, 'Submit your talent profile for review. We move intentionally, partner selectively, and operate with vision.'),

  -- About
  ('about_headline',       'Page Headline',            'About', NULL, false, 'About Landi-Lou'),
  ('about_intro',          'Agency Introduction',      'About', 'First paragraph under the headline', true, 'Landi-Lou Talent Agency was founded by Dr. Calandria U. Smith with one clear vision: to build a premier house of talent, vision, and opportunity — and be a catalyst for transforming legacies.'),
  ('about_mission',        'Mission Statement',        'About', NULL, true, 'We exist to curate excellence, protect artists, and build enduring legacies. We move every prominent talent to their highest potential — professionally, strategically, and authentically.'),
  ('about_difference',     'What Makes Us Different',  'About', NULL, true, 'From stage to screen, social media to brand partnerships, we guide every prominent talent to their highest potential — professionally, strategically, and authentically.'),
  ('founder_name',         'Founder Name',             'About', NULL, false, 'Dr. Calandria U. Smith'),
  ('founder_title',        'Founder Title',            'About', NULL, false, 'Founder & Director'),
  ('founder_quote',        'Founder Quote',            'About', 'Displayed under the founder photo', true, 'This Premier Talent Agency exists to curate excellence, protect artists, and build enduring legacies. We move intentionally, partner selectively, and operate with vision.'),

  -- Representation
  ('rep_heading',          'Page Heading',             'Representation', NULL, false, 'Areas of Representation'),
  ('rep_subtext',          'Page Subtext',             'Representation', NULL, true, 'We place exceptional talent across every major medium. Our roster is selective, our relationships are deep, and our commitment to your career is total.'),
  ('rep_cta_heading',      'CTA Heading',              'Representation', NULL, false, 'Ready to join the roster?'),

  -- For Clients
  ('clients_heading',      'Page Heading',             'For Clients', NULL, false, 'Book Talent'),
  ('clients_subtext',      'Page Subtext',             'For Clients', NULL, true, 'Tell us about your project. We''ll search our private database and present only the talent who best fit your needs. No public browsing — just curated matches, delivered with precision.'),

  -- Agency / Global
  ('agency_tagline',       'Footer Tagline (Left)',    'Agency Info', NULL, true, 'We are not a volume agency. We are a premier house of talent, vision, and opportunity.'),
  ('footer_copyright_suffix', 'Footer Copyright Line', 'Agency Info', NULL, false, 'Curating excellence. Protecting legacy.'),
  ('contact_email',        'Contact Email',            'Agency Info', NULL, false, 'info@landiloutalentagency.com'),
  ('contact_location',     'Location',                 'Agency Info', NULL, false, 'Central Florida')

ON CONFLICT (key) DO NOTHING;
