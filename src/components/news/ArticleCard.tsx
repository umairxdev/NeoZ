'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, Bookmark } from 'lucide-react';
import { Article } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCategoryFallback } from '@/lib/category-fallbacks';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  index?: number;
}

const LOCAL_STORAGE_KEY = 'newsstream_bookmarks';
const PREFERENCES_KEY = 'newsstream_preferences';

function getLocalPreferences() {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { likedArticles: [], dislikedArticles: [], interests: [], mutedTopics: [], mutedSources: [] };
}

function getLocalBookmarks(): Article[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function ArticleCard({ article, featured = false, index = 0 }: ArticleCardProps) {
  const articleUrl = `/article/${article.id}`;
  const fallbackImage = useMemo(
    () => getCategoryFallback(article.category, index, '800'),
    [article.category, index]
  );
  const [imgSrc, setImgSrc] = useState(article.image || fallbackImage);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const prefs = getLocalPreferences();
    const bookmarks = getLocalBookmarks();
    setIsLiked(prefs.likedArticles?.includes(article.url) || false);
    setIsDisliked(prefs.dislikedArticles?.includes(article.url) || false);
    setIsBookmarked(bookmarks.some(b => b.url === article.url));
  }, [article.url]);

  const handleClick = () => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
  };

  const handleMobileInteraction = async (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const prefs = getLocalPreferences();
    
    if (type === 'like') {
      if (isDisliked) {
        if (!prefs.likedArticles) prefs.likedArticles = [];
        prefs.likedArticles = prefs.likedArticles.filter((u: string) => u !== article.url);
        if (prefs.dislikedArticles) prefs.dislikedArticles = prefs.dislikedArticles.filter((u: string) => u !== article.url);
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
        setIsDisliked(false);
      }
      setIsLiked(!isLiked);
      if (!isLiked) {
        if (!prefs.likedArticles) prefs.likedArticles = [];
        prefs.likedArticles.push(article.url);
        if (!prefs.interests) prefs.interests = [];
        if (!prefs.interests.includes(article.category.toLowerCase())) {
          prefs.interests.push(article.category.toLowerCase());
        }
      } else {
        if (prefs.likedArticles) prefs.likedArticles = prefs.likedArticles.filter((u: string) => u !== article.url);
      }
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } else if (type === 'dislike') {
      if (isLiked) {
        if (!prefs.dislikedArticles) prefs.dislikedArticles = [];
        prefs.dislikedArticles = prefs.dislikedArticles.filter((u: string) => u !== article.url);
        if (prefs.likedArticles) prefs.likedArticles = prefs.likedArticles.filter((u: string) => u !== article.url);
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
        setIsLiked(false);
      }
      setIsDisliked(!isDisliked);
      if (!isDisliked) {
        if (!prefs.dislikedArticles) prefs.dislikedArticles = [];
        prefs.dislikedArticles.push(article.url);
      } else {
        if (prefs.dislikedArticles) prefs.dislikedArticles = prefs.dislikedArticles.filter((u: string) => u !== article.url);
      }
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } else if (type === 'bookmark') {
      const bookmarks = getLocalBookmarks();
      if (isBookmarked) {
        const filtered = bookmarks.filter(b => b.url !== article.url);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
        setIsBookmarked(false);
      } else {
        if (isDisliked) {
          if (!prefs.dislikedArticles) prefs.dislikedArticles = [];
          prefs.dislikedArticles = prefs.dislikedArticles.filter((u: string) => u !== article.url);
          localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
          setIsDisliked(false);
        }
        bookmarks.push(article);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookmarks));
        setIsBookmarked(true);
      }
    }
  };

  return (
    <Card className={`group overflow-hidden flex flex-col h-full bg-card border-border/50 transition-all duration-300 card-glow ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}>
      <Link href={articleUrl} onClick={handleClick} className="relative block w-full overflow-hidden" style={{ aspectRatio: featured ? '16/9' : '16/12' }}>
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

      <CardHeader className={`${featured ? 'p-4 md:p-6' : 'p-3 md:p-4'} pb-1 md:pb-2 space-y-2 md:space-y-3`}>
        <div className="flex items-center text-[10px] md:text-xs text-muted-foreground gap-1 md:gap-2">
          <span className="font-semibold text-foreground tracking-wide">{article.source}</span>
          <span className="w-1 h-1 rounded-full bg-[#1bab89]/50" />
          <time dateTime={article.publishedAt}>
            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
          </time>
        </div>
        <Link href={articleUrl} onClick={handleClick} className="group-hover:text-[#1bab89] transition-colors duration-200">
          <h3 className={`font-normal tracking-tight line-clamp-2 leading-tight ${featured ? 'text-lg md:text-2xl lg:text-3xl' : 'text-base md:text-lg'}`} style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}>
            {article.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className={`flex-1 ${featured ? 'p-4 md:p-6 py-1 md:py-2' : 'p-3 md:p-4 py-0 md:py-0'}`}>
        <p className={`text-muted-foreground line-clamp-2 md:line-clamp-3 ${featured ? 'text-sm md:text-base' : 'text-sm md:text-sm'} leading-relaxed`}>
          {article.description}
        </p>
      </CardContent>

      <CardFooter className={`${featured ? 'p-4 md:p-6 pt-2 md:pt-4' : 'p-3 md:p-4 pt-1 md:pt-2'}`}>
        <div className="flex gap-1 md:gap-2 flex-wrap">
          {article.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-[10px] md:text-xs text-muted-foreground font-normal border-border/50 hover:border-[#1bab89]/30 hover:text-[#1bab89] transition-colors">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardFooter>

      {/* Mobile Interaction Buttons */}
      <div className="md:hidden flex items-center justify-end gap-0 px-2 pb-2">
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${isLiked ? 'text-[#1bab89]' : 'text-muted-foreground'}`}
          onClick={(e) => handleMobileInteraction(e, 'like')}
        >
          <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${isDisliked ? 'text-destructive' : 'text-muted-foreground'}`}
          onClick={(e) => handleMobileInteraction(e, 'dislike')}
        >
          <ThumbsDown className={`h-3.5 w-3.5 ${isDisliked ? 'fill-current' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${isBookmarked ? 'text-[#1bab89]' : 'text-muted-foreground'}`}
          onClick={(e) => handleMobileInteraction(e, 'bookmark')}
        >
          <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </Card>
  );
}