'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { InfiniteArticleGrid } from '@/components/news/InfiniteArticleGrid';
import { ArticleSkeleton } from '@/components/news/ArticleSkeleton';
import { TrendingTopics } from '@/components/trending/TrendingTopics';

const VALID_CATEGORIES = [
  'technology', 'business', 'world', 'science', 'ai', 'sports', 'health', 'entertainment', 'politics', 'pakistan', 'south-asia'
];

function normalizeCategory(slug: string): string {
  // Convert URL-friendly slugs back to display format
  const slugMap: Record<string, string> = {
    'south-asia': 'south asia'
  };
  return slugMap[slug.toLowerCase()] || slug.toLowerCase();
}
const LOCAL_STORAGE_PREFS = 'newsstream_preferences';

async function fetchCategoryNews(category: string) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return { data: [] };
  }

  try {
    const res = await fetch(`/api/news/${encodeURIComponent(category)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (e) {
    console.error(`Fetch error for category ${category}:`, e);
    return { data: [] };
  }
}

function CategoryFeed({ category, interests }: { category: string; interests: string[] }) {
  const [initialArticles, setInitialArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategoryNews(category).then(data => {
      setInitialArticles(data.data || []);
      setIsLoading(false);
    });
  }, [category]);

  // Restore scroll after content loads
  useEffect(() => {
    if (!isLoading && initialArticles.length > 0) {
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
  }, [isLoading, initialArticles]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleSkeleton count={6} />
      </div>
    );
  }

  return (
    <InfiniteArticleGrid 
      initialArticles={initialArticles} 
      endpoint={`/api/news/${encodeURIComponent(category)}?interests=${encodeURIComponent(interests.join(','))}`}
      className="featured-grid" 
      limit={20}
    />
  );
}

export default function CategoryPage() {
  const params = useParams();
  const [interests, setInterests] = useState<string[]>([]);
  const [slug, setSlug] = useState<string>('');

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
  }, []);

  useEffect(() => {
    if (params?.slug) {
      setSlug(Array.isArray(params.slug) ? params.slug[0] : params.slug);
    }
  }, [params]);

  if (!slug) {
    return (
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleSkeleton count={6} />
        </div>
      </div>
    );
  }

  const slugLower = slug.toLowerCase();
  const normalizedSlug = normalizeCategory(slugLower);
  
  if (!VALID_CATEGORIES.includes(slugLower)) {
    notFound();
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-12">
      <div className="flex flex-col mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight capitalize mb-2">
          {normalizedSlug} News
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Latest updates and stories from the {normalizedSlug} world.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4">
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ArticleSkeleton count={6} />
            </div>
          }>
            <CategoryFeed category={normalizedSlug} interests={interests} />
          </Suspense>
        </div>
        
        <aside className="w-full lg:w-1/4">
          <TrendingTopics />
        </aside>
      </div>
    </div>
  );
}