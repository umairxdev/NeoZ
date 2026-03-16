'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bookmark, Home, Compass, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Input } from '@/components/ui/input';

const CATEGORIES = [
  { href: '/category/technology', label: 'Tech' },
  { href: '/category/business', label: 'Business' },
  { href: '/category/science', label: 'Science' },
  { href: '/category/sports', label: 'Sports' },
  { href: '/category/world', label: 'World' },
  { href: '/category/pakistan', label: 'Pakistan' },
  { href: '/category/south-asia', label: 'South Asia' },
];

function NeoZLogo() {
  return (
    <Link href="/" className="flex items-center group">
      <span className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
        Neo
      </span>
      <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1bab89] drop-shadow-[0_0_10px_rgba(27,171,137,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(27,171,137,0.8)] transition-all duration-300">
        Z
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [bookmarkCount, setBookmarkCount] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('newsstream_bookmarks');
      if (stored) {
        const bookmarks = JSON.parse(stored);
        setBookmarkCount(bookmarks.length);
      }
    } catch {}

    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4">
          {/* Top Row: Logo + Search + Actions */}
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NeoZLogo />
            </div>

            {/* Search Bar - Desktop Only */}
            <div className="hidden md:block flex-1 max-w-lg mx-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search"
                  placeholder="Search news..."
                  className={`w-full pl-10 pr-4 bg-secondary/50 border-border/50 focus:border-[#1bab89] transition-all ${isSearchFocused ? 'ring-2 ring-[#1bab89]/30' : ''}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <Button variant="outline" size="sm" className="hidden sm:flex border-[#1bab89]/30 text-[#1bab89] hover:bg-[#1bab89]/10" render={<Link href="/dashboard" />}>
                Dashboard
              </Button>
              <ThemeToggle />
              
              <Button variant="ghost" size="icon" className="relative" render={<Link href="/dashboard" />}>
                <Bookmark className="h-5 w-5" />
                {bookmarkCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#1bab89] text-[10px] font-bold text-black flex items-center justify-center">
                    {bookmarkCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Category Tabs - Desktop */}
          <nav className="hidden md:flex items-center gap-1 pb-3 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = pathname === cat.href || pathname.startsWith(cat.href + '/');
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-full ${
                    isActive 
                      ? 'text-[#1bab89] bg-[#1bab89]/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Menu - Categories */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl py-4">
            <nav className="flex flex-col gap-1 px-2">
              {CATEGORIES.map((cat) => {
                const isActive = pathname === cat.href || pathname.startsWith(cat.href + '/');
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className={`px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg ${
                      isActive 
                        ? 'text-[#1bab89] bg-[#1bab89]/10' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

// Mobile Bottom Navigation
export function MobileNav() {
  const pathname = usePathname();
  const [bookmarkCount, setBookmarkCount] = React.useState(0);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('newsstream_bookmarks');
      if (stored) {
        const bookmarks = JSON.parse(stored);
        setBookmarkCount(bookmarks.length);
      }
    } catch {}
  }, []);

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/dashboard', icon: Bookmark, label: 'Saved', count: bookmarkCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="grid grid-cols-3 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${
                isActive ? 'text-[#1bab89]' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-[#1bab89] text-[8px] font-bold text-black flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#1bab89] rounded-full shadow-[0_0_10px_rgba(27,171,137,0.5)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}