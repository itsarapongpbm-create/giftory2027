'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/cards';
import type { CatalogProduct } from '@/lib/catalog';
import type { CategoryShowcase } from '@/lib/siteSettings';
import { cn } from '@/utils';

type CategoryProductsClientProps = {
  categorySlug: string;
  categoryName: string;
  showcase: CategoryShowcase;
  products: CatalogProduct[];
};

type SortMode = 'default' | 'price-asc' | 'price-desc';

const SORT_OPTIONS: Array<{ value: SortMode; label: string }> = [
  { value: 'default', label: 'เรียงตาม: แนะนำ' },
  { value: 'price-asc', label: 'ราคา: น้อยไปมาก' },
  { value: 'price-desc', label: 'ราคา: มากไปน้อย' },
];

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
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const isSpecialCustomDesign = categorySlug === 'special-custom-design';

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!isSortOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSortOpen]);

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

  const currentSortLabel =
    SORT_OPTIONS.find(opt => opt.value === sortMode)?.label || 'เรียงตาม: แนะนำ';

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
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-shadow-black/40"
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
                  className="w-full rounded-full border border-shadow-black/15 bg-white py-2 pl-9 pr-8 text-sm font-light shadow-sm outline-none transition-all duration-200 placeholder:text-shadow-black/40 focus:border-maroon focus:ring-1 focus:ring-maroon/20 sm:w-60"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-shadow-black/40 transition-colors hover:text-maroon"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Custom Smooth Sort Dropdown */}
              <div ref={sortDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsSortOpen(prev => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                  className="inline-flex w-full items-center justify-between gap-3 rounded-full border border-shadow-black/15 bg-white px-4 py-2 text-sm font-light text-shadow-black shadow-sm transition-all duration-200 hover:border-maroon hover:bg-slate-50/50 sm:w-auto"
                >
                  <span>{currentSortLabel}</span>
                  <svg
                    className={cn(
                      'size-3.5 text-shadow-black/50 transition-transform duration-200',
                      isSortOpen && 'rotate-180 text-maroon'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isSortOpen && (
                  <div
                    role="listbox"
                    aria-label="Sort options"
                    className="absolute right-0 top-full z-40 mt-1.5 min-w-[190px] overflow-hidden rounded-xl border border-shadow-black/10 bg-white/95 p-1 shadow-xl backdrop-blur-md transition-all"
                  >
                    {SORT_OPTIONS.map(option => {
                      const isSelected = sortMode === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSortMode(option.value);
                            setIsSortOpen(false);
                          }}
                          className={cn(
                            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-light transition-colors',
                            isSelected
                              ? 'bg-maroon/10 font-normal text-maroon'
                              : 'text-shadow-black/80 hover:bg-maroon/5 hover:text-maroon'
                          )}
                        >
                          <span>{option.label}</span>
                          {isSelected && (
                            <svg
                              className="size-4 text-maroon"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
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
