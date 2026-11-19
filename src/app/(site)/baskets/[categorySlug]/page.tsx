import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import {
  buildProductItemListStructuredData,
  generateBreadcrumbStructuredData,
} from '@/components/seo/StructuredData';
import { getPublishedProductsByCategory, getPublishedProductSections } from '@/lib/catalog';
import { getCategoryShowcase } from '@/lib/siteSettings';
import { getSiteUrl } from '@/utils/siteUrl';
import { generateThaiKeywords } from '@/utils/thaiKeywords';
import CategoryProductsClient from './CategoryProductsClient';

type CategoryPageParams = Promise<{ categorySlug: string }>;

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: CategoryPageParams;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const showcase = await getCategoryShowcase(categorySlug);
  const baseUrl = getSiteUrl();

  const title = `${showcase.title || categorySlug} | giftoryth`;
  const description =
    showcase.description ||
    'เลือกชมกระเช้าของขวัญพรีเมียม ดีไซน์ทันสมัยไม่ซ้ำใคร จัดส่งด่วนทั่วไทย';
  const url = `${baseUrl}/baskets/${categorySlug}`;

  return {
    title,
    description,
    keywords: generateThaiKeywords('baskets'),
    openGraph: {
      title,
      description,
      images: [showcase.coverImage],
      url,
      type: 'website',
    },
    alternates: {
      canonical: url,
    },
  };
}

const CategoryPage = async ({ params }: { params: CategoryPageParams }) => {
  const { categorySlug } = await params;
  const [products, showcase, allSections] = await Promise.all([
    getPublishedProductsByCategory(categorySlug),
    getCategoryShowcase(categorySlug),
    getPublishedProductSections(),
  ]);

  const matchedSection = allSections.find(s => s.slug === categorySlug);
  const categoryName = matchedSection?.name || showcase.title || categorySlug;

  if (products.length === 0 && !matchedSection) {
    notFound();
  }

  const baseUrl = getSiteUrl();
  const structuredData = [
    buildProductItemListStructuredData(products),
    generateBreadcrumbStructuredData([
      { name: 'Home', url: `${baseUrl}/` },
      { name: 'Baskets', url: `${baseUrl}/baskets` },
      { name: showcase.title || categoryName, url: `${baseUrl}/baskets/${categorySlug}` },
    ]),
  ];

  return (
    <>
      <Script
        id={`structured-data-category-${categorySlug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CategoryProductsClient
        categorySlug={categorySlug}
        categoryName={categoryName}
        showcase={showcase}
        products={products}
      />
    </>
  );
};

export default CategoryPage;
