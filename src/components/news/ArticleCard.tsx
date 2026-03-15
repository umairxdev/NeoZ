'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCategoryFallback } from '@/lib/category-fallbacks';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  index?: number;
}

export function ArticleCard({ article, featured = false, index = 0 }: ArticleCardProps) {
  const articleUrl = `/article/${article.id}`;
  const fallbackImage = useMemo(
    () => getCategoryFallback(article.category, index, '800'),
    [article.category, index]
  );
  const [imgSrc, setImgSrc] = useState(article.image || fallbackImage);

  return (
    <Card className={`group overflow-hidden flex flex-col h-full bg-card border-border/50 transition-all duration-300 card-glow ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}>
      <Link href={articleUrl} className="relative block w-full overflow-hidden aspect-video-lock" style={{ aspectRatio: featured ? '16/9' : '16/10' }}>
        <Image
          src={imgSrc}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc(fallbackImage)}
          unoptimized
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-md font-semibold text-xs border border-white/10 shadow-lg">
            {article.category}
          </Badge>
        </div>
        {/* Neon accent on hover */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#1bab89]/30 transition-all duration-300 rounded-lg" />
      </Link>

      <CardHeader className={`${featured ? 'p-6' : 'p-4'} pb-2 space-y-3`}>
        <div className="flex items-center text-xs text-muted-foreground gap-2">
          <span className="font-semibold text-foreground tracking-wide">{article.source}</span>
          <span className="w-1 h-1 rounded-full bg-[#1bab89]/50" />
          <time dateTime={article.publishedAt}>
            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
          </time>
        </div>
        <Link href={articleUrl} className="group-hover:text-[#1bab89] transition-colors duration-200">
          <h3 className={`font-normal tracking-tight line-clamp-2 leading-tight ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`} style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}>
            {article.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className={`flex-1 ${featured ? 'p-6 py-2' : 'p-4 py-0'}`}>
        <p className={`text-muted-foreground line-clamp-3 ${featured ? 'text-base' : 'text-sm'} leading-relaxed`}>
          {article.description}
        </p>
      </CardContent>

      <CardFooter className={`${featured ? 'p-6 pt-4' : 'p-4 pt-2'}`}>
        <div className="flex gap-2 flex-wrap">
          {article.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs text-muted-foreground font-normal border-border/50 hover:border-[#1bab89]/30 hover:text-[#1bab89] transition-colors">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}