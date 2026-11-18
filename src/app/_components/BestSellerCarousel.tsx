'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

export default function BestSellerCarousel({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const move = useCallback((direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const item = track.firstElementChild as HTMLElement | null;
    const step = (item?.getBoundingClientRect().width || track.clientWidth) + 24;
    const target = direction > 0 && track.scrollLeft >= max - 2
      ? 0
      : direction < 0 && track.scrollLeft <= 2
        ? max
        : Math.max(0, Math.min(max, track.scrollLeft + direction * step));
    track.scrollTo({ left: target, behavior: reducedMotion ? 'instant' : 'smooth' });
  }, [reducedMotion]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const resize = new ResizeObserver(() => setCanScroll(track.scrollWidth > track.clientWidth + 2));
    resize.observe(track);
    for (const child of track.children) resize.observe(child);
    const intersection = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    intersection.observe(track);
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener('change', updateMotion);
    return () => {
      resize.disconnect();
      intersection.disconnect();
      media.removeEventListener('change', updateMotion);
    };
  }, []);

  useEffect(() => {
    if (!canScroll || paused || hovered || focused || !visible || reducedMotion) return;
    const timer = setInterval(() => {
      if (!document.hidden) move(1);
    }, 4000);
    return () => clearInterval(timer);
  }, [canScroll, paused, hovered, focused, visible, reducedMotion, move]);

  return (
    <section
      aria-label="Best Sellers"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      {canScroll && (
        <div className="mb-3 flex items-center justify-end gap-2 px-4 md:px-8">
          {!reducedMotion && (
            <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'} className="h-10 border border-maroon/25 px-3 text-sm text-maroon hover:bg-maroon/5">
              {paused ? 'เล่นอัตโนมัติ' : 'หยุดเลื่อน'}
            </button>
          )}
          <button type="button" aria-label="Previous best sellers" onClick={() => move(-1)} className="size-10 border border-maroon/25 text-xl text-maroon hover:bg-maroon/5">←</button>
          <button type="button" aria-label="Next best sellers" onClick={() => move(1)} className="size-10 border border-maroon/25 text-xl text-maroon hover:bg-maroon/5">→</button>
        </div>
      )}
      <div
        ref={trackRef}
        tabIndex={0}
        aria-label="Best seller products; use left and right arrow keys to browse"
        onKeyDown={event => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            move(event.key === 'ArrowRight' ? 1 : -1);
          }
        }}
        className="flex w-full snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto overscroll-x-contain px-4 pb-2 [scrollbar-width:none] md:scroll-px-8 md:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </section>
  );
}
