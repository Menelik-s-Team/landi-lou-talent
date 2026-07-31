import type { Metadata } from 'next'
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
import Link from 'next/link'
import { ArrowRight, Film, Tv, Megaphone, Camera, Heart, BookOpen, Mic, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Representation | Landi-Lou Talent Agency',
  description: 'We place exceptional talent across film, television, commercial, print, lifestyle, theatre, voice over, and digital content. Selective roster, deep relationships.',
  alternates: { canonical: 'https://landiloutalentagency.com/representation' },
  openGraph: {
    title: 'Representation | Landi-Lou Talent Agency',
    description: 'We place exceptional talent across every major medium. Our roster is selective, our relationships are deep, and our commitment to your career is total.',
    url: 'https://landiloutalentagency.com/representation',
  },
}

const areas = [
  {
    icon: Film,
    title: 'Film',
    desc: 'From independent features to major studio productions. We place actors, background talent, and key creatives in projects that matter.',
  },
  {
    icon: Tv,
    title: 'Television',
    desc: 'Network, cable, and streaming. We connect talent to episodic series, limited series, reality, and broadcast opportunities.',
  },
  {
    icon: Megaphone,
    title: 'Commercial',
    desc: 'National and regional campaigns for the world\'s leading brands. We represent actors, models, and on-camera talent for commercial work.',
  },
  {
    icon: Camera,
    title: 'Print',
    desc: 'Editorial, advertising, and catalogue. We place models and talent with top photographers, publications, and advertising agencies.',
  },
  {
    icon: Heart,
    title: 'Lifestyle',
    desc: 'Authentic talent for wellness, fitness, home, and aspirational brand campaigns. Real people, real stories.',
  },
  {
    icon: BookOpen,
    title: 'Theatre',
    desc: 'From regional theatre to national tours. We support stage actors with audition prep, representation, and career strategy.',
  },
  {
    icon: Mic,
    title: 'Voice Over',
    desc: 'Commercial narration, animation, audiobook, and e-learning. We represent trained voice artists for on-demand and studio work.',
  },
  {
    icon: Globe,
    title: 'Influencer & Digital Content',
    desc: 'Authentic creators with engaged audiences. We connect brands with talent who build community and drive results.',
  },
]

export default function RepresentationPage() {
  return (
    <>
      <Navbar />

      <section className="pt-36 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#7c3aad]/5 blur-[100px]" />
        </div>
        <div className="relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">What We Represent</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#f0ead8] mb-6">
            Areas of Representation
          </h1>
          <p className="text-[#9ba9bb] max-w-xl mx-auto leading-relaxed">
            We place exceptional talent across every major medium. Our roster is selective, our relationships
            are deep, and our commitment to your career is total.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#0d1120]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card rounded-lg p-8 flex flex-col gap-4 group hover:border-[#c9a84c]/30 transition-all">
              <div className="w-11 h-11 rounded-full bg-[#c9a84c]/10 flex items-center justify-center">
                <Icon size={20} className="text-[#c9a84c]" />
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#f0ead8]">{title}</h3>
              <p className="text-[#9ba9bb] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-[#f0ead8] mb-6">
          Ready to join the roster?
        </h2>
        <p className="text-[#9ba9bb] mb-8 max-w-lg mx-auto">
          Submit your talent profile for consideration. We review every submission personally and reach out when there&apos;s a fit.
        </p>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-10 py-4 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all"
        >
          Submit Your Profile <ArrowRight size={16} />
        </Link>
      </section>

      <Footer />
    </>
  )
}
