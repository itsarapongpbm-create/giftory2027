import Topic from './Topic';
import BestSellerCard from './BestSellerCard';
import BestSellerCarousel from './BestSellerCarousel';
import { getBestSellerProducts } from '@/lib/catalog';

const BestSeller = async () => {
  const bestSellerProducts = await getBestSellerProducts();

  if (bestSellerProducts.length === 0) {
    return null;
  }

  return (
    <>
      <Topic title="Best Sellers" />
      <BestSellerCarousel>
        {bestSellerProducts.map((product, index) => (
          <div className="w-[225px] shrink-0 snap-start sm:w-[247.5px] md:w-[270px] lg:w-[292.5px]" key={product.id}>
            <BestSellerCard
              image={product.image}
              title={product.title}
              price={product.price}
              isBestSeller
              isEvenIem={index % 2 === 0}
              href={`/basket/${product.id}`}
            />
          </div>
        ))}
      </BestSellerCarousel>
    </>
  );
};

export default BestSeller;
