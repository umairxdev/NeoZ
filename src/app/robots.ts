import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isDev = process.env.NODE_ENV === 'development';
  const baseUrl = isDev ? 'http://localhost:3000' : 'https://' + (process.env.VERCEL_URL || 'newsstream.vercel.app');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
