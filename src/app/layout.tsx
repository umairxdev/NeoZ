import type { Metadata } from 'next';
import { Syne, Outfit } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/ClientLayout';

const syne = Syne({ 
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://neoz.news'),
  title: {
    default: 'NeoZ | Your Smart News Dashboard',
    template: '%s | NeoZ',
  },
  description: 'NeoZ delivers personalized news aggregation from top global sources. Stay informed with curated content in technology, business, sports, world news, and more.',
  keywords: ['news', 'news aggregator', 'personalized news', 'tech news', 'business news', 'sports news', 'world news', 'Pakistan news', 'South Asia news', 'AI news'],
  authors: [{ name: 'NeoZ' }],
  creator: 'NeoZ',
  publisher: 'NeoZ',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://neoz.news',
    siteName: 'NeoZ',
    title: 'NeoZ | Your Smart News Dashboard',
    description: 'NeoZ delivers personalized news aggregation from top global sources. Stay informed with curated content in technology, business, sports, world news, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeoZ - Smart News Aggregation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeoZ | Your Smart News Dashboard',
    description: 'NeoZ delivers personalized news aggregation from top global sources.',
    images: ['/og-image.png'],
    creator: '@neoz',
  },
  alternates: {
    canonical: 'https://neoz.news',
    languages: {
      'en-US': 'https://neoz.news',
    },
  },
  category: 'news',
  classification: 'News Aggregator',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "NeoZ",
              "url": "https://neoz.news",
              "description": "Smart news aggregation from top global sources",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://neoz.news/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "NeoZ",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://neoz.news/logo.png"
                }
              }
            })
          }}
        />
      </head>
      <body className={`${syne.variable} ${outfit.variable} min-h-screen bg-background antialiased flex flex-col`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
