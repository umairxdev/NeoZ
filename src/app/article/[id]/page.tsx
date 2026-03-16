'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, ArrowLeft, Loader2, Clock, Globe } from 'lucide-react';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArticleImage } from '@/components/news/ArticleImage';
import { ArticleInteractions } from '@/components/news/ArticleInteractions';
import { getCategoryFallback } from '@/lib/category-fallbacks';

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    
    const articleId = Array.isArray(id) ? id[0] : id;
    
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/news?limit=500`, { cache: 'no-store' });
        
        if (!res.ok) {
          setError('Failed to fetch articles');
          setIsLoading(false);
          return;
        }
        
        const { data } = await res.json() as { data: Article[] };
        const found = data?.find((a) => a.id === articleId) ?? null;
        setArticle(found);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchArticle();
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="container py-8 max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1bab89]" />
      </div>
    );
  }

  if (error || !article) {
    notFound();
    return null;
  }

  const fallbackImage = getCategoryFallback(article.category, 0, '1200');

  return (
    <div className="container py-6 md:py-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <Button variant="ghost" size="sm" className="mb-6 -ml-3 text-muted-foreground hover:text-[#1bab89]" render={<Link href="/" />}>
        <span>
          <ArrowLeft className="mr-2 h-4 w-4 inline" />
          Back to Feed
        </span>
      </Button>

      <article className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-[#1bab89] text-black font-semibold px-3 py-1 text-xs">
              {article.category}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span className="font-medium">{article.source}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <time dateTime={article.publishedAt}>
                {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
              </time>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            {article.title}
          </h1>
        </div>

        {/* Featured Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
          <ArticleImage
            src={article.image || ''}
            alt={article.title}
            category={article.category}
            seed={0}
          />
        </div>

        {/* Description */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-muted-foreground border-l-4 border-[#1bab89] pl-6 py-2 bg-[#1bab89]/5 rounded-r-lg">
            {article.fullDescription || article.description}
          </p>
        </div>

        <Separator className="my-8" />

        {/* Interactions */}
        <ArticleInteractions article={article} />

        {/* External Link */}
        <Button size="lg" className="w-full md:w-auto font-semibold shadow-lg bg-[#1bab89] text-black hover:bg-[#158a6f]" render={<a href={article.url} target="_blank" rel="noopener noreferrer" />}>
          <span>
            Read Full Article on {article.source}
            <ExternalLink className="ml-2 h-4 w-4 inline" />
          </span>
        </Button>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="px-3 py-1 font-normal bg-[#1bab89]/10 text-[#1bab89] border border-[#1bab89]/20">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}