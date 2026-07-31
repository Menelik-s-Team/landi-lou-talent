import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
import Link from 'next/link'
import { ArrowRight, Briefcase, TrendingUp, BookOpen, Star, Shield, Users } from 'lucide-react'

export const metadata = {
  title: 'Services | Landi-Lou Talent Agency',
}

const services = [
  {
    icon: Star,
    title: 'Talent Representation',
    desc: 'Full-service representation across acting, modeling, voice-over, influencer marketing, singing, and dancing. We match your talent with the right opportunities.',
  },
  {
    icon: TrendingUp,
    title: 'Strategic Branding',
    desc: 'We work with you to craft a personal brand that stands apart. Your image, your story, your market positioning — done with precision.',
  },
  {
    icon: Briefcase,
    title: 'Elite Partnerships',
    desc: 'We connect talent with brands, casting directors, and production companies aligned with excellence. No filler opportunities.',
  },
  {
    icon: Shield,
    title: 'Legacy Protection',
    desc: 'Contract review, rights management, and long-term career strategy. We protect your legacy from day one.',
  },
  {
    icon: BookOpen,
    title: 'Career Development',
    desc: 'Guidance, coaching, and resources to develop your craft and position you for sustainable success in the industry.',
  },
  {
    icon: Users,
    title: 'Casting Coordination',
    desc: 'Direct access to casting directors through our portal. Streamlined booking, clear communication, and professional coordination every time.',
  },
]

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <section className="pt-36 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#7c3aad]/5 blur-[100px]" />
        </div>
        <div className="relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">What We Offer</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#f0ead8] mb-6">
            Our Services
          </h1>
          <p className="text-[#7a869a] max-w-xl mx-auto leading-relaxed">
            Comprehensive representation designed to elevate select talent through strategic branding,
            elite partnerships, and curated opportunities.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#0d1120]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card rounded-lg p-8 flex flex-col gap-4 group hover:border-[#c9a84c]/30 transition-all">
              <div className="w-11 h-11 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
                <Icon size={20} className="text-[#c9a84c]" />
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#f0ead8]">{title}</h3>
              <p className="text-[#7a869a] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#f0ead8] mb-6">
          Ready to work with us?
        </h2>
        <p className="text-[#7a869a] mb-8 max-w-lg mx-auto">
          Submit your talent profile for review. We&apos;ll evaluate and reach out if it&apos;s the right fit.
        </p>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-10 py-4 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all"
        >
          Submit Talent Profile <ArrowRight size={16} />
        </Link>
      </section>

      <Footer />
    </>
  )
}
