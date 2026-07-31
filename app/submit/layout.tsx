import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Submit Your Talent',
  description: 'Apply for representation with Landi-Lou Talent Agency. We accept actors, models, influencers, voice-over artists, singers, and dancers in Central Florida.',
  alternates: { canonical: 'https://landiloutalentagency.com/submit' },
  openGraph: {
    title: 'Submit Your Talent | Landi-Lou Talent Agency',
    description: 'Apply for representation with Central Florida\'s premier talent agency.',
    url: 'https://landiloutalentagency.com/submit',
  },
}

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
