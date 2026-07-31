import { createAdminClient } from '@/lib/supabase/admin'
import ContentEditor from './ContentEditor'

export const metadata = { title: 'Edit Content | Admin' }

// All editable fields defined in code — DB values override these defaults
export const CONTENT_FIELDS = [
  // Homepage
  { key: 'home_hero_eyebrow',     label: 'Hero Eyebrow Label',          section: 'Homepage',    hint: 'Small text above the main headline',          multiline: false, default: 'Landi-Lou Talent Agency' },
  { key: 'home_hero_line1',       label: 'Hero Headline — Line 1',      section: 'Homepage',    hint: null,                                           multiline: false, default: 'Connecting Talent.' },
  { key: 'home_hero_line2',       label: 'Hero Headline — Line 2',      section: 'Homepage',    hint: null,                                           multiline: false, default: 'Building Careers.' },
  { key: 'home_hero_line3',       label: 'Hero Headline — Line 3 (Gold)', section: 'Homepage',  hint: 'Displays in gold gradient',                    multiline: false, default: 'Creating Opportunities.' },
  { key: 'home_hero_subtext',     label: 'Hero Subtext',                section: 'Homepage',    hint: null,                                           multiline: true,  default: 'A boutique talent agency representing exceptional actors, models, and creatives across film, television, theatre, and beyond.' },
  { key: 'home_philosophy_label', label: 'Philosophy Eyebrow',          section: 'Homepage',    hint: null,                                           multiline: false, default: 'Our Philosophy' },
  { key: 'home_philosophy_quote', label: 'Philosophy Quote',            section: 'Homepage',    hint: 'The blockquote displayed in the center section', multiline: true, default: 'We are not a volume agency. We are a premier house of talent, vision, and opportunity — curating careers, building brands, and protecting legacy.' },
  { key: 'home_cta_eyebrow',     label: 'Bottom CTA Eyebrow',          section: 'Homepage',    hint: null,                                           multiline: false, default: 'Ready to Elevate?' },
  { key: 'home_cta_heading',     label: 'Bottom CTA Heading',          section: 'Homepage',    hint: null,                                           multiline: false, default: 'Your next chapter starts here.' },
  { key: 'home_cta_subtext',     label: 'Bottom CTA Subtext',          section: 'Homepage',    hint: null,                                           multiline: true,  default: 'Submit your talent profile for review. We move intentionally, partner selectively, and operate with vision.' },

  // About
  { key: 'about_headline',       label: 'Page Headline',               section: 'About',       hint: null,                                           multiline: false, default: 'About Landi-Lou' },
  { key: 'about_intro',          label: 'Agency Introduction',         section: 'About',       hint: 'First paragraph under the headline',           multiline: true,  default: 'Landi-Lou Talent Agency was founded by Dr. Calandria U. Smith with one clear vision: to build a premier house of talent, vision, and opportunity — and be a catalyst for transforming legacies.' },
  { key: 'about_mission',        label: 'Mission Statement',           section: 'About',       hint: null,                                           multiline: true,  default: 'We exist to curate excellence, protect artists, and build enduring legacies. We move every prominent talent to their highest potential — professionally, strategically, and authentically.' },
  { key: 'about_difference',     label: 'What Makes Us Different',     section: 'About',       hint: null,                                           multiline: true,  default: 'From stage to screen, social media to brand partnerships, we guide every prominent talent to their highest potential — professionally, strategically, and authentically.' },
  { key: 'founder_name',         label: 'Founder Name',               section: 'About',       hint: null,                                           multiline: false, default: 'Dr. Calandria U. Smith' },
  { key: 'founder_title',        label: 'Founder Title',              section: 'About',       hint: null,                                           multiline: false, default: 'Founder & Director' },
  { key: 'founder_quote',        label: 'Founder Quote',              section: 'About',       hint: 'Displayed under the founder photo',            multiline: true,  default: 'This Premier Talent Agency exists to curate excellence, protect artists, and build enduring legacies. We move intentionally, partner selectively, and operate with vision.' },

  // Representation
  { key: 'rep_heading',          label: 'Page Heading',               section: 'Representation', hint: null,                                        multiline: false, default: 'Areas of Representation' },
  { key: 'rep_subtext',          label: 'Page Subtext',               section: 'Representation', hint: null,                                        multiline: true,  default: 'We place exceptional talent across every major medium. Our roster is selective, our relationships are deep, and our commitment to your career is total.' },
  { key: 'rep_cta_heading',      label: 'CTA Heading',                section: 'Representation', hint: null,                                        multiline: false, default: 'Ready to join the roster?' },

  // For Clients
  { key: 'clients_heading',      label: 'Page Heading',               section: 'For Clients', hint: null,                                           multiline: false, default: 'Book Talent' },
  { key: 'clients_subtext',      label: 'Page Subtext',               section: 'For Clients', hint: null,                                           multiline: true,  default: "Tell us about your project. We'll search our private database and present only the talent who best fit your needs. No public browsing — just curated matches, delivered with precision." },

  // Agency Info
  { key: 'agency_tagline',          label: 'Agency Tagline (Footer)',  section: 'Agency Info', hint: null,                                           multiline: true,  default: 'We are not a volume agency. We are a premier house of talent, vision, and opportunity.' },
  { key: 'footer_copyright_suffix', label: 'Footer Bottom Tagline',   section: 'Agency Info', hint: 'Right side of the footer bottom bar',          multiline: false, default: 'Curating excellence. Protecting legacy.' },
  { key: 'contact_email',           label: 'Contact Email',           section: 'Agency Info', hint: null,                                           multiline: false, default: 'info@landiloutalentagency.com' },
  { key: 'contact_location',        label: 'Location',                section: 'Agency Info', hint: null,                                           multiline: false, default: 'Central Florida' },
]

export default async function ContentPage() {
  // Try to fetch any saved overrides from the DB
  let dbValues: Record<string, string> = {}
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('site_content')
      .select('key, value')

    if (data) {
      for (const row of data as { key: string; value: string }[]) {
        dbValues[row.key] = row.value
      }
    }
  } catch {
    // Table may not exist yet — editor still works with defaults
  }

  // Merge: DB value wins over default
  const fields = CONTENT_FIELDS.map(f => ({
    ...f,
    value: dbValues[f.key] ?? f.default,
  }))

  // Group by section
  const sections: Record<string, typeof fields> = {}
  for (const f of fields) {
    if (!sections[f.section]) sections[f.section] = []
    sections[f.section].push(f)
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-10">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Website Management</p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Edit Content</h1>
        <p className="text-[#9ba9bb] text-sm mt-3">
          Edit any field and click <strong className="text-[#f0ead8]">Save</strong> — changes go live on the website immediately.
        </p>
      </div>

      <ContentEditor sections={sections} />
    </div>
  )
}
