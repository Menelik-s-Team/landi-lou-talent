import type { Metadata } from 'next'
import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, Users, TrendingUp, Handshake, Sparkles } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata: Metadata = {
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
    {
      '@type': 'LocalBusiness',
      '@id': 'https://landiloutalentagency.com/#business',
      name: 'Landi-Lou Talent Agency',
      url: 'https://landiloutalentagency.com',
      image: 'https://landiloutalentagency.com/logo.png',
      address: { '@type': 'PostalAddress', addressRegion: 'FL', addressCountry: 'US' },
      email: 'info@landiloutalentagency.com',
      priceRange: '$$',
    },
  ],
}

const brandValues = [
  { icon: Users, label: 'Personalized Representation' },
  { icon: Handshake, label: 'Strategic Partnerships' },
  { icon: Star, label: 'LL Standard of Excellence' },
  { icon: TrendingUp, label: 'Career Development' },
  { icon: Sparkles, label: 'Lasting Impact' },
]

async function getFeaturedTalent() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('talent_profiles')
      .select('id, first_name, last_name, categories, headshot_url')
      .eq('is_featured', true)
      .limit(6)

    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featuredTalent = await getFeaturedTalent()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#c9a84c]/5 blur-[120px]" />
          <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#0ea5c8]/5 blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] rounded-full bg-[#7c3aad]/5 blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          {/* Eyebrow */}
          <p className="text-[#c9a84c] text-xs tracking-[0.4em] uppercase mb-6 font-semibold" style={{ fontVariant: 'small-caps' }}>
            Landi-Lou Talent Agency
          </p>

          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-bold leading-tight mb-6 text-[#f0ead8]">
            Connecting Talent.<br />
            Building Careers.<br />
            <span
              className="bg-gradient-to-r from-[#c9a84c] via-[#e8c97a] to-[#c9a84c] bg-clip-text text-transparent"
            >
              Creating Opportunities.
            </span>
          </h1>

          <p className="text-[#9ba9bb] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            A boutique talent agency representing exceptional actors, models, and creatives
            across film, television, theatre, and beyond.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all"
            >
              Submit Your Talent <ArrowRight size={16} />
            </Link>
            <Link
              href="/for-clients"
              className="flex items-center justify-center gap-2 px-8 py-4 border border-[#c9a84c]/40 text-[#c9a84c] rounded text-sm tracking-wide hover:bg-[#c9a84c]/10 transition-all"
            >
              For Clients
            </Link>
          </div>
        </div>
      </section>

      {/* Meet a Few of Our Talent */}
      {featuredTalent.length > 0 && (
        <section className="py-20 px-6 bg-[#06080f]">
          <div className="max-w-7xl mx-auto">
            <p className="text-[#c9a84c] text-xs tracking-[0.4em] uppercase mb-12 text-center font-semibold">
              Meet a Few of Our Talent
            </p>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {featuredTalent.map((talent: {
                id: string
                first_name: string
                last_name: string
                categories: string[] | null
                headshot_url: string | null
              }) => (
                <div
                  key={talent.id}
                  className="relative flex-shrink-0 w-56 group cursor-pointer"
                >
                  <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '3/4' }}>
                    {talent.headshot_url ? (
                      <Image
                        src={talent.headshot_url}
                        alt={`${talent.first_name} ${talent.last_name}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="224px"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#141929] flex items-center justify-center">
                        <Star size={32} className="text-[#c9a84c]/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/10 transition-all duration-300 rounded-lg" />
                  </div>
                  <div className="mt-3 px-1">
                    <p className="text-[#f0ead8] font-semibold text-sm leading-tight">{talent.first_name} {talent.last_name}</p>
                    {talent.categories?.[0] && (
                      <p className="text-[#9ba9bb] text-xs mt-1 tracking-wide uppercase">{talent.categories[0]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy quote */}
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

      {/* Brand values strip */}
      <section className="bg-black py-10 px-6 border-y border-[rgba(201,168,76,0.12)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8">
            {brandValues.map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex flex-col items-center gap-2 group">
                {i === 2 ? (
                  /* Center LL star accent */
                  <div className="w-10 h-10 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center group-hover:bg-[#c9a84c]/25 transition-all">
                    <Star size={18} className="text-[#c9a84c]" fill="currentColor" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center group-hover:bg-[#c9a84c]/20 transition-all">
                    <Icon size={18} className="text-[#c9a84c]" />
                  </div>
                )}
                <p className="text-[#9ba9bb] text-xs tracking-wide text-center group-hover:text-[#f0ead8] transition-colors max-w-[110px] leading-snug">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">Ready to Elevate?</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#f0ead8] mb-6">
            Your next chapter starts here.
          </h2>
          <p className="text-[#9ba9bb] mb-10 leading-relaxed">
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
