"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface TrendingTopic {
  topic: string;
  count: number;
}

export function TrendingTopics() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('/api/trending');
        if (res.ok) {
          const data = await res.json();
          setTopics(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch trending topics', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTrending();
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : topics.length === 0 ? (
          <p className="text-sm text-muted-foreground">No trending topics right now.</p>
        ) : (
          <ul className="space-y-3">
            {topics.map((t, i) => (
              <li key={t.topic} className="flex items-center justify-between group">
                <Link 
                  href={`/search?q=${encodeURIComponent(t.topic)}`}
                  className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="text-muted-foreground text-xs w-4">{i + 1}.</span>
                  <span className="capitalize">{t.topic}</span>
                </Link>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {t.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
