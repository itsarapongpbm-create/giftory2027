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
      value: contactSettings.lineLink || contactSettings.lineId,
    },
    {
      id: 'instagram',
      icon: (
        <svg
          className="size-6 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
      title: 'Instagram',
      detail: '@giftory.th',
      className: 'bg-main-red',
      type: 'instagram' as const,
      value: contactSettings.instagramLink,
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
      value:
        contactSettings.locationLink ||
        contactSettings.locationQuery ||
        contactSettings.locationText,
    },
  ].filter(item => Boolean(item.detail));

  const showcaseImage = contactSettings.featureImage || contactSettings.logoImage;

  return (
    <div className="mb-4 flex flex-col overflow-hidden max-md:min-h-[calc(100dvh-290px)] lg:grid lg:grid-cols-2">
      {/* Left Column: Premium Lifestyle Showcase with Brand Caption */}
      <div className="relative min-h-[460px] bg-beige sm:min-h-[520px] lg:min-h-full">
        <Image
          src={showcaseImage}
          alt={contactSettings.featureAlt || 'giftory handmade baskets'}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-center"
          priority
        />
        {/* Subtle Gradient & Brand Caption Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-shadow-black/85 via-shadow-black/45 to-transparent p-6 text-main-white sm:p-8">
          <p className="text-lg font-light tracking-wide sm:text-xl md:text-2xl">
            {contactSettings.companyName}
          </p>
          <p className="mt-1 max-w-md text-xs font-extralight text-main-white/85 sm:text-sm">
            {contactSettings.companySubtitle}
          </p>
        </div>
      </div>

      {/* Right Column: Clean Contact Details & Business Hours */}
      <div className="flex flex-col justify-between bg-white p-6 sm:p-8 lg:p-10">
        <div>
          {/* Contact Cards List */}
          <div className="divide-y divide-gray-100">
            {dynamicContactInfo.map(contact => (
              <ContactCard key={contact.id} {...contact} />
            ))}
          </div>
        </div>

        {/* Business Hours */}
        <div className="mt-8 border-t border-gray-100 pt-6 text-center">
          <h2 className="mb-3 text-xs font-light uppercase tracking-widest text-shadow-black/60 sm:text-sm">
            Business Hours
          </h2>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div className="rounded-lg border border-shadow-black/5 bg-[#FAF9F6] p-3 text-center">
              <p className="mb-1 text-xs font-light text-shadow-black/65">
                Monday - Friday
              </p>
              <p className="text-xs font-medium text-shadow-black sm:text-sm">
                {contactSettings.hoursWeekday}
              </p>
            </div>
            <div className="rounded-lg border border-shadow-black/5 bg-[#FAF9F6] p-3 text-center">
              <p className="mb-1 text-xs font-light text-shadow-black/65">
                Saturday
              </p>
              <p className="text-xs font-medium text-shadow-black sm:text-sm">
                {contactSettings.hoursSaturday}
              </p>
            </div>
            <div className="rounded-lg border border-shadow-black/5 bg-[#FAF9F6] p-3 text-center">
              <p className="mb-1 text-xs font-light text-shadow-black/65">Sunday</p>
              <p className="text-xs font-medium text-shadow-black sm:text-sm">
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
