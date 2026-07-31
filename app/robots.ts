import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/talent-portal', '/casting', '/api/'],
      },
    ],
    sitemap: 'https://landiloutalentagency.com/sitemap.xml',
  }
}
