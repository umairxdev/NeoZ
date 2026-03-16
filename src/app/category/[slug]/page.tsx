import { Metadata } from 'next';
import CategoryClient from './page-client';

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'technology': 'Latest technology news, gadgets, AI, and innovation stories from top sources worldwide.',
  'business': 'Breaking business news, markets, economy, and corporate stories from global leaders.',
  'world': 'World news and international affairs - comprehensive coverage of global events.',
  'science': 'Science discoveries, research breakthroughs, and space exploration news.',
  'ai': 'Artificial intelligence news, machine learning updates, and AI industry developments.',
  'sports': 'Sports news - cricket, football, and global sports updates from top sources.',
  'health': 'Health news, medical breakthroughs, wellness tips, and healthcare updates.',
  'entertainment': 'Entertainment news, movies, music, celebrities, and pop culture.',
  'politics': 'Political news, elections, policy updates, and government affairs.',
  'pakistan': 'Pakistan news - latest updates from Pakistan, business, politics, and sports.',
  'south-asia': 'South Asia news - coverage of India, Pakistan, Bangladesh, Sri Lanka, and the region.',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = slug.toLowerCase();
  const displayName = category === 'south-asia' ? 'South Asia' : category.charAt(0).toUpperCase() + category.slice(1);
  const description = CATEGORY_DESCRIPTIONS[category] || `Latest ${displayName} news and updates from NeoZ.`;

  return {
    title: `${displayName} News`,
    description,
    openGraph: {
      title: `${displayName} News | NeoZ`,
      description,
      type: 'website',
      url: `https://neoz.news/category/${category}`,
    },
    twitter: {
      card: 'summary',
      title: `${displayName} News | NeoZ`,
      description,
    },
  };
}

export default CategoryClient;
