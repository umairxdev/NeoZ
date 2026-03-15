import { cookies } from 'next/headers';

export interface UserPreferences {
  likedArticles: string[];
  dislikedArticles: string[];
  bookmarkedArticles: string[];
  interests: string[];
  mutedTopics: string[];
  mutedSources: string[];
}

const COOKIE_NAME = 'user_preferences';
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getDefaultPreferences(): UserPreferences {
  return {
    likedArticles: [],
    dislikedArticles: [],
    bookmarkedArticles: [],
    interests: [],
    mutedTopics: [],
    mutedSources: [],
  };
}

export async function getPreferences(): Promise<UserPreferences> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    
    if (!cookie) {
      return getDefaultPreferences();
    }
    
    const parsed = JSON.parse(cookie.value);
    return {
      likedArticles: parsed.likedArticles || [],
      dislikedArticles: parsed.dislikedArticles || [],
      bookmarkedArticles: parsed.bookmarkedArticles || [],
      interests: parsed.interests || [],
      mutedTopics: parsed.mutedTopics || [],
      mutedSources: parsed.mutedSources || [],
    };
  } catch {
    return getDefaultPreferences();
  }
}

export function getPreferencesFromRequest(cookieHeader: string | null): UserPreferences {
  try {
    if (!cookieHeader) {
      return getDefaultPreferences();
    }
    
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(c => c.split('='))
    );
    const cookie = cookies[COOKIE_NAME];
    
    if (!cookie) {
      return getDefaultPreferences();
    }
    
    const parsed = JSON.parse(decodeURIComponent(cookie));
    return {
      likedArticles: parsed.likedArticles || [],
      dislikedArticles: parsed.dislikedArticles || [],
      bookmarkedArticles: parsed.bookmarkedArticles || [],
      interests: parsed.interests || [],
      mutedTopics: parsed.mutedTopics || [],
      mutedSources: parsed.mutedSources || [],
    };
  } catch {
    return getDefaultPreferences();
  }
}

export function serializePreferences(prefs: UserPreferences): string {
  return encodeURIComponent(JSON.stringify(prefs));
}

export function buildCookieHeader(prefs: UserPreferences): string {
  return `${COOKIE_NAME}=${serializePreferences(prefs)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export async function updatePreference(
  type: 'like' | 'dislike' | 'bookmark' | 'unlike' | 'unbookmark' | 'undislike' | 'mute_topic' | 'unmute_topic' | 'mute_source' | 'unmute_source',
  articleUrl: string,
  articleCategory: string,
  articleSource: string
): Promise<UserPreferences> {
  const prefs = await getPreferences();
  
  switch (type) {
    case 'like':
      if (!prefs.likedArticles.includes(articleUrl)) {
        prefs.likedArticles.push(articleUrl);
      }
      prefs.dislikedArticles = prefs.dislikedArticles.filter(u => u !== articleUrl);
      if (!prefs.interests.includes(articleCategory.toLowerCase())) {
        prefs.interests.push(articleCategory.toLowerCase());
      }
      break;
      
    case 'unlike':
      prefs.likedArticles = prefs.likedArticles.filter(u => u !== articleUrl);
      break;
      
    case 'dislike':
      if (!prefs.dislikedArticles.includes(articleUrl)) {
        prefs.dislikedArticles.push(articleUrl);
      }
      prefs.likedArticles = prefs.likedArticles.filter(u => u !== articleUrl);
      break;
      
    case 'undislike':
      prefs.dislikedArticles = prefs.dislikedArticles.filter(u => u !== articleUrl);
      break;
      
    case 'bookmark':
      if (!prefs.bookmarkedArticles.includes(articleUrl)) {
        prefs.bookmarkedArticles.push(articleUrl);
      }
      break;
      
    case 'unbookmark':
      prefs.bookmarkedArticles = prefs.bookmarkedArticles.filter(u => u !== articleUrl);
      break;
      
    case 'mute_topic':
      if (!prefs.mutedTopics.includes(articleCategory.toLowerCase())) {
        prefs.mutedTopics.push(articleCategory.toLowerCase());
      }
      break;
      
    case 'unmute_topic':
      prefs.mutedTopics = prefs.mutedTopics.filter(t => t !== articleCategory.toLowerCase());
      break;
      
    case 'mute_source':
      if (!prefs.mutedSources.includes(articleSource.toLowerCase())) {
        prefs.mutedSources.push(articleSource.toLowerCase());
      }
      break;
      
    case 'unmute_source':
      prefs.mutedSources = prefs.mutedSources.filter(s => s !== articleSource.toLowerCase());
      break;
  }
  
  return prefs;
}

export function isArticleLiked(prefs: UserPreferences, articleUrl: string): boolean {
  return prefs.likedArticles.includes(articleUrl);
}

export function isArticleDisliked(prefs: UserPreferences, articleUrl: string): boolean {
  return prefs.dislikedArticles.includes(articleUrl);
}

export function isArticleBookmarked(prefs: UserPreferences, articleUrl: string): boolean {
  return prefs.bookmarkedArticles.includes(articleUrl);
}