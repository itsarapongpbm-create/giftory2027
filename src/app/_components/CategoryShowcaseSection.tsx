'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils';
import type { CatalogProduct } from '@/lib/catalog';
import type { CategoryShowcase } from '@/lib/siteSettings';
import CategoryProductCarousel from './CategoryProductCarousel';

type CategoryShowcaseSectionProps = {
  showcase: CategoryShowcase;
  products: CatalogProduct[];
  isReversed?: boolean;
};

export default function CategoryShowcaseSection({
  showcase,
  products,
  isReversed = false,
}: CategoryShowcaseSectionProps) {
  return (
    <section className="border-b border-shadow-black/10 py-10 last:border-b-0 md:py-16">
      {/* Top Banner (Story & Key Visual) */}
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column (Text & CTA) */}
        <div
          className={cn(
            'flex flex-col justify-center lg:col-span-6',
            isReversed && 'lg:order-2'
          )}
        >
          {showcase.subtitle && (
            <p className="text-xs font-light uppercase tracking-wider text-maroon sm:text-sm">
              {showcase.subtitle}
            </p>
          )}

          <h2 className="mt-1 text-2xl font-light tracking-wide text-shadow-black sm:text-3xl lg:text-4xl">
            {showcase.title}
          </h2>

          <div className="mt-3 h-[2px] w-12 bg-maroon" />

          <p className="mt-4 text-sm font-light leading-relaxed text-shadow-black/75 sm:text-base">
            {showcase.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={`/baskets/${showcase.slug}`}
              className="inline-flex items-center gap-2.5 rounded-full bg-shadow-black px-7 py-3 text-sm font-light tracking-wide text-main-white transition-all duration-200 hover:bg-maroon hover:shadow-md"
            >
              <span>เลือกดูสินค้า</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            {products.length > 0 && (
              <span className="text-xs font-light text-shadow-black/55 sm:text-sm">
                ทั้งหมด {products.length} รายการ
              </span>
            )}
          </div>
        </div>

        {/* Right Column (Hero / Key Visual Image) */}
        <div
          className={cn(
            'lg:col-span-6',
            isReversed && 'lg:order-1'
          )}
        >
          <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-shadow-black/10 bg-white/70 shadow-sm transition-all duration-300 hover:shadow-md sm:aspect-[16/10]">
            <Image
              src={showcase.coverImage}
              alt={showcase.coverAlt || showcase.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={false}
            />
          </div>
        </div>
      </div>

      {/* Bottom Carousel (Products Preview Slider) */}
      {products.length > 0 && (
        <div className="mt-8 md:mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-light uppercase tracking-wider text-shadow-black/60">
              สินค้าแนะนำในหมวดนี้
            </h3>
            <Link
              href={`/baskets/${showcase.slug}`}
              className="group inline-flex items-center gap-1 text-xs font-light text-maroon hover:underline sm:text-sm"
            >
              <span>ดูทั้งหมด ({products.length})</span>
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

          <CategoryProductCarousel products={products} categorySlug={showcase.slug} />
        </div>
      )}
    </section>
  );
}
