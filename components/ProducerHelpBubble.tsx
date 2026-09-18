'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Phone, Mail } from 'lucide-react'

export default function ProducerHelpBubble() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    function onScroll() {
      if (dismissed) return
      const scrolled = window.scrollY > 400
      setVisible(scrolled)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  function dismiss() {
    setDismissed(true)
    setVisible(false)
    setOpen(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded panel */}
      {open && (
        <div className="bg-[#0d1120] border border-[#c9a84c]/30 rounded-2xl shadow-2xl w-72 p-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[#f0ead8] font-semibold text-sm">Need help finding talent?</p>
              <p className="text-[#9ba9bb] text-xs mt-0.5 leading-relaxed">
                Our team is ready to get on a call and match you with the right talent fast.
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#9ba9bb] hover:text-[#f0ead8] ml-3 flex-shrink-0 transition-colors">
              <X size={16} />
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <a
              href="tel:+14073556400"
              className="flex items-center gap-3 px-4 py-3 bg-[#c9a84c] text-[#06080f] rounded-xl font-semibold text-sm hover:bg-[#e8c97a] transition-colors"
            >
              <Phone size={15} />
              Schedule a Call
            </a>
            <a
              href="mailto:info@landiloutalentagency.com"
              className="flex items-center gap-3 px-4 py-3 border border-[#c9a84c]/30 text-[#c9a84c] rounded-xl text-sm hover:bg-[#c9a84c]/10 transition-colors"
            >
              <Mail size={15} />
              Send an Email
            </a>
          </div>
          <button
            onClick={dismiss}
            className="text-[#9ba9bb]/50 text-xs mt-4 hover:text-[#9ba9bb] transition-colors"
          >
            Don&apos;t show this again
          </button>
        </div>
      )}

      {/* Bubble trigger */}
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="Get help finding talent"
        className="relative w-14 h-14 rounded-full bg-[#c9a84c] text-[#06080f] flex items-center justify-center shadow-lg hover:bg-[#e8c97a] transition-all hover:scale-105 active:scale-95"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#c9a84c] animate-ping opacity-25" />
        )}
      </button>
    </div>
  )
}
