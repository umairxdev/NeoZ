'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { getCategoryFallback } from '@/lib/category-fallbacks';

interface HeroArticleProps {
  article: Article;
  seed?: number;
}

export function HeroArticle({ article, seed = 0 }: HeroArticleProps) {
  const articleUrl = `/article/${article.id}`;
  const fallbackImage = getCategoryFallback(article.category, seed, '1600');
  const [imgSrc, setImgSrc] = useState(article.image || fallbackImage);

  const handleClick = () => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
  };

  return (
    <div className="relative group overflow-hidden rounded-2xl mb-8 aspect-[3/2] md:aspect-[21/9] lg:aspect-[2.5/1] shadow-2xl">
      <Link href={articleUrl} onClick={handleClick} className="block w-full h-full">
        <div className="absolute inset-0">
          <Image
            src={imgSrc}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            sizes="100vw"
            onError={() => setImgSrc(fallbackImage)}
            unoptimized
          />
        </div>

        {/* Gradient Overlay - More Dramatic */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/50 to-transparent md:from-background/90 md:via-background/40" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-10 lg:p-12">
          {/* Teal Accent Line */}
          <div className="absolute top-4 left-4 md:top-6 md:left-10 w-10 md:w-16 h-0.5 bg-[#1bab89] shadow-[0_0_20px_rgba(27,171,137,0.8)]" />
          
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
            <Badge className="bg-[#1bab89] text-black font-bold px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(27,171,137,0.5)]">
              Top Story
            </Badge>
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-md font-semibold text-[10px] md:text-xs border border-white/20 dark:border-white/10 px-2 md:px-3">
              {article.category}
            </Badge>
          </div>

          <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-normal text-foreground mb-2 md:mb-4 leading-[1.1] tracking-tight max-w-4xl drop-shadow-lg" style={{ fontFamily: 'var(--font-syne), system-ui, sans-serif' }}>
            {article.title}
          </h2>

          <p className="text-muted-foreground line-clamp-2 md:line-clamp-3 mb-3 md:mb-5 max-w-2xl text-xs md:text-base bg-background/50 backdrop-blur-sm rounded px-2 py-1">
            {article.description}
          </p>

          <div className="flex items-center text-sm font-medium text-muted-foreground gap-3">
            <span className="text-foreground font-semibold tracking-wide">{article.source}</span>
            <span className="w-1 h-1 rounded-full bg-[#1bab89]" />
            <time dateTime={article.publishedAt} className="text-muted-foreground/80">
              {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
            </time>
          </div>
        </div>
      </Link>
    </div>
  );
}