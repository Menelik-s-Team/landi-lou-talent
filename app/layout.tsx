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
  title: 'Landi-Lou Talent Agency | Premier Talent Representation',
  description:
    'The first fully integrated talent agency in Central Florida. We curate talent, protect legacy, and partner with brands aligned with excellence.',
  openGraph: {
    title: 'Landi-Lou Talent Agency',
    description: 'We are not a volume agency. We are a premier house of talent, vision, and opportunity.',
    url: 'https://landiloutalentagency.com',
    siteName: 'Landi-Lou Talent Agency',
    type: 'website',
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
