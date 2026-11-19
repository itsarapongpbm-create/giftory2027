'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils';
import { formatPrice } from '@/utils/string';
import type { CatalogProduct } from '@/lib/catalog';

type CategoryProductCarouselProps = {
  products: CatalogProduct[];
  categorySlug: string;
};

export default function CategoryProductCarousel({
  products,
  categorySlug: _categorySlug,
}: CategoryProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const scrollable = maxScroll > 2;
    setCanScroll(scrollable);
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(!scrollable || track.scrollLeft >= maxScroll - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncScrollState();
    const resizeObserver = new ResizeObserver(syncScrollState);
    resizeObserver.observe(track);

    track.addEventListener('scroll', syncScrollState, { passive: true });
    return () => {
      resizeObserver.disconnect();
      track.removeEventListener('scroll', syncScrollState);
    };
  }, [syncScrollState, products.length]);

  const scrollByStep = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.firstElementChild as HTMLElement | null;
    const cardStep = (firstCard?.getBoundingClientRect().width || 240) + 16;
    const visibleCards = Math.max(1, Math.floor(track.clientWidth / cardStep));
    const stepMultiplier = visibleCards >= 4 ? 2 : 1;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const target = Math.max(
      0,
      Math.min(maxScroll, track.scrollLeft + direction * cardStep * stepMultiplier)
    );

    track.scrollTo({ left: target, behavior: 'smooth' });
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Scroll Left Button */}
      {canScroll && (
        <button
          type="button"
          onClick={() => scrollByStep(-1)}
          disabled={atStart}
          aria-label="Previous products"
          className={cn(
            'absolute -left-3 top-[38%] z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-shadow-black/15 bg-white text-shadow-black shadow-md backdrop-blur-sm transition-all duration-200 md:-left-4 md:size-11',
            atStart
              ? 'cursor-not-allowed opacity-0 pointer-events-none'
              : 'opacity-100 hover:border-maroon hover:bg-maroon hover:text-white'
          )}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Scroll Right Button */}
      {canScroll && (
        <button
          type="button"
          onClick={() => scrollByStep(1)}
          disabled={atEnd}
          aria-label="Next products"
          className={cn(
            'absolute -right-3 top-[38%] z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-shadow-black/15 bg-white text-shadow-black shadow-md backdrop-blur-sm transition-all duration-200 md:-right-4 md:size-11',
            atEnd
              ? 'cursor-not-allowed opacity-0 pointer-events-none'
              : 'opacity-100 hover:border-maroon hover:bg-maroon hover:text-white'
          )}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Carousel Track */}
      <div
        ref={trackRef}
        tabIndex={0}
        aria-label="Product carousel"
        className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map(product => {
          const priceDisplay = product.price ? `${formatPrice(product.price)} ฿` : 'Contact us';

          return (
            <Link
              key={product.id}
              href={`/basket/${product.id}`}
              className="group flex w-[180px] shrink-0 snap-start flex-col sm:w-[200px] md:w-[220px] lg:w-[230px]"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-shadow-black/10 bg-white p-2 transition-all duration-200 group-hover:border-maroon/40 group-hover:shadow-md">
                <div className="relative size-full">
                  <Image
                    src={product.cardImage || product.image}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1024px) 230px, (min-width: 640px) 200px, 180px"
                    className={cn(
                      'object-contain transition-transform duration-300 group-hover:scale-105',
                      product.imageClassName
                    )}
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col justify-between pt-2.5">
                <div>
                  <span className="block truncate text-[11px] font-mono uppercase tracking-wider text-shadow-black/50">
                    {product.id}
                  </span>
                  <h3 className="line-clamp-2 min-h-[2.5rem] text-xs font-light text-shadow-black transition-colors group-hover:text-maroon sm:text-sm">
                    {product.title}
                  </h3>
                </div>

                <div className="mt-2 flex items-center justify-between pt-1">
                  <span className="text-sm font-medium text-maroon sm:text-base">
                    {priceDisplay}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex size-6 items-center justify-center rounded-full border border-maroon/30 text-xs font-light text-maroon transition-all duration-200 group-hover:border-maroon group-hover:bg-maroon group-hover:text-white"
                  >
                    +
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
