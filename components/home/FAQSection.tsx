'use client'

import { useState } from 'react'
import { ChevronDown, Play, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    question: 'Should I choose talent based on their look?',
    answer: 'The right look matters—but it\'s only the beginning. Before choosing talent, review their resume, training, credits, and demo reel. A great headshot tells you someone looks right for the role. A demo reel tells you whether they can actually do the job. Professional talent understand how to take direction, work with a production team, adjust a performance, hit marks, deliver dialogue naturally, and perform consistently from take to take. Landi-Lou helps clients find talent who not only look the part, but can deliver when the camera starts rolling.',
    cta: { label: 'Let us find the right talent for your project', href: '/for-clients' },
    videoPlaceholder: true,
  },
  {
    question: 'Why should I hire professional talent instead of using an employee or someone we already know?',
    answer: 'Because being comfortable in everyday life is very different from being comfortable on camera. What appears to be a simple 30-second delivery can require multiple takes, precise timing, memorization, teleprompter ability, blocking, continuity, and adjustments from a director. Experienced talent can often accomplish in a few takes what an inexperienced performer may struggle with for hours—which can save valuable production time and money.',
    cta: { label: 'Submit a talent request', href: '/for-clients' },
    videoPlaceholder: true,
  },
  {
    question: "Isn't professional talent more expensive?",
    answer: 'Not necessarily when you consider the cost of the entire production. Cameras, crew, locations, equipment, editors, producers, and everyone else on set are costing money while the camera is rolling. Saving a few hundred dollars on talent can become very expensive if an inexperienced performer requires significantly more time or leaves you without usable footage. Professional talent is an investment in getting the job done efficiently and getting footage you can actually use.',
    cta: { label: 'Talk to us about your budget', href: '/for-clients' },
    videoPlaceholder: false,
  },
  {
    question: 'What should I look for in a demo reel?',
    answer: 'Don\'t just ask, "Do I like this person?" Ask, "Can I see evidence that this person can do what my project requires?" If your project involves a spokesperson, look for strong direct-to-camera delivery. If it requires a teleprompter, look for demonstrated teleprompter experience. If it\'s a dramatic role, look for acting work. If it requires hosting, interviewing, comedy, improvisation, or product demonstration, look for those specific skills. Previous work is often one of the best predictors of whether someone can successfully handle yours.',
    cta: { label: 'Let us curate the right match for you', href: '/for-clients' },
    videoPlaceholder: true,
  },
  {
    question: 'Do I always need to hold auditions?',
    answer: 'No. Sometimes the talent\'s existing body of work already answers the important questions. If a professional has extensive credits and a reel demonstrating the exact skill you need, asking them to perform an unrelated or overly complicated audition may not tell you anything useful. Landi-Lou can help determine when an audition is valuable—and when a resume, reel, interview, or brief skills check will give you the information you actually need.',
    cta: { label: 'Get expert guidance on your casting process', href: '/for-clients' },
    videoPlaceholder: false,
  },
  {
    question: 'What makes someone "professional talent"?',
    answer: 'Professionalism is about much more than having acting credits. We look for talent who arrive prepared, communicate promptly, follow instructions, take direction, understand production etiquette, maintain consistency, and have the skills their materials claim they have. Professional talent will make your production easier—not become another problem your team has to solve.',
    cta: { label: 'Meet our professional roster', href: '/for-clients' },
    videoPlaceholder: true,
  },
  {
    question: 'What if I need someone with a very specific skill?',
    answer: 'Tell us. "Actor" or "model" may only describe part of what you actually need. Your project might require someone who can use a teleprompter naturally, improvise, conduct interviews, demonstrate a product, memorize technical language, perform comedy, speak to a live audience, or deliver complicated copy conversationally. The more we understand about what the person will actually be expected to do, the better we can match you with the right talent.',
    cta: { label: 'Describe your project and we\'ll find the fit', href: '/for-clients' },
    videoPlaceholder: false,
  },
  {
    question: 'Why work with Landi-Lou instead of searching for talent myself?',
    answer: 'Because casting shouldn\'t just be about finding people—it should be about finding the right people for the job. Landi-Lou can help narrow the field based on appearance, experience, demonstrated ability, professionalism, availability, and the specific demands of your production. Instead of sorting through hundreds of profiles and hoping someone can deliver, you have an agency helping you identify professionals whose experience supports what they\'re being hired to do.',
    cta: { label: 'Work with Landi-Lou today', href: '/for-clients' },
    videoPlaceholder: true,
  },
  {
    question: 'What information should I give Landi-Lou when requesting talent?',
    answer: 'Start with what you\'re creating, what the talent will actually be doing, where and when the project shoots, how many talent you need, and your approximate budget. It\'s also important to tell us how the finished content will be used—including platforms, geographic reach, length of use, and whether you need limited usage or a full buyout. Those details help us recommend appropriate talent and provide accurate pricing.',
    cta: { label: 'Submit your project details now', href: '/for-clients' },
    videoPlaceholder: false,
  },
  {
    question: "What's the biggest mistake clients make when casting?",
    answer: 'Casting the picture instead of the performer. Someone can look exactly like the person you imagined and still be completely wrong for the demands of the job. Start with the skills the production requires, verify those skills through resumes, reels, credits, or auditions, and then choose the person who also fits your creative vision. The goal isn\'t simply to find someone who looks right standing in front of the camera. It\'s to find someone who can deliver once it turns on.',
    cta: { label: 'Let us help you cast smarter', href: '/for-clients' },
    videoPlaceholder: true,
  },
  {
    question: 'How much should I pay an actor or professional talent?',
    answer: 'There isn\'t one standard answer. Talent rates can vary based on the type of project, the performer\'s experience and specialized skills, the time required, where the project is being produced, and especially how and where the finished content will be used. A talent quote may include a Session Fee (compensation for time on set), a Usage Fee (based on how and where content will be distributed), Travel & Accommodations, and other project-specific considerations. You\'re not simply paying for hours on set—you\'re paying for professional performance, experience, and the agreed-upon use of that performance.',
    cta: { label: 'Tell us your budget and we\'ll make it work', href: '/for-clients' },
    videoPlaceholder: false,
  },
  {
    question: 'What are your agency fees, and how does Landi-Lou get paid?',
    answer: 'We believe in complete transparency. As the talent\'s representative, Landi-Lou may receive a commission calculated as a percentage of the talent\'s compensation for a booked project. Depending on the project, we may also charge a separate agency or service fee that covers sourcing and presenting qualified talent, coordinating auditions and availability, negotiating booking terms, handling contracts and paperwork, and managing communication throughout the booking. Before a booking is finalized, Landi-Lou will provide a clear breakdown of all applicable costs. No mystery markups. No hidden fees. Just clear, professional representation from the beginning of the booking through completion.',
    cta: { label: 'Request a transparent quote for your project', href: '/for-clients' },
    videoPlaceholder: false,
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faqs" className="py-24 px-6 bg-[#06080f] border-t border-[rgba(201,168,76,0.08)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">For Clients</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#f0ead8] mb-4">
            Client FAQ
          </h2>
          <p className="text-[#9ba9bb] text-sm leading-relaxed max-w-lg mx-auto">
            Everything you need to know about hiring talent through Landi-Lou.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#c9a84c]/40 bg-[#0d1120]'
                    : 'border-[rgba(201,168,76,0.12)] bg-[#0a0d18] hover:border-[#c9a84c]/25'
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

                    {/* Video placeholder — swap with embedded talent video when Alexis delivers footage */}
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

                    {/* CTA */}
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
            Still have questions?{' '}
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
