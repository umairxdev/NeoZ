'use client';

import { useState, useEffect } from 'react';
import { Bookmark, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Article } from '@/types';

const LOCAL_STORAGE_KEY = 'newsstream_bookmarks';
const PREFERENCES_KEY = 'newsstream_preferences';
const INTERESTS_COOKIE = 'neoz_interests';

function getLocalPreferences() {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { likedArticles: [], dislikedArticles: [], interests: [], mutedTopics: [], mutedSources: [] };
}

function setLocalPreferences(prefs: any) {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
  // Also set cookie for server-side access
  if (prefs.interests && prefs.interests.length > 0) {
    const expires = new Date();
    expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `${INTERESTS_COOKIE}=${encodeURIComponent(prefs.interests.join(','))};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }
}

function getLocalBookmarks(): Article[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function setLocalBookmarks(articles: Article[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(articles));
}

interface ArticleInteractionsProps {
  article: Article;
}

export function ArticleInteractions({ article }: ArticleInteractionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const prefs = getLocalPreferences();
    const bookmarks = getLocalBookmarks();
    
    setIsLiked(prefs.likedArticles?.includes(article.url) || false);
    setIsDisliked(prefs.dislikedArticles?.includes(article.url) || false);
    setIsBookmarked(bookmarks.some(b => b.url === article.url));
    setIsLoading(false);
  }, [article.url]);

  const updatePreferences = (type: 'like' | 'dislike' | 'unlike' | 'undislike') => {
    const prefs = getLocalPreferences() as any;
    
    switch (type) {
      case 'like':
        if (!prefs.likedArticles) prefs.likedArticles = [];
        if (!prefs.likedArticles.includes(article.url)) {
          prefs.likedArticles.push(article.url);
        }
        if (prefs.dislikedArticles) prefs.dislikedArticles = prefs.dislikedArticles.filter((u: string) => u !== article.url);
        if (!prefs.interests) prefs.interests = [];
        if (!prefs.interests.includes(article.category.toLowerCase())) {
          prefs.interests.push(article.category.toLowerCase());
        }
        break;
      case 'unlike':
        if (prefs.likedArticles) prefs.likedArticles = prefs.likedArticles.filter((u: string) => u !== article.url);
        break;
      case 'dislike':
        if (!prefs.dislikedArticles) prefs.dislikedArticles = [];
        if (!prefs.dislikedArticles.includes(article.url)) {
          prefs.dislikedArticles.push(article.url);
        }
        if (prefs.likedArticles) prefs.likedArticles = prefs.likedArticles.filter((u: string) => u !== article.url);
        break;
      case 'undislike':
        if (prefs.dislikedArticles) prefs.dislikedArticles = prefs.dislikedArticles.filter((u: string) => u !== article.url);
        break;
    }
    
    setLocalPreferences(prefs);
  };

  async function handleInteraction(type: 'like' | 'dislike' | 'bookmark' | 'unlike' | 'unbookmark' | 'undislike') {
    setIsLoading(true);
    
    try {
      if (type === 'like' || type === 'unlike') {
        const newState = type === 'like';
        
        if (isDisliked) {
          const prefs = getLocalPreferences() as any;
          if (prefs.dislikedArticles) prefs.dislikedArticles = prefs.dislikedArticles.filter((u: string) => u !== article.url);
          setLocalPreferences(prefs);
          setIsDisliked(false);
        }
        
        setIsLiked(newState);
        updatePreferences(newState ? 'like' : 'unlike');
        toast.success(newState ? 'Added to liked' : 'Removed from liked');
      } 
      else if (type === 'dislike' || type === 'undislike') {
        const newState = type === 'dislike';
        
        if (isLiked) {
          const prefs = getLocalPreferences() as any;
          if (prefs.likedArticles) prefs.likedArticles = prefs.likedArticles.filter((u: string) => u !== article.url);
          setLocalPreferences(prefs);
          setIsLiked(false);
        }
        
        setIsDisliked(newState);
        updatePreferences(newState ? 'dislike' : 'undislike');
        toast.success(newState ? 'Added to disliked' : 'Removed from disliked');
      }
      else if (type === 'bookmark' || type === 'unbookmark') {
        const newState = type === 'bookmark';
        
        if (!newState && isDisliked) {
          const prefs = getLocalPreferences() as any;
          if (prefs.dislikedArticles) prefs.dislikedArticles = prefs.dislikedArticles.filter((u: string) => u !== article.url);
          setLocalPreferences(prefs);
          setIsDisliked(false);
        }
        
        setIsBookmarked(newState);
        
        const bookmarks = getLocalBookmarks();
        if (newState) {
          bookmarks.push(article);
          setLocalBookmarks(bookmarks);
          toast.success('Article saved');
        } else {
          const filtered = bookmarks.filter(b => b.url !== article.url);
          setLocalBookmarks(filtered);
          toast.success('Article removed');
        }
      }
    } catch (error) {
      console.error('Interaction error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/50 rounded-2xl p-4 sm:p-6 shadow-lg">
      <div className="flex flex-wrap items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className={`rounded-full transition-all duration-200 ${
            isLiked 
              ? 'bg-[#1bab89]/10 text-[#1bab89] border-[#1bab89] shadow-[0_0_15px_rgba(27,171,137,0.3)]' 
              : 'hover:bg-[#1bab89]/5 hover:border-[#1bab89]/30 hover:text-[#1bab89]'
          }`}
          onClick={() => handleInteraction(isLiked ? 'unlike' : 'like')}
          disabled={isLoading}
        >
          <ThumbsUp className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
          {isLiked ? 'Liked' : 'Like'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className={`rounded-full transition-all duration-200 ${
            isDisliked 
              ? 'bg-destructive/10 text-destructive border-destructive hover:bg-destructive/20' 
              : 'hover:bg-destructive/5 hover:text-destructive hover:border-destructive/50'
          }`}
          onClick={() => handleInteraction(isDisliked ? 'undislike' : 'dislike')}
          disabled={isLoading}
        >
          <ThumbsDown className={`h-4 w-4 mr-2 ${isDisliked ? 'fill-current' : ''}`} />
          {isDisliked ? 'Disliked' : 'Dislike'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className={`rounded-full transition-all duration-200 ${
            isBookmarked 
              ? 'bg-[#1bab89]/10 text-[#1bab89] border-[#1bab89] shadow-[0_0_15px_rgba(27,171,137,0.3)]' 
              : 'hover:bg-[#1bab89]/5 hover:border-[#1bab89]/30 hover:text-[#1bab89]'
          }`}
          onClick={() => handleInteraction(isBookmarked ? 'unbookmark' : 'bookmark')}
          disabled={isLoading}
        >
          <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
          {isBookmarked ? 'Saved' : 'Save'}
        </Button>
      </div>
    </div>
  );
}