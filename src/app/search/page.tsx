import { Metadata } from 'next';
import SearchClient from './page-client';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || '';
  const title = query ? `Search: ${query}` : 'Search News';
  const description = query 
    ? `Search results for "${query}" on NeoZ - your smart news dashboard.`
    : 'Search news on NeoZ - your smart news dashboard.';

  return {
    title,
    description,
    openGraph: {
      title: `${title} | NeoZ`,
      description,
      type: 'website',
      url: `https://neoz.news/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
    },
    twitter: {
      card: 'summary',
      title: `${title} | NeoZ`,
      description,
    },
  };
}

export default SearchClient;
