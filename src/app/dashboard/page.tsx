'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Heart, Settings, Loader2, ArrowRight, Sparkles, ChevronDown, X } from 'lucide-react';
import { Article } from '@/types';

const LOCAL_STORAGE_BOOKMARKS = 'newsstream_bookmarks';
const LOCAL_STORAGE_PREFS = 'newsstream_preferences';

function getLocalBookmarks(): Article[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function setLocalBookmarks(articles: Article[]) {
  localStorage.setItem(LOCAL_STORAGE_BOOKMARKS, JSON.stringify(articles));
}

function getLocalPreferences() {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_PREFS);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { likedArticles: [], dislikedArticles: [], interests: [], mutedTopics: [], mutedSources: [] };
}

function setLocalPreferences(prefs: any) {
  localStorage.setItem(LOCAL_STORAGE_PREFS, JSON.stringify(prefs));
}

function DropdownSection({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children,
  count 
}: { 
  title: string; 
  icon: any; 
  isOpen: boolean; 
  onToggle: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-card hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-[#1bab89]" />
          <span className="font-medium">{title}</span>
          {count !== undefined && count > 0 && (
            <Badge variant="secondary" className="bg-[#1bab89]/20 text-[#1bab89] border-0 text-xs">
              {count}
            </Badge>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 border-t border-border/50 bg-card/50">
          {children}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [prefs, setPrefs] = useState<any>(null);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openSections, setOpenSections] = useState<string[]>(['bookmarks']);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    try {
      const storedPrefs = getLocalPreferences();
      const storedBookmarks = getLocalBookmarks();
      
      setPrefs(storedPrefs);
      setBookmarkedArticles(storedBookmarks);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function toggleSection(section: string) {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  }

  function handleRemoveBookmark(url: string) {
    const bookmarks = getLocalBookmarks();
    const filtered = bookmarks.filter(a => a.url !== url);
    setLocalBookmarks(filtered);
    setBookmarkedArticles(filtered);
  }

  function handleRemoveLike(url: string) {
    const currentPrefs = getLocalPreferences();
    if (currentPrefs.likedArticles) {
      currentPrefs.likedArticles = currentPrefs.likedArticles.filter((u: string) => u !== url);
    }
    setLocalPreferences(currentPrefs);
    setPrefs(currentPrefs);
    loadData();
  }

  if (isLoading) {
    return (
      <div className="container py-10 md:py-16 max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1bab89]" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              Dashboard
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              Your saved articles & preferences.
            </p>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <Link href="/">
            <Button className="bg-[#1bab89] text-black hover:bg-[#158a6f] w-full md:w-auto">
              <Sparkles className="mr-2 h-4 w-4" />
              Browse Feed
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {/* Saved Articles */}
        <DropdownSection 
          title="Saved Articles" 
          icon={Bookmark}
          isOpen={openSections.includes('bookmarks')}
          onToggle={() => toggleSection('bookmarks')}
          count={bookmarkedArticles.length}
        >
          {bookmarkedArticles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bookmark className="mx-auto h-8 w-8 opacity-20 mb-3" />
              <p className="text-sm">No saved articles yet.</p>
              <Link href="/">
                <Button className="mt-4 bg-[#1bab89] text-black hover:bg-[#158a6f] text-sm py-1.5">
                  Browse Articles <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-2">
              {bookmarkedArticles.map(article => (
                <div 
                  key={article.id} 
                  className="flex items-center justify-between p-2 border border-border/30 rounded-lg hover:border-[#1bab89]/30 transition-colors"
                >
                  <Link href={`/article/${article.id}`} className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium line-clamp-2 hover:text-[#1bab89] transition-colors">
                      {article.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {article.source} • {article.category}
                    </p>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-destructive flex-shrink-0 h-8 w-8 p-0"
                    onClick={() => handleRemoveBookmark(article.url)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DropdownSection>

        {/* Liked Articles */}
        <DropdownSection 
          title="Liked Articles" 
          icon={Heart}
          isOpen={openSections.includes('likes')}
          onToggle={() => toggleSection('likes')}
          count={prefs?.likedArticles?.length || 0}
        >
          {(!prefs?.likedArticles || prefs.likedArticles.length === 0) ? (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="mx-auto h-8 w-8 opacity-20 mb-3" />
              <p className="text-sm">No liked articles yet.</p>
              <p className="text-xs mt-1">Like articles to personalize your feed!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {prefs.likedArticles.map((url: string, index: number) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 border border-border/30 rounded-lg"
                >
                  <p className="text-sm truncate text-muted-foreground flex-1">{url}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-destructive flex-shrink-0 h-8 w-8 p-0"
                    onClick={() => handleRemoveLike(url)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DropdownSection>

        {/* Interests */}
        <DropdownSection 
          title="Your Interests" 
          icon={Settings}
          isOpen={openSections.includes('interests')}
          onToggle={() => toggleSection('interests')}
          count={prefs?.interests?.length || 0}
        >
          {(!prefs?.interests || prefs.interests.length === 0) ? (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="mx-auto h-8 w-8 opacity-20 mb-3" />
              <p className="text-sm">No interests yet.</p>
              <p className="text-xs mt-1">Like articles to train your feed!</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {prefs.interests.map((interest: string) => (
                <Badge 
                  key={interest} 
                  variant="secondary" 
                  className="px-3 py-1.5 text-sm bg-[#1bab89]/10 text-[#1bab89] border border-[#1bab89]/30 rounded-full"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          )}
        </DropdownSection>
      </div>
    </div>
  );
}