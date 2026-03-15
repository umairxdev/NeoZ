import { Article } from '@/types';
import { fetchAllFeeds } from './fetcher';

const CACHE_LIFETIME = 10 * 60 * 1000;

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

  private async triggerBackgroundRefresh() {
    if (this.isRefreshing) return;
    
    const now = Date.now();
    if (now - this.lastRefreshed > CACHE_LIFETIME) {
      this.isRefreshing = true;
      try {
        const newArticles = await fetchAllFeeds();
        if (newArticles.length > 0) {
          this.articles = newArticles;
          this.lastRefreshed = Date.now();
        }
      } catch {
        // Silently fail background refresh
      } finally {
        this.isRefreshing = false;
      }
    }
  }

  public async getArticles(): Promise<Article[]> {
    const now = Date.now();
    
    // If we have cached articles and they're fresh, return them
    if (this.articles.length > 0 && (now - this.lastRefreshed) < CACHE_LIFETIME) {
      this.triggerBackgroundRefresh();
      return this.articles;
    }

    // Need to fetch fresh data
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      try {
        const newArticles = await fetchAllFeeds();
        if (newArticles.length > 0) {
          this.articles = newArticles;
          this.lastRefreshed = Date.now();
        }
      } catch {
        // If fetch fails but we have old cache, return it
        if (this.articles.length > 0) {
          return this.articles;
        }
      } finally {
        this.isRefreshing = false;
      }
    } else {
      // Wait for ongoing refresh
      let retries = 0;
      while (this.isRefreshing && retries < 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        retries++;
      }
    }

    return this.articles;
  }
  
  public async forceRefresh(): Promise<boolean> {
    if (this.isRefreshing) return false;
    this.isRefreshing = true;
    try {
      const newArticles = await fetchAllFeeds();
      if (newArticles.length > 0) {
        this.articles = newArticles;
        this.lastRefreshed = Date.now();
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }
}

export const articleCache = CacheService.getInstance();