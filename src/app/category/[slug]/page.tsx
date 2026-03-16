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
        setInterests(prefs.interests || []);
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
    <div className="container py-8 md:py-12">
      <div className="flex flex-col mb-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight capitalize mb-2">
          {normalizedSlug} News
        </h1>
        <p className="text-muted-foreground text-lg">
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