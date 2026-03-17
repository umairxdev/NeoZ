'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, ArrowLeft, Loader2, Clock, Globe } from 'lucide-react';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArticleInteractions } from '@/components/news/ArticleInteractions';
import { getCategoryFallback } from '@/lib/category-fallbacks';

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('');

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

  useEffect(() => {
    if (article) {
      const fallback = getCategoryFallback(article.category, 0, '1200');
      setImgSrc(article.image || fallback);
    }
  }, [article]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
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
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <div className="w-full max-w-4xl">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 -ml-3 text-muted-foreground hover:text-[#1bab89]" 
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <article className="bg-card border border-border/50 rounded-2xl p-4 md:p-6 space-y-4 shadow-lg">
          <div className="space-y-3">
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

            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              {article.title}
            </h1>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg">
            <Image
              src={imgSrc}
              alt={article.title}
              width={800}
              height={450}
              className="w-full h-auto"
              priority
              onError={() => setImgSrc(fallbackImage)}
              unoptimized
            />
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed text-muted-foreground border-l-4 border-[#1bab89] pl-4 py-2 bg-[#1bab89]/5 rounded-r-lg">
              {article.fullDescription || article.description}
            </p>
          </div>

          <Separator className="my-4" />

          <ArticleInteractions article={article} />

          <Button 
            size="lg" 
            className="w-full md:w-auto font-semibold shadow-lg bg-[#1bab89] text-black hover:bg-[#158a6f]"
            render={<a href={article.url} target="_blank" rel="noopener noreferrer" />}
          >
            Read Full Article on {article.source}
            <ExternalLink className="ml-2 h-4 w-4 inline" />
          </Button>

          {article.tags && article.tags.length > 0 && (
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tags</h3>
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
    </div>
  );
}
