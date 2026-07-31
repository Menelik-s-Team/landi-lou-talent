import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Shield, Zap, Users, Mic, Camera, Music, Film, Globe } from 'lucide-react'

const categories = [
  { icon: Film, label: 'Acting' },
  { icon: Camera, label: 'Modeling' },
  { icon: Globe, label: 'Influencer' },
  { icon: Mic, label: 'Voice-Over' },
  { icon: Music, label: 'Singing' },
  { icon: Star, label: 'Dancing' },
]

const pillars = [
  {
    icon: Star,
    title: 'Curated Excellence',
    body: 'We represent select talent — not volume. Every performer we sign is a strategic choice.',
  },
  {
    icon: Shield,
    title: 'Legacy Protection',
    body: 'Your brand, your story, your terms. We protect what you build.',
  },
  {
    icon: Zap,
    title: 'Elite Partnerships',
    body: 'We connect talent with brands, directors, and opportunities aligned with excellence.',
  },
  {
    icon: Users,
    title: 'Full Representation',
    body: 'From stage to screen, social media, and beyond — we guide every step.',
  },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#c9a84c]/5 blur-[120px]" />
          <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#0ea5c8]/5 blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] rounded-full bg-[#7c3aad]/5 blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <Image
            src="/logo.png"
            alt="Landi-Lou Talent Agency"
            width={120}
            height={120}
            className="mx-auto mb-8 rounded-full ring-2 ring-[#c9a84c]/30 gold-glow"
          />

          <p className="text-[#c9a84c] text-xs tracking-[0.35em] uppercase mb-5">
            Central Florida&apos;s Premier Talent Agency
          </p>

          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-bold leading-tight mb-6 text-[#f0ead8]">
            We Curate Talent.<br />
            <span className="gold-text">We Protect Legacy.</span>
          </h1>

          <p className="text-[#7a869a] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            The first fully integrated, inspirationally motivated talent agency in Central Florida —
            guiding performers from stage to screen, social media, and beyond.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all"
            >
              Submit Your Talent <ArrowRight size={16} />
            </Link>
            <Link
              href="/about"
              className="flex items-center justify-center gap-2 px-8 py-4 border border-[#c9a84c]/40 text-[#c9a84c] rounded text-sm tracking-wide hover:bg-[#c9a84c]/10 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <section className="border-y border-[rgba(201,168,76,0.15)] bg-[#0d1120] py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {categories.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-[#141929] border border-[rgba(201,168,76,0.15)] flex items-center justify-center group-hover:border-[#c9a84c]/50 transition-all">
                  <Icon size={18} className="text-[#c9a84c]" />
                </div>
                <p className="text-xs tracking-wide text-[#7a869a] group-hover:text-[#f0ead8] transition-colors">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand statement */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">Our Philosophy</p>
          <blockquote className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#f0ead8] leading-snug mb-8">
            &ldquo;We are not a volume agency. We are a premier house of talent, vision, and
            opportunity — curating careers, building brands, and protecting legacy.&rdquo;
          </blockquote>
          <div className="w-16 h-px bg-[#c9a84c]/40 mx-auto" />
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 px-6 bg-[#0d1120]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">What Sets Us Apart</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-[#f0ead8]">Built on Four Pillars</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map(({ icon: Icon, title, body }) => (
              <div key={title} className="glass-card rounded-lg p-7 flex flex-col gap-4 gold-glow group hover:border-[#c9a84c]/30 transition-all">
                <div className="w-11 h-11 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
                  <Icon size={20} className="text-[#c9a84c]" />
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-lg text-[#f0ead8]">{title}</h3>
                <p className="text-[#7a869a] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">Ready to Elevate?</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#f0ead8] mb-6">
            Your next chapter starts here.
          </h2>
          <p className="text-[#7a869a] mb-10 leading-relaxed">
            Submit your talent profile for review. We move intentionally, partner selectively,
            and operate with vision.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all"
          >
            Apply Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
