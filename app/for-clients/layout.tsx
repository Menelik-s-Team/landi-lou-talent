import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Clients | Landi-Lou Talent Agency',
  description: 'Submit a talent request. Tell us your project needs and we\'ll search our private database to present only the best-matched talent — curated, not browsed.',
  alternates: { canonical: 'https://landiloutalentagency.com/for-clients' },
  openGraph: {
    title: 'For Clients | Landi-Lou Talent Agency',
    description: 'Book talent the right way. Submit your request and let us curate the perfect match for your project.',
    url: 'https://landiloutalentagency.com/for-clients',
  },
}

export default function ForClientsLayout({ children }: { children: React.ReactNode }) {
  return children
}
