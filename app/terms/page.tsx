import type { Metadata } from 'next'
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for Landi-Lou Talent Agency.',
  alternates: { canonical: 'https://landiloutalentagency.com/terms' },
  robots: { index: false, follow: false },
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-40 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Legal</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8] mb-4">Terms of Use</h1>
          <p className="text-[#9ba9bb] text-sm mb-10">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-invert max-w-none text-[#9ba9bb] leading-relaxed space-y-8">

            <section>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">Acceptance of Terms</h2>
              <p>By accessing or using the Landi-Lou Talent Agency website, you agree to be bound by these Terms of Use. If you do not agree, please do not use this site.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">Use of This Website</h2>
              <p>This website is intended for talent seeking representation and clients seeking talent placement. You agree not to use this site for any unlawful purpose or in any way that could damage, disable, or impair the site.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">Talent Submissions</h2>
              <p>By submitting an application, you confirm that:</p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>All information provided is accurate and truthful</li>
                <li>You own or have rights to all submitted photographs, videos, and audio recordings</li>
                <li>You consent to Landi-Lou Talent Agency reviewing, storing, and sharing your profile with prospective clients for representation purposes</li>
                <li>If you are under 18, a parent or legal guardian has provided consent for your submission</li>
              </ul>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">Minors</h2>
              <div className="border border-[#c9a84c]/30 bg-[#c9a84c]/5 rounded-lg p-5">
                <p className="text-sm">Applicants under 18 must have a parent or legal guardian complete and submit all application materials. We do not knowingly accept applications from individuals under 13 without verified parental consent. Parents and guardians are responsible for supervising minors&apos; use of this site.</p>
              </div>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">No Guarantee of Representation</h2>
              <p>Submitting an application does not guarantee representation. Landi-Lou Talent Agency reserves the right to accept or decline any application at its sole discretion.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">Intellectual Property</h2>
              <p>All content on this website — including text, design, graphics, and the Landi-Lou brand — is the property of Landi-Lou Talent Agency and may not be reproduced without written permission.</p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">Contact</h2>
              <p>Questions about these terms: <a href="mailto:info@landiloutalentagency.com" className="text-[#c9a84c] underline">info@landiloutalentagency.com</a></p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
