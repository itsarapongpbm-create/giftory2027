'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/cards';
import type { CatalogProduct } from '@/lib/catalog';
import type { CategoryShowcase } from '@/lib/siteSettings';

type CategoryProductsClientProps = {
  categorySlug: string;
  categoryName: string;
  showcase: CategoryShowcase;
  products: CatalogProduct[];
};

type SortMode = 'default' | 'price-asc' | 'price-desc';

const sortProducts = (items: CatalogProduct[], mode: SortMode) => {
  if (mode === 'default') return items;

  return [...items].sort((a, b) => {
    const priceA = a.price ?? Number.MAX_SAFE_INTEGER;
    const priceB = b.price ?? Number.MAX_SAFE_INTEGER;
    return mode === 'price-asc' ? priceA - priceB : priceB - priceA;
  });
};

export default function CategoryProductsClient({
  categorySlug,
  categoryName,
  showcase,
  products,
}: CategoryProductsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('default');

  const isSpecialCustomDesign = categorySlug === 'special-custom-design';

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const matched = q
      ? products.filter(
          item =>
            item.title.toLowerCase().includes(q) ||
            item.details.toLowerCase().includes(q)
        )
      : products;

    return sortProducts(matched, sortMode);
  }, [products, searchQuery, sortMode]);

  return (
    <div className="min-h-[calc(100dvh-290px)] bg-main-white pb-16">
      {/* Category Header */}
      <div className="border-b border-shadow-black/10 bg-white/75 py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex items-center gap-2 text-xs font-light tracking-wide text-shadow-black/50 sm:text-sm"
          >
            <Link href="/" className="transition-colors hover:text-maroon">
              Home
            </Link>
            <span className="text-shadow-black/25">/</span>
            <Link href="/baskets" className="transition-colors hover:text-maroon">
              Baskets
            </Link>
            <span className="text-shadow-black/25">/</span>
            <span className="font-normal text-maroon">{showcase.title || categoryName}</span>
          </nav>

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            {/* Title & Description */}
            <div className="max-w-2xl">
              {showcase.subtitle && (
                <p className="text-xs font-light uppercase tracking-widest text-maroon sm:text-sm">
                  {showcase.subtitle}
                </p>
              )}

              <h1 className="mt-1 text-2xl font-extralight tracking-wide text-shadow-black sm:text-3xl lg:text-4xl">
                {showcase.title || categoryName}
              </h1>

              <div className="mt-2.5 h-[2px] w-12 bg-maroon" />

              {showcase.description && (
                <p className="mt-2.5 text-xs font-light leading-relaxed text-shadow-black/70 sm:text-sm md:text-base">
                  {showcase.description}
                </p>
              )}
            </div>

            {/* Filter and Sort Bar */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              {/* Search with Magnifying Glass Icon */}
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-shadow-black/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาในหมวดนี้..."
                  aria-label="Search baskets in this category"
                  className="w-full border border-shadow-black/20 bg-white py-2 pl-9 pr-3 text-sm font-light outline-none transition-colors focus:border-maroon sm:w-56"
                />
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortMode}
                onChange={e => setSortMode(e.target.value as SortMode)}
                aria-label="Sort baskets"
                className="cursor-pointer border border-shadow-black/20 bg-white px-3 py-2 text-sm font-light outline-none transition-colors focus:border-maroon"
              >
                <option value="default">เรียงตาม: แนะนำ</option>
                <option value="price-asc">ราคา: น้อยไปมาก</option>
                <option value="price-desc">ราคา: มากไปน้อย</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {searchQuery.trim() && (
          <div className="mb-6 flex items-center justify-between text-sm font-light text-shadow-black/65">
            <span>
              พบ {filteredProducts.length} รายการสำหรับ &ldquo;{searchQuery.trim()}&rdquo;
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSortMode('default');
              }}
              className="text-maroon underline underline-offset-4"
            >
              ล้างตัวกรอง
            </button>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="mx-auto my-16 max-w-md px-4 text-center">
            <p className="text-lg font-light text-shadow-black">ไม่พบกระเช้าที่ตรงกับการค้นหา</p>
            <p className="mt-2 text-sm font-light text-shadow-black/60">
              ลองค้นหาด้วยคำอื่น หรือรีเซ็ตการค้นหาเพื่อดูสินค้าทั้งหมด
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSortMode('default');
              }}
              className="mt-5 border border-maroon px-5 py-2 text-sm font-light text-maroon transition-colors hover:bg-maroon hover:text-white"
            >
              แสดงสินค้าทั้งหมดในหมวดนี้
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredProducts.map(basket => (
              <ProductCard
                key={basket.id}
                {...basket}
                className={isSpecialCustomDesign ? 'relative place-items-baseline bg-maroon' : undefined}
                imageClassName={
                  isSpecialCustomDesign ? basket.imageClassName || 'abs' : basket.imageClassName
                }
                defaultBackground={isSpecialCustomDesign}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
