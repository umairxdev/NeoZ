import { Article } from '@/types';
import { fetchAllFeeds } from './fetcher';

const CACHE_LIFETIME = 10 * 60 * 1000; // 10 minutes limit

class CacheService {
  private static instance: CacheService;
  private articles: Article[] = [];
  private lastRefreshed: number = 0;
  private isRefreshing: boolean = false;

  private constructor() {}

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Triggers a backgound refresh if cache is stale and not currently refreshing
   */
  private async triggerBackgroundRefresh() {
    if (this.isRefreshing) return;
    
    const now = Date.now();
    if (now - this.lastRefreshed > CACHE_LIFETIME) {
      this.isRefreshing = true;
      try {
        console.log('Starting RSS fetch background refresh...');
        const newArticles = await fetchAllFeeds();
        if (newArticles.length > 0) {
          this.articles = newArticles;
          this.lastRefreshed = Date.now();
          console.log(`Cache updated with ${this.articles.length} articles.`);
        }
      } catch (error) {
        console.error('Failed to refresh cache in background', error);
      } finally {
        this.isRefreshing = false;
      }
    }
  }

  /**
   * Returns current cached articles. Triggers a background fetch if stale.
   * If cache is totally empty, waits for fetch.
   */
  public async getArticles(): Promise<Article[]> {
    // Skip fetching during build time to avoid timeouts and network issues
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return this.articles;
    }

    if (this.articles.length === 0) {
      // First hit, blocking fetch
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        try {
          console.log('Initial RSS fetch starting...');
          const newArticles = await fetchAllFeeds();
          this.articles = newArticles;
          this.lastRefreshed = Date.now();
          console.log(`Initial cache populated with ${this.articles.length} articles.`);
        } catch (error) {
          console.error('Failed initial cache population', error);
        } finally {
          this.isRefreshing = false;
        }
      } else {
        // Wait for it to finish
        let retries = 0;
        while (this.isRefreshing && retries < 20) {
          await new Promise(resolve => setTimeout(resolve, 500));
          retries++;
        }
      }
    } else {
      // Non-blocking trigger
      this.triggerBackgroundRefresh();
    }

    return this.articles;
  }
  
  /**
   * Force refresh the cache completely (used by cron job /api/cron/refresh)
   */
  public async forceRefresh(): Promise<boolean> {
     if (this.isRefreshing) return false;
     this.isRefreshing = true;
     try {
        console.log('Force fetching RSS...');
        const newArticles = await fetchAllFeeds();
        if (newArticles.length > 0) {
          this.articles = newArticles;
          this.lastRefreshed = Date.now();
        }
        return true;
     } catch (e) {
        console.trace(e);
        return false;
     } finally {
        this.isRefreshing = false;
     }
  }
}

export const articleCache = CacheService.getInstance();
