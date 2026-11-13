import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-40 pb-20 px-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-lg mx-auto">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">404</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl text-[#f0ead8] mb-6">
            Page Not Found
          </h1>
          <div className="w-16 h-px bg-[#c9a84c]/40 mx-auto mb-8" />
          <p className="text-[#9ba9bb] text-base leading-relaxed mb-10">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-7 py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all"
            >
              Go Home
            </Link>
            <Link
              href="/submit"
              className="px-7 py-3 border border-[#c9a84c]/40 text-[#c9a84c] rounded text-sm tracking-wide hover:bg-[#c9a84c]/10 transition-all"
            >
              Submit Your Profile
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 border border-[rgba(201,168,76,0.2)] text-[#9ba9bb] rounded text-sm tracking-wide hover:text-[#f0ead8] hover:border-[#c9a84c]/40 transition-all"
            >
              Contact
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
