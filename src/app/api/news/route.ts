import { NextResponse } from 'next/server';
import { articleCache } from '@/lib/rss/cache';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const section = searchParams.get('section') || 'latest';
    const interestsParam = searchParams.get('interests');
    const interests = interestsParam ? interestsParam.split(',').map(i => i.trim().toLowerCase()).filter(Boolean) : [];

    const allArticles = await articleCache.getArticles();

    let sortedArticles = [...allArticles];
    
    if (section === 'latest') {
      // Sort by date first
      sortedArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
    
    // If user has interests, boost articles matching those interests
    if (interests.length > 0) {
      sortedArticles = sortedArticles.map(article => {
        let score = 0;
        const articleCategory = article.category.toString().toLowerCase();
        const articleTags = article.tags.map(t => t.toLowerCase());
        const articleSource = article.source.toLowerCase();
        
        // Boost matching interests
        for (const interest of interests) {
          if (articleCategory === interest) {
            score += 10; // Category match gets highest boost
          }
          if (articleTags.some(t => t.includes(interest) || interest.includes(t))) {
            score += 5; // Tag match
          }
          if (articleSource === interest) {
            score += 3; // Source match
          }
        }
        
        // Add recency bonus (newer articles get slight boost)
        const ageInHours = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
        if (ageInHours <= 2) score += 2;
        else if (ageInHours <= 6) score += 1;
        
        return { ...article, score };
      });
      
      // Sort by score (desc) then by date (desc)
      sortedArticles.sort((a, b) => {
        const scoreDiff = (b.score || 0) - (a.score || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
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
        totalPages: Math.ceil(sortedArticles.length / limit)
      }
    });

  } catch (error) {
    console.error('API Error in /api/news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}