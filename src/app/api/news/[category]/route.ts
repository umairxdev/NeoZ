import { NextResponse } from 'next/server';
import { articleCache } from '@/lib/rss/cache';

export const revalidate = 0;

function countWords(text: string | undefined | null): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    let { category } = await params;
    
    // Convert URL-friendly slugs to actual category names
    const slugMap: Record<string, string> = {
      'south-asia': 'south asia'
    };
    category = slugMap[category.toLowerCase()] || category;
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const interestsParam = searchParams.get('interests');
    const interests = interestsParam ? interestsParam.split(',').map(i => i.trim().toLowerCase()).filter(Boolean) : [];

    const allArticles = await articleCache.getArticles();

    let filteredArticles = allArticles.filter(
      article => article.category.toLowerCase() === category.toLowerCase()
    );

    // Sort by latest first
    filteredArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // If user has interests, boost matching articles
    if (interests.length > 0) {
      filteredArticles = filteredArticles.map(article => {
        let score = 0;
        const articleTags = article.tags.map(t => t.toLowerCase());
        const articleSource = article.source.toLowerCase();
        
        for (const interest of interests) {
          if (articleTags.some(t => t.includes(interest) || interest.includes(t))) {
            score += 5;
          }
          if (articleSource === interest) {
            score += 3;
          }
        }
        
        // Recency bonus
        const ageInHours = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
        if (ageInHours <= 2) score += 2;
        else if (ageInHours <= 6) score += 1;
        
        return { ...article, score };
      });
      
      filteredArticles.sort((a, b) => {
        const scoreDiff = (b.score || 0) - (a.score || 0);
        if (scoreDiff !== 0) return scoreDiff;
        
        const descLenDiff = countWords(b.description) - countWords(a.description);
        if (descLenDiff !== 0) return descLenDiff;
        
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
    } else {
      // No interests - sort by description length, then by date
      filteredArticles.sort((a, b) => {
        const descLenDiff = countWords(b.description) - countWords(a.description);
        if (descLenDiff !== 0) return descLenDiff;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedArticles,
      meta: {
        total: filteredArticles.length,
        category,
        page,
        limit,
        totalPages: Math.ceil(filteredArticles.length / limit)
      }
    });

  } catch (error) {
    console.error(`API Error in /api/news/[category]:`, error);
    return NextResponse.json({ error: 'Failed to fetch category news' }, { status: 500 });
  }
}