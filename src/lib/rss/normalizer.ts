import crypto from 'crypto';
import { stripHtml } from 'string-strip-html';
import { Article, Category, FeedSource } from '@/types';
import { extractImage } from './image-extractor';

function decodeEntities(text: string): string {
  const entities: Record<string, string> = {
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&#8217;': "'",
    '&#8211;': '-',
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8216;': "'",
    '&#39;': "'",
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&ndash;': '-',
    '&mdash;': '—',
  };
  return text.replace(/&[#\w\d]+;/g, (entity) => entities[entity] || entity);
}

function truncateToWords(text: string, maxWords: number, minWords?: number): string {
  const words = text.trim().split(/\s+/);
  // Keep original if fewer than minWords (don't harm short descriptions)
  if (minWords && words.length < minWords) {
    return text;
  }
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

// Keywords that indicate a promotional/sponsored article - these should be filtered out
const PROMO_KEYWORDS = [
  'promo code', 'promo codes', 'coupon code', 'coupon codes', 'discount code',
  'discount codes', 'deals:', 'deal:', 'save up to', 'percent off', '% off',
  'coupons and deals', 'best deals', 'shopping deals', 'affiliate',
];

export function normalizeItem(item: any, source: FeedSource): Article | null {
  if (!item.title || !item.link) {
    return null; // Skip invalid items
  }

  // Filter out promotional/sponsored/promo-code articles
  const titleLower = item.title.toLowerCase();
  if (PROMO_KEYWORDS.some(keyword => titleLower.includes(keyword))) {
    return null;
  }

  // 1. Generate a unique ID
  const rawId = item.guid || item.id || item.link;
  const id = crypto.createHash('md5').update(rawId).digest('hex');

  // 2. Clean up description
  let rawDesc = item.contentSnippet || item.content || item.description || '';
  let fullDescription = '';
  try {
    fullDescription = stripHtml(rawDesc).result;
  } catch (e) {
    fullDescription = rawDesc.replace(/<[^>]*>?/gm, ''); // Fallback regex
  }
  
  fullDescription = decodeEntities(fullDescription).trim();
  
  // Limit to max 500 words for full description
  fullDescription = truncateToWords(fullDescription, 500, 200);

  // Truncate to shorter length for card display (~50 words)
  let description = truncateToWords(fullDescription, 50);

  // 3. Parse date
  let publishedAt = new Date().toISOString();
  if (item.pubDate || item.isoDate) {
    try {
      publishedAt = new Date(item.isoDate || item.pubDate).toISOString();
    } catch (e) {
      // Fallback to current date
    }
  }

  // 4. Extract categories/tags from item if present
  let tags: string[] = [];
  if (item.categories && Array.isArray(item.categories)) {
    tags = item.categories
      .map((c: any) => typeof c === 'string' ? c : c._)
      .filter(Boolean);
  }

  // 5. Extract image
  const image = extractImage(item, source.category);

  return {
    id,
    title: decodeEntities(item.title),
    description,
    fullDescription,
    url: item.link,
    image,
    source: source.sourceName,
    category: source.category,
    publishedAt,
    tags
  };
}