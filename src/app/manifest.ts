import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NeoZ - Smart News Dashboard',
    short_name: 'NeoZ',
    description: 'NeoZ delivers personalized news aggregation from top global sources. Stay informed with curated content in technology, business, sports, world news, and more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#1bab89',
    categories: ['news', 'magazines'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
