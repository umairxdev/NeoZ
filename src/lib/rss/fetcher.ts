import Parser from 'rss-parser';
import { Article, FeedSource } from '@/types';
import { RSS_FEEDS } from './feeds';
import { normalizeItem } from './normalizer';
import { deduplicateArticles } from './deduplicator';

// Configure rss-parser with custom fields to extract images and other metadata
const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content', { keepArray: true }],
      ['media:thumbnail', 'media:thumbnail'],
      ['content:encoded', 'content:encoded'],
      ['description', 'description'],
      ['category', 'categories', { keepArray: true }]
    ]
  }
});

// Browser-like headers to avoid being blocked by anti-bot measures
const REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

const FETCH_TIMEOUT_MS = 5000;

/**
 * Fetches and parses a single RSS feed.
 * Uses native fetch with browser-like headers, then parses the XML string.
 */
async function fetchFeed(source: FeedSource): Promise<Article[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let xml: string;
    try {
      const response = await fetch(source.url, {
        headers: REQUEST_HEADERS,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`Feed ${source.sourceName} returned HTTP ${response.status}`);
        return [];
      }
      xml = await response.text();
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      const isAbort = fetchError instanceof Error && fetchError.name === 'AbortError';
      console.error(
        `Failed to fetch feed ${source.sourceName} (${source.url}):`,
        isAbort ? `Request timed out after ${FETCH_TIMEOUT_MS}ms` : fetchError
      );
      return [];
    }

    const feed = await parser.parseString(xml);
    const articles: Article[] = [];

    // Take up to 20 most recent items per feed
    const items = feed.items.slice(0, 20);

    for (const item of items) {
      const article = normalizeItem(item, source);
      if (article) {
        articles.push(article);
      }
    }

    return articles;
  } catch (error) {
    console.error(`Failed to parse feed ${source.sourceName} (${source.url}):`, error);
    return [];
  }
}

/**
 * Fetches all RSS feeds in parallel, normalizes, and deduplicates them.
 */
export async function fetchAllFeeds(): Promise<Article[]> {
  const allArticles: Article[] = [];

  // Fetch all feeds in parallel with failure tolerance
  const results = await Promise.allSettled(
    RSS_FEEDS.map(source => fetchFeed(source))
  );

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      allArticles.push(...result.value);
    }
  }

  // Sort by published date descending
  allArticles.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // Deduplicate
  const dedupedArticles = deduplicateArticles(allArticles);

  return dedupedArticles;
}
