'use client';

import { createContext, useContext } from 'react';
import type { ContactSettings } from '@/lib/siteSettings';

const FALLBACK_CONTACT_SETTINGS: ContactSettings = {
  logoImage: 'https://images.giftoryth.com/giftoryth-public/images/logos/logo-white-transparent.webp',
  logoAlt: 'Giftoryth logo',
  featureImage: 'https://images.giftoryth.com/giftoryth-public/images/IMG_6078.webp',
  featureAlt: 'Giftoryth handmade baskets',
  qrImage: 'https://images.giftoryth.com/giftoryth-public/images/line/qr.webp',
  qrAlt: 'Giftoryth Line QR code',
  tagline:
    'Give practical gifts that last through every precious moment. Picnic baskets designed for special people... in seasons filled with smiles 🧺✨ #BasketShopMoments',
  companyName: 'MAM Design and Service Co., Ltd.',
  companySubtitle: 'Crafting beautiful handmade baskets and custom gifts with passion and precision.',
  phone: '0-2060-2828',
  hotline: '09-5939-3979',
  lineId: '@giftory.th',
  lineLink: 'https://line.me/R/ti/p/@giftory.th',
  instagramLink: 'https://www.instagram.com/giftory.th?cnvx=Y295bnJveWwwd3ln',
  email: 'sales@giftoryth.com',
  locationText:
    'MAM Design and Service Co., Ltd.\n46/14 Rim Khlong Bang Kho Rd., Bang Kho, Chom Thong, Bangkok 10150',
  locationQuery: 'MAM Design and Service Co., Ltd.',
  locationLink:
    'https://www.google.com/maps/place/%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97+%E0%B9%80%E0%B8%AD%E0%B9%87%E0%B8%A1%E0%B9%80%E0%B8%AD%E0%B9%80%E0%B8%AD%E0%B9%87%E0%B8%A1+%E0%B8%94%E0%B8%B5%E0%B9%84%E0%B8%8B%E0%B8%99%E0%B9%8C%E0%B9%81%E0%B8%AD%E0%B8%99%E0%B8%94%E0%B9%8C%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A7%E0%B8%B4%E0%B8%AA+%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94/@13.698763,100.467262,18.5z/data=!4m15!1m8!3m7!1s0x30e2987b72aae9d7:0x14e2f2b4be951fe9!2z4LiW4LiZ4LiZIOC4o-C4tOC4oeC4hOC4peC4reC4h-C4muC4suC4h-C4hOC5ieC4rSDguYHguILguKfguIfguJrguLLguIfguITguYnguK0g4LmA4LiC4LiV4LiI4Lit4Lih4LiX4Lit4LiHIOC4geC4o-C4uOC4h-C5gOC4l-C4nuC4oeC4q-C4suC4meC4hOC4oyAxMDE1MA!3b1!8m2!3d13.6999352!4d100.4777495!16s%2Fg%2F11cs31w7_g!3m5!1s0x30e2990012ebfd59:0xe63c6b8f066e6e49!8m2!3d13.6981869!4d100.4687875!16s%2Fg%2F11ykxrcyd9?entry=ttu&g_ep=EgoyMDI2MTExNS4wIKXMDSoASAFQAw%3D%3D',
  hoursWeekday: '9:00 AM - 6:00 PM',
  hoursSaturday: '9:00 AM - 4:00 PM',
  hoursSunday: 'Closed',
  catalogPdfUrl: 'https://images.giftoryth.com/giftoryth-public/catalogs/GIFTORY_NY_BASKET.pdf',
};

const SiteConfigContext = createContext<ContactSettings>(FALLBACK_CONTACT_SETTINGS);

export function SiteConfigProvider({
  value,
  children,
}: {
  value: ContactSettings;
  children: React.ReactNode;
}) {
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
