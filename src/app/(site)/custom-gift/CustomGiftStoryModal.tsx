'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { StoryArticle } from './customGiftStoriesData';

type CustomGiftStoryModalProps = {
  isOpen: boolean;
  story: StoryArticle | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
};

export default function CustomGiftStoryModal({
  isOpen,
  story,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: CustomGiftStoryModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrev && hasPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && onNext && hasNext) {
        onNext();
      }
    },
    [onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !story) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-gift-story-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-shadow-black/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-none border border-white/20 bg-white shadow-2xl">
        {/* Sticky Top Bar with Close Button */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-shadow-black/10 bg-white/95 px-6 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-light tracking-[0.25em] text-maroon uppercase">
              {story.categoryTag}
            </span>
            <span className="text-shadow-black/30">·</span>
            <span className="text-[11px] font-light tracking-wider text-shadow-black/60 uppercase">
              {story.subCategory}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-light text-shadow-black/50 sm:inline">
              {story.readTime}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close story reader"
              className="flex size-8 items-center justify-center rounded-full border border-shadow-black/10 bg-white text-shadow-black transition-colors hover:bg-maroon hover:text-white"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Story Content */}
        <div className="overflow-y-auto px-6 py-6 sm:px-10 sm:py-8">
          {/* Main Story Image */}
          <div className="relative aspect-[1.6/1] w-full overflow-hidden border border-shadow-black/10 bg-gray-100">
            <Image
              src={story.image}
              alt={story.title}
              fill
              priority
              sizes="(min-width: 1024px) 800px, 95vw"
              className="object-cover object-center"
            />
          </div>

          {/* Title & Accent Bar */}
          <div className="mt-8">
            <p className="text-xs font-light uppercase tracking-wider text-maroon">
              {story.categoryTag} · {story.subCategory}
            </p>

            <h2
              id="custom-gift-story-modal-title"
              className="mt-2 text-xl font-light leading-snug tracking-wide text-shadow-black sm:text-2xl md:text-3xl"
            >
              {story.title}
            </h2>

            <div className="mt-3 h-[2px] w-12 bg-maroon" />
          </div>

          {/* Lead Paragraph */}
          <p className="mt-6 text-sm font-light leading-relaxed text-shadow-black/90 sm:text-base md:text-lg">
            {story.fullContent.leadParagraph}
          </p>

          {/* Pull Quote */}
          {story.fullContent.quote && (
            <div className="my-8 border-l-2 border-maroon bg-[#FAF8F5] p-5 sm:p-6">
              <p className="text-sm font-light italic leading-relaxed text-shadow-black/85 sm:text-base">
                &ldquo;{story.fullContent.quote}&rdquo;
              </p>
              {story.fullContent.quoteAuthor && (
                <p className="mt-2 text-xs font-light tracking-wider text-maroon uppercase">
                  — {story.fullContent.quoteAuthor}
                </p>
              )}
            </div>
          )}

          {/* Body Paragraphs */}
          <div className="space-y-4 text-xs font-light leading-relaxed text-shadow-black/75 sm:text-sm md:text-base">
            {story.fullContent.bodyParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Highlights Box */}
          {story.fullContent.highlights && story.fullContent.highlights.length > 0 && (
            <div className="mt-8 border border-beige/60 bg-[#FAF8F5]/80 p-5 sm:p-6">
              <span className="text-xs font-light uppercase tracking-widest text-maroon">
                Key Craftsmanship Highlights
              </span>
              <ul className="mt-3 space-y-2">
                {story.fullContent.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs font-light text-shadow-black/80 sm:text-sm">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-maroon" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Story Navigation Controls */}
          <div className="mt-10 flex items-center justify-between border-t border-shadow-black/10 pt-6">
            <button
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
              className={`inline-flex items-center gap-2 text-xs font-light tracking-wider transition-colors ${
                hasPrev
                  ? 'text-shadow-black hover:text-maroon'
                  : 'cursor-not-allowed text-shadow-black/25'
              }`}
            >
              <span aria-hidden="true">‹</span>
              <span>เรื่องราวก่อนหน้า</span>
            </button>

            <Link
              href="/contact"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-maroon bg-white px-5 py-2 text-xs font-light tracking-wider text-maroon shadow-xs transition-all hover:bg-maroon hover:text-white"
            >
              <span>ปรึกษาทีมงานออกแบบ</span>
              <span aria-hidden="true">›</span>
            </Link>

            <button
              type="button"
              onClick={onNext}
              disabled={!hasNext}
              className={`inline-flex items-center gap-2 text-xs font-light tracking-wider transition-colors ${
                hasNext
                  ? 'text-shadow-black hover:text-maroon'
                  : 'cursor-not-allowed text-shadow-black/25'
              }`}
            >
              <span>เรื่องราวถัดไป</span>
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
