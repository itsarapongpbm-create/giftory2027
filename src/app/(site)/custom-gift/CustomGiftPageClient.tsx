'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import type { CustomGiftPageItem } from '@/lib/customGiftPage';
import type { ContactSettings, CustomGiftHeroSettings } from '@/lib/siteSettings';
import CustomGiftLightbox, { type LightboxItem } from './CustomGiftLightbox';
import CustomGiftProcessSection from './CustomGiftProcessSection';
import CustomGiftCategoryCoverflow, {
  type CoverflowItem,
} from './CustomGiftCategoryCoverflow';
import CustomGiftStoriesSection from './CustomGiftStoriesSection';

type CustomGiftPageClientProps = {
  items: CustomGiftPageItem[];
  contactSettings?: ContactSettings | null;
  heroSettings?: CustomGiftHeroSettings | null;
};

const CustomGiftPageClient = ({
  heroSettings,
}: CustomGiftPageClientProps) => {
  const [activeLightboxItems, setActiveLightboxItems] = useState<LightboxItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleOpenCoverflowLightbox = useCallback(
    (_item: CoverflowItem, allCategoryItems: CoverflowItem[], index: number) => {
      setActiveLightboxItems(allCategoryItems);
      setLightboxIndex(index);
      setIsLightboxOpen(true);
    },
    []
  );

  const handleCloseLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const tag = heroSettings?.tag || 'Bespoke Gifting Service';
  const title = heroSettings?.title || 'Custom Gift — ศิลปะแห่งการมอบของขวัญเฉพาะคุณ';
  const description =
    heroSettings?.description ||
    'ส่งต่อความรู้สึกอันทรงคุณค่าผ่านของขวัญสั่งทำพิเศษ คัดสรรสินค้าพรีเมียมและออกแบบทุกองค์ประกอบด้วยความประณีต เพื่อสะท้อนความตั้งใจและเอกลักษณ์เฉพาะตัวของคุณอย่างสมบูรณ์แบบ';
  const bgImage = heroSettings?.bgImage || '/images/home-cover.webp';
  const bgAlt = heroSettings?.bgAlt || 'Custom Gift Hero Background';

  return (
    <div className="min-h-[calc(100dvh-290px)]">
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden bg-shadow-black text-main-white">
        {/* Background Image Container */}
        <div className="absolute inset-0 size-full">
          <Image
            src={bgImage}
            alt={bgAlt}
            fill
            priority
            sizes="100vw"
            className="scale-[1.03] object-cover object-center"
          />
          {/* Luxury dual overlays for high contrast and brand ambiance */}
          <div className="absolute inset-0 bg-gradient-to-t from-shadow-black/95 via-shadow-black/70 to-shadow-black/80" />
          <div className="absolute inset-0 bg-maroon/20 mix-blend-multiply" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex min-h-[380px] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[440px] sm:px-6 md:min-h-[480px] md:px-8 md:py-24">
          {tag && (
            <p className="text-xs font-light uppercase tracking-[0.3em] text-beige sm:text-sm">
              {tag}
            </p>
          )}

          <h1
            id="custom-gift"
            className="mt-3 text-2xl font-light tracking-wide text-main-white sm:text-3xl md:text-4xl lg:text-5xl"
          >
            {title}
          </h1>

          <div className="mx-auto my-4 h-[2px] w-14 bg-beige md:w-16" />

          <p className="mx-auto max-w-2xl text-sm font-light leading-relaxed text-main-white/85 sm:text-base">
            {description}
          </p>

          <div className="mt-8 flex items-center gap-2 text-xs font-light tracking-widest uppercase text-main-white/60">
            <span>Scroll to Explore</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </section>

      {/* 4-Step Bespoke Journey */}
      <CustomGiftProcessSection />

      {/* 4-Category Interactive Coverflow Showcase */}
      <CustomGiftCategoryCoverflow onSelectItem={handleOpenCoverflowLightbox} />

      {/* AP Thai Blog Inspired Brand Stories & Editorial Journal */}
      <CustomGiftStoriesSection />

      {/* Lightbox Modal */}
      <CustomGiftLightbox
        isOpen={isLightboxOpen}
        items={activeLightboxItems}
        currentIndex={lightboxIndex}
        onClose={handleCloseLightbox}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
};

export default CustomGiftPageClient;
