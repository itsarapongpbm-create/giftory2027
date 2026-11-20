import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/string';
import { cn } from '@/utils/className';
import ProductDetailsList from '@/components/products/ProductDetailsList';
import ProductDetailsPreview from '@/components/products/ProductDetailsPreview';

const ProductCard = ({
  image,
  cardImage,
  title,
  price,
  details,
  id,
  className,
  imageClassName,
  disabledLink,
  defaultBackground = false,
  onClick,
}: Product.ProductCardProps) => {
  const priceFormat = formatPrice(price || 0);

  const isCustomBasket = defaultBackground || Boolean(id?.startsWith('custom-'));

  const cardClassName = cn(
    'hover:shadow-card group card relative aspect-[2/3] max-h-[550px] w-full overflow-hidden rounded-none shadow-sm md:max-h-full',
    isCustomBasket ? 'bg-maroon place-items-baseline' : 'bg-white bg-opacity-70',
    !disabledLink && 'cursor-pointer',
    className
  );

  const content = (
    <>
      {isCustomBasket && (
        <Image
          src="/images/background-product-clean.webp"
          alt=""
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 30vw, 80vw"
          className="absolute inset-0 size-full scale-[1.04] object-cover object-top"
          priority={false}
        />
      )}
      <Image
        src={cardImage || image}
        alt={title || 'Product image'}
        fill
        sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 24vw, (min-width: 640px) 48vw, 90vw"
        className={cn(
          isCustomBasket
            ? cn('w-full', imageClassName || 'h-[90%] absolute bottom-0 object-contain')
            : cn('h-[calc(100%-90px)] w-full object-cover', imageClassName)
        )}
      />
      {(title || details) && (
        <div className="absolute inset-0 flex items-end transition-opacity duration-200 group-hover:bg-shadow-black/25">
          <div
            className={cn(
              'card-body translate-y-[calc(100%-90px)] transform overflow-y-auto bg-main-white transition-transform duration-200 group-hover:-translate-y-12 md:translate-y-[calc(100%-105px)]',
              typeof details === 'string' && details &&
                'mb-12 flex h-[calc(100%-48px)] min-h-0 flex-col gap-2 overflow-hidden p-6 translate-y-[calc(100%-42px)] group-hover:!translate-y-0 group-focus-visible:!translate-y-0 md:mb-14 md:h-[calc(100%-56px)] md:translate-y-[calc(100%-49px)] md:group-hover:!translate-y-0 md:group-focus-visible:!translate-y-0',
              !title && 'translate-y-[calc(100%-10px)] md:translate-y-[calc(100%-15px)]'
            )}
          >
            <h2 className="card-title line-clamp-2 shrink-0 break-words text-base !font-extralight text-shadow-black md:text-lg">
              {title}
            </h2>
            {typeof details === 'string' && details ? (
              <ProductDetailsPreview details={details} />
            ) : details && (
              <div className="text-xs font-extralight text-shadow-black md:text-sm">
                <ProductDetailsList details={details} />
              </div>
            )}
          </div>
        </div>
      )}
      {price && (
        <div className="absolute bottom-0 left-0 flex h-12 w-full items-center bg-main-white px-6 md:h-14">
          <p className="text-xl font-light text-maroon">฿ {priceFormat}</p>
        </div>
      )}
    </>
  );

  if (disabledLink) {
    return (
      <div className={cardClassName} onClick={() => onClick?.()}>
        {content}
      </div>
    );
  }

  return (
    <Link href={`/basket/${id}`} className={cardClassName} onClick={() => onClick?.()}>
      {content}
    </Link>
  );
};

export default ProductCard;
