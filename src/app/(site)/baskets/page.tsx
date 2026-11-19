import type { Metadata } from 'next';
import Script from 'next/script';
import { buildProductItemListStructuredData } from '@/components/seo/StructuredData';
import { getSiteUrl } from '@/utils/siteUrl';
import { generateThaiKeywords } from '@/utils/thaiKeywords';
import BasketsHubClient from './BasketsHubClient';
import { getPublishedProductSections } from '@/lib/catalog';
import { getAllCategoryShowcases } from '@/lib/siteSettings';

const BASE_URL = getSiteUrl();

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'หมวดหมู่กระเช้าของขวัญพรีเมียม | giftoryth',
  description:
    'เลือกชมหมวดหมู่กระเช้าของขวัญพรีเมียม ดีไซน์ทันสมัยไม่ซ้ำใคร เลือกสินค้าได้ตามความต้องการ เหมาะกับทุกโอกาส จัดส่งด่วนทั่วไทย',
  keywords: generateThaiKeywords('baskets'),
  openGraph: {
    title: 'หมวดหมู่กระเช้าของขวัญพรีเมียม | giftoryth',
    description:
      'เลือกชมหมวดหมู่กระเช้าของขวัญพรีเมียม ดีไซน์ทันสมัยไม่ซ้ำใคร เลือกสินค้าได้ตามความต้องการ เหมาะกับทุกโอกาส จัดส่งด่วนทั่วไทย',
    images: ['https://images.giftoryth.com/giftoryth-public/images/Basket/04.webp'],
    url: `${BASE_URL}/baskets`,
    type: 'website',
  },
  alternates: {
    canonical: `${BASE_URL}/baskets`,
  },
};

const BasketsPage = async () => {
  const sections = await getPublishedProductSections();
  const slugs = sections.map(s => s.slug);
  const showcases = await getAllCategoryShowcases(slugs);
  const allProducts = sections.flatMap(section => section.products);
  const itemListStructuredData = buildProductItemListStructuredData(allProducts);

  return (
    <>
      <Script
        id="structured-data-baskets"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([itemListStructuredData]) }}
      />
      <BasketsHubClient sections={sections} showcases={showcases} />
    </>
  );
};

export default BasketsPage;
