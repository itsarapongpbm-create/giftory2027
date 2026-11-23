'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
export type LightboxItem = {
  image: string;
  title?: string;
  slot?: number;
};

type CustomGiftLightboxProps = {
  isOpen: boolean;
  items: LightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
};

const CustomGiftLightbox = ({
  isOpen,
  items,
  currentIndex,
  onClose,
  onNavigate,
}: CustomGiftLightboxProps) => {
  const currentItem = items[currentIndex];

  const handlePrev = useCallback(() => {
    if (items.length === 0) return;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onNavigate(prevIndex);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (items.length === 0) return;
    const nextIndex = (currentIndex + 1) % items.length;
    onNavigate(nextIndex);
  }, [currentIndex, items.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft') {
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Custom Gift Preview"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-shadow-black/95 p-4 backdrop-blur-md md:p-8"
      onClick={onClose}
    >
      {/* Top Bar: Item count and close button */}
      <div
        className="flex w-full max-w-5xl items-center justify-between text-main-white/80"
        onClick={event => event.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-light uppercase tracking-widest text-main-white/60">
            Custom Collection
          </span>
          <span className="text-xs text-main-white/30">—</span>
          <span className="text-xs font-light tracking-wide text-beige">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="flex size-10 items-center justify-center border border-main-white/20 text-main-white/80 transition-colors hover:border-main-white hover:text-main-white"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Main Image Container */}
      <div
        className="relative flex size-full max-h-[75vh] max-w-4xl items-center justify-center py-4"
        onClick={event => event.stopPropagation()}
      >
        {/* Navigation Button: Previous */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous work"
            className="absolute left-0 z-10 flex size-10 -translate-x-2 items-center justify-center border border-main-white/20 bg-shadow-black/60 text-main-white/80 transition-colors hover:border-main-white hover:bg-shadow-black hover:text-main-white sm:size-12 sm:-translate-x-6 md:-translate-x-12"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* The Image */}
        <div className="relative size-full overflow-hidden">
          <Image
            src={currentItem.image}
            alt={currentItem.title || `Custom gift item ${currentItem.slot}`}
            fill
            sizes="(min-width: 1024px) 800px, 90vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Navigation Button: Next */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next work"
            className="absolute right-0 z-10 flex size-10 translate-x-2 items-center justify-center border border-main-white/20 bg-shadow-black/60 text-main-white/80 transition-colors hover:border-main-white hover:bg-shadow-black hover:text-main-white sm:size-12 sm:translate-x-6 md:translate-x-12"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Bottom Bar: Title & Caption */}
      <div
        className="w-full max-w-2xl text-center text-main-white"
        onClick={event => event.stopPropagation()}
      >
        {currentItem.title ? (
          <p className="text-base font-light tracking-wide md:text-lg">
            {currentItem.title}
          </p>
        ) : (
          <p className="text-sm font-light tracking-wide text-main-white/70">
            Giftory TH Bespoke Gift Collection
          </p>
        )}
        <p className="mt-1 text-xs font-extralight tracking-widest text-main-white/40">
          {currentItem.slot ? `Slot ${currentItem.slot}` : 'Giftory Bespoke Showcase'}
        </p>
      </div>
    </div>
  );
};

export default CustomGiftLightbox;
