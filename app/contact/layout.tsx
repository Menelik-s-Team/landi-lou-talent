import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Landi-Lou Talent Agency. For talent submissions, use the submission form. For casting director inquiries, reach out directly.',
  alternates: { canonical: 'https://landiloutalentagency.com/contact' },
  openGraph: {
    title: 'Contact | Landi-Lou Talent Agency',
    description: 'Reach out to Landi-Lou Talent Agency — Central Florida\'s premier talent representation firm.',
    url: 'https://landiloutalentagency.com/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
