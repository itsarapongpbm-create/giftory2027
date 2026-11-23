'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export type CoverflowFeature = {
  label: string;
  type: 'craft' | 'brand' | 'vip';
};

export type CoverflowItem = {
  id: string;
  title: string;
  subtitle: string;
  categoryTag: string;
  image: string;
  features: CoverflowFeature[];
};

export type CoverflowCategory = {
  id: string;
  name: string;
  subtitle: string;
  title: string;
  description: string;
  items: CoverflowItem[];
};

export const SHOWCASE_CATEGORIES: CoverflowCategory[] = [
  {
    id: 'baskets',
    name: 'งานออกแบบกระเช้าองค์กร',
    subtitle: 'งานออกแบบกระเช้าองค์กร คัดสรรอย่างประณีต',
    title: 'Corporate Custom Baskets',
    description:
      'รังสรรค์กระเช้าของขวัญตามเอกลักษณ์และโทนสีของแบรนด์ คัดสรรโครงสร้างหนัง ไม้ และงานจักสานชั้นเลิศ เหมาะสำหรับเทศกาลปีใหม่และโอกาสสำคัญระดับองค์กร',
    items: [
      {
        id: 'basket-01',
        title: 'The Executive Prestige Hamper',
        subtitle: 'กระเช้าหนังแท้และโครงสร้างไม้สั่งทำพิเศษสำหรับผู้บริหาร',
        categoryTag: 'Executive Leather Basket',
        image: '/images/special-custom-design/custom-basket/01.webp',
        features: [
          { label: 'Bespoke Leather Craft', type: 'craft' },
          { label: 'Embossed Logo Tag', type: 'brand' },
          { label: 'VIP Selection', type: 'vip' },
        ],
      },
      {
        id: 'basket-02',
        title: 'Heritage Woven Luxury Reserve',
        subtitle: 'กระเช้าจักสานธรรมชาติผสานริบบิ้นปักทองประณีต',
        categoryTag: 'Handwoven Natural Basket',
        image: '/images/special-custom-design/custom-basket/02.webp',
        features: [
          { label: 'Artisan Bamboo Weave', type: 'craft' },
          { label: 'Gold Embroidered Ribbon', type: 'brand' },
        ],
      },
      {
        id: 'basket-03',
        title: 'Siam Noir Signature Presentation',
        subtitle: 'เซตกระเช้าทรงสูงผูกโบว์ซิกเนเจอร์ Giftory',
        categoryTag: 'Signature Bespoke Basket',
        image: '/images/special-custom-design/custom-basket/03.webp',
        features: [
          { label: 'Signature Burgundy Bow', type: 'brand' },
          { label: 'Corporate Tier-1', type: 'vip' },
        ],
      },
      {
        id: 'basket-04',
        title: 'Grand Celebration Gourmet Hamper',
        subtitle: 'กระเช้าของขวัญกูร์เมต์นำเข้าคัดสรรพิเศษเฉพาะเทศกาล',
        categoryTag: 'Gourmet Celebration',
        image: '/images/special-custom-design/custom-basket/04.webp',
        features: [
          { label: 'Curated Import Gourmet', type: 'vip' },
          { label: 'Custom Brand Palette', type: 'brand' },
        ],
      },
      {
        id: 'basket-05',
        title: 'Royal Burgundy Velvet Basket',
        subtitle: 'กระเช้าบุผ้ากำมะหยี่สีแดงเบอร์กันดีสำหรับลูกค้า VIP',
        categoryTag: 'Velvet Prestige Collection',
        image: '/images/special-custom-design/custom-basket/05.webp',
        features: [
          { label: 'Plush Velvet Lining', type: 'craft' },
          { label: 'Executive Gift Card', type: 'brand' },
        ],
      },
    ],
  },
  {
    id: 'merchandise',
    name: 'งานออกแบบสินค้าพรีเมียม',
    subtitle: 'งานออกแบบสินค้าพรีเมียม ดีไซน์เฉพาะแบรนด์',
    title: 'Bespoke Merchandise & Collabs',
    description:
      'ออกแบบและผลิตสินค้าพรีเมียมเฉพาะแบรนด์ งานคอลแลปส์ร่วมสมัย และของที่ระลึกที่สะท้อนภาพลักษณ์ความพิถีพิถันขององค์กรสู่ผู้รับ',
    items: [
      {
        id: 'merch-01',
        title: 'PDM Beyond × Giftory Collaboration',
        subtitle: 'คอลเลกชันผ้าทอและลวดลายกราฟิกดีไซน์ร่วมสมัย',
        categoryTag: 'Special Collaboration',
        image: '/images/special-custom-design/custom-gift/01.webp',
        features: [
          { label: 'Exclusive Motif Design', type: 'craft' },
          { label: 'PDM Design HQ Collab', type: 'brand' },
          { label: 'Limited Edition Box', type: 'vip' },
        ],
      },
      {
        id: 'merch-02',
        title: 'PDM Weekend Mat Basket Collection',
        subtitle: 'กระเช้า 2-in-1 กางเป็นเสื่อปิกนิกดีไซน์พิเศษ',
        categoryTag: 'Innovative Lifestyle',
        image: '/images/pdm-kaiku/lifestyle.webp',
        features: [
          { label: '2-in-1 Foldable Design', type: 'craft' },
          { label: 'Weather-Proof Fabric', type: 'vip' },
        ],
      },
      {
        id: 'merch-03',
        title: 'Signature Woven Brand Label Detail',
        subtitle: 'งานป้ายทอและรายละเอียดอัตลักษณ์เฉพาะองค์กร',
        categoryTag: 'Brand Label Artisan',
        image: '/images/pdm-kaiku/woven-label.webp',
        features: [
          { label: 'High-Density Woven Label', type: 'brand' },
          { label: 'Precision Stitching', type: 'craft' },
        ],
      },
      {
        id: 'merch-04',
        title: 'Tailored Stainless Tumbler Set',
        subtitle: 'แก้วสแตนเลสเก็บความเย็นสลักเลเซอร์เฉพาะองค์กร',
        categoryTag: 'Corporate Merchandise',
        image: '/images/special-custom-design/custom-gift/04.webp',
        features: [
          { label: 'Laser-Etched Logo', type: 'brand' },
          { label: 'Double-Wall Vacuum', type: 'vip' },
        ],
      },
      {
        id: 'merch-05',
        title: 'Custom Canvas & Tote Presentation',
        subtitle: 'กระเป๋าผ้าแคนวาสสั่งทอหนาพิเศษพร้อมแถบชื่อองค์กร',
        categoryTag: 'Sustainable Premium',
        image: '/images/special-custom-design/custom-gift/05.webp',
        features: [
          { label: 'Eco-Friendly Canvas', type: 'craft' },
          { label: 'Screen Printed Identity', type: 'brand' },
        ],
      },
    ],
  },
  {
    id: 'corporate-sets',
    name: 'งานเซตองค์กร',
    subtitle: 'งานเซตของขวัญองค์กร บรรจุภัณฑ์สั่งทำพิเศษ',
    title: 'Corporate Gift Box Sets',
    description:
      'ชุดของขวัญ Presentation Box Set จัดเซตตามงบประมาณ พร้อมการ์ดอวยพรและบรรจุภัณฑ์ที่ออกแบบเฉพาะสำหรับมอบแด่ลูกค้า VIP และพันธมิตรทางธุรกิจ',
    items: [
      {
        id: 'set-01',
        title: 'The Artisanal Presentation Box Set',
        subtitle: 'กล่องของขวัญพรีเมียมพร้อมการ์ดข้อความเฉพาะบุคคล',
        categoryTag: 'Bespoke Box Set',
        image: '/images/special-custom-design/custom-gift/11.webp',
        features: [
          { label: 'Rigid Gift Box Packaging', type: 'craft' },
          { label: 'Calligraphy Card', type: 'brand' },
          { label: 'Custom Colorway', type: 'vip' },
        ],
      },
      {
        id: 'set-02',
        title: 'VIP Appreciation Curated Gift Set',
        subtitle: 'เซตของขวัญคัดสรรไอเทมระดับลักชัวรีสำหรับผู้ใหญ่',
        categoryTag: 'Executive VIP Curation',
        image: '/images/special-custom-design/custom-gift/08.webp',
        features: [
          { label: 'Fine Gourmet Selection', type: 'vip' },
          { label: 'Hot-Stamp Gold Foil', type: 'brand' },
        ],
      },
      {
        id: 'set-03',
        title: 'Executive Wellness & Gourmet Set',
        subtitle: 'เซตของขวัญสุขภาพและกูร์เมต์นำเข้าคัดพิเศษ',
        categoryTag: 'Wellness & Gourmet',
        image: '/images/special-custom-design/custom-gift/09.webp',
        features: [
          { label: 'Organic Artisan Tea', type: 'vip' },
          { label: 'Silk Ribbon Bow', type: 'craft' },
        ],
      },
      {
        id: 'set-04',
        title: 'Signature Corporate Welcome Partner Kit',
        subtitle: 'ชุดของขวัญต้อนรับผู้บริหารและพันธมิตรธุรกิจ',
        categoryTag: 'Business Welcome Kit',
        image: '/images/special-custom-design/custom-gift/06.webp',
        features: [
          { label: 'Custom Foam Insert', type: 'craft' },
          { label: 'Welcome Note Card', type: 'brand' },
        ],
      },
      {
        id: 'set-05',
        title: 'Year-End Celebration Privilege Box',
        subtitle: 'เซตของขวัญขอบคุณส่งท้ายปีสำหรับกลุ่มลูกค้าองค์กร',
        categoryTag: 'Privilege Year-End',
        image: '/images/special-custom-design/custom-gift/07.webp',
        features: [
          { label: 'Metallic Foil Sleeve', type: 'brand' },
          { label: 'Curated Luxury Mix', type: 'vip' },
        ],
      },
    ],
  },
  {
    id: 'accessories',
    name: 'สินค้าพรีเมียมเพิ่มเติม',
    subtitle: 'สินค้าและกิมมิคพรีเมียมเพิ่มเติม เติมเต็มทุกดีเทล',
    title: 'Premium Accessories & Details',
    description:
      'รายละเอียดที่สร้างความประทับใจไม่รู้ลืม ริบบิ้นทอพิเศษปักชื่อแบรนด์ ป้ายแท็กโลหะสลักชื่อ และการ์ดข้อความปั๊มฟอยล์ทองแท้',
    items: [
      {
        id: 'acc-01',
        title: 'Signature Embroidered Ribbon Detail',
        subtitle: 'ริบบิ้นทอเนื้อดีพร้อมงานปักชื่อและตราสัญลักษณ์แบรนด์',
        categoryTag: 'Custom Ribbon',
        image: '/images/IDENTITY_SERVICE/01.webp',
        features: [
          { label: 'Silk Satin Ribbon', type: 'craft' },
          { label: 'Gold / Silver Thread', type: 'brand' },
          { label: 'Pantone Matched', type: 'vip' },
        ],
      },
      {
        id: 'acc-02',
        title: 'Bespoke Engraved Metal Brand Tag',
        subtitle: 'ป้ายแท็กโลหะสีทองและสีเงินรมดำสลักชื่อเฉพาะ',
        categoryTag: 'Metallic Identity Tag',
        image: '/images/IDENTITY_SERVICE/04.webp',
        features: [
          { label: 'Brushed Brass Metal', type: 'craft' },
          { label: 'Engraved Monogram', type: 'brand' },
        ],
      },
      {
        id: 'acc-03',
        title: 'Handcrafted Artisan Signature Bow',
        subtitle: 'โบว์ริบบิ้นผูกมือด้วยความประณีตทุกชิ้น',
        categoryTag: 'Artisan Bow',
        image: '/images/shop-all-basket/bow.webp',
        features: [
          { label: 'Hand-Tied Perfection', type: 'craft' },
          { label: 'Multi-Layer Ribbon', type: 'vip' },
        ],
      },
      {
        id: 'acc-04',
        title: 'Foil-Stamped Velvet Touch Greeting Card',
        subtitle: 'การ์ดอวยพรสัมผัสกำมะหยี่ปั๊มฟอยล์ทองแท้',
        categoryTag: 'Stationery & Greeting',
        image: '/images/IDENTITY_SERVICE/07.webp',
        features: [
          { label: '350gsm Soft-Touch', type: 'craft' },
          { label: 'Hot Foil Stamping', type: 'brand' },
        ],
      },
      {
        id: 'acc-05',
        title: 'Custom Fabric Drawstring Bag Detail',
        subtitle: 'ถุงผ้ากำมะหยี่และถุงหูรูดพร้อมป้ายโลโก้เฉพาะ',
        categoryTag: 'Velvet Packaging',
        image: '/images/shop-all-basket/bow-bag.webp',
        features: [
          { label: 'Premium Velvet Cloth', type: 'craft' },
          { label: 'Gold Metallic Drawstring', type: 'vip' },
        ],
      },
    ],
  },
];

type CustomGiftCategoryCoverflowProps = {
  onSelectItem: (item: CoverflowItem, allCategoryItems: CoverflowItem[], index: number) => void;
};

const CustomGiftCategoryCoverflow = ({
  onSelectItem,
}: CustomGiftCategoryCoverflowProps) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const currentCategory = SHOWCASE_CATEGORIES[activeCategoryIndex];
  const items = currentCategory.items;
  const totalItems = items.length;

  const handlePrev = useCallback(() => {
    setActiveSlideIndex(prev => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const handleNext = useCallback(() => {
    setActiveSlideIndex(prev => (prev + 1) % totalItems);
  }, [totalItems]);

  const handleSelectCategory = (index: number) => {
    setActiveCategoryIndex(index);
    setActiveSlideIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = event.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section className="relative overflow-hidden border-b border-shadow-black/10 bg-gradient-to-b from-[#FAF8F5] via-white to-[#F5F2EB] py-16 md:py-24">
      {/* Subtle Ambient Glow Effect Behind Cards */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-beige/25 via-maroon/5 to-beige/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-8">
        {/* Editorial Header (Matching Giftory Category Showcase Typography) */}
        <div className="mb-12 grid grid-cols-1 items-start gap-6 border-b border-shadow-black/10 pb-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7 lg:col-span-8">
            <p className="text-xs font-light tracking-wider text-maroon sm:text-sm">
              {currentCategory.subtitle}
            </p>

            <h2 className="mt-1 text-2xl font-light tracking-wide text-shadow-black sm:text-3xl lg:text-4xl">
              {currentCategory.title}
            </h2>

            <div className="mt-3 h-[2px] w-12 bg-maroon" />

            <p className="mt-4 text-xs font-light leading-relaxed text-shadow-black/75 sm:text-sm md:text-base">
              {currentCategory.description}
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 md:col-span-5 md:items-end md:text-right lg:col-span-4 md:pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-maroon bg-white px-6 py-2.5 text-xs font-light tracking-wider text-maroon shadow-xs transition-all duration-300 hover:bg-maroon hover:text-white"
            >
              <span>ปรึกษาทีมงานออกแบบ</span>
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>

        {/* 5-Card 3D Overlapping Coverflow Showcase Container */}
        <div
          className="relative mx-auto flex h-[440px] w-full max-w-6xl items-center justify-center overflow-visible sm:h-[490px] md:h-[550px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((item, index) => {
            let offset = index - activeSlideIndex;
            if (offset > totalItems / 2) offset -= totalItems;
            if (offset < -totalItems / 2) offset += totalItems;

            const isCenter = offset === 0;
            const isLeft1 = offset === -1 || (offset < 0 && Math.abs(offset) === 1);
            const isRight1 = offset === 1 || (offset > 0 && Math.abs(offset) === 1);
            const isLeft2 = offset === -2 || (offset < 0 && Math.abs(offset) === 2);
            const isRight2 = offset === 2 || (offset > 0 && Math.abs(offset) === 2);

            const isVisible = isCenter || isLeft1 || isRight1 || isLeft2 || isRight2;
            if (!isVisible) return null;

            // Positioning & 3D Layering matching the Reference
            let transformClass = '';
            let zIndex = 10;
            let opacityClass = 'opacity-100';

            if (isCenter) {
              transformClass = 'translate-x-0 scale-100';
              zIndex = 30;
              opacityClass = 'opacity-100 shadow-[0_30px_70px_rgba(16,12,8,0.25)]';
            } else if (isLeft1) {
              transformClass =
                '-translate-x-[55%] sm:-translate-x-[64%] md:-translate-x-[72%] scale-[0.88] translate-y-3';
              zIndex = 20;
              opacityClass = 'opacity-85 shadow-xl hover:opacity-100 cursor-pointer';
            } else if (isRight1) {
              transformClass =
                'translate-x-[55%] sm:translate-x-[64%] md:translate-x-[72%] scale-[0.88] translate-y-3';
              zIndex = 20;
              opacityClass = 'opacity-85 shadow-xl hover:opacity-100 cursor-pointer';
            } else if (isLeft2) {
              transformClass =
                '-translate-x-[100%] sm:-translate-x-[118%] md:-translate-x-[135%] scale-[0.76] translate-y-6';
              zIndex = 10;
              opacityClass = 'opacity-50 shadow-md hover:opacity-80 cursor-pointer';
            } else if (isRight2) {
              transformClass =
                'translate-x-[100%] sm:translate-x-[118%] md:translate-x-[135%] scale-[0.76] translate-y-6';
              zIndex = 10;
              opacityClass = 'opacity-50 shadow-md hover:opacity-80 cursor-pointer';
            }

            return (
              <div
                key={item.id}
                style={{ zIndex }}
                onClick={() => {
                  if (isCenter) {
                    onSelectItem(item, items, index);
                  } else if (isLeft1 || isLeft2) {
                    handlePrev();
                  } else if (isRight1 || isRight2) {
                    handleNext();
                  }
                }}
                className={`absolute top-0 flex h-[440px] w-[270px] flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-shadow-black transition-all duration-500 ease-out sm:h-[490px] sm:w-[320px] md:h-[550px] md:w-[360px] ${transformClass} ${opacityClass} select-none`}
              >
                {/* Background Image Artwork */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority={isCenter}
                  sizes="(min-width: 768px) 360px, 270px"
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                />

                {/* Dark Vignette Overlay for High-Tech Glass Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-shadow-black/95 via-shadow-black/35 to-shadow-black/40" />

                {/* Top Glass Header Row (Icon Chip + Action Circle) */}
                <div className="relative z-10 flex items-center justify-between p-4 sm:p-5">
                  {/* Top-Left Glass Pill (Category Badge) */}
                  <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-shadow-black/40 px-3 py-1.5 backdrop-blur-md">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-beige"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    </svg>
                    <span className="max-w-[150px] truncate text-[11px] font-light tracking-wide text-white sm:max-w-[190px]">
                      {item.categoryTag}
                    </span>
                  </div>

                  {/* Top-Right Glass Arrow Up-Right ↗ */}
                  <div
                    aria-label="View detail"
                    className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-shadow-black/40 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-beige hover:text-beige sm:size-9"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </div>

                {/* Center Floating Glass Chips (Only on Center Card - Like the AP Reference) */}
                {isCenter ? (
                  <div className="relative z-10 flex flex-col items-center gap-2.5 px-4 py-2">
                    {item.features.map(feat => (
                      <div
                        key={feat.label}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-shadow-black/40 px-3.5 py-1.5 shadow-md backdrop-blur-md transition-all duration-300 hover:bg-shadow-black/60 hover:border-beige/50"
                      >
                        <div className="flex size-4 items-center justify-center text-beige">
                          {feat.type === 'craft' && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          )}
                          {feat.type === 'brand' && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                            </svg>
                          )}
                          {feat.type === 'vip' && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[11px] font-light tracking-wide text-white">
                          {feat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-10" />
                )}

                {/* Bottom Information Glass Banner */}
                <div className="relative z-10 p-5 pb-9 text-white sm:p-6 sm:pb-11">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-light uppercase tracking-widest text-beige">
                        Work {String(index + 1).padStart(2, '0')} / {String(totalItems).padStart(2, '0')}
                      </span>
                      <h3 className="mt-1 line-clamp-1 text-base font-light tracking-wide sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs font-extralight text-white/80">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Bottom-Right Luxury Emblem */}
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-shadow-black/40 text-beige backdrop-blur-md">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="21 8 21 21 3 21 3 8" />
                        <rect x="1" y="3" width="22" height="5" />
                        <line x1="10" y1="12" x2="14" y2="12" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Left Navigation Arrow Floating Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous showcase card"
            className="absolute left-2 z-40 flex size-11 items-center justify-center rounded-full border border-shadow-black/10 bg-white text-shadow-black shadow-xl transition-all duration-200 hover:scale-105 hover:bg-maroon hover:text-white sm:left-6 sm:size-12 md:left-8"
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
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Right Navigation Arrow Floating Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next showcase card"
            className="absolute right-2 z-40 flex size-11 items-center justify-center rounded-full border border-shadow-black/10 bg-white text-shadow-black shadow-xl transition-all duration-200 hover:scale-105 hover:bg-maroon hover:text-white sm:right-6 sm:size-12 md:right-8"
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
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* 4 Bottom Pill Segmented Tabs (Overlapping the bottom edge of cards - Matching Reference) */}
        <div className="relative z-40 -mt-6 flex justify-center px-4 sm:-mt-8">
          <div className="inline-flex max-w-full flex-wrap items-center justify-center rounded-full border border-white/50 bg-[#E5E5EA]/90 p-1.5 shadow-lg backdrop-blur-md sm:gap-1">
            {SHOWCASE_CATEGORIES.map((cat, idx) => {
              const isActive = idx === activeCategoryIndex;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(idx)}
                  className={`rounded-full px-4 py-2 text-xs tracking-wide transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-sm ${
                    isActive
                      ? 'border border-black/5 bg-white font-medium text-maroon shadow-md'
                      : 'font-light text-shadow-black/75 hover:text-shadow-black'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomGiftCategoryCoverflow;
