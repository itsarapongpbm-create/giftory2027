import Topic from './Topic';
import NewArrivalsCarousel, { type NewArrivalItem } from './NewArrivalsCarousel';
import { getAllPublishedProducts, type CatalogProduct } from '@/lib/catalog';
import { getNewArrivalsSettings } from '@/lib/siteSettings';

const DEFAULT_FALLBACK_COUNT = 8;

const resolveNewArrivalProducts = (
  selectedSlugs: string[],
  allProducts: CatalogProduct[]
): NewArrivalItem[] => {
  if (selectedSlugs.length > 0) {
    const bySlug = new Map(allProducts.map(product => [product.id, product]));
    const picked: NewArrivalItem[] = [];
    const used = new Set<string>();

    for (const slug of selectedSlugs) {
      const found = bySlug.get(slug);
      if (found && !used.has(found.id)) {
        picked.push({
          id: found.id,
          image: found.image,
          title: found.title,
          price: found.price,
        });
        used.add(found.id);
      }
    }

    if (picked.length > 0) {
      return picked;
    }
  }

  return allProducts.slice(0, DEFAULT_FALLBACK_COUNT).map(product => ({
    id: product.id,
    image: product.image,
    title: product.title,
    price: product.price,
  }));
};

const NewArrivals = async () => {
  const [settings, allProducts] = await Promise.all([
    getNewArrivalsSettings(),
    getAllPublishedProducts(),
  ]);

  const items = resolveNewArrivalProducts(settings.productSlugs, allProducts);

  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-label={settings.title}>
      <Topic title={settings.title} />
      <NewArrivalsCarousel items={items} />
    </section>
  );
};

export default NewArrivals;
