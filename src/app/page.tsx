'use client';

import { Suspense, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { HeroArticle } from '@/components/news/HeroArticle';
import { InfiniteArticleGrid } from '@/components/news/InfiniteArticleGrid';
import { TrendingTopics } from '@/components/trending/TrendingTopics';
import { ArticleSkeleton } from '@/components/news/ArticleSkeleton';

const LOCAL_STORAGE_PREFS = 'newsstream_preferences';

function NewsFeed({ interests }: { interests: string[] }) {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInitialNews();
  }, [interests]);

  // Restore scroll after content loads
  useEffect(() => {
    if (!isLoading && articles.length > 0) {
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            window.scrollTo(0, parseInt(savedPosition, 10));
            sessionStorage.removeItem('scrollPosition');
          }, 100);
        });
      }
    }
  }, [isLoading, articles]);

  async function fetchInitialNews() {
    try {
      const interestParam = interests.length > 0 ? `&interests=${encodeURIComponent(interests.join(','))}` : '';
      const res = await fetch(`/api/news?limit=20${interestParam}`, { cache: 'no-store' });
      
      if (res.ok) {
        const data = await res.json();
        setArticles(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="aspect-[21/9] bg-muted animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleSkeleton count={6} />
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
        <p className="text-lg">Initializing RSS feeds...</p>
        <p className="text-sm mt-2 text-muted-foreground/60">Feeds take a moment to load on first visit.</p>
      </div>
    );
  }

  const heroArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <div className="space-y-12 stagger-children">
      {/* Hero Section */}
      <section>
        <HeroArticle article={heroArticle} />
      </section>

      {/* Editorial Section Header */}
      <section>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 md:w-12 h-0.5 bg-[#1bab89] shadow-[0_0_10px_rgba(27,171,137,0.5)]" />
            <h2 className="text-lg md:text-3xl font-normal tracking-tight" style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}>
              {interests.length > 0 ? 'Your Personalized Feed' : 'Latest Stories'}
            </h2>
          </div>
        </div>
        
        {/* Editorial Grid - Asymmetric on Desktop */}
        <InfiniteArticleGrid 
          initialArticles={gridArticles} 
          endpoint={`/api/news?interests=${encodeURIComponent(interests.join(','))}`}
          className="editorial-grid" 
          limit={20}
        />
      </section>
    </div>
  );
}

export default function HomePage() {
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PREFS);
      if (stored) {
        const prefs = JSON.parse(stored);
        const userInterests = prefs.interests || [];
        setInterests(userInterests);
        
        // Sync interests to cookie for server-side personalization
        if (userInterests.length > 0) {
          const expires = new Date();
          expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
          document.cookie = `neoz_interests=${encodeURIComponent(userInterests.join(','))};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
        }
      }
    } catch {}

    // Scroll restoration moved to NewsFeed component after content loads
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4 md:py-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Main Content */}
        <div className="w-full lg:w-3/4 xl:w-2/3">
          <Suspense fallback={
            <div className="space-y-8">
              <div className="aspect-[3/2] md:aspect-[21/9] bg-muted animate-pulse rounded-2xl" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <ArticleSkeleton count={6} />
              </div>
            </div>
          }>
            <NewsFeed interests={interests} />
          </Suspense>
        </div>
        
        {/* Sidebar - Hidden on Mobile */}
        <aside className="hidden lg:block w-full lg:w-1/4 xl:w-1/3 space-y-8">
          <div className="sticky top-32">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-[#1bab89] shadow-[0_0_10px_rgba(27,171,137,0.5)]" />
              <h3 className="text-lg font-semibold tracking-tight">Trending</h3>
            </div>
            <TrendingTopics />
          </div>
        </aside>
      </div>
    </div>
  );
}