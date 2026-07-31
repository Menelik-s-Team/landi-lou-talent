import Navbar from '@/components/nav/Navbar'
import Footer from '@/components/nav/Footer'
import { Mail, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Contact | Landi-Lou Talent Agency',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <section className="pt-36 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-[#0ea5c8]/5 blur-[100px]" />
        </div>
        <div className="relative z-10">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Get In Touch</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl text-[#f0ead8] mb-6">
            Contact Us
          </h1>
          <div className="w-16 h-px bg-[#c9a84c]/40 mx-auto" />
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14">
          {/* Info */}
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#f0ead8] mb-8">
              Let&apos;s Connect
            </h2>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-[#c9a84c]" />
                </div>
                <div>
                  <p className="text-[#7a869a] text-xs tracking-widest uppercase mb-1">Email</p>
                  <a href="mailto:info@landiloutalentagency.com" className="text-[#f0ead8] hover:text-[#c9a84c] transition-colors">
                    info@landiloutalentagency.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-[#c9a84c]" />
                </div>
                <div>
                  <p className="text-[#7a869a] text-xs tracking-widest uppercase mb-1">Location</p>
                  <p className="text-[#f0ead8]">Central Florida</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-[rgba(201,168,76,0.15)]">
              <p className="text-[#7a869a] text-sm leading-relaxed">
                For talent submissions, please use our{' '}
                <a href="/submit" className="text-[#c9a84c] hover:text-[#e8c97a] transition-colors">
                  submission form
                </a>
                . For casting director inquiries, contact us directly via email.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="glass-card rounded-lg p-8">
            <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#f0ead8] mb-6">Send a Message</h3>
            <form className="flex flex-col gap-5" action="mailto:info@landiloutalentagency.com" method="get" encType="text/plain">
              <div>
                <label className="block text-[#7a869a] text-xs tracking-widest uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#7a869a] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-[#7a869a] text-xs tracking-widest uppercase mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#7a869a] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-[#7a869a] text-xs tracking-widest uppercase mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#7a869a] focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                  placeholder="What is this about?"
                />
              </div>
              <div>
                <label className="block text-[#7a869a] text-xs tracking-widest uppercase mb-2">Message</label>
                <textarea
                  name="body"
                  rows={5}
                  className="w-full bg-[#141929] border border-[rgba(201,168,76,0.2)] rounded px-4 py-3 text-[#f0ead8] text-sm placeholder-[#7a869a] focus:outline-none focus:border-[#c9a84c]/60 transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#c9a84c] text-[#06080f] font-semibold rounded text-sm tracking-wide hover:bg-[#e8c97a] transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
