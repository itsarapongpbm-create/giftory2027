'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import BestSellerCard from './BestSellerCard';

export type BestSellerCarouselItem = {
  id: string;
  image: string;
  title: string;
  price?: number;
};

const SPEED_PX_PER_SEC = 45;
const FALLBACK_CARD_WIDTH = 316;
const MIN_CARDS_PER_HALF = 8;

export default function BestSellerCarousel({ items }: { items: BestSellerCarouselItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  const initialRepeatCount = Math.max(1, Math.ceil(MIN_CARDS_PER_HALF / Math.max(1, items.length)));
  const [repeatCount, setRepeatCount] = useState(initialRepeatCount);
  const [durationSec, setDurationSec] = useState(
    () => (items.length * initialRepeatCount * FALLBACK_CARD_WIDTH) / SPEED_PX_PER_SEC
  );
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touchPaused, setTouchPaused] = useState(false);
  const [visible, setVisible] = useState(true);

  const repeatedItems = useMemo(() => {
    const result: Array<{ item: BestSellerCarouselItem; originalIndex: number; copyIndex: number }> = [];
    for (let copyIndex = 0; copyIndex < repeatCount; copyIndex += 1) {
      items.forEach((item, originalIndex) => {
        result.push({ item, originalIndex, copyIndex });
      });
    }
    return result;
  }, [items, repeatCount]);

  useEffect(() => {
    const minRepeat = Math.max(1, Math.ceil(MIN_CARDS_PER_HALF / Math.max(1, items.length)));
    setRepeatCount(minRepeat);
  }, [items.length]);

  useEffect(() => {
    const container = containerRef.current;
    const group = groupRef.current;
    if (!container || !group) return;

    const updateMetrics = () => {
      const containerWidth = container.getBoundingClientRect().width;
      const groupWidth = group.getBoundingClientRect().width;
      if (groupWidth <= 0) return;

      const singleSetWidth = groupWidth / repeatCount;
      if (singleSetWidth > 0 && groupWidth < containerWidth + 320) {
        const needed = Math.max(repeatCount, Math.ceil((containerWidth + 320) / singleSetWidth));
        if (needed !== repeatCount) {
          setRepeatCount(needed);
          return;
        }
      }

      setDurationSec(Math.max(12, groupWidth / SPEED_PX_PER_SEC));
    };

    updateMetrics();
    const resizeObserver = new ResizeObserver(updateMetrics);
    resizeObserver.observe(container);
    resizeObserver.observe(group);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [repeatCount]);

  const isPaused = hovered || focused || touchPaused || !visible;

  return (
    <section
      ref={containerRef}
      aria-label="Best Sellers"
      className="relative w-full overflow-hidden py-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setTouchPaused(true)}
      onTouchEnd={() => setTouchPaused(false)}
      onTouchCancel={() => setTouchPaused(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}
    >
      {/* Subtle edge fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-main-white to-transparent sm:w-16 md:w-24"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-main-white to-transparent sm:w-16 md:w-24"
      />

      <div
        className="animate-best-seller-marquee flex w-max"
        style={{
          animationDuration: `${durationSec.toFixed(2)}s`,
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {/* Primary track */}
        <div ref={groupRef} className="flex shrink-0 items-stretch gap-6 pr-6">
          {repeatedItems.map(({ item, originalIndex, copyIndex }) => {
            const isClone = copyIndex > 0;
            return (
              <div
                key={`primary-${copyIndex}-${item.id}`}
                aria-hidden={isClone || undefined}
                className="w-[225px] shrink-0 sm:w-[247.5px] md:w-[270px] lg:w-[292.5px]"
              >
                <BestSellerCard
                  image={item.image}
                  title={item.title}
                  price={item.price}
                  isBestSeller
                  isEvenIem={originalIndex % 2 === 0}
                  href={`/basket/${item.id}`}
                  tabIndex={isClone ? -1 : undefined}
                />
              </div>
            );
          })}
        </div>

        {/* Seamless duplicate track */}
        <div aria-hidden="true" className="flex shrink-0 items-stretch gap-6 pr-6">
          {repeatedItems.map(({ item, originalIndex, copyIndex }) => (
            <div
              key={`clone-${copyIndex}-${item.id}`}
              className="w-[225px] shrink-0 sm:w-[247.5px] md:w-[270px] lg:w-[292.5px]"
            >
              <BestSellerCard
                image={item.image}
                title={item.title}
                price={item.price}
                isBestSeller
                isEvenIem={originalIndex % 2 === 0}
                href={`/basket/${item.id}`}
                tabIndex={-1}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
