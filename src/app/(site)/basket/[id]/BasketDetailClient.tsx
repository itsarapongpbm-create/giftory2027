'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSiteConfig } from '@/app/_components/SiteConfigContext';
import { ProductCard } from '@/components/cards';
import { CartIcon, LineIcon } from '@/components/icons';
import ProductDetailsList from '@/components/products/ProductDetailsList';
import { useCart } from '@/context/CartContext';
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
  const router = useRouter();
  const { lineLink } = useSiteConfig();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const priceFormat = formatPrice(product.price || 0);

  const isSpecialCustom =
    product.categorySlug === 'special-custom-design' || product.id.startsWith('custom-');

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

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        categorySlug: product.categorySlug,
        categoryName: product.categoryName,
      },
      quantity,
      true
    );
  };

  const handleBuyNow = () => {
    addItem(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        categorySlug: product.categorySlug,
        categoryName: product.categoryName,
      },
      quantity,
      false
    );
    router.push('/checkout');
  };

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
                'relative flex flex-col items-center justify-center p-4 sm:p-6 min-h-[380px] sm:min-h-[460px] overflow-hidden',
                isSpecialCustom ? 'bg-maroon' : 'bg-white',
                product.imageContainerClassName
              )}
            >
              {isSpecialCustom && (
                <Image
                  src="/images/background-product-clean.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="absolute inset-0 size-full scale-[1.04] object-cover object-top"
                  priority={false}
                />
              )}
              <div className="group relative z-10 mx-auto flex w-full max-w-[480px] items-center justify-center overflow-hidden">
                <Image
                  key={activeImage.url}
                  src={activeImage.url}
                  alt={activeImage.alt}
                  width={800}
                  height={800}
                  className={cn(
                    'h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]',
                    isSpecialCustom ? 'max-h-[460px] object-contain drop-shadow-lg' : 'object-cover'
                  )}
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
                <div className="relative z-10 mt-4 flex w-full max-w-[480px] gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`View photo ${idx + 1}`}
                      className={cn(
                        'relative size-16 shrink-0 overflow-hidden border-2 transition-all',
                        isSpecialCustom ? 'bg-maroon/30' : 'bg-main-white',
                        idx === activeIndex
                          ? 'border-maroon opacity-100 ring-2 ring-maroon/50'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      )}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        sizes="64px"
                        className={isSpecialCustom ? 'object-contain p-1' : 'object-cover'}
                      />
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

                  {/* Quantity Stepper */}
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-xs font-light text-shadow-black/70">จำนวน:</span>
                    <div className="flex items-center border border-shadow-black/20 bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="px-3 py-1.5 text-xs text-shadow-black/70 transition-colors hover:bg-shadow-black/5"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-xs font-medium text-shadow-black">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="px-3 py-1.5 text-xs text-shadow-black/70 transition-colors hover:bg-shadow-black/5"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="space-y-3">
                {product.price ? (
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex flex-1 items-center justify-center gap-2 border border-maroon bg-maroon px-5 py-3 text-sm font-light tracking-wide text-white transition-all hover:bg-main hover:border-main"
                    >
                      <CartIcon className="size-4" />
                      <span>เพิ่มลงในตะกร้า</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex flex-1 items-center justify-center border border-shadow-black/30 bg-white px-5 py-3 text-sm font-light tracking-wide text-shadow-black transition-all hover:border-maroon hover:text-maroon"
                    >
                      สั่งซื้อทันที
                    </button>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleBuyClick}
                  className="flex w-full items-center justify-center gap-2 border border-[#06C755] bg-[#06C755]/10 px-5 py-2.5 text-xs font-light tracking-wide text-[#06C755] transition-colors hover:bg-[#06C755] hover:text-white"
                >
                  <LineIcon className="size-4 fill-current" />
                  <span>ปรึกษาจัดกระเช้า / สั่งผ่าน LINE</span>
                </button>

                {/* Gift Shop Guarantees */}
                <div className="mt-4 border-t border-shadow-black/10 pt-3 text-[11px] font-light text-shadow-black/70 space-y-1.5">
                  <p className="flex items-start gap-2">
                    <span className="text-maroon">•</span>
                    <span>แถมฟรีการ์ดอวยพร พิมพ์ข้อความและผูกริบบิ้นพรีเมียม</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-maroon">•</span>
                    <span>กำหนดวันจัดส่งล่วงหน้าได้ พร้อมจัดส่งด่วนทั่วกรุงเทพฯ และปริมณฑล</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-maroon">•</span>
                    <span>สามารถออกใบกำกับภาษีสำหรับนิติบุคคลและบุคคลธรรมดาได้</span>
                  </p>
                </div>
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
              {relatedProducts.map(item => {
                const itemIsCustom =
                  item.categorySlug === 'special-custom-design' ||
                  item.id.startsWith('custom-');
                return (
                  <ProductCard
                    key={item.id}
                    {...item}
                    defaultBackground={itemIsCustom}
                    className={itemIsCustom ? 'relative place-items-baseline bg-maroon' : undefined}
                    imageClassName={
                      itemIsCustom
                        ? item.imageClassName || 'w-full h-[90%] absolute bottom-0 object-contain'
                        : item.imageClassName
                    }
                  />
                );
              })}
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
