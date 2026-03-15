import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticleSkeletonProps {
  count?: number;
}

export function ArticleSkeleton({ count = 1 }: ArticleSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <Card key={i} className="flex flex-col h-full opacity-70">
      <Skeleton className="w-full aspect-[16/10] rounded-b-none" />
      <CardHeader className="p-4 pb-2 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-full mt-2" />
        <Skeleton className="h-5 w-4/5" />
      </CardHeader>
      <CardContent className="flex-1 p-4 py-0 mb-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-11/12 mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  ));

  return (
    <>
      {skeletons}
    </>
  );
}
