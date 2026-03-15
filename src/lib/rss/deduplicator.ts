import { Article } from '@/types';

// Simple fuzzy match for titles to catch same articles from different syndications
function isSimilarTitle(title1: string, title2: string): boolean {
  if (!title1 || !title2) return false;
  
  // Normalize strings
  const n1 = title1.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const n2 = title2.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  
  // Exact match after normalization
  if (n1 === n2) return true;
  
  // Contains match (e.g. "Breaking: Something happened" vs "Something happened")
  if (n1.includes(n2) && n2.length > 20) return true;
  if (n2.includes(n1) && n1.length > 20) return true;
  
  return false;
}

export function deduplicateArticles(articles: Article[]): Article[] {
  const uniqueArticles: Article[] = [];
  const urlSet = new Set<string>();

  for (const article of articles) {
    // 1. Exact URL match deduplication
    const normalizedUrl = article.url.split('?')[0]; // Strip tracking params
    if (urlSet.has(normalizedUrl)) {
      continue;
    }
    
    // 2. Title similarity deduplication (avoid showing the exact same news story multiple times)
    const hasSimilar = uniqueArticles.some(existing => 
      isSimilarTitle(existing.title, article.title)
    );
    
    if (hasSimilar) {
      continue;
    }

    // It's unique
    uniqueArticles.push(article);
    urlSet.add(normalizedUrl);
  }

  return uniqueArticles;
}
