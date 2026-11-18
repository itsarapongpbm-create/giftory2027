import Link from 'next/link';
import Image from 'next/image';
import Topic from './Topic';
import { getAllPublishedProducts, type CatalogProduct } from '@/lib/catalog';
import { getPdmKaikuSettings } from '@/lib/siteSettings';
import { formatPrice } from '@/utils/string';

const resolveFeaturedProducts = (
  selectedSlugs: string[],
  allProducts: CatalogProduct[]
): CatalogProduct[] => {
  const bySlug = new Map(allProducts.map(product => [product.id, product]));
  const picked: CatalogProduct[] = [];
  const used = new Set<string>();

  for (const slug of selectedSlugs) {
    const found = bySlug.get(slug);
    if (found && !used.has(found.id)) {
      picked.push(found);
      used.add(found.id);
    }
    if (picked.length === 2) break;
  }

  for (const product of allProducts) {
    if (picked.length === 2) break;
    if (!used.has(product.id)) {
      picked.push(product);
      used.add(product.id);
    }
  }

  return picked;
};

const PdmKaikuSection = async () => {
  const [settings, allProducts] = await Promise.all([
    getPdmKaikuSettings(),
    getAllPublishedProducts(),
  ]);

  const featuredProducts = resolveFeaturedProducts(settings.productSlugs, allProducts);

  return (
    <section aria-label={settings.title}>
      <Topic title={settings.title} />

      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Story Panel (Top) + 2 Spec Diagrams (Bottom) */}
          <div className="flex flex-col overflow-hidden border border-shadow-black/10 bg-white lg:col-span-5">
            {/* Story Header */}
            <div className="border-b border-shadow-black/10 bg-beige/25 p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-normal uppercase tracking-[0.2em] text-maroon">
                  {settings.subtitle}
                </p>
                <Link
                  href="/baskets"
                  className="inline-flex items-center gap-1.5 text-xs font-light tracking-wide text-maroon underline-offset-4 hover:underline"
                >
                  <span>Explore</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <p className="mt-3 text-sm font-light leading-relaxed text-shadow-black/80 sm:text-[15px]">
                {settings.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="border border-shadow-black/15 bg-main-white/85 px-2.5 py-1 text-xs font-light tracking-wide text-shadow-black/80">
                  2-in-1 Basket &amp; Mat
                </span>
                <span className="border border-shadow-black/15 bg-main-white/85 px-2.5 py-1 text-xs font-light tracking-wide text-shadow-black/80">
                  80 × 60 cm
                </span>
                <span className="border border-shadow-black/15 bg-main-white/85 px-2.5 py-1 text-xs font-light tracking-wide text-shadow-black/80">
                  Reusable
                </span>
              </div>
            </div>

            {/* 2 Spec Diagrams Side by Side */}
            <div className="grid flex-1 grid-cols-2 bg-white">
              {/* Woven Label Detail */}
              <div className="flex flex-col border-r border-shadow-black/10">
                <div className="relative min-h-[210px] flex-1 sm:min-h-[250px] lg:min-h-[270px]">
                  <div className="absolute inset-3 sm:inset-5">
                    <Image
                      src={settings.labelImage}
                      alt={settings.labelAlt}
                      fill
                      sizes="(min-width: 1600px) 320px, (min-width: 1024px) 20vw, 48vw"
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="border-t border-shadow-black/10 px-3 py-2.5 text-center">
                  <p className="text-xs font-light tracking-wide text-shadow-black/75">
                    Woven Label · giftory × PDM
                  </p>
                </div>
              </div>

              {/* 2-in-1 Unfold Spec */}
              <div className="flex flex-col">
                <div className="relative min-h-[210px] flex-1 sm:min-h-[250px] lg:min-h-[270px]">
                  <div className="absolute inset-3 sm:inset-4">
                    <Image
                      src={settings.unfoldImage}
                      alt={settings.unfoldAlt}
                      fill
                      sizes="(min-width: 1600px) 320px, (min-width: 1024px) 20vw, 48vw"
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="border-t border-shadow-black/10 px-3 py-2.5 text-center">
                  <p className="text-xs font-light tracking-wide text-shadow-black/75">
                    2-in-1 Mat · 80 × 60 cm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: 2 Large Featured Product Cards (Best Sellers Style) */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
            {featuredProducts.map((product, index) => {
              const priceFormat = product.price ? formatPrice(product.price) : undefined;
              return (
                <Link
                  key={`${product.id}-${index}`}
                  href={`/basket/${product.id}`}
                  className="hover:shadow-card group card relative aspect-[3/4] h-[380px] w-full cursor-pointer overflow-hidden rounded-none bg-shadow-black/10 shadow-sm sm:h-[430px] lg:aspect-auto lg:h-full lg:min-h-[500px]"
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1600px) 440px, (min-width: 1024px) 28vw, (min-width: 640px) 48vw, 96vw"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />

                  <div className="absolute left-0 top-0 bg-maroon px-3.5 py-1.5 text-xs font-light tracking-wider text-main-white">
                    PDM × giftory
                  </div>

                  <div className="absolute inset-0 flex items-end bg-shadow-black/25 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
                    <div className="card-body translate-y-0 transform bg-main-white/95 p-4 transition-transform duration-300 lg:translate-y-full lg:bg-main-white lg:p-6 lg:group-hover:translate-y-0">
                      <h3 className="card-title line-clamp-1 !text-base !font-extralight text-shadow-black lg:line-clamp-2 lg:!text-[20px]">
                        {product.title}
                      </h3>
                      {priceFormat && (
                        <p className="text-lg font-light text-maroon lg:text-2xl">
                          ฿ {priceFormat}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PdmKaikuSection;
