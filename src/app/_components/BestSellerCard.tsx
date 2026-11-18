import Link from 'next/link';
import Image from 'next/image';
import { BestSellerBadge } from '@/components/icons';
import { formatPrice } from '@/utils/string';

type BestSellerCardProps = Product.BestSellerCardProps & {
  href?: string;
};

const BestSellerCard = ({
  image,
  title,
  price,
  details,
  isBestSeller = false,
  isEvenIem = false,
  href = '/baskets',
}: BestSellerCardProps) => {
  const badgeVariant = isEvenIem ? 'even' : 'odd';
  const priceFormat = price ? formatPrice(price) : undefined;

  return (
    <Link
      href={href}
      className="hover:shadow-card group card relative aspect-[3/4] h-[300px] w-full cursor-pointer overflow-hidden rounded-none bg-shadow-black bg-opacity-20 shadow-sm sm:h-[330px] md:h-[360px] lg:h-[390px]"
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 640px) 40vw, 90vw"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex items-end bg-shadow-black/25 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
        <div className="card-body translate-y-0 transform bg-main-white/95 p-4 transition-transform duration-300 lg:translate-y-full lg:bg-main-white lg:p-6 lg:group-hover:translate-y-0">
          <h2 className="card-title line-clamp-1 !text-base !font-extralight text-shadow-black lg:line-clamp-2 lg:!text-[20px]">
            {title}
          </h2>
          {details && (
            <div className="hidden text-sm font-extralight text-shadow-black lg:block">
              {details}
            </div>
          )}
          {priceFormat && (
            <p className="text-lg font-light text-maroon lg:text-2xl">฿ {priceFormat}</p>
          )}
        </div>
      </div>
      {isBestSeller && (
        <div className="absolute left-0 top-0">
          <BestSellerBadge variant={badgeVariant} width={100} height={36} />
        </div>
      )}
    </Link>
  );
};

export default BestSellerCard;
