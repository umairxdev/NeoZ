'use client';

import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowBanner(false);
  }

  function handleDecline() {
    localStorage.setItem('cookie_consent', 'declined');
    setShowBanner(false);
  }

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg">
      <div className="container max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm">
          <Cookie className="h-5 w-5 text-primary flex-shrink-0" />
          <p className="text-muted-foreground">
            We use cookies to store your preferences (likes, bookmarks, interests) locally on your device. 
            No data is sent to any server.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={handleDecline}>
            Decline
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}