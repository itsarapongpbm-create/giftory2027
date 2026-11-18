import Script from 'next/script';
import type { Metadata } from 'next';
import HomeContent from '../_components/HomeContent';
import {
  buildBusinessStructuredData,
  websiteStructuredData,
  faqStructuredData,
} from '@/components/seo/StructuredData';
import { getAllPublishedProducts } from '@/lib/catalog';
import { getContactSettings } from '@/lib/siteSettings';
import { getSiteUrl } from '@/utils/siteUrl';
import { generateThaiKeywords } from '@/utils/thaiKeywords';

const BASE_URL = getSiteUrl();

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'giftoryth - กระเช้าของขวัญพรีเมียม',
  description:
    'กระเช้าของขวัญพรีเมียม ดีไซน์ทันสมัยไม่ซ้ำใคร เลือกสินค้าได้ตามความต้องการ เหมาะกับทุกโอกาส จัดส่งด่วนทั่วไทย',
  keywords: generateThaiKeywords('home'),
  openGraph: {
    title: 'giftoryth - กระเช้าของขวัญพรีเมียม',
    description:
      'กระเช้าของขวัญพรีเมียม ดีไซน์ทันสมัยไม่ซ้ำใคร เลือกสินค้าได้ตามความต้องการ เหมาะกับทุกโอกาส จัดส่งด่วนทั่วไทย',
    images: ['https://images.giftoryth.com/giftoryth-public/images/Basket/04.webp'],
    url: BASE_URL,
    type: 'website',
  },
};

export default async function Page() {
  const [products, contactSettings] = await Promise.all([
    getAllPublishedProducts(),
    getContactSettings(),
  ]);
  const structuredData = [
    buildBusinessStructuredData(products, contactSettings),
    websiteStructuredData,
    faqStructuredData,
  ];

  return (
    <>
      <Script
        id="structured-data-home"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeContent />
    </>
  );
}
