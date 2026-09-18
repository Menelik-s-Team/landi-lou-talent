import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Handshake } from 'lucide-react'
import Navbar from '@/components/nav/Navbar'

export const metadata: Metadata = {
  title: 'Get Started — Landi-Lou Talent Agency',
  description: 'Are you looking for representation, or hiring talent? Start here.',
}

export default function StartPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#06080f]">

        {/* Stage-light backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#c9a84c]/5 blur-[150px]" />
          <div className="absolute top-0 left-[12%] w-[260px] h-[110%] bg-[#7c3aad]/9 blur-[80px]" style={{ transform: 'rotate(-18deg)', transformOrigin: 'top center' }} />
          <div className="absolute top-0 right-[12%] w-[260px] h-[110%] bg-[#7c3aad]/9 blur-[80px]" style={{ transform: 'rotate(18deg)', transformOrigin: 'top center' }} />
          <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-[#2d0a5a]/12 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 gap-12 py-24 w-full max-w-4xl mx-auto">

          {/* Logo / agency name */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 relative">
              <Image src="/logo.png" alt="Landi-Lou Talent Agency" fill className="object-contain" />
            </div>
            <p className="text-[#c9a84c] text-xs tracking-[0.4em] uppercase font-semibold">Landi-Lou Talent Agency</p>
          </div>

          {/* Headline */}
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#f0ead8] font-bold leading-tight mb-4">
              Welcome. Who are you here for?
            </h1>
            <p className="text-[#9ba9bb] text-base max-w-xl mx-auto leading-relaxed">
              Central Florida&apos;s premier talent agency. Tell us where to take you.
            </p>
          </div>

          {/* Two paths */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">

            {/* Hiring Talent */}
            <Link
              href="/for-clients"
              className="group relative rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-5 text-center py-14 px-8 transition-all duration-300 hover:scale-[1.02] border border-[rgba(201,168,76,0.15)] hover:border-[#c9a84c]/50"
              style={{ background: 'linear-gradient(145deg, #1a0030 0%, #0d0020 50%, #06080f 100%)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#7c3aad]/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7c3aad]/80 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#7c3aad]/20 border border-[#c9a84c]/40 flex items-center justify-center group-hover:bg-[#7c3aad]/40 transition-all">
                  <Handshake size={24} className="text-[#c9a84c]" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] font-bold mb-2">
                    Hiring Talent
                  </h2>
                  <p className="text-[#9ba9bb] text-sm leading-relaxed">
                    Film, TV, commercial, print, events &amp; branded content
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-[#c9a84c] text-xs tracking-widest uppercase font-semibold group-hover:gap-3 transition-all">
                  Book Talent <ArrowRight size={14} />
                </span>
              </div>
            </Link>

            {/* Seeking Representation */}
            <Link
              href="/submit"
              className="group relative rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-5 text-center py-14 px-8 transition-all duration-300 hover:scale-[1.02] border border-[rgba(201,168,76,0.15)] hover:border-[#c9a84c]/50"
              style={{ background: 'linear-gradient(145deg, #1a1200 0%, #0d0d00 50%, #06080f 100%)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/8 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/40 flex items-center justify-center group-hover:bg-[#c9a84c]/25 transition-all">
                  <Star size={24} className="text-[#c9a84c]" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] font-bold mb-2">
                    Seeking Representation
                  </h2>
                  <p className="text-[#9ba9bb] text-sm leading-relaxed">
                    Actors, models, hosts, voice-over artists, singers &amp; dancers
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-[#c9a84c] text-xs tracking-widest uppercase font-semibold group-hover:gap-3 transition-all">
                  Submit Profile <ArrowRight size={14} />
                </span>
              </div>
            </Link>

          </div>

          {/* Explore home */}
          <Link
            href="/"
            className="text-[#9ba9bb]/60 text-xs tracking-widest uppercase hover:text-[#c9a84c] transition-colors"
          >
            Explore the Agency
          </Link>

        </div>
      </main>
    </>
  )
}
