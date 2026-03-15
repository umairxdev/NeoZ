import { NextResponse } from 'next/server';
import { articleCache } from '@/lib/rss/cache';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return NextResponse.json({ data: [], meta: { total: 0 } });
    }

    const allArticles = await articleCache.getArticles();
    const qLower = query.toLowerCase();

    // Basic search across fields
    const searchResults = allArticles.filter(article => {
      return (
        article.title.toLowerCase().includes(qLower) ||
        article.description.toLowerCase().includes(qLower) ||
        article.source.toLowerCase().includes(qLower) ||
        article.category.toLowerCase().includes(qLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(qLower))
      );
    });

    searchResults.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedResults,
      meta: {
        total: searchResults.length,
        query,
        page,
        limit,
        totalPages: Math.ceil(searchResults.length / limit)
      }
    });

  } catch (error) {
    console.error('API Error in /api/search:', error);
    return NextResponse.json({ error: 'Failed to search news' }, { status: 500 });
  }
}
