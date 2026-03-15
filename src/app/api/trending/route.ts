import { NextResponse } from 'next/server';
import { articleCache } from '@/lib/rss/cache';

export const revalidate = 3600; // Cache this route's response for 1 hour

// Very simplistic stop words list
const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
  'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
  'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get',
  'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no',
  'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your',
  'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
  'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well',
  'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give',
  'day', 'most', 'us', 'are', 'is', 'was', 'has', 'had', 'been',
  'were', 'more', 'about', 'says'
]);

export async function GET() {
  try {
    const allArticles = await articleCache.getArticles();

    // Only consider recent articles (last 48 hours)
    const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000;
    const recentArticles = allArticles.filter(
      article => new Date(article.publishedAt).getTime() > twoDaysAgo
    );

    const wordCounts: Record<string, number> = {};

    // First try to use explicit tags
    for (const article of recentArticles) {
      if (article.tags && article.tags.length > 0) {
        for (const tag of article.tags) {
          if (tag.length < 3) continue; // Skip very short tags
          const t = tag.toLowerCase();
          wordCounts[t] = (wordCounts[t] || 0) + 1;
        }
      }
    }

    // Convert to sorted array
    let sortedTopics = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([topic, count]) => ({ topic, count }))
      .filter(item => item.count >= 2); // At least 2 mentions

    // Take top 10
    const topTrending = sortedTopics.slice(0, 10);

    return NextResponse.json({
      data: topTrending,
      meta: {
        total: topTrending.length
      }
    });

  } catch (error) {
    console.error('API Error in /api/trending:', error);
    return NextResponse.json({ error: 'Failed to compute trending topics' }, { status: 500 });
  }
}
