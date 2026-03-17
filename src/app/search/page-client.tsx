"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ArticleGrid } from '@/components/news/ArticleGrid';
import { ArticleSkeleton } from '@/components/news/ArticleSkeleton';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    async function fetchSearch() {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSearch();
    setInputValue(query);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(inputValue.trim())}`;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col mb-10 text-center items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Search News
        </h1>
        
        <form onSubmit={handleSubmit} className="w-full max-w-2xl relative mb-4">
          <Input 
            type="search" 
            placeholder="Search keywords, topics, sources..." 
            className="w-full pl-12 h-14 text-lg rounded-full bg-background border-2 focus-visible:ring-primary/20"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
        </form>
        
        {query && (
          <p className="text-muted-foreground">
            Showing results for <span className="font-semibold text-foreground">"{query}"</span>
          </p>
        )}
      </div>

      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ArticleSkeleton count={8} />
          </div>
        ) : query ? (
          results.length > 0 ? (
            <ArticleGrid articles={results} />
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-xl border-muted">
              <h3 className="text-2xl font-bold mb-2">No results found</h3>
              <p className="text-muted-foreground">Try adjusting your keywords or searching for a different topic.</p>
            </div>
          )
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-xl">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ready to explore</h3>
            <p className="text-muted-foreground">Type a keyword above to search through thousands of cached articles.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-64 bg-muted mx-auto rounded-md" />
          <div className="h-14 max-w-2xl bg-muted mx-auto rounded-full" />
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
