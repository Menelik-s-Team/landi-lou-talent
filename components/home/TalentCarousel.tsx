'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TalentCard {
  src: string
  name: string | null
  category: string
}

const cards: TalentCard[] = [
  { src: '/talent/crystal-rischer-red.jpg', name: 'Crystal R.', category: 'Model / Lifestyle' },
  { src: '/talent/crystal-rischer.jpg', name: 'Crystal R.', category: 'Actor / Lifestyle' },
  { src: '/talent/dorian-gayle.jpg', name: 'Dorian G.', category: 'Comedian / Actor' },
  { src: '/talent/brooke-austin.jpg', name: 'Brooke A.', category: 'Model / Lifestyle' },
  { src: '/talent/richie-thole.jpg', name: 'Richie T.', category: 'Lifestyle / Model' },
  { src: '/talent/talent-1.jpg', name: null, category: 'Actor' },
  { src: '/talent/talent-4.jpg', name: null, category: 'Model / Influencer' },
  { src: '/talent/talent-6.jpg', name: null, category: 'Model / Lifestyle' },
  { src: '/talent/talent-7.jpg', name: null, category: 'Model / Commercial' },
  { src: '/talent/child-talent.png', name: null, category: 'Young Talent' },
  { src: '/talent/talent-new-1.jpg', name: null, category: 'Actor / Commercial' },
]

export default function TalentCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  const total = cards.length

  function next() {
    setDirection('next')
    setCurrent(i => (i + 1) % total)
  }

  function prev() {
    setDirection('prev')
    setCurrent(i => (i - 1 + total) % total)
  }

  const getCard = (offset: number) => cards[(current + offset) % total]

  const front = getCard(0)
  const mid = getCard(1)
  const back = getCard(2)

  return (
    <div className="flex flex-col items-center gap-10">
      {/* Card stack */}
      <div className="relative w-72 sm:w-80" style={{ height: '420px' }}>

        {/* Back card */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-xl"
          style={{
            transform: 'translate(20px, 18px) scale(0.90) rotate(4deg)',
            zIndex: 10,
            transformOrigin: 'bottom center',
          }}
        >
          <Image
            src={back.src}
            alt={back.name ?? back.category}
            fill
            className="object-cover object-top"
            sizes="320px"
          />
          <div className="absolute inset-0 bg-[#06080f]/40" />
        </div>

        {/* Mid card */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-xl"
          style={{
            transform: 'translate(10px, 10px) scale(0.95) rotate(2deg)',
            zIndex: 20,
            transformOrigin: 'bottom center',
          }}
        >
          <Image
            src={mid.src}
            alt={mid.name ?? mid.category}
            fill
            className="object-cover object-top"
            sizes="320px"
          />
          <div className="absolute inset-0 bg-[#06080f]/25" />
        </div>

        {/* Front card — clickable to advance */}
        <button
          onClick={next}
          className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
          style={{ zIndex: 30, transform: 'translate(0, 0) scale(1) rotate(0deg)', transformOrigin: 'bottom center' }}
          aria-label={`Current: ${front.name ?? front.category}. Click to see next talent.`}
        >
          <Image
            src={front.src}
            alt={front.name ?? front.category}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 288px, 320px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080f]/80 via-[#06080f]/10 to-transparent" />
          {/* Name / category overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
            <p className="text-[#c9a84c] text-xs tracking-widest uppercase">{front.category}</p>
          </div>
          {/* Tap hint */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-[#06080f]/60 rounded-full px-3 py-1">
            <p className="text-[#c9a84c] text-[10px] tracking-widest uppercase">Next</p>
          </div>
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={prev}
          aria-label="Previous talent"
          className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center text-[#9ba9bb] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to talent ${i + 1}`}
              className={`rounded-full transition-all ${
                i === current
                  ? 'w-5 h-2 bg-[#c9a84c]'
                  : 'w-2 h-2 bg-[rgba(201,168,76,0.2)] hover:bg-[#c9a84c]/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next talent"
          className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center text-[#9ba9bb] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Counter */}
      <p className="text-[#9ba9bb] text-xs tracking-widest uppercase">
        {current + 1} / {total}
      </p>
    </div>
  )
}
