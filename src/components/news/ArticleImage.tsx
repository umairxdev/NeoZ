'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getCategoryFallback } from '@/lib/category-fallbacks';

interface ArticleImageProps {
  src: string;
  alt: string;
  category: string;
  /** Seed used to pick a varied fallback when multiple images are missing on a page */
  seed?: number;
}

export function ArticleImage({ src, alt, category, seed = 0 }: ArticleImageProps) {
  const fallback = getCategoryFallback(category, seed, '1200');
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover"
      priority
      onError={() => setImgSrc(fallback)}
      unoptimized
    />
  );
}
