'use client';

import { useMemo, useRef, useState } from 'react';
import { OutlineButton } from '@/components/buttons';
import { ProductCard } from '@/components/cards';
import type { CatalogCategorySection, CatalogProduct } from '@/lib/catalog';
import { cn } from '@/utils';

type BasketsPageClientProps = {
  sections: CatalogCategorySection[];
};

type SortMode = 'default' | 'price-asc' | 'price-desc';

const sortProducts = (products: CatalogProduct[], mode: SortMode) => {
  if (mode === 'default') return products;

  return [...products].sort((a, b) => {
    const priceA = a.price ?? Number.MAX_SAFE_INTEGER;
    const priceB = b.price ?? Number.MAX_SAFE_INTEGER;
    return mode === 'price-asc' ? priceA - priceB : priceB - priceA;
  });
};

const BasketsPageClient = ({ sections }: BasketsPageClientProps) => {
  const sectionRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('default');

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return sections
      .map(section => {
        const matched = q
          ? section.products.filter(
              item =>
                item.title.toLowerCase().includes(q) ||
                item.details.toLowerCase().includes(q) ||
                section.name.toLowerCase().includes(q)
            )
          : section.products;

        return {
          ...section,
          products: sortProducts(matched, sortMode),
        };
      })
      .filter(section => section.products.length > 0);
  }, [sections, searchQuery, sortMode]);

  const totalCount = useMemo(
    () => filteredSections.reduce((sum, s) => sum + s.products.length, 0),
    [filteredSections]
  );

  return (
    <div className="min-h-[calc(100dvh-290px)]">
      <div className="flex flex-col gap-4 px-4 pt-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex flex-wrap justify-center gap-3 md:justify-start">
          {sections.map(section => (
            <OutlineButton
              key={section.id}
              color="primary"
              size="lg"
              onClick={() =>
                sectionRefs.current[section.id]?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }
            >
              {section.name}
            </OutlineButton>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search baskets..."
              aria-label="Search baskets"
              className="w-full border border-shadow-black/20 bg-white px-3.5 py-2 text-sm font-light outline-none transition-colors focus:border-maroon sm:w-56"
            />
          </div>
          <select
            value={sortMode}
            onChange={e => setSortMode(e.target.value as SortMode)}
            aria-label="Sort baskets"
            className="border border-shadow-black/20 bg-white px-3 py-2 text-sm font-light outline-none transition-colors focus:border-maroon"
          >
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {searchQuery.trim() && (
        <div className="mt-4 flex items-center justify-between px-4 text-sm font-light text-shadow-black/65 md:px-8">
          <span>
            Found {totalCount} {totalCount === 1 ? 'basket' : 'baskets'} for &ldquo;{searchQuery.trim()}&rdquo;
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSortMode('default');
            }}
            className="text-maroon underline underline-offset-4"
          >
            Clear filter
          </button>
        </div>
      )}

      {filteredSections.length === 0 ? (
        <div className="mx-auto my-16 max-w-md px-4 text-center">
          <p className="text-lg font-light text-shadow-black">No baskets matched your search.</p>
          <p className="mt-2 text-sm font-light text-shadow-black/60">
            Try a different keyword or reset the filter to browse all collections.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSortMode('default');
            }}
            className="mt-5 border border-maroon px-5 py-2 text-sm font-light text-maroon hover:bg-maroon hover:text-main-white"
          >
            Show All Baskets
          </button>
        </div>
      ) : (
        filteredSections.map((section, index) => {
          const isSpecialCustomDesign = section.slug === 'special-custom-design';

          return (
            <section
              key={section.id}
              className={index === filteredSections.length - 1 ? 'mb-4' : undefined}
            >
              <div className="flex h-fit w-full flex-col px-4 py-8 pb-[30px] md:px-8 md:py-10 lg:py-12 xl:py-14">
                <h1
                  ref={element => {
                    sectionRefs.current[section.id] = element;
                  }}
                  id={section.slug}
                  className="mb-2 scroll-mt-20 text-lg font-extralight leading-tight tracking-wide md:text-xl xl:text-2xl"
                >
                  {section.name}
                </h1>
                <div className="mt-4 h-[2px] w-12 bg-maroon md:w-16" />
              </div>
              <div
                className={cn(
                  'grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6',
                  index === filteredSections.length - 1 && 'mb-4'
                )}
              >
                {section.products.map(basket => (
                  <ProductCard
                    key={basket.id}
                    {...basket}
                    className={isSpecialCustomDesign && 'relative place-items-baseline bg-maroon'}
                    imageClassName={
                      isSpecialCustomDesign ? basket.imageClassName || 'abs' : basket.imageClassName
                    }
                    defaultBackground={isSpecialCustomDesign}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
};

export default BasketsPageClient;
