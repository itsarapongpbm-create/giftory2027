import { prisma } from './prisma';

export const HOME_COVER_IMAGE_KEY = 'home.coverImage';
export const DEFAULT_HOME_COVER_IMAGE =
  'https://images.giftoryth.com/giftoryth-public/images/cover.webp';

export const CUSTOM_GIFT_SETTING_KEYS = {
  title: 'home.customGift.title',
  leftImage: 'home.customGift.leftImage',
  leftAlt: 'home.customGift.leftAlt',
  rightImage1: 'home.customGift.rightImage1',
  rightAlt1: 'home.customGift.rightAlt1',
  rightImage2: 'home.customGift.rightImage2',
  rightAlt2: 'home.customGift.rightAlt2',
} as const;

export const DEFAULT_CUSTOM_GIFT_SETTINGS = {
  title: 'Custom Gift',
  leftImage: 'https://images.giftoryth.com/giftoryth-public/images/shop-all-basket/signature.webp',
  leftAlt: 'Signature gift',
  rightImage1: 'https://images.giftoryth.com/giftoryth-public/images/shop-all-basket/bow.webp',
  rightAlt1: 'Bow',
  rightImage2: 'https://images.giftoryth.com/giftoryth-public/images/shop-all-basket/bow-bag.webp',
  rightAlt2: 'Bow bag',
};

export const ABOUT_SETTING_KEYS = {
  firstImage: 'about.firstImage',
  firstAlt: 'about.firstAlt',
  firstParagraph: 'about.firstParagraph',
  secondImage: 'about.secondImage',
  secondAlt: 'about.secondAlt',
  secondParagraph: 'about.secondParagraph',
} as const;

export const DEFAULT_ABOUT_SETTINGS = {
  firstImage: 'https://images.giftoryth.com/giftoryth-public/images/IMG_6078.webp',
  firstAlt: 'About Giftoryth',
  firstParagraph:
    'A gift basket that goes beyond just "a gift" If you\'re looking for something truly special a gift that\'s not only beautiful, but meaningful and reusable Our custom-designed gift baskets are made just for you. Because we believe... A great gift isn\'t just about what\'s inside it\'s about the thought, the care, and the heartfelt message behind it. As we like to say, "More than a gift, it\'s a story."',
  secondImage: 'https://images.giftoryth.com/giftoryth-public/images/cover.webp',
  secondAlt: 'Giftoryth gift basket',
  secondParagraph:
    'Let us help you design a gift that tells your story. Whether it\'s for clients, loved ones, or a special occasion our baskets are made to express your values, your brand, and your unique style. Memorable. Personal. Uniquely yours.',
};

export const CONTACT_SETTING_KEYS = {
  logoImage: 'contact.logoImage',
  logoAlt: 'contact.logoAlt',
  featureImage: 'contact.featureImage',
  featureAlt: 'contact.featureAlt',
  qrImage: 'contact.qrImage',
  qrAlt: 'contact.qrAlt',
  tagline: 'contact.tagline',
  companyName: 'contact.companyName',
  companySubtitle: 'contact.companySubtitle',
  phone: 'contact.phone',
  hotline: 'contact.hotline',
  lineId: 'contact.lineId',
  lineLink: 'contact.lineLink',
  email: 'contact.email',
  locationText: 'contact.locationText',
  locationQuery: 'contact.locationQuery',
  hoursWeekday: 'contact.hoursWeekday',
  hoursSaturday: 'contact.hoursSaturday',
  hoursSunday: 'contact.hoursSunday',
  catalogPdfUrl: 'site.catalogPdfUrl',
} as const;

export const DEFAULT_CONTACT_SETTINGS = {
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
  email: 'sales@giftoryth.com',
  locationText: '46/14 Rim Khlong Bang Kho Road, Bang Kho, Chom Thong, Bangkok 10150',
  locationQuery: 'ถนน ริมคลองบางค้อ',
  hoursWeekday: '9:00 AM - 6:00 PM',
  hoursSaturday: '9:00 AM - 4:00 PM',
  hoursSunday: 'Closed',
  catalogPdfUrl: 'https://images.giftoryth.com/giftoryth-public/catalogs/GIFTORY_NY_BASKET.pdf',
};

export type ContactSettings = typeof DEFAULT_CONTACT_SETTINGS;
export type AboutSettings = typeof DEFAULT_ABOUT_SETTINGS;
export type CustomGiftSettings = typeof DEFAULT_CUSTOM_GIFT_SETTINGS;

export const getSiteSetting = async (key: string) => {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key },
    });

    return setting?.value || null;
  } catch (error) {
    console.warn(`SiteSetting fallback for "${key}" (DB unavailable):`, (error as Error).message);
    return null;
  }
};

export const getHomeCoverImage = async () =>
  (await getSiteSetting(HOME_COVER_IMAGE_KEY)) || DEFAULT_HOME_COVER_IMAGE;

export const getSiteSettings = async (keys: string[]) => {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: keys,
        },
      },
    });

    return new Map(settings.map(setting => [setting.key, setting.value]));
  } catch (error) {
    console.warn('SiteSettings fallback (DB unavailable):', (error as Error).message);
    return new Map<string, string>();
  }
};

