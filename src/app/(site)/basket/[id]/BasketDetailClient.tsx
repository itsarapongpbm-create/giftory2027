'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useSiteConfig } from '@/app/_components/SiteConfigContext';
import { OutlineButton } from '@/components/buttons';
import { ProductCard } from '@/components/cards';
import ProductDetailsList from '@/components/products/ProductDetailsList';
import type { CatalogGalleryImage, CatalogProduct } from '@/lib/catalog';
import { cn } from '@/utils/className';
import { formatPrice } from '@/utils/string';

type BasketDetailClientProps = {
  product: {
    id: string;
    title: string;
    price?: number;
    image: string;
    details: React.ReactNode;
    categorySlug?: string;
    categoryName?: string;
    galleryImages?: CatalogGalleryImage[];
    gridStyle?: string;
    imageContainerClassName?: string;
  };
  relatedProducts?: CatalogProduct[];
};

const BasketDetailClient = ({ product, relatedProducts = [] }: BasketDetailClientProps) => {
  const { lineLink } = useSiteConfig();
  const priceFormat = formatPrice(product.price || 0);

  const allImages = [
    { id: 'main', url: product.image, alt: product.title },
    ...(product.galleryImages || []).map(img => ({
      id: img.id,
      url: img.url,
      alt: img.alt || product.title,
    })),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = allImages[activeIndex] || allImages[0];
  const hasGallery = allImages.length > 1;

  const handleBuyClick = () => {
    const message = encodeURIComponent(
      `Hi, I would like to know more about "${product.title}" at price ฿${priceFormat}`
    );
    window.open(`${lineLink}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const showPrev = () => setActiveIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  const showNext = () => setActiveIndex(prev => (prev + 1) % allImages.length);

  return (
    <div className="mb-4 min-h-[calc(100dvh-380px)] bg-maroon px-3 py-8 sm:px-6 md:px-8 md:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-2 text-xs font-light text-main-white/80 sm:text-sm"
        >
          <Link href="/" className="hover:text-main-white hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link href="/baskets" className="hover:text-main-white hover:underline">
            Baskets
          </Link>
          {product.categoryName && product.categorySlug && (
            <>
              <span>/</span>
              <Link
                href={`/baskets/${product.categorySlug}`}
                className="hover:text-main-white hover:underline"
              >
                {product.categoryName}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-main-white">{product.title}</span>
        </nav>

        <div className="shadow-card-light overflow-hidden rounded-none bg-main-white">
          <div className={cn('grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-6', product.gridStyle)}>
            <div
              className={cn(
                'flex flex-col items-center justify-center bg-white p-4 sm:p-6',
                product.imageContainerClassName
              )}
            >
              <div className="group relative mx-auto w-full max-w-[480px] overflow-hidden">
                <Image
                  key={activeImage.url}
                  src={activeImage.url}
                  alt={activeImage.alt}
                  width={800}
                  height={800}
                  className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 40vw, 90vw"
                  priority
                />
                {hasGallery && (
                  <>
                    <button
                      type="button"
                      onClick={showPrev}
                      aria-label="Previous photo"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/85 px-2.5 py-1.5 text-sm text-shadow-black shadow transition-colors hover:bg-maroon hover:text-white"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      aria-label="Next photo"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/85 px-2.5 py-1.5 text-sm text-shadow-black shadow transition-colors hover:bg-maroon hover:text-white"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {hasGallery && (
                <div className="mt-4 flex w-full max-w-[480px] gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`View photo ${idx + 1}`}
                      className={cn(
                        'relative size-16 shrink-0 overflow-hidden border-2 bg-main-white transition-all',
                        idx === activeIndex
                          ? 'border-maroon opacity-100'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      )}
                    >
                      <Image src={img.url} alt={img.alt} fill sizes="64px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center p-4 text-shadow-black sm:p-6 md:p-8">
              <div className="mb-4 sm:mb-6">
                {product.categoryName && (
                  <p className="mb-1 text-xs font-light uppercase tracking-wider text-maroon/80">
                    {product.categoryName}
                  </p>
                )}
                <h1 className="mb-2 text-base font-light leading-tight tracking-wide sm:text-lg md:text-xl lg:text-2xl">
                  {product.title}
                </h1>
                <div className="mt-3 h-[2px] w-12 bg-maroon sm:w-14" />
              </div>

              <div className="mb-6 sm:mb-8">
                <h3 className="mb-3 text-sm font-light text-maroon sm:mb-4 sm:text-base md:text-lg">
                  What&apos;s Inside
                </h3>
                <div className="space-y-1 text-[11px] font-light leading-relaxed text-shadow-black/80 sm:text-sm md:text-base">
                  <ProductDetailsList details={product.details} />
                </div>
              </div>

              {product.price ? (
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span className="text-lg font-light text-maroon sm:text-xl md:text-2xl lg:text-3xl">
                      ฿{priceFormat}
                    </span>
                    <span className="text-[11px] font-light text-shadow-black/60 sm:text-sm">
                      THB
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                <OutlineButton
                  color="primary"
                  size="lg"
                  onClick={handleBuyClick}
                  className="w-full text-sm font-light tracking-wide sm:w-[260px] sm:text-base md:w-[300px]"
                >
                  Order via Line
                </OutlineButton>
                <p className="mt-2 text-[11px] font-light text-shadow-black/60 sm:text-xs md:text-sm">
                  Free consultation • Custom arrangements available
                </p>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-extralight tracking-wide text-main-white md:text-xl">
                You May Also Like
              </h2>
              <Link
                href="/baskets"
                className="text-xs font-light text-main-white/80 underline-offset-4 hover:text-main-white hover:underline sm:text-sm"
              >
                View all baskets →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map(item => (
                <ProductCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-center sm:mt-12">
          <div className="h-[1px] w-24 bg-main-white/30" />
        </div>
      </div>
    </div>
  );
};

export default BasketDetailClient;
