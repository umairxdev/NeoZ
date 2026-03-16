import { NextResponse } from 'next/server';
import { articleCache } from '@/lib/rss/cache';

export const revalidate = 0;

function getInterestsFromCookie(request: Request): string[] {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return [];
  
  const match = cookieHeader.match(/neoz_interests=([^;]+)/);
  if (!match || !match[1]) return [];
  
  return match[1].split(',').filter(Boolean).map(i => i.trim().toLowerCase());
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const section = searchParams.get('section') || 'latest';
    
    // Get interests from cookie (for server-side personalization)
    let interests = getInterestsFromCookie(request);
    
    // Also check URL param as fallback
    const interestsParam = searchParams.get('interests');
    if (interestsParam && interests.length === 0) {
      interests = interestsParam.split(',').map(i => i.trim().toLowerCase()).filter(Boolean);
    }

    const allArticles = await articleCache.getArticles();

    let sortedArticles = [...allArticles];
    
    // If user has interests, prioritize articles matching those interests
    if (interests.length > 0) {
      sortedArticles = sortedArticles.map(article => {
        let score = 0;
        const articleCategory = article.category.toString().toLowerCase();
        const articleTags = article.tags.map(t => t.toLowerCase());
        const articleSource = article.source.toLowerCase();
        const articleTitle = article.title.toLowerCase();
        
        // Strong boost for category match
        for (const interest of interests) {
          if (articleCategory === interest) {
            score += 50;
          }
          if (articleCategory.includes(interest) || interest.includes(articleCategory)) {
            score += 25;
          }
        }
        
        // Tag match boost
        for (const interest of interests) {
          for (const tag of articleTags) {
            if (tag.includes(interest) || interest.includes(tag)) {
              score += 20;
              break;
            }
          }
        }
        
        // Title keyword match boost
        for (const interest of interests) {
          if (articleTitle.includes(interest)) {
            score += 15;
          }
        }
        
        // Source match
        for (const interest of interests) {
          if (articleSource.includes(interest)) {
            score += 10;
          }
        }
        
        // Recency bonus
        const ageInHours = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
        if (ageInHours <= 2) score += 5;
        else if (ageInHours <= 6) score += 3;
        else if (ageInHours <= 12) score += 1;
        
        return { ...article, score };
      });
      
      // Sort by score (desc) then by date (desc)
      sortedArticles.sort((a, b) => {
        const scoreDiff = (b.score || 0) - (a.score || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
    } else {
      // No interests - just sort by date
      if (section === 'latest') {
        sortedArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      }
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = sortedArticles.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedArticles,
      meta: {
        total: sortedArticles.length,
        page,
        limit,
        totalPages: Math.ceil(sortedArticles.length / limit),
        userInterests: interests
      }
    });

  } catch (error) {
    console.error('API Error in /api/news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
