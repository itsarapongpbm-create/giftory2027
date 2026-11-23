import type { Metadata } from 'next';
import Image from 'next/image';
import { getSiteUrl } from '@/utils/siteUrl';
import { generateThaiKeywords } from '@/utils/thaiKeywords';
import { getAboutSettings } from '@/lib/siteSettings';
import AboutWhyGiftorySection from './AboutWhyGiftorySection';

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา | giftoryth',
  description:
    'กระเช้าของขวัญพรีเมียม ดีไซน์ทันสมัยไม่ซ้ำใคร เลือกสินค้าได้ตามความต้องการ เหมาะกับทุกโอกาส จัดส่งด่วนทั่วไทย',
  keywords: generateThaiKeywords('about'),
  openGraph: {
    title: 'เกี่ยวกับเรา | giftoryth',
    description:
      'กระเช้าของขวัญพรีเมียม ดีไซน์ทันสมัยไม่ซ้ำใคร เลือกสินค้าได้ตามความต้องการ เหมาะกับทุกโอกาส จัดส่งด่วนทั่วไทย',
    images: ['https://images.giftoryth.com/giftoryth-public/images/IMG_6078.webp'],
    url: `${BASE_URL}/about`,
    type: 'website',
  },
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
};

export const dynamic = 'force-dynamic';

const AboutPage = async () => {
  const aboutSettings = await getAboutSettings();

  return (
    <>
      {/* Desktop 2x2 Grid */}
      <div className="relative mx-auto mb-4 hidden min-h-[calc(100dvh-290px)] w-full max-w-[1200px] grid-cols-2 lg:grid">
        <div className="h-[500px] bg-beige">
          <Image
            src={aboutSettings.firstImage}
            alt={aboutSettings.firstAlt}
            width={1000}
            height={1000}
            className="h-full w-full object-cover"
            priority={false}
          />
        </div>
        <div className="flex h-[500px] flex-col justify-center px-16">
          <p className="drop-cap whitespace-pre-line text-xs font-extralight leading-relaxed tracking-wide text-maroon sm:text-base md:text-lg lg:text-xl xl:text-2xl">
            {aboutSettings.firstParagraph}
          </p>
        </div>
        <div className="flex h-[500px] flex-col justify-center bg-white px-16">
          <p className="drop-cap whitespace-pre-line text-xs font-extralight leading-relaxed tracking-wide text-maroon sm:text-base md:text-lg lg:text-xl xl:text-2xl">
            {aboutSettings.secondParagraph}
          </p>
        </div>
        <div className="h-[500px] bg-beige">
          <Image
            src={aboutSettings.secondImage}
            alt={aboutSettings.secondAlt}
            width={1000}
            height={1000}
            className="h-full w-full object-cover"
            priority={false}
          />
        </div>
      </div>

      {/* Mobile Stacked Layout */}
      <div className="mx-auto mb-4 flex min-h-[calc(100dvh-290px)] w-full max-w-[1200px] flex-col lg:hidden">
        <div className="relative h-[500px] bg-beige">
          <Image
            src={aboutSettings.firstImage}
            alt={aboutSettings.firstAlt}
            width={1000}
            height={1000}
            className="h-full w-full object-cover"
            priority={false}
          />
          <div className="absolute left-1/2 top-1/2 flex size-full -translate-x-1/2 -translate-y-1/2 flex-col justify-center bg-shadow-black/50 px-8 sm:px-16">
            <p className="drop-cap whitespace-pre-line text-sm font-light leading-relaxed tracking-wide text-main-white sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              {aboutSettings.firstParagraph}
            </p>
          </div>
        </div>
        <div className="relative h-[500px] bg-beige">
          <Image
            src={aboutSettings.secondImage}
            alt={aboutSettings.secondAlt}
            width={1000}
            height={1000}
            className="h-full w-full object-cover"
            priority={false}
          />
          <div className="absolute left-1/2 top-1/2 flex size-full -translate-x-1/2 -translate-y-1/2 flex-col justify-center bg-shadow-black/50 px-8 sm:px-16">
            <p className="drop-cap whitespace-pre-line text-sm font-light leading-relaxed tracking-wide text-main-white sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              {aboutSettings.secondParagraph}
            </p>
          </div>
        </div>
      </div>

      {/* Why Giftory TH - Corporate Trust & Excellence Pillars */}
      <AboutWhyGiftorySection />
    </>
  );
};

export default AboutPage;
