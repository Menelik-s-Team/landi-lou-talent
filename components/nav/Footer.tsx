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
              <p className="text-[10px] tracking-[0.2em] text-[#7a869a] uppercase">Talent Agency</p>
            </div>
          </div>
          <p className="text-[#7a869a] text-sm leading-relaxed max-w-xs">
            We are not a volume agency. We are a premier house of talent, vision, and opportunity.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[0.2em] uppercase mb-5">Navigation</p>
          <div className="flex flex-col gap-3">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/services', label: 'Services' },
              { href: '/submit', label: 'Submit Talent' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="text-[#7a869a] hover:text-[#f0ead8] text-sm transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[#c9a84c] text-xs tracking-[0.2em] uppercase mb-5">Contact</p>
          <div className="flex flex-col gap-3 text-sm text-[#7a869a]">
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

      <div className="border-t border-[rgba(201,168,76,0.1)] px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[#7a869a] text-xs">
          © {new Date().getFullYear()} Landi-Lou Talent Agency. All rights reserved.
        </p>
        <p className="text-[#7a869a] text-xs">Curating excellence. Protecting legacy.</p>
      </div>
    </footer>
  )
}
