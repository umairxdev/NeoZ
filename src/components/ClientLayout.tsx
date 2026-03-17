'use client';

import { ThemeProvider } from '@/providers/ThemeProvider';
import { Header, MobileNav } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/sonner';
import { CookieConsent } from '@/components/ui/cookie-consent';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        <main className="flex-1 w-full hide-on-mobile-nav">
          {children}
        </main>
        <MobileNav />
        <Toaster />
        <CookieConsent />
      </div>
    </ThemeProvider>
  );
}