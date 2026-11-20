'use client';

import { useState, useCallback } from 'react';
import { ProductCard } from '@/components/cards';
import type { CustomGiftPageItem } from '@/lib/customGiftPage';
import type { ContactSettings } from '@/lib/siteSettings';
import { cn } from '@/utils';
import CustomGiftLightbox from './CustomGiftLightbox';
import CustomGiftProcessSection from './CustomGiftProcessSection';
import CustomGiftConsultationSection from './CustomGiftConsultationSection';

type CustomGiftPageClientProps = {
  items: CustomGiftPageItem[];
  contactSettings?: ContactSettings | null;
};

const CustomGiftPageClient = ({
  items,
  contactSettings,
}: CustomGiftPageClientProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const featuredItem = items.find(item => item.slot === 1);
  const listItems = items.filter(item => item.slot !== 1);
  const orderedItems = featuredItem ? [featuredItem, ...listItems] : items;

  const handleOpenLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  return (
    <div className="min-h-[calc(100dvh-290px)]">
      {/* Hero & Storytelling Section */}
      <section className="border-b border-shadow-black/10 bg-white px-4 pb-12 pt-8 sm:px-6 md:px-8 md:pb-16 md:pt-12 lg:pb-20 lg:pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-light uppercase tracking-[0.25em] text-maroon">
            Bespoke Gifting Service
          </p>
          <h1
            id="custom-gift"
            className="mt-3 text-2xl font-light tracking-wide text-shadow-black sm:text-3xl md:text-4xl"
          >
            Custom Gift — ศิลปะแห่งการมอบของขวัญเฉพาะคุณ
          </h1>
          <div className="mx-auto mt-4 h-[2px] w-12 bg-maroon md:w-16" />
          <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-relaxed text-shadow-black/75 sm:text-base">
            ส่งต่อความรู้สึกอันทรงคุณค่าผ่านของขวัญสั่งทำพิเศษ คัดสรรสินค้าพรีเมียมและออกแบบทุกองค์ประกอบด้วยความประณีต เพื่อสะท้อนความตั้งใจและเอกลักษณ์เฉพาะตัวของคุณอย่างสมบูรณ์แบบ
          </p>
        </div>
      </section>

      {/* 4-Step Bespoke Journey */}
      <CustomGiftProcessSection />

      {/* Portfolio Showcase Grid */}
      <section className="bg-main-white py-12 md:py-16">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-shadow-black/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-light uppercase tracking-[0.25em] text-maroon">
                Curated Portfolio
              </p>
              <h2 className="mt-1 text-xl font-light tracking-wide text-shadow-black sm:text-2xl md:text-3xl">
                ตัวอย่างผลงานสั่งจัดพิเศษ
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-light text-shadow-black/60">
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
              <span>คลิกที่รูปภาพเพื่อเปิดชมรายละเอียดผลงานขนาดใหญ่</span>
            </div>
          </div>

          <div
            className={cn(
              'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
            )}
          >
            {featuredItem && (
              <ProductCard
                key={`${featuredItem.slot}-${featuredItem.image}`}
                id={featuredItem.id}
                image={featuredItem.image}
                title={featuredItem.title}
                imageClassName={featuredItem.imageClassName}
                disabledLink={true}
                onClick={() => handleOpenLightbox(0)}
                className={cn(
                  'max-w-full cursor-pointer transition-all duration-300 hover:shadow-md',
                  featuredItem.className
                )}
              />
            )}
            {listItems.map((item, idx) => {
              const lightboxIndex = featuredItem ? idx + 1 : idx;
              return (
                <ProductCard
                  key={`${item.slot}-${item.image}`}
                  id={item.id}
                  image={item.image}
                  title={item.title}
                  imageClassName={item.imageClassName}
                  disabledLink={true}
                  onClick={() => handleOpenLightbox(lightboxIndex)}
                  className="max-w-full cursor-pointer bg-gray-100 transition-all duration-300 hover:shadow-md"
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Consultation Touchpoint */}
      <CustomGiftConsultationSection contactSettings={contactSettings} />

      {/* Lightbox Modal */}
      <CustomGiftLightbox
        isOpen={isLightboxOpen}
        items={orderedItems}
        currentIndex={lightboxIndex}
        onClose={handleCloseLightbox}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
};

export default CustomGiftPageClient;
