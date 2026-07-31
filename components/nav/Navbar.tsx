'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/representation', label: 'Representation' },
  { href: '/submit', label: 'Submit' },
  { href: '/for-clients', label: 'For Clients' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[rgba(201,168,76,0.2)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="Landi-Lou Talent Agency"
            width={52}
            height={52}
            className="rounded-full object-cover ring-1 ring-[#c9a84c]/30 group-hover:ring-[#c9a84c]/70 transition-all"
          />
          <div className="hidden sm:block">
            <p className="font-[var(--font-playfair)] text-[#c9a84c] text-sm font-semibold tracking-widest uppercase leading-none">
              Landi-Lou
            </p>
            <p className="text-[10px] tracking-[0.2em] text-[#9ba9bb] uppercase">Talent Agency</p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm tracking-wide transition-colors duration-200 ${
                pathname === href
                  ? 'text-[#c9a84c]'
                  : 'text-[#9ba9bb] hover:text-[#f0ead8]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Login CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm px-5 py-2 rounded border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all tracking-wide"
          >
            Talent Login
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[#c9a84c]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[rgba(201,168,76,0.15)] bg-[#0d1120] px-6 py-6 flex flex-col gap-5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`text-sm tracking-wide ${pathname === href ? 'text-[#c9a84c]' : 'text-[#9ba9bb]'}`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="text-sm px-5 py-2 rounded border border-[#c9a84c]/40 text-[#c9a84c] text-center mt-2"
          >
            Portal Login
          </Link>
        </div>
      )}
    </nav>
  )
}
