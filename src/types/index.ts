export type Category = 
  | 'Technology' 
  | 'Business' 
  | 'World' 
  | 'Science' 
  | 'AI' 
  | 'Sports' 
  | 'Health'
  | 'Entertainment'
  | 'Politics'
  | 'Pakistan'
  | 'South Asia';

export interface Article {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  url: string;
  image: string | null;
  source: string;
  category: Category | string;
  publishedAt: string;
  tags: string[];
  score?: number;
}

export interface FeedSource {
  url: string;
  category: Category;
  sourceName: string;
}

export interface UserPreferences {
  likedArticles: string[];
  dislikedArticles: string[];
  bookmarkedArticles: string[];
  interests: string[];
  mutedTopics: string[];
  mutedSources: string[];
}