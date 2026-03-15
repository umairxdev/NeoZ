import React from 'react';
import { Article } from '@/types';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  className?: string;
}

export function ArticleGrid({ articles, className = '' }: ArticleGridProps) {
  if (!articles?.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No articles found.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {articles.map((article, index) => (
        <ArticleCard
          key={article.id}
          article={article}
          index={index}
          // Make the first article large in a 2x2 span if it's the very first on the section
          featured={index === 0 && className.includes('featured-grid')}
        />
      ))}
    </div>
  );
}
