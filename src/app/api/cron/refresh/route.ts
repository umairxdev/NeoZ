import { NextResponse } from 'next/server';
import { articleCache } from '@/lib/rss/cache';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Optional: Add authorization check here if you want to protect this route
    // e.g., requiring a specific CRON_SECRET header
    /*
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }
    */

    const success = await articleCache.forceRefresh();

    if (success) {
      return NextResponse.json({ message: 'Cache refreshed successfully' });
    } else {
      return NextResponse.json({ message: 'Cache refresh already in progress' }, { status: 202 });
    }

  } catch (error) {
    console.error('API Error in /api/cron/refresh:', error);
    return NextResponse.json({ error: 'Failed to refresh cache' }, { status: 500 });
  }
}
