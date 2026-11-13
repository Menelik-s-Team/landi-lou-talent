import type { Metadata } from 'next'
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Landi-Lou Talent Agency is a boutique talent agency committed to professional representation, intentional development, and lasting relationships — connecting clients with carefully selected, production-ready talent.',
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

      <main>
      {/* Header */}
      <section id="main-content" className="pt-40 pb-16 px-6 text-center relative overflow-hidden">
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
      <section className="py-20 px-6 bg-[#f0ead8]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-5">Who We Are</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#06080f] mb-8 leading-snug">
            A Boutique Talent Agency Built on Relationships
          </h2>
          <p className="text-[#3a3a3a] leading-relaxed mb-5 text-lg max-w-2xl mx-auto">
            Landi-Lou is a boutique talent agency committed to professional representation, intentional development, and lasting relationships.
          </p>
          <p className="text-[#3a3a3a] leading-relaxed max-w-2xl mx-auto">
            We provide personalized representation for actors, models, comedians, hosts, voice talent, and commercial performers — while connecting clients with carefully selected, production-ready talent.
          </p>
        </div>
      </section>

      {/* Leadership — Dr. Smith feature */}
      <section className="py-20 px-6 bg-[#0d1120]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">The People Behind the Agency</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Our Leadership</h2>
          </div>

          {/* Dr. Calandria Smith — full feature layout */}
          <div className="flex flex-col lg:flex-row gap-12 items-start mb-16 pb-16 border-b border-[rgba(201,168,76,0.15)]">
            <div className="flex-shrink-0 flex flex-col items-center lg:items-start gap-5">
              <div className="relative w-64 h-80 rounded-xl overflow-hidden ring-2 ring-[#c9a84c]/40 shadow-2xl">
                <Image
                  src="/calandria.jpg"
                  alt="Dr. Calandria U. Smith — Founder & Director, Landi-Lou Talent Agency"
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080f]/50 via-transparent to-transparent" />
              </div>
              {/* Credential badges */}
              <div className="flex flex-col gap-2 w-full max-w-[256px]">
                <div className="flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/25 rounded-lg px-3 py-2">
                  <span className="text-[#c9a84c] text-[10px] font-bold tracking-widest uppercase">Ph.D.</span>
                  <span className="text-[#9ba9bb] text-[11px] leading-tight">Human Services — Public Service Leadership</span>
                </div>
                <div className="flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/25 rounded-lg px-3 py-2">
                  <span className="text-[#c9a84c] text-[10px] font-bold tracking-widest uppercase">MBA</span>
                  <span className="text-[#9ba9bb] text-[11px]">Webster University</span>
                </div>
                <div className="flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/25 rounded-lg px-3 py-2">
                  <span className="text-[#c9a84c] text-[10px] font-bold tracking-widest uppercase">B.S.</span>
                  <span className="text-[#9ba9bb] text-[11px]">Business Economics — Florida A&amp;M University</span>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Founder &amp; Director</p>
              <h3 className="font-[family-name:var(--font-playfair)] text-3xl text-[#f0ead8] mb-1">
                Dr. Calandria U. Smith
              </h3>
              <p className="text-[#9ba9bb] text-xs tracking-widest uppercase mb-6">Orlando, FL · Central Florida Native</p>

              <blockquote className="border-l-2 border-[#c9a84c]/50 pl-5 mb-8 italic text-[#f0ead8]/80 text-sm leading-relaxed">
                &ldquo;This Premier Talent Agency exists to curate excellence, protect artistry, and build enduring legacies. We move intentionally, partner selectively, and operate with vision.&rdquo;
              </blockquote>

              <div className="flex flex-col gap-4 text-[#9ba9bb] text-sm leading-relaxed">
                <p>
                  Dr. Calandria U. Smith is an Orlando native, Ph.D., and multi-industry executive with over 30 years of experience across financial services, higher education, business development, and the performing arts. She has served as <strong className="text-[#f0ead8]">Executive Vice President of a graduate university</strong>, spent 13 years with <strong className="text-[#f0ead8]">Pearson Online Learning Services</strong> partnering with institutions like the University of Florida and Arizona State, and has been an Adjunct Professor for more than two decades.
                </p>
                <p>
                  She is the founder of <strong className="text-[#f0ead8]">Landi-Lou Productions</strong>, a nonprofit supporting women impacted by domestic abuse, trafficking, and homelessness, and a disability services agency she operates with her husband. A motivational speaker, minister, and performer since age three, Dr. Smith was cast in a <strong className="text-[#f0ead8]">National Touring Gospel Stage Play</strong> — and launched Landi-Lou Talent Agency to give others the same doors she walked through.
                </p>
              </div>
            </div>
          </div>

          {/* Donnette Knowlen Leffler */}
          <div className="flex flex-col items-center text-center group max-w-sm mx-auto">
            <div className="relative w-56 h-64 rounded-xl overflow-hidden ring-1 ring-[#c9a84c]/30 mb-6 shadow-2xl group-hover:ring-[#c9a84c]/60 transition-all duration-300">
              <Image
                src="/team/donnette-leffler.jpg"
                alt="Donnette Knowlen Leffler — Talent Agent, Landi-Lou Talent Agency"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080f]/60 via-transparent to-transparent" />
            </div>
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Talent Agent</p>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-3">
              Donnette Knowlen Leffler
            </h3>
            <div className="flex flex-col gap-3 text-[#9ba9bb] text-sm leading-relaxed text-left">
              <p>
                Donnette Knowlen Leffler brings more than <strong className="text-[#f0ead8]">20 years of experience</strong> in talent representation, client relations, business development, and operations. She has served as a Talent Agent with <strong className="text-[#f0ead8]">The Christensen Group</strong> and <strong className="text-[#f0ead8]">Diamond Talent Agency</strong> — recruiting talent, coordinating auditions for commercial, print, and film, and connecting clients with companies ranging from local businesses to <strong className="text-[#f0ead8]">Universal, Disney, and Yum! Brands</strong>.
              </p>
              <p>
                As a Media and Production Coordinator with <strong className="text-[#f0ead8]">HB Productions</strong>, she hired talent, scouted locations, and coordinated productions distributed across the U.S. and Canada — giving her a well-rounded view of what both talent and clients need from professional representation.
              </p>
              <p>
                For Donnette, being a talent agent is about more than submitting someone for a role. It&apos;s about building relationships, creating opportunities, and helping talent develop a professional, sustainable career in the industry.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* What we cover — cream section */}
      <section className="py-16 px-6 bg-[#f0ead8]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Coverage</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#06080f]">What We Represent</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Acting', 'Modeling', 'Influencer Marketing', 'Voice-Over', 'Singing', 'Dancing', 'Children & Youth', 'Fitness', 'Specialty Talent'].map((cat) => (
              <div key={cat} className="bg-white/60 border border-[#c9a84c]/20 rounded-lg px-6 py-5 text-center hover:bg-white/90 hover:border-[#c9a84c]/40 transition-all">
                <p className="text-[#06080f] text-sm tracking-wide font-medium">{cat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — dark for contrast */}
      <section className="py-20 px-6 bg-[#06080f] text-center">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">Join Our Roster</p>
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#f0ead8] mb-8">
          Ready to work with us?
        </h2>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-10 py-4 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all"
        >
          Submission <ArrowRight size={16} />
        </Link>
      </section>
      </main>

      <Footer />
    </>
  )
}
