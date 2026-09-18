import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://eosjtnjfolgignvuqsml.supabase.co",
              "connect-src 'self' https://eosjtnjfolgignvuqsml.supabase.co wss://eosjtnjfolgignvuqsml.supabase.co",
              "media-src 'self' https://eosjtnjfolgignvuqsml.supabase.co",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
      // No caching on authenticated portal routes
      {
        source: '/(admin|talent-portal|casting)(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // www → non-www
      {
        source: '/(.*)',
        has: [{ type: 'host', value: 'www.landiloutalentagency.com' }],
        destination: 'https://landiloutalentagency.com/:path*',
        permanent: true,
      },
      // Retire old /services → /representation
      {
        source: '/services',
        destination: '/representation',
        permanent: true,
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eosjtnjfolgignvuqsml.supabase.co',
      },
    ],
  },
}

export default nextConfig
