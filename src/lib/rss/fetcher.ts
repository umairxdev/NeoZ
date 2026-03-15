import Parser from 'rss-parser';
import { Article, FeedSource } from '@/types';
import { RSS_FEEDS } from './feeds';
import { normalizeItem } from './normalizer';
import { deduplicateArticles } from './deduplicator';

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

const REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

const FETCH_TIMEOUT_MS = 8000;

async function fetchFeed(source: FeedSource): Promise<Article[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(source.url, {
        headers: REQUEST_HEADERS,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return [];
      }
      let xml = await response.text();
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

export async function fetchAllFeeds(): Promise<Article[]> {
  const allArticles: Article[] = [];

  // Fetch in smaller batches to avoid timeout
  const BATCH_SIZE = 10;
  for (let i = 0; i < RSS_FEEDS.length; i += BATCH_SIZE) {
    const batch = RSS_FEEDS.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(batch.map(source => fetchFeed(source)));

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        allArticles.push(...result.value);
      }
    }
  }

  allArticles.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return deduplicateArticles(allArticles);
}