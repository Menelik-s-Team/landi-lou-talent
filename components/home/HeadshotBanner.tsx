import Image from 'next/image'

const headshots = [
  { src: '/talent/talent-1.jpg', name: null, category: 'Actor' },
  { src: '/talent/talent-4.jpg', name: null, category: 'Model / Influencer' },
  { src: '/talent/dorian-gayle.jpg', name: 'Dorian G.', category: 'Comedian / Actor' },
  { src: '/talent/brooke-austin.jpg', name: 'Brooke A.', category: 'Model / Lifestyle' },
  // Center feature — Crystal R. in red dress
  { src: '/talent/crystal-rischer-red.jpg', name: 'Crystal R.', category: 'Model / Lifestyle', featured: true },
  { src: '/talent/crystal-rischer.jpg', name: 'Crystal R.', category: 'Actor / Lifestyle' },
  { src: '/talent/richie-thole.jpg', name: 'Richie T.', category: 'Lifestyle / Model' },
  { src: '/talent/talent-7.jpg', name: null, category: 'Model / Commercial' },
  { src: '/talent/child-talent.png', name: null, category: 'Young Talent' },
]

export default function HeadshotBanner() {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-end justify-start md:justify-center gap-3 px-6 min-w-max mx-auto">
        {headshots.map((talent, i) => {
          const isFeatured = !!(talent as { featured?: boolean }).featured

          return (
            <div
              key={i}
              className="relative flex-shrink-0 rounded-xl overflow-hidden group"
              style={{
                width: isFeatured ? '160px' : '110px',
                height: isFeatured ? '300px' : '220px',
                boxShadow: isFeatured
                  ? '0 0 40px rgba(201,168,76,0.35), 0 0 80px rgba(124,58,173,0.2)'
                  : '0 4px 24px rgba(0,0,0,0.4)',
                border: isFeatured ? '2px solid rgba(201,168,76,0.6)' : '1px solid rgba(201,168,76,0.1)',
              }}
            >
              <Image
                src={talent.src}
                alt={talent.name ?? talent.category}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                sizes={isFeatured ? '160px' : '110px'}
              />
              {/* Subtle bottom fade for name tag */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Name / category on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-[#c9a84c] text-[9px] tracking-widest uppercase text-center leading-tight">
                  {talent.name ? `${talent.name} · ` : ''}{talent.category}
                </p>
              </div>
              {/* Featured badge */}
              {isFeatured && (
                <div className="absolute top-2 left-0 right-0 flex justify-center">
                  <span className="bg-[#c9a84c] text-[#06080f] text-[8px] tracking-[0.2em] uppercase font-bold px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
