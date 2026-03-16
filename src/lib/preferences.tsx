'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'sonner';

const LOCAL_STORAGE_PREFS = 'newsstream_preferences';
const INTERESTS_COOKIE = 'neoz_interests';

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

function setCookie(name: string, value: string, days: number = 365) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

interface PreferencesContextType {
  interests: string[];
  likedArticles: string[];
  dislikedArticles: string[];
  mutedTopics: string[];
  mutedSources: string[];
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  isLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType>({
  interests: [],
  likedArticles: [],
  dislikedArticles: [],
  mutedTopics: [],
  mutedSources: [],
  addInterest: () => {},
  removeInterest: () => {},
  isLoading: true,
});

export function usePreferences() {
  return useContext(PreferencesContext);
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<any>({
    likedArticles: [],
    dislikedArticles: [],
    interests: [],
    mutedTopics: [],
    mutedSources: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getLocalPreferences();
    setPrefs(stored);
    
    // Sync interests to cookie for server-side access
    if (stored.interests && stored.interests.length > 0) {
      setCookie(INTERESTS_COOKIE, stored.interests.join(','));
    }
    setIsLoading(false);
  }, []);

  const addInterest = (interest: string) => {
    const newInterests = prefs.interests.includes(interest) 
      ? prefs.interests 
      : [...prefs.interests, interest];
    const newPrefs = { ...prefs, interests: newInterests };
    setPrefs(newPrefs);
    setLocalPreferences(newPrefs);
    setCookie(INTERESTS_COOKIE, newInterests.join(','));
  };

  const removeInterest = (interest: string) => {
    const newInterests = prefs.interests.filter((i: string) => i !== interest);
    const newPrefs = { ...prefs, interests: newInterests };
    setPrefs(newPrefs);
    setLocalPreferences(newPrefs);
    setCookie(INTERESTS_COOKIE, newInterests.join(','));
  };

  return (
    <PreferencesContext.Provider value={{ ...prefs, addInterest, removeInterest, isLoading }}>
      {children}
    </PreferencesContext.Provider>
  );
}

// Helper function to extract interests from cookies (for server-side use)
export function getInterestsFromCookie(): string[] {
  const cookie = getCookie(INTERESTS_COOKIE);
  if (!cookie) return [];
  return cookie.split(',').filter(Boolean);
}
