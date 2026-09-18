import type { Metadata } from 'next'
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
import Link from 'next/link'
import { ArrowRight, Star, Users, TrendingUp, Handshake, Sparkles, Play, Quote } from 'lucide-react'
import { getContent } from '@/lib/content'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'About — Landi-Lou Talent Agency',
  description: "Central Florida's premier talent agency representing actors, models, influencers, voice-over artists, singers, and dancers.",
}

const brandValues = [
  { icon: Users, label: 'Professional Representation' },
  { icon: Sparkles, label: 'Intentional Development' },
  { icon: Star, label: 'LL Standard of Excellence' },
  { icon: TrendingUp, label: 'Vision & Opportunity' },
  { icon: Handshake, label: 'Lasting Relationships' },
]

const testimonials = [
  {
    quote: 'Dr. Calandria Smith brings an unmatched level of professionalism and genuine passion for the talent she represents. She is a true advocate in every sense of the word.',
    name: 'John Perros',
    title: 'Industry Professional',
  },
  {
    quote: 'Landi-Lou Talent Agency stands apart. The attention to detail, the personal touch, and the commitment to excellence are evident in everything they do.',
    name: 'Industry Partner',
    title: 'Central Florida',
  },
]

export default async function AgencyHomePage() {
  redirect('/about')

  const c = await getContent([
    'home_hero_eyebrow','home_hero_line1','home_hero_line2','home_hero_line3',
    'home_hero_subtext','home_philosophy_label','home_philosophy_quote',
    'home_cta_eyebrow','home_cta_heading','home_cta_subtext',
  ], {
    home_hero_eyebrow: 'Landi-Lou Talent Agency',
    home_hero_line1: 'Connecting Talent.',
    home_hero_line2: 'Building Careers.',
    home_hero_line3: 'Creating Opportunities.',
    home_hero_subtext: 'A premier house of talent, vision, and opportunity — representing exceptional actors, models, and creatives across film, television, theatre, and beyond.',
    home_philosophy_label: 'Our Mission',
    home_philosophy_quote: 'We are a premier house of talent, vision, and opportunity.',
    home_cta_eyebrow: 'Ready to Elevate?',
    home_cta_heading: 'Your next chapter starts here.',
    home_cta_subtext: "Submit your talent profile for review. We partner selectively and operate with vision — because this is more than representation. It's a lasting relationship.",
  })

  return (
    <>
      <Navbar />

      <main>

      {/* Hero */}
      <section id="main-content" className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden pt-40 pb-20 px-6 bg-[#0d0b14]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#c9a84c]/5 blur-[140px]" />
          <div className="absolute top-0 left-[10%] w-[300px] h-full bg-[#7c3aad]/7 blur-[100px]" style={{ transform: 'rotate(-20deg)', transformOrigin: 'top center' }} />
          <div className="absolute top-0 right-[10%] w-[300px] h-full bg-[#7c3aad]/7 blur-[100px]" style={{ transform: 'rotate(20deg)', transformOrigin: 'top center' }} />
        </div>
        <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
          <p className="text-[#c9a84c] text-xs tracking-[0.4em] uppercase mb-3 font-semibold">
            {c.home_hero_eyebrow}
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-bold leading-tight mb-6 text-[#f0ead8]">
            {c.home_hero_line1} {c.home_hero_line2}<br />
            <span className="bg-gradient-to-r from-[#c9a84c] via-[#e8c97a] to-[#c9a84c] bg-clip-text text-transparent">
              {c.home_hero_line3}
            </span>
          </h1>
          <p className="text-[#c4bfcc] text-lg max-w-2xl mx-auto leading-relaxed">
            {c.home_hero_subtext}
          </p>
        </div>
      </section>

      {/* Video placeholder */}
      <section className="py-20 px-6 bg-[#14121e] border-y border-[rgba(201,168,76,0.08)]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Our Story</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#f0ead8] mb-8">
            Meet Landi-Lou Talent Agency
          </h2>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#c9a84c]/20 bg-[#0d0b14] flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1200]/60 via-[#0d0b14] to-[#1a0030]/60" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#c9a84c]/10 border-2 border-[#c9a84c]/40 flex items-center justify-center group-hover:bg-[#c9a84c]/20 transition-all">
                <Play size={32} className="text-[#c9a84c] ml-1" fill="currentColor" />
              </div>
              <div>
                <p className="text-[#f0ead8] font-semibold text-lg">Video Coming Soon</p>
                <p className="text-[#c4bfcc] text-sm mt-1">The full story of Landi-Lou Talent Agency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 bg-[#0d0b14]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">{c.home_philosophy_label}</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl text-[#f0ead8] leading-snug mb-8">
            We are a premier house of talent,<br />
            <span className="bg-gradient-to-r from-[#c9a84c] via-[#e8c97a] to-[#c9a84c] bg-clip-text text-transparent">
              vision, and opportunity.
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10">
            {['Professional Representation', 'Intentional Development', 'Lasting Relationships'].map((pillar, i) => (
              <div key={pillar} className="flex items-center gap-4">
                <p className="text-[#c4bfcc] text-sm tracking-wide uppercase">{pillar}</p>
                {i < 2 && <span className="hidden sm:block text-[#c9a84c]/30 text-lg">|</span>}
              </div>
            ))}
          </div>
          <p className="text-[#c4bfcc] max-w-2xl mx-auto leading-relaxed text-base">
            Our goal is to create opportunities that benefit both our talent and our clients — built on trust, communication, and mutual respect.
          </p>
          <div className="w-16 h-px bg-[#c9a84c]/40 mx-auto mt-10" />
        </div>
      </section>

      {/* Brand values strip */}
      <section className="bg-[#19162a] py-10 px-6 border-y border-[rgba(201,168,76,0.12)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8">
            {brandValues.map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex flex-col items-center gap-2 group">
                {i === 2 ? (
                  <div className="w-10 h-10 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center group-hover:bg-[#c9a84c]/25 transition-all">
                    <Star size={18} className="text-[#c9a84c]" fill="currentColor" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#7c3aad]/20 border border-[#7c3aad]/30 flex items-center justify-center group-hover:bg-[#7c3aad]/35 transition-all">
                    <Icon size={18} className="text-[#c9a84c]" />
                  </div>
                )}
                <p className="text-[#c4bfcc] text-xs tracking-wide text-center group-hover:text-[#f0ead8] transition-colors max-w-[110px] leading-snug">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#14121e]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">What They Say</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#f0ead8]">
              Trusted by Industry Professionals
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="relative bg-[#1e1a30] border border-[#c9a84c]/20 rounded-2xl p-8">
                <Quote size={28} className="text-[#c9a84c]/30 mb-4" />
                <p className="text-[#f0ead8] leading-relaxed mb-6 italic text-[15px]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7c3aad]/20 border border-[#c9a84c]/30 flex items-center justify-center">
                    <span className="text-[#c9a84c] font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-[#f0ead8] font-semibold text-sm">{t.name}</p>
                    <p className="text-[#c4bfcc] text-xs">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-[#f0ead8]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">{c.home_cta_eyebrow}</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#06080f] mb-6">
            {c.home_cta_heading}
          </h2>
          <p className="text-[#3a3a3a] mb-10 leading-relaxed">
            {c.home_cta_subtext}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#0d0b14] text-[#f0ead8] font-semibold rounded text-sm tracking-wide hover:bg-[#c9a84c] hover:text-[#06080f] transition-all"
            >
              Apply Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/for-clients"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-[#06080f]/30 text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#06080f]/10 transition-all"
            >
              Book Talent
            </Link>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </>
  )
}
