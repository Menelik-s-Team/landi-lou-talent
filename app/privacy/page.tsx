import type { Metadata } from 'next'
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Landi-Lou Talent Agency.',
  alternates: { canonical: 'https://landiloutalentagency.com/privacy' },
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-40 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Legal</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8] mb-4">Privacy Policy</h1>
          <p className="text-[#9ba9bb] text-sm mb-10">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-invert max-w-none text-[#9ba9bb] leading-relaxed space-y-8">

            <section>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">Who We Are</h2>
              <p>Landi-Lou Talent Agency (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a Florida-based talent agency. Our website is <strong className="text-[#f0ead8]">landiloutalentagency.com</strong>.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">Information We Collect</h2>
              <p>When you submit a talent application, we may collect:</p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>Name, date of birth, and contact information</li>
                <li>Physical attributes and professional experience</li>
                <li>Headshots, portfolio photos, video reels, and voice recordings</li>
                <li>Social media handles and website URLs</li>
                <li>Availability and geographic information</li>
              </ul>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">Minors — Important Notice</h2>
              <div className="border border-[#c9a84c]/30 bg-[#c9a84c]/5 rounded-lg p-5">
                <p className="text-sm">We do not knowingly collect personal information from children under 13 without verifiable parental consent. If you are under 18, a parent or legal guardian must review and consent to this Privacy Policy before submitting an application on your behalf. If we learn that we have collected personal information from a child under 13 without parental consent, we will delete that information promptly. Contact us at <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] underline">info@landiloutalentagency.com</a> for immediate removal requests.</p>
              </div>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">How We Use Your Information</h2>
              <p>We use submitted information to:</p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>Review talent applications and determine representation fit</li>
                <li>Contact you regarding representation opportunities</li>
                <li>Present your profile to prospective clients (only if represented)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">Data Retention</h2>
              <p>Application data is retained for up to 24 months. You may request deletion of your information at any time by emailing <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] underline">info@landiloutalentagency.com</a>.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">Contact</h2>
              <p>For any privacy questions or data requests: <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] underline">info@landiloutalentagency.com</a></p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
