import Topic from './Topic';
import BestSellerCarousel from './BestSellerCarousel';
import { getBestSellerProducts } from '@/lib/catalog';

const BestSeller = async () => {
  const bestSellerProducts = await getBestSellerProducts();

  if (bestSellerProducts.length === 0) {
    return null;
  }

  const items = bestSellerProducts.map(product => ({
    id: product.id,
    image: product.image,
    title: product.title,
    price: product.price,
  }));

  return (
    <>
      <Topic title="Best Sellers" />
      <BestSellerCarousel items={items} />
    </>
  );
};

export default BestSeller;
