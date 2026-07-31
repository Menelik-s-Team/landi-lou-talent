import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://eosjtnjfolgignvuqsml.supabase.co",
              "connect-src 'self' https://eosjtnjfolgignvuqsml.supabase.co https://api.resend.com",
              "frame-ancestors 'none'",
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
