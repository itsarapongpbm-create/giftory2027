'use client';

import type { CatalogCategorySection } from '@/lib/catalog';
import type { CategoryShowcase } from '@/lib/siteSettings';
import CategoryShowcaseSection from '@/app/_components/CategoryShowcaseSection';

type BasketsHubClientProps = {
  sections: CatalogCategorySection[];
  showcases: Record<string, CategoryShowcase>;
};

export default function BasketsHubClient({ sections, showcases }: BasketsHubClientProps) {
  return (
    <div className="min-h-[calc(100dvh-290px)] bg-main-white pb-16 pt-4 md:pt-8">
      {/* Category Showcases Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {sections.map((section, index) => {
          const showcase = showcases[section.slug] || {
            slug: section.slug,
            title: section.name,
            subtitle: '',
            description: '',
            coverImage: section.products[0]?.image || '/images/cover.webp',
            coverAlt: section.name,
          };

          return (
            <div key={section.id} id={section.slug} className="scroll-mt-20">
              <CategoryShowcaseSection
                showcase={showcase}
                products={section.products}
                isReversed={index % 2 === 1}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
