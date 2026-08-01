import type { Metadata } from 'next'
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Landi-Lou Talent Agency — Central Florida\'s first fully integrated talent agency founded by Dr. Calandria Smith. We curate excellence, protect artistry, and build enduring legacies.',
  alternates: { canonical: 'https://landiloutalentagency.com/about' },
  openGraph: {
    title: 'About Landi-Lou Talent Agency',
    description: 'Founded by Dr. Calandria Smith — Central Florida\'s premier talent agency representing actors, models, influencers, and more.',
    url: 'https://landiloutalentagency.com/about',
  },
}


export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="pt-36 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#c9a84c]/5 blur-[100px]" />
        </div>
        <div className="relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Our Story</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#f0ead8] mb-6">
            About Landi-Lou
          </h1>
          <div className="w-16 h-px bg-[#c9a84c]/40 mx-auto" />
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-5">Who We Are</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#f0ead8] mb-6 leading-snug">
              The First Fully Integrated Talent Agency in Central Florida
            </h2>
            <p className="text-[#9ba9bb] leading-relaxed mb-5">
              Landi-Lou Talent Agency was founded by Dr. Calandria U. Smith with one clear vision:
              to build a premier house of talent, vision, and opportunity — not a volume-driven operation.
            </p>
            <p className="text-[#9ba9bb] leading-relaxed mb-5">
              We exist to curate excellence, protect artistry, and build enduring legacies. We move
              intentionally, partner selectively, and operate with vision.
            </p>
            <p className="text-[#9ba9bb] leading-relaxed">
              From stage to screen, social media to brand partnerships, we guide every performer toward
              their highest potential — professionally, strategically, and authentically.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative w-72 h-80 rounded-xl overflow-hidden ring-1 ring-[#c9a84c]/30 gold-glow">
              <Image
                src="/calandria.jpg"
                alt="Dr. Calandria U. Smith — Founder, Landi-Lou Talent Agency"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 px-6 bg-[#0d1120]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative w-64 h-72 rounded-xl overflow-hidden ring-1 ring-[#c9a84c]/30 gold-glow">
                <Image
                  src="/calandria.jpg"
                  alt="Dr. Calandria U. Smith"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div>
              <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Founder</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#f0ead8] mb-2">
                Dr. Calandria U. Smith
              </h2>
              <p className="text-[#c9a84c] text-sm mb-6 tracking-wide">aka Landi Sleek — Founder & Director</p>
              <p className="text-[#9ba9bb] leading-relaxed text-base italic">
                &ldquo;This Premier Talent Agency exists to curate excellence, protect artistry, and build
                enduring legacies. We move intentionally, partner selectively, and operate with vision.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we cover */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Coverage</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#f0ead8]">What We Represent</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Acting', 'Modeling', 'Influencer Marketing', 'Voice-Over', 'Singing', 'Dancing', 'Children & Youth', 'Fitness', 'Specialty Talent'].map((cat) => (
              <div key={cat} className="glass-card rounded-lg px-6 py-5 text-center">
                <p className="text-[#f0ead8] text-sm tracking-wide">{cat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-10 py-4 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all"
        >
          Submit Your Talent <ArrowRight size={16} />
        </Link>
      </section>

      <Footer />
    </>
  )
}
