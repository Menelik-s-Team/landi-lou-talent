'use client'

import { useState } from 'react'
import { ChevronDown, Play, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const talentFaqs = [
  {
    question: 'How do I submit my profile for representation?',
    answer: 'Click "Submit Profile" and complete our multi-step submission form. You\'ll provide your personal info, talent categories, physical attributes, and upload your headshots and any demo or voice reels. Once submitted, our team reviews your application and you\'ll receive a response by email.',
    cta: { label: 'Start your submission now', href: '/submit' },
    videoPlaceholder: true,
  },
  {
    question: 'What does Landi-Lou look for in new talent?',
    answer: 'We represent talent who are professional, reliable, and ready to work — not just people who look good. We look at your training, your body of work, how you present yourself, and whether your skills match the categories you\'re submitting for. We value professionalism, responsiveness, and a genuine commitment to the craft.',
    cta: { label: 'See our areas of representation', href: '/representation' },
    videoPlaceholder: false,
  },
  {
    question: 'Do I need experience to apply?',
    answer: 'Not necessarily. We work with talent at various stages — from emerging to professional. What matters most is that you\'re trained, coachable, and ready to commit. If you\'re new, be honest about your experience level on your submission and let your skills speak for themselves.',
    cta: { label: 'Submit your profile', href: '/submit' },
    videoPlaceholder: true,
  },
  {
    question: 'How long does the review process take?',
    answer: 'We review all submissions carefully. Because we operate as a selective boutique agency, our process is thorough. You can typically expect to hear back within 2–4 weeks. All talent receive a response — whether approved or not.',
    cta: { label: 'Questions? Contact us', href: '/contact' },
    videoPlaceholder: false,
  },
  {
    question: 'What happens after I\'m approved?',
    answer: 'Once approved, you\'ll receive login credentials to your talent portal. From there, you\'ll complete your full profile, upload your media, and keep your availability up to date. Our team will contact you when opportunities that match your profile become available.',
    cta: { label: 'Learn more about the process', href: '/representation' },
    videoPlaceholder: true,
  },
  {
    question: 'Does Landi-Lou guarantee me work?',
    answer: 'No agency can guarantee bookings — and any that claim otherwise should be approached with caution. What we guarantee is professional representation, active outreach on your behalf, and honest communication about opportunities. The goal is to connect your skills with the right projects.',
    cta: { label: 'Submit your profile', href: '/submit' },
    videoPlaceholder: false,
  },
  {
    question: 'What are agency commissions?',
    answer: 'Landi-Lou operates on a standard commission model — meaning we earn a percentage of your booking fee when you book work through the agency. We will always be transparent about commission rates before you sign with us. We do not charge upfront fees for representation.',
    cta: { label: 'Have questions? Reach out directly', href: '/contact' },
    videoPlaceholder: false,
  },
  {
    question: 'Can I be represented by Landi-Lou and another agency at the same time?',
    answer: 'This depends on your representation agreement. We offer both exclusive and non-exclusive representation depending on the category of work. This will be discussed in detail before any agreement is signed. Transparency about existing representation is important during the submission process.',
    cta: { label: 'Start your submission', href: '/submit' },
    videoPlaceholder: false,
  },
]

export default function TalentFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="talent-faqs" className="py-24 px-6 bg-[#0a0d18] border-t border-[rgba(201,168,76,0.08)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">For Talent</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#f0ead8] mb-4">
            Talent FAQ
          </h2>
          <p className="text-[#9ba9bb] text-sm leading-relaxed max-w-lg mx-auto">
            Questions about submitting, getting approved, and working with Landi-Lou.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {talentFaqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#c9a84c]/40 bg-[#0d1120]'
                    : 'border-[rgba(201,168,76,0.12)] bg-[#06080f] hover:border-[#c9a84c]/25'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[#f0ead8] font-medium text-[15px] leading-snug pr-2">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#c9a84c] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 flex flex-col gap-4">
                    <p className="text-[#9ba9bb] leading-relaxed text-sm">
                      {faq.answer}
                    </p>

                    {faq.videoPlaceholder && (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#c9a84c]/15 bg-[#06080f] flex items-center justify-center group cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1200]/40 via-transparent to-[#0d0020]/40" />
                        <div className="relative z-10 flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center group-hover:bg-[#c9a84c]/20 transition-all">
                            <Play size={22} className="text-[#c9a84c] ml-0.5" fill="currentColor" />
                          </div>
                          <p className="text-[#9ba9bb] text-xs tracking-wide">Video answer coming soon</p>
                        </div>
                      </div>
                    )}

                    <Link
                      href={faq.cta.href}
                      className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-semibold tracking-widest uppercase hover:gap-3 transition-all"
                    >
                      {faq.cta.label} <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-[#9ba9bb] text-sm">
            More questions?{' '}
            <a
              href="mailto:info@landiloutalentagency.com"
              className="text-[#c9a84c] hover:text-[#e8c97a] transition-colors font-medium"
            >
              Email us directly
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
