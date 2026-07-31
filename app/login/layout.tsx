import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portal Login',
  description: 'Log in to the Landi-Lou Talent Agency portal.',
  robots: { index: false, follow: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
