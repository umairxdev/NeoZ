'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Heart, Settings, Slash, Loader2, ArrowRight, Sparkles } from 'lucide-react';
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

function NeoZLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-xl';
  return (
    <Link href="/" className="flex items-center gap-0.5 group">
      <span className={`${textSize} font-extrabold tracking-tight`} style={{ fontFamily: 'Syne, sans-serif' }}>
        Neo
      </span>
      <span className={`${textSize} font-extrabold tracking-tight text-[#1bab89] drop-shadow-[0_0_10px_rgba(27,171,137,0.6)]`}>
        Z
      </span>
    </Link>
  );
}

export default function DashboardPage() {
  const [prefs, setPrefs] = useState<any>(null);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="container py-6 md:py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <NeoZLogo size="lg" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Your saved articles & preferences.
            </p>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <Link href="/">
            <Button className="bg-[#1bab89] text-black hover:bg-[#158a6f]">
              <Sparkles className="mr-2 h-4 w-4" />
              Browse Feed
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="bookmarks" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1.5 bg-muted/50 rounded-xl gap-1">
          <TabsTrigger 
            value="bookmarks" 
            className="py-2.5 flex items-center justify-center gap-2 data-[state=active]:bg-[#1bab89] data-[state=active]:text-black rounded-lg"
          >
            <Bookmark className="h-4 w-4" /> 
            <span>Saved</span>
            {bookmarkedArticles.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-[#1bab89]/20 text-[#1bab89] border-0 text-xs">
                {bookmarkedArticles.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="likes" 
            className="py-2.5 flex items-center justify-center gap-2 data-[state=active]:bg-[#1bab89] data-[state=active]:text-black rounded-lg"
          >
            <Heart className="h-4 w-4" /> 
            <span>Liked</span>
          </TabsTrigger>
          <TabsTrigger 
            value="interests" 
            className="py-2.5 flex items-center justify-center gap-2 data-[state=active]:bg-[#1bab89] data-[state=active]:text-black rounded-lg"
          >
            <Settings className="h-4 w-4" /> 
            <span>Interests</span>
          </TabsTrigger>
          <TabsTrigger 
            value="muted" 
            className="py-2.5 flex items-center justify-center gap-2 data-[state=active]:bg-[#1bab89] data-[state=active]:text-black rounded-lg"
          >
            <Slash className="h-4 w-4" /> 
            <span>Hidden</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bookmarks" className="mt-0">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Saved Articles</CardTitle>
              <CardDescription>Your bookmarked articles for later reading.</CardDescription>
            </CardHeader>
            <CardContent>
              {bookmarkedArticles.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bookmark className="mx-auto h-10 w-10 opacity-20 mb-4" />
                  <p className="text-base">No saved articles yet.</p>
                  <p className="text-sm mt-2">Save articles while browsing.</p>
                  <Link href="/">
                    <Button className="mt-6 bg-[#1bab89] text-black hover:bg-[#158a6f]">
                      Browse Articles <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3">
                  {bookmarkedArticles.map(article => (
                    <div 
                      key={article.id} 
                      className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:border-[#1bab89]/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <Link href={`/article/${article.id}`} className="font-medium text-sm line-clamp-2 hover:text-[#1bab89] transition-colors">
                          {article.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span>{article.category}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => handleRemoveBookmark(article.url)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="likes" className="mt-0">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Liked Articles</CardTitle>
              <CardDescription>Articles you liked to personalize your feed.</CardDescription>
            </CardHeader>
            <CardContent>
              {(!prefs?.likedArticles || prefs.likedArticles.length === 0) ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Heart className="mx-auto h-10 w-10 opacity-20 mb-4" />
                  <p className="text-base">No liked articles yet.</p>
                  <p className="text-sm mt-1">Like articles to personalize your feed!</p>
                  <Link href="/">
                    <Button className="mt-6 bg-[#1bab89] text-black hover:bg-[#158a6f]">
                      Browse Articles <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {prefs.likedArticles.map((url: string, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 border border-border/50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-sm truncate text-muted-foreground">{url}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => handleRemoveLike(url)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interests" className="mt-0">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Your Interests</CardTitle>
              <CardDescription>Topics learned from your likes.</CardDescription>
            </CardHeader>
            <CardContent>
              {prefs?.interests && prefs.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {prefs.interests.map((interest: string) => (
                    <Badge 
                      key={interest} 
                      variant="secondary" 
                      className="px-4 py-2 text-sm bg-[#1bab89]/10 text-[#1bab89] border border-[#1bab89]/30 rounded-full"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="mx-auto h-10 w-10 opacity-20 mb-4" />
                  <p className="text-base">No interests yet.</p>
                  <p className="text-sm mt-1">Like articles to train your feed!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="muted" className="mt-0">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Hidden Content</CardTitle>
              <CardDescription>Topics and sources you've hidden.</CardDescription>
            </CardHeader>
            <CardContent>
              {((prefs?.mutedTopics?.length ?? 0) === 0 && (prefs?.mutedSources?.length ?? 0) === 0) ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Slash className="mx-auto h-10 w-10 opacity-20 mb-4" />
                  <p className="text-base">Nothing hidden yet.</p>
                  <p className="text-sm mt-1">Use "Hide" on articles to filter content.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prefs?.mutedTopics && prefs.mutedTopics.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Muted Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {prefs.mutedTopics.map((topic: string) => (
                          <Badge key={topic} variant="outline" className="rounded-full">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {prefs?.mutedSources && prefs.mutedSources.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-sm text-muted-foreground uppercase tracking-wider">Muted Sources</h4>
                      <div className="flex flex-wrap gap-2">
                        {prefs.mutedSources.map((source: string) => (
                          <Badge key={source} variant="outline" className="rounded-full">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}