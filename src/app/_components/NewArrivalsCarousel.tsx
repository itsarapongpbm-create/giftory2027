'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils';
import { formatPrice } from '@/utils/string';

export type NewArrivalItem = {
  id: string;
  image: string;
  title: string;
  price?: number;
};

export default function NewArrivalsCarousel({ items }: { items: NewArrivalItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);

  const syncScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const scrollable = maxScroll > 2;
    setCanScroll(scrollable);
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(!scrollable || track.scrollLeft >= maxScroll - 2);
    setProgress(scrollable ? Math.min(1, Math.max(0, track.scrollLeft / maxScroll)) : 0);
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
  }, [syncScrollState, items.length]);

  const scrollByStep = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.firstElementChild as HTMLElement | null;
    const cardStep = (firstCard?.getBoundingClientRect().width || 292.5) + 24;
    const visibleCards = Math.max(1, Math.floor(track.clientWidth / cardStep));
    const stepMultiplier = visibleCards >= 4 ? 2 : 1;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const target = Math.max(
      0,
      Math.min(maxScroll, track.scrollLeft + direction * cardStep * stepMultiplier)
    );

    track.scrollTo({ left: target, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
      <div className="relative">
        {/* Previous Button (Left Side) */}
        {canScroll && (
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            disabled={atStart}
            aria-label="Previous new arrivals"
            className={cn(
              'absolute left-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-shadow-black/15 bg-main-white/95 text-shadow-black shadow-md backdrop-blur-sm transition-all duration-200 md:left-3 md:size-12',
              atStart
                ? 'cursor-not-allowed opacity-30'
                : 'hover:border-maroon hover:bg-maroon hover:text-main-white'
            )}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* Next Button (Right Side) */}
        {canScroll && (
          <button
            type="button"
            onClick={() => scrollByStep(1)}
            disabled={atEnd}
            aria-label="Next new arrivals"
            className={cn(
              'absolute right-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-shadow-black/15 bg-main-white/95 text-shadow-black shadow-md backdrop-blur-sm transition-all duration-200 md:right-3 md:size-12',
              atEnd
                ? 'cursor-not-allowed opacity-30'
                : 'hover:border-maroon hover:bg-maroon hover:text-main-white'
            )}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        {/* Manual Horizontal Product Track */}
        <div
          ref={trackRef}
          tabIndex={0}
          aria-label="New arrival products; use left and right arrow keys to browse"
          onKeyDown={event => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              scrollByStep(-1);
            } else if (event.key === 'ArrowRight') {
              event.preventDefault();
              scrollByStep(1);
            }
          }}
          className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((product, index) => {
            const isEven = index % 2 === 0;
            const priceFormat = product.price ? formatPrice(product.price) : undefined;

            return (
              <div
                key={product.id}
                className="w-[225px] shrink-0 snap-start sm:w-[247.5px] md:w-[270px] lg:w-[292.5px]"
              >
                <Link
                  href={`/basket/${product.id}`}
                  className="hover:shadow-card group card relative aspect-[3/4] h-[300px] w-full cursor-pointer overflow-hidden rounded-none bg-shadow-black bg-opacity-20 shadow-sm sm:h-[330px] md:h-[360px] lg:h-[390px]"
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 640px) 40vw, 90vw"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />

                  <div className="absolute inset-0 flex items-end bg-shadow-black/25 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
                    <div className="card-body translate-y-0 transform bg-main-white/95 p-4 transition-transform duration-300 lg:translate-y-full lg:bg-main-white lg:p-6 lg:group-hover:translate-y-0">
                      <h3 className="card-title line-clamp-1 !text-base !font-extralight text-shadow-black lg:line-clamp-2 lg:!text-[20px]">
                        {product.title}
                      </h3>
                      {priceFormat && (
                        <p className="text-lg font-light text-maroon lg:text-2xl">
                          ฿ {priceFormat}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* New Arrival slanted ribbon matching Best Seller style */}
                  <div
                    className={cn(
                      'absolute left-0 top-0 py-2 pl-3.5 pr-6 text-xs font-normal tracking-wide',
                      isEven ? 'bg-beige text-main' : 'bg-maroon text-main-white'
                    )}
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)',
                    }}
                  >
                    New Arrival
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle Scroll Progress Bar */}
      {canScroll && (
        <div className="mx-auto mt-5 h-[2px] w-full max-w-xs overflow-hidden bg-shadow-black/10">
          <div
            className="h-full bg-maroon transition-transform duration-200 ease-out"
            style={{
              width: '35%',
              transform: `translateX(${progress * 185}%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}
