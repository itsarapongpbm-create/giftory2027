import type { Metadata } from 'next';
import Image from 'next/image';
import { ContactCard } from '@/components/cards';
import { LineIcon } from '@/components/icons';
import { getContactSettings } from '@/lib/siteSettings';
import { getSiteUrl } from '@/utils/siteUrl';
import { generateThaiKeywords } from '@/utils/thaiKeywords';

const BASE_URL = getSiteUrl();

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ติดต่อเรา | giftoryth',
  description:
    'กระเช้าของขวัญพรีเมียม ดีไซน์ทันสมัยไม่ซ้ำใคร เลือกสินค้าได้ตามความต้องการ เหมาะกับทุกโอกาส จัดส่งด่วนทั่วไทย',
  keywords: generateThaiKeywords('contact'),
  openGraph: {
    title: 'ติดต่อเรา | giftoryth',
    description:
      'กระเช้าของขวัญพรีเมียม ดีไซน์ทันสมัยไม่ซ้ำใคร เลือกสินค้าได้ตามความต้องการ เหมาะกับทุกโอกาส จัดส่งด่วนทั่วไทย',
    images: ['https://images.giftoryth.com/giftoryth-public/images/IMG_6078.webp'],
    url: `${BASE_URL}/contact`,
    type: 'website',
  },
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
};

const ContactPage = async () => {
  const contactSettings = await getContactSettings();

  const dynamicContactInfo = [
    {
      id: 'phone',
      icon: (
        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      ),
      title: 'Phone',
      detail: contactSettings.phone,
      className: 'bg-main-red',
      type: 'phone' as const,
      value: contactSettings.phone.replace(/[^0-9+]/g, ''),
    },
    {
      id: 'hotline',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6 text-white"
        >
          <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
          <path
            fillRule="evenodd"
            d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z"
            clipRule="evenodd"
          />
        </svg>
      ),
      title: 'Hotline',
      detail: contactSettings.hotline,
      className: 'bg-main-red',
      type: 'phone' as const,
      value: contactSettings.hotline.replace(/[^0-9+]/g, ''),
    },
    {
      id: 'line',
      icon: <LineIcon className="size-6 fill-white text-white" />,
      title: 'Line',
      detail: contactSettings.lineId,
      className: 'bg-main-red',
      type: 'line' as const,
      value: contactSettings.lineId,
    },
    {
      id: 'email',
      icon: (
        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      title: 'Email',
      detail: contactSettings.email,
      className: 'bg-main-red',
      type: 'email' as const,
      value: contactSettings.email,
    },
    {
      id: 'location',
      icon: (
        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      title: 'Location',
      detail: contactSettings.locationText,
      className: 'bg-main-red',
      type: 'location' as const,
      value: contactSettings.locationQuery || contactSettings.locationText,
    },
  ].filter(item => Boolean(item.detail));

  return (
    <div className="mb-4 flex grid-cols-2 flex-col overflow-y-hidden max-md:min-h-[calc(100dvh-290px)] lg:grid lg:h-[calc(100dvh-290px)]">
      <div className="col-span-1 flex items-center justify-center bg-beige max-lg:max-h-[400px]">
        <Image
          src={contactSettings.logoImage}
          alt={contactSettings.logoAlt}
          width={1000}
          height={1000}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="scrollbar-hide col-span-1 flex flex-col gap-y-4 overflow-y-auto bg-white lg:gap-y-8">
        <div className="flex h-fit w-full flex-col items-center justify-center px-4 pt-[40px] md:px-10 lg:mb-10 lg:pt-[80px]">
          <div className="mb-6 h-[1px] w-32 bg-main-red"></div>
          <p className="text-center text-base font-extralight leading-relaxed text-maroon md:text-lg xl:text-xl">
            {contactSettings.tagline}
          </p>
        </div>

        <div className="px-4 md:px-8">
          {dynamicContactInfo.map(contact => (
            <ContactCard key={contact.id} {...contact} />
          ))}
        </div>

        <div className="relative h-[400px] w-full !bg-beige text-center">
          <Image
            src={contactSettings.featureImage}
            alt={contactSettings.featureAlt}
            width={1000}
            height={1000}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute bottom-0 left-0 right-0 h-full w-full bg-black/30" />
          <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-y-6 text-main-white">
            <p className="text-lg font-light tracking-wide md:text-2xl xl:text-3xl">
              {contactSettings.companyName}
            </p>
            <p className="px-2 text-center text-sm font-extralight md:text-base xl:text-xl">
              {contactSettings.companySubtitle}
            </p>
          </div>
        </div>

        <div className="shadow-card-light mx-4 mt-4 flex flex-col items-center justify-center gap-y-4 border border-gray-100 bg-white p-4 md:mx-8 md:p-8">
          <Image
            src={contactSettings.qrImage}
            alt={contactSettings.qrAlt}
            width={192}
            height={192}
            className="size-48 object-cover"
          />
          <p className="text-center text-sm font-extralight text-main md:text-base xl:text-lg">
            Join our Line to get the latest updates
          </p>
          <div className="h-[1px] w-32 bg-main-red" />
        </div>

        <div className="mb-16 text-center">
          <h3 className="mb-6 text-lg font-light text-main md:text-xl xl:text-2xl">
            Business Hours
          </h3>
          <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="py-3">
              <p className="mb-1 text-sm font-extralight text-main md:text-base">Monday - Friday</p>
              <p className="text-sm text-gray-600 md:text-base xl:text-lg">
                {contactSettings.hoursWeekday}
              </p>
            </div>
            <div className="py-3">
              <p className="mb-1 text-sm font-extralight text-main md:text-base">Saturday</p>
              <p className="text-sm text-gray-600 md:text-base xl:text-lg">
                {contactSettings.hoursSaturday}
              </p>
            </div>
            <div className="py-3">
              <p className="mb-1 text-sm font-extralight text-main md:text-base">Sunday</p>
              <p className="text-sm text-gray-600 md:text-base xl:text-lg">
                {contactSettings.hoursSunday}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