export const getCustomGiftSettings = async (): Promise<CustomGiftSettings> => {
  const settings = await getSiteSettings(Object.values(CUSTOM_GIFT_SETTING_KEYS));

  return {
    title: settings.get(CUSTOM_GIFT_SETTING_KEYS.title) || DEFAULT_CUSTOM_GIFT_SETTINGS.title,
    leftImage: settings.get(CUSTOM_GIFT_SETTING_KEYS.leftImage) || DEFAULT_CUSTOM_GIFT_SETTINGS.leftImage,
    leftAlt: settings.get(CUSTOM_GIFT_SETTING_KEYS.leftAlt) || DEFAULT_CUSTOM_GIFT_SETTINGS.leftAlt,
    rightImage1: settings.get(CUSTOM_GIFT_SETTING_KEYS.rightImage1) || DEFAULT_CUSTOM_GIFT_SETTINGS.rightImage1,
    rightAlt1: settings.get(CUSTOM_GIFT_SETTING_KEYS.rightAlt1) || DEFAULT_CUSTOM_GIFT_SETTINGS.rightAlt1,
    rightImage2: settings.get(CUSTOM_GIFT_SETTING_KEYS.rightImage2) || DEFAULT_CUSTOM_GIFT_SETTINGS.rightImage2,
    rightAlt2: settings.get(CUSTOM_GIFT_SETTING_KEYS.rightAlt2) || DEFAULT_CUSTOM_GIFT_SETTINGS.rightAlt2,
  };
};

export const getAboutSettings = async (): Promise<AboutSettings> => {
  const settings = await getSiteSettings(Object.values(ABOUT_SETTING_KEYS));

  return {
    firstImage: settings.get(ABOUT_SETTING_KEYS.firstImage) || DEFAULT_ABOUT_SETTINGS.firstImage,
    firstAlt: settings.get(ABOUT_SETTING_KEYS.firstAlt) || DEFAULT_ABOUT_SETTINGS.firstAlt,
    firstParagraph: settings.get(ABOUT_SETTING_KEYS.firstParagraph) || DEFAULT_ABOUT_SETTINGS.firstParagraph,
    secondImage: settings.get(ABOUT_SETTING_KEYS.secondImage) || DEFAULT_ABOUT_SETTINGS.secondImage,
    secondAlt: settings.get(ABOUT_SETTING_KEYS.secondAlt) || DEFAULT_ABOUT_SETTINGS.secondAlt,
    secondParagraph: settings.get(ABOUT_SETTING_KEYS.secondParagraph) || DEFAULT_ABOUT_SETTINGS.secondParagraph,
  };
};

export const getContactSettings = async (): Promise<ContactSettings> => {
  const settings = await getSiteSettings(Object.values(CONTACT_SETTING_KEYS));

  return {
    logoImage: settings.get(CONTACT_SETTING_KEYS.logoImage) || DEFAULT_CONTACT_SETTINGS.logoImage,
    logoAlt: settings.get(CONTACT_SETTING_KEYS.logoAlt) || DEFAULT_CONTACT_SETTINGS.logoAlt,
    featureImage: settings.get(CONTACT_SETTING_KEYS.featureImage) || DEFAULT_CONTACT_SETTINGS.featureImage,
    featureAlt: settings.get(CONTACT_SETTING_KEYS.featureAlt) || DEFAULT_CONTACT_SETTINGS.featureAlt,
    qrImage: settings.get(CONTACT_SETTING_KEYS.qrImage) || DEFAULT_CONTACT_SETTINGS.qrImage,
    qrAlt: settings.get(CONTACT_SETTING_KEYS.qrAlt) || DEFAULT_CONTACT_SETTINGS.qrAlt,
    tagline: settings.get(CONTACT_SETTING_KEYS.tagline) || DEFAULT_CONTACT_SETTINGS.tagline,
    companyName: settings.get(CONTACT_SETTING_KEYS.companyName) || DEFAULT_CONTACT_SETTINGS.companyName,
    companySubtitle: settings.get(CONTACT_SETTING_KEYS.companySubtitle) || DEFAULT_CONTACT_SETTINGS.companySubtitle,
    phone: settings.get(CONTACT_SETTING_KEYS.phone) || DEFAULT_CONTACT_SETTINGS.phone,
    hotline: settings.get(CONTACT_SETTING_KEYS.hotline) || DEFAULT_CONTACT_SETTINGS.hotline,
    lineId: settings.get(CONTACT_SETTING_KEYS.lineId) || DEFAULT_CONTACT_SETTINGS.lineId,
    lineLink: settings.get(CONTACT_SETTING_KEYS.lineLink) || DEFAULT_CONTACT_SETTINGS.lineLink,
    email: settings.get(CONTACT_SETTING_KEYS.email) || DEFAULT_CONTACT_SETTINGS.email,
    locationText: settings.get(CONTACT_SETTING_KEYS.locationText) || DEFAULT_CONTACT_SETTINGS.locationText,
    locationQuery: settings.get(CONTACT_SETTING_KEYS.locationQuery) || DEFAULT_CONTACT_SETTINGS.locationQuery,
    hoursWeekday: settings.get(CONTACT_SETTING_KEYS.hoursWeekday) || DEFAULT_CONTACT_SETTINGS.hoursWeekday,
    hoursSaturday: settings.get(CONTACT_SETTING_KEYS.hoursSaturday) || DEFAULT_CONTACT_SETTINGS.hoursSaturday,
    hoursSunday: settings.get(CONTACT_SETTING_KEYS.hoursSunday) || DEFAULT_CONTACT_SETTINGS.hoursSunday,
    catalogPdfUrl: settings.get(CONTACT_SETTING_KEYS.catalogPdfUrl) || DEFAULT_CONTACT_SETTINGS.catalogPdfUrl,
  };
};
