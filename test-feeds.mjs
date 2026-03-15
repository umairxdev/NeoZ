import Parser from 'rss-parser';
import { RSS_FEEDS } from './src/lib/rss/feeds';

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
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

const FETCH_TIMEOUT_MS = 8000;

async function testFeed(source: any) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const startTime = Date.now();
    const response = await fetch(source.url, {
      headers: REQUEST_HEADERS,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const duration = Date.now() - startTime;

    if (!response.ok) {
      console.log(`❌ ${source.sourceName}: HTTP ${response.status} (${duration}ms)`);
      return;
    }

    const xml = await response.text();
    await parser.parseString(xml);
    console.log(`✅ ${source.sourceName}: OK (${duration}ms)`);
  } catch (error: any) {
    clearTimeout(timeoutId);
    const isAbort = error instanceof Error && error.name === 'AbortError';
    console.log(`❌ ${source.sourceName}: ${isAbort ? 'Timeout' : error.message}`);
  }
}

async function runTests() {
  console.log(`Testing ${RSS_FEEDS.length} feeds...\n`);
  // Test in small batches to not saturate local connection
  const batchSize = 5;
  for (let i = 0; i < RSS_FEEDS.length; i += batchSize) {
    const batch = RSS_FEEDS.slice(i, i + batchSize);
    await Promise.all(batch.map(testFeed));
  }
}

runTests();
