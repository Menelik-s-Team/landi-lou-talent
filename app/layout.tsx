import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://landiloutalentagency.com'),
  title: {
    default: 'Landi-Lou Talent Agency | Premier Talent Representation in Central Florida',
    template: '%s | Landi-Lou Talent Agency',
  },
  description:
    'Central Florida\'s premier talent agency representing actors, models, influencers, voice-over artists, singers, and dancers. We curate talent, protect legacy, and connect performers with elite opportunities.',
  keywords: [
    'Central Florida talent agency',
    'Orlando talent agency',
    'Florida talent representation',
    'book talent Central Florida',
    'actors models Orlando',
    'talent agency Florida',
    'Landi-Lou Talent Agency',
  ],
  authors: [{ name: 'Dr. Calandria Smith' }],
  creator: 'Landi-Lou Talent Agency',
  openGraph: {
    title: 'Landi-Lou Talent Agency | Premier Talent Representation',
    description: 'Central Florida\'s premier talent agency. We curate talent, protect legacy, and partner with brands aligned with excellence.',
    url: 'https://landiloutalentagency.com',
    siteName: 'Landi-Lou Talent Agency',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Landi-Lou Talent Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Landi-Lou Talent Agency',
    description: 'Central Florida\'s premier talent agency.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://landiloutalentagency.com',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased bg-[#06080f] text-[#f0ead8]">
        {children}
      </body>
    </html>
  )
}
