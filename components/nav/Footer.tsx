import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(201,168,76,0.15)] bg-[#0d1120] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Landi-Lou" width={44} height={44} className="rounded-full" />
            <div>
              <p className="font-[var(--font-playfair)] text-[#c9a84c] text-sm font-semibold tracking-widest uppercase">
                Landi-Lou
              </p>
              <p className="text-[10px] tracking-[0.2em] text-[#9ba9bb] uppercase">Talent Agency</p>
            </div>
          </div>
          <p className="text-[#9ba9bb] text-sm leading-relaxed max-w-xs">
            We are not a volume agency. We are a premier house of talent, vision, and opportunity.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[0.2em] uppercase mb-5">Navigation</p>
          <div className="flex flex-col gap-3">
            {[
              { href: '/about', label: 'About' },
              { href: '/representation', label: 'Representation' },
              { href: '/submit', label: 'Submission' },
              { href: '/for-clients', label: 'For Clients' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="text-[#9ba9bb] hover:text-[#f0ead8] text-sm transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[0.2em] uppercase mb-5">Contact</p>
          <div className="flex flex-col gap-3 text-sm text-[#9ba9bb]">
            <a href="mailto:info@landiloutalentagency.com" className="hover:text-[#f0ead8] transition-colors">
              info@landiloutalentagency.com
            </a>
            <p>Central Florida</p>
            <Link href="/login" className="text-[#c9a84c] hover:text-[#e8c97a] transition-colors">
              Portal Login →
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(201,168,76,0.1)] px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[#9ba9bb] text-xs">
          {'© '}{new Date().getFullYear()}{' Landi-Lou Talent Agency. All rights reserved.'} &nbsp;·&nbsp; Licensed Talent Agency &middot; State of Florida
        </p>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/privacy" className="text-[#9ba9bb] hover:text-[#f0ead8] transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-[#9ba9bb] hover:text-[#f0ead8] transition-colors">Terms of Use</Link>
          <span className="text-[#9ba9bb]/40">·</span>
          <a href="https://apexdigi.org" target="_blank" rel="noopener noreferrer"
            className="text-[#9ba9bb]/60 hover:text-[#c9a84c] transition-colors tracking-wide">
            Built by Apex Digital
          </a>
        </div>
      </div>
    </footer>
  )
}
