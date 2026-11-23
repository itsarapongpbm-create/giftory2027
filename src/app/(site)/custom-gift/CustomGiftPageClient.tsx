'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ProductCard } from '@/components/cards';
import type { CustomGiftPageItem } from '@/lib/customGiftPage';
import type { ContactSettings, CustomGiftHeroSettings } from '@/lib/siteSettings';
import CustomGiftLightbox, { type LightboxItem } from './CustomGiftLightbox';
import CustomGiftProcessSection from './CustomGiftProcessSection';
import CustomGiftCategoryCoverflow, {
  type CoverflowItem,
} from './CustomGiftCategoryCoverflow';
import CustomGiftConsultationSection from './CustomGiftConsultationSection';

type CustomGiftPageClientProps = {
  items: CustomGiftPageItem[];
  contactSettings?: ContactSettings | null;
  heroSettings?: CustomGiftHeroSettings | null;
};

const CustomGiftPageClient = ({
  items,
  contactSettings,
  heroSettings,
}: CustomGiftPageClientProps) => {
  const { featuredItem, listItems, orderedItems } = useMemo(() => {
    const featured = items.find(item => item.slot === 1);
    const list = items.filter(item => item.slot !== 1);
    const ordered: LightboxItem[] = featured ? [featured, ...list] : items;
    return { featuredItem: featured, listItems: list, orderedItems: ordered };
  }, [items]);

  const [activeLightboxItems, setActiveLightboxItems] =
    useState<LightboxItem[]>(orderedItems);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleOpenGridLightbox = useCallback(
    (index: number) => {
      setActiveLightboxItems(orderedItems);
      setLightboxIndex(index);
      setIsLightboxOpen(true);
    },
    [orderedItems]
  );

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

      {/* Complete Portfolio Showcase Section */}
      <section className="bg-main-white py-14 md:py-20">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          {/* Main Section Header (Matching Giftory Category Showcase Typography) */}
          <div className="mb-10 grid grid-cols-1 items-start gap-6 border-b border-shadow-black/10 pb-8 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-8 lg:col-span-9">
              <p className="text-xs font-light tracking-wider text-maroon sm:text-sm">
                ตัวอย่างผลงานสั่งจัดพิเศษ คัดสรรอย่างประณีต
              </p>
              <h2 className="mt-1 text-2xl font-light tracking-wide text-shadow-black sm:text-3xl lg:text-4xl">
                Curated Portfolio Archive
              </h2>
              <div className="mt-3 h-[2px] w-12 bg-maroon" />
              <p className="mt-4 text-xs font-light leading-relaxed text-shadow-black/75 sm:text-sm md:text-base">
                รวบรวมตัวอย่างผลงานสั่งจัดจริงที่ผ่านมา พร้อมไอเดียการจัดเซตสำหรับองค์กรและโอกาสสำคัญในทุกเทศกาล
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-light text-shadow-black/60 md:col-span-4 md:justify-end lg:col-span-3 md:pt-4">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <span>คลิกที่รูปภาพเพื่อเปิดชมขนาดใหญ่</span>
            </div>
          </div>

          {/* Featured Project Spotlight (Slot 1) - Correct 1.41:1 aspect ratio so text is never cropped */}
          {featuredItem && (
            <div className="mb-16">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-light tracking-[0.25em] text-maroon uppercase">
                    Case Study Spotlight
                  </span>
                  <div className="h-[1px] w-6 bg-beige" />
                </div>
                <span className="text-xs font-light text-shadow-black/50">
                  Featured Custom Collaboration
                </span>
              </div>

              <div
                onClick={() => handleOpenGridLightbox(0)}
                className="group relative mx-auto aspect-[1.42/1] max-w-4xl w-full cursor-pointer overflow-hidden border border-shadow-black/10 bg-white transition-all duration-500 hover:border-maroon/40 hover:shadow-xl"
              >
                <Image
                  src={featuredItem.image}
                  alt={featuredItem.title || 'Featured custom project'}
                  fill
                  priority
                  sizes="(min-width: 1024px) 896px, 95vw"
                  className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                />

                {/* Luxury Hover Overlay */}
                <div className="absolute inset-0 bg-shadow-black/0 transition-colors duration-300 group-hover:bg-shadow-black/25" />

                {/* Floating Zoom Action Badge */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 border border-white/25 bg-shadow-black/80 px-4 py-2 text-xs font-light tracking-wider text-main-white backdrop-blur-sm transition-all duration-300 group-hover:bg-maroon group-hover:border-maroon sm:bottom-6 sm:right-6">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span className="hidden sm:inline">คลิกเพื่อชมภาพขยาย</span>
                  <span className="sm:hidden">ชมภาพขยาย</span>
                </div>

                {featuredItem.title && (
                  <div className="absolute bottom-4 left-4 border border-white/20 bg-shadow-black/80 px-4 py-2 text-sm font-light text-main-white backdrop-blur-sm sm:bottom-6 sm:left-6">
                    {featuredItem.title}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Unified Bespoke Collection Grid (Slot 2+) */}
          <div>
            <div className="mb-6 flex flex-col items-start justify-between gap-3 border-b border-shadow-black/10 pb-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-light tracking-[0.25em] text-maroon uppercase">
                  Bespoke Collection
                </span>
                <h3 className="mt-1 text-lg font-light tracking-wide text-shadow-black sm:text-xl">
                  คอลเลกชันกระเช้าและของขวัญสั่งทำ
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-light text-shadow-black/60">
                <span>เลือกชมผลงาน</span>
                <span className="text-shadow-black/30">—</span>
                <span className="font-normal text-maroon">{listItems.length} แบบ</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {listItems.map((item, idx) => {
                const lightboxIndex = featuredItem ? idx + 1 : idx;
                return (
                  <div
                    key={`${item.slot}-${item.image}`}
                    className="group relative cursor-pointer"
                  >
                    <ProductCard
                      id={item.id}
                      image={item.image}
                      title={item.title}
                      imageClassName={item.imageClassName}
                      disabledLink={true}
                      onClick={() => handleOpenGridLightbox(lightboxIndex)}
                      className="max-w-full bg-gray-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
                    />
                    {/* Subtle hover zoom icon indicator */}
                    <div
                      onClick={() => handleOpenGridLightbox(lightboxIndex)}
                      className="pointer-events-none absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-shadow-black/60 text-main-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Touchpoint */}
      <CustomGiftConsultationSection contactSettings={contactSettings} />

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
