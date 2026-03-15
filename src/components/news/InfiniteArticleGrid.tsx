'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Article } from '@/types';
import { ArticleCard } from './ArticleCard';
import { ArticleSkeleton } from './ArticleSkeleton';
import { Button } from '../ui/button';

interface InfiniteArticleGridProps {
  initialArticles: Article[];
  endpoint: string; // e.g. '/api/news' or '/api/news/sports'
  className?: string;
  limit?: number;
}

export function InfiniteArticleGrid({
  initialArticles,
  endpoint,
  className = '',
  limit = 20,
}: InfiniteArticleGridProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchMoreArticles = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const nextPage = page + 1;
      const url = new URL(endpoint, window.location.href);
      url.searchParams.set('page', nextPage.toString());
      url.searchParams.set('limit', limit.toString());
      
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch more articles');
      
      const data = await res.json();
      const newArticles = data.data as Article[];
      
      if (newArticles.length === 0) {
        setHasMore(false);
      } else {
        setArticles(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const uniqueNewArticles = newArticles.filter(a => !existingIds.has(a.id));
          return [...prev, ...uniqueNewArticles];
        });
        setPage(nextPage);
        
        if (newArticles.length < limit) {
          setHasMore(false);
        }
      }
    } catch (err: any) {
      console.error('Error fetching more articles:', err);
      setError('Failed to load more articles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, limit, loading, hasMore]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMore && !loading) {
        fetchMoreArticles();
      }
    }, { threshold: 0.1, rootMargin: '200px' });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [fetchMoreArticles, hasMore, loading]);

  if (!articles?.length && !loading) {
    return (
      <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
        <p>No articles found or initializing RSS feeds...</p>
        <p className="text-sm mt-2">Feeds take a moment to fetch on first load. Please refersh in a few seconds.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            index={index}
            featured={index === 0 && className.includes('featured-grid')}
          />
        ))}
      </div>
      
      {hasMore && (
        <div ref={loadMoreRef} className="py-8 w-full flex flex-col items-center justify-center">
          {loading ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full ${className}`}>
              <ArticleSkeleton count={4} />
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => fetchMoreArticles()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>
      )}
      
      {!hasMore && articles.length > 0 && (
        <div className="py-8 text-center text-muted-foreground">
          <p>You've reached the end of the feed.</p>
        </div>
      )}
    </div>
  );
}