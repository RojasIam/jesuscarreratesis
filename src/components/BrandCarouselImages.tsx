'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export const BRAND_CAROUSEL_IMAGES = [
  { src: '/foto-sidebar.webp', alt: 'Técnico en campo — Optical Quality' },
  { src: '/foto-sidebar2.webp', alt: 'Medición óptica — Optical Quality' },
] as const;

export const BRAND_CAROUSEL_INTERVAL_MS = 5000;

type BrandCarouselImagesProps = {
  className?: string;
  innerClassName?: string;
  imageSizes?: string;
};

export default function BrandCarouselImages({
  className = '',
  innerClassName = 'p-6 sm:p-8 lg:p-10',
  imageSizes = '(max-width: 1024px) 100vw, 480px',
}: BrandCarouselImagesProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BRAND_CAROUSEL_IMAGES.length);
    }, BRAND_CAROUSEL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <div className={`absolute inset-0 ${innerClassName}`}>
        {BRAND_CAROUSEL_IMAGES.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            className={`object-contain transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            sizes={imageSizes}
          />
        ))}
      </div>
    </div>
  );
}
