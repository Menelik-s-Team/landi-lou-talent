import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Handshake } from 'lucide-react'
import Navbar from '@/components/nav/Navbar'
import HeadshotBanner from '@/components/home/HeadshotBanner'
import Footer from '@/components/nav/Footer'

export const metadata: Metadata = {
  title: 'Landi-Lou Talent Agency — Central Florida\'s Premier Talent Agency',
  description: "Central Florida's premier talent agency. Representing actors, models, hosts, voice-over artists, singers, and dancers.",
  alternates: { canonical: 'https://landiloutalentagency.com' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://landiloutalentagency.com/#organization',
      name: 'Landi-Lou Talent Agency',
      url: 'https://landiloutalentagency.com',
      logo: 'https://landiloutalentagency.com/logo.png',
      email: 'info@landiloutalentagency.com',
      description: "Central Florida's premier talent agency representing actors, models, influencers, voice-over artists, singers, and dancers.",
      areaServed: { '@type': 'State', name: 'Florida' },
      founder: { '@type': 'Person', name: 'Dr. Calandria Smith' },
    },
  ],
}

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main id="main-content" className="relative min-h-screen flex flex-col items-center overflow-hidden bg-[#0d0b14]">

        {/* Stage-light backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#c9a84c]/6 blur-[160px]" />
          <div className="absolute top-0 left-[8%] w-[320px] h-[90%] bg-[#7c3aad]/10 blur-[90px]" style={{ transform: 'rotate(-20deg)', transformOrigin: 'top center' }} />
          <div className="absolute top-0 right-[8%] w-[320px] h-[90%] bg-[#7c3aad]/10 blur-[90px]" style={{ transform: 'rotate(20deg)', transformOrigin: 'top center' }} />
          <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-[#3d0a6a]/10 to-transparent" />
          <div className="absolute top-[60%] left-1/4 w-[200px] h-[200px] rounded-full bg-[#c9a84c]/4 blur-[80px]" />
          <div className="absolute top-[60%] right-1/4 w-[200px] h-[200px] rounded-full bg-[#7c3aad]/6 blur-[80px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center w-full pt-32 pb-16 gap-10">

          {/* Logo — large and centered */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-36 h-36 md:w-44 md:h-44">
              <Image
                src="/logo.png"
                alt="Landi-Lou Talent Agency"
                fill
                className="object-contain drop-shadow-[0_0_40px_rgba(201,168,76,0.4)]"
                priority
              />
            </div>
            <div className="text-center">
              <p className="font-[family-name:var(--font-playfair)] text-[#c9a84c] text-2xl md:text-3xl font-bold tracking-widest uppercase leading-none">
                Landi-Lou
              </p>
              <p className="text-[#c4bfcc] text-sm tracking-[0.35em] uppercase mt-1">
                Talent Agency
              </p>
            </div>
          </div>

          {/* Tagline */}
          <div className="text-center px-6">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#f0ead8] font-bold mb-3 leading-tight">
              Who are you here for?
            </h1>
            <p className="text-[#c4bfcc] text-sm md:text-base max-w-md mx-auto leading-relaxed">
              Central Florida&apos;s premier talent agency. Tell us where to take you.
            </p>
          </div>

          {/* Choose Your Path */}
          <div className="w-full max-w-3xl px-6">
            <p className="text-[#c9a84c]/70 text-xs tracking-[0.35em] uppercase text-center mb-5">Choose your path</p>

            <div className="relative p-[2px] rounded-3xl" style={{ background: 'linear-gradient(135deg, #c9a84c, #e8c97a44, #7c3aad88, #c9a84c)' }}>
              <div className="rounded-3xl bg-[#0d0b14] p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Hiring Talent */}
                <Link
                  href="/for-clients"
                  className="group relative rounded-2xl overflow-hidden min-h-[240px] flex flex-col items-center justify-center gap-4 text-center transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(145deg, #2a0845 0%, #1a0030 40%, #0d0b14 100%)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#7c3aad]/15 via-transparent to-[#0d0b14]/80 pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7c3aad] to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col items-center gap-3 px-6">
                    <div className="w-14 h-14 rounded-full bg-[#7c3aad]/25 border border-[#c9a84c]/50 flex items-center justify-center group-hover:bg-[#7c3aad]/45 transition-all">
                      <Handshake size={22} className="text-[#c9a84c]" />
                    </div>
                    <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] font-bold leading-tight">
                      Hiring Talent
                    </h2>
                    <p className="text-[#c4bfcc] text-sm leading-relaxed max-w-[220px]">
                      Film, television, commercial, print, events &amp; branded content
                    </p>
                    <span className="flex items-center gap-2 text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mt-1 group-hover:gap-3 transition-all">
                      Book Talent <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>

                {/* Seeking Representation */}
                <Link
                  href="/submit"
                  className="group relative rounded-2xl overflow-hidden min-h-[240px] flex flex-col items-center justify-center gap-4 text-center transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(145deg, #251a00 0%, #1a1200 40%, #0d0b14 100%)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/10 via-transparent to-[#0d0b14]/80 pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col items-center gap-3 px-6">
                    <div className="w-14 h-14 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/50 flex items-center justify-center group-hover:bg-[#c9a84c]/30 transition-all">
                      <Star size={22} className="text-[#c9a84c]" />
                    </div>
                    <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] font-bold leading-tight">
                      Seeking Representation
                    </h2>
                    <p className="text-[#c4bfcc] text-sm leading-relaxed max-w-[220px]">
                      Actors, models, hosts, voice-over artists, singers &amp; dancers
                    </p>
                    <span className="flex items-center gap-2 text-[#c9a84c] text-xs tracking-widest uppercase font-semibold mt-1 group-hover:gap-3 transition-all">
                      Submit Profile <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>

              </div>
            </div>
          </div>

          {/* Our Roster — headshot banner */}
          <div className="w-full">
            <p className="text-[#c9a84c]/60 text-xs tracking-[0.3em] uppercase text-center mb-6">Our Roster</p>
            <HeadshotBanner />
          </div>

          {/* Bottom links */}
          <div className="flex items-center gap-8 text-xs tracking-widest uppercase pb-4">
            <Link href="/about" className="text-[#c4bfcc]/50 hover:text-[#c9a84c] transition-colors">
              About the Agency
            </Link>
            <span className="text-[#c9a84c]/20">|</span>
            <Link href="/login" className="text-[#c4bfcc]/50 hover:text-[#c9a84c] transition-colors">
              Portal Login
            </Link>
            <span className="text-[#c9a84c]/20">|</span>
            <Link href="/contact" className="text-[#c4bfcc]/50 hover:text-[#c9a84c] transition-colors">
              Contact
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
