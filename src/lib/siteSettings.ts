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
  rightImage1: '/images/shop-all-basket/bow.webp',
  rightAlt1: 'Bow',
  rightImage2: 'https://images.giftoryth.com/giftoryth-public/images/shop-all-basket/bow-bag.webp',
  rightAlt2: 'Bow bag',
};

export const PDM_KAIKU_SETTING_KEYS = {
  title: 'home.pdmKaiku.title',
  subtitle: 'home.pdmKaiku.subtitle',
  description: 'home.pdmKaiku.description',
  lifestyleImage: 'home.pdmKaiku.lifestyleImage',
  lifestyleAlt: 'home.pdmKaiku.lifestyleAlt',
  unfoldImage: 'home.pdmKaiku.unfoldImage',
  unfoldAlt: 'home.pdmKaiku.unfoldAlt',
  labelImage: 'home.pdmKaiku.labelImage',
  labelAlt: 'home.pdmKaiku.labelAlt',
  productSlugs: 'home.pdmKaiku.productSlugs',
} as const;

export const DEFAULT_PDM_KAIKU_SETTINGS = {
  title: 'PDM WEEKEND MAT BASKET',
  subtitle: 'PDM × giftory Collaboration',
  description:
    'A thoughtfully designed 2-in-1 basket that effortlessly unfolds into an 80 × 60 cm picnic mat — finished with the signature giftory × PDM woven label.',
  lifestyleImage: '/images/pdm-kaiku/lifestyle.webp',
  lifestyleAlt: 'PDM Weekend Mat Basket outdoor picnic lifestyle',
  unfoldImage: '/images/pdm-kaiku/unfold-spec.webp',
  unfoldAlt: 'PDM Weekend Mat Basket 2-in-1 basket to 80x60 cm picnic mat diagram',
  labelImage: '/images/pdm-kaiku/woven-label.webp',
  labelAlt: 'giftory x PDM signature woven label detail',
  productSlugs: [] as string[],
};

export const NEW_ARRIVALS_SETTING_KEYS = {
  title: 'home.newArrivals.title',
  productSlugs: 'home.newArrivals.productSlugs',
} as const;

export const DEFAULT_NEW_ARRIVALS_SETTINGS = {
  title: 'New Arrivals',
  productSlugs: [] as string[],
};

export type InstagramPostItem = {
  image: string;
  postUrl: string;
  caption: string;
  isReel: boolean;
};

export const INSTAGRAM_FEED_SETTING_KEYS = {
  title: 'home.instagram.title',
  handle: 'home.instagram.handle',
  profileUrl: 'home.instagram.profileUrl',
  posts: 'home.instagram.posts',
} as const;

export const DEFAULT_INSTAGRAM_POSTS: InstagramPostItem[] = [
  {
    image: '/images/Basket/04.webp',
    postUrl: 'https://www.instagram.com/giftory.th?cnvx=Y295bnJveWwwd3ln',
    caption: 'Signature Festive Gift Basket',
    isReel: true,
  },
  {
    image: '/images/Basket/09.webp',
    postUrl: 'https://www.instagram.com/giftory.th?cnvx=Y295bnJveWwwd3ln',
    caption: 'Curated Corporate Gift Box',
    isReel: false,
  },
  {
    image: '/images/Basket/13.webp',
    postUrl: 'https://www.instagram.com/giftory.th?cnvx=Y295bnJveWwwd3ln',
    caption: 'Warm Natural Woven Basket',
    isReel: false,
  },
  {
    image: '/images/IMG_6078.webp',
    postUrl: 'https://www.instagram.com/giftory.th?cnvx=Y295bnJveWwwd3ln',
    caption: 'Behind the Scenes at giftory',
    isReel: true,
  },
  {
    image: '/images/Basket/16.webp',
    postUrl: 'https://www.instagram.com/giftory.th?cnvx=Y295bnJveWwwd3ln',
    caption: 'Seasonal Ribbon & Bow Collection',
    isReel: false,
  },
];

export const DEFAULT_INSTAGRAM_FEED_SETTINGS = {
  title: 'Follow Us on Instagram',
  handle: '@giftory.th',
  profileUrl: 'https://www.instagram.com/giftory.th?cnvx=Y295bnJveWwwd3ln',
  posts: DEFAULT_INSTAGRAM_POSTS,
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
  instagramLink: 'contact.instagramLink',
  email: 'contact.email',
  locationText: 'contact.locationText',
  locationQuery: 'contact.locationQuery',
  locationLink: 'contact.locationLink',
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
  instagramLink: 'https://www.instagram.com/giftory.th?cnvx=Y295bnJveWwwd3ln',
  email: 'sales@giftoryth.com',
  locationText: '46/14 Rim Khlong Bang Kho Road, Bang Kho, Chom Thong, Bangkok 10150',
  locationQuery: 'ถนน ริมคลองบางค้อ',
  locationLink:
    'https://www.google.com/maps/place/%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97+%E0%B9%80%E0%B8%AD%E0%B9%87%E0%B8%A1%E0%B9%80%E0%B8%AD%E0%B9%80%E0%B8%AD%E0%B9%87%E0%B8%A1+%E0%B8%94%E0%B8%B5%E0%B9%84%E0%B8%8B%E0%B8%99%E0%B9%8C%E0%B9%81%E0%B8%AD%E0%B8%99%E0%B8%94%E0%B9%8C%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A7%E0%B8%B4%E0%B8%AA+%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94/@13.698763,100.467262,18.5z/data=!4m15!1m8!3m7!1s0x30e2987b72aae9d7:0x14e2f2b4be951fe9!2z4LiW4LiZ4LiZIOC4o-C4tOC4oeC4hOC4peC4reC4h-C4muC4suC4h-C4hOC5ieC4rSDguYHguILguKfguIfguJrguLLguIfguITguYnguK0g4LmA4LiC4LiV4LiI4Lit4Lih4LiX4Lit4LiHIOC4geC4o-C4uOC4h-C5gOC4l-C4nuC4oeC4q-C4suC4meC4hOC4oyAxMDE1MA!3b1!8m2!3d13.6999352!4d100.4777495!16s%2Fg%2F11cs31w7_g!3m5!1s0x30e2990012ebfd59:0xe63c6b8f066e6e49!8m2!3d13.6981869!4d100.4687875!16s%2Fg%2F11ykxrcyd9?entry=ttu&g_ep=EgoyMDI2MTExNS4wIKXMDSoASAFQAw%3D%3D',
  hoursWeekday: '9:00 AM - 6:00 PM',
  hoursSaturday: '9:00 AM - 4:00 PM',
  hoursSunday: 'Closed',
  catalogPdfUrl: 'https://images.giftoryth.com/giftoryth-public/catalogs/GIFTORY_NY_BASKET.pdf',
};

export type ContactSettings = typeof DEFAULT_CONTACT_SETTINGS;
export type AboutSettings = typeof DEFAULT_ABOUT_SETTINGS;
export type CustomGiftSettings = typeof DEFAULT_CUSTOM_GIFT_SETTINGS;
export type PdmKaikuSettings = typeof DEFAULT_PDM_KAIKU_SETTINGS;
export type NewArrivalsSettings = typeof DEFAULT_NEW_ARRIVALS_SETTINGS;
export type InstagramFeedSettings = typeof DEFAULT_INSTAGRAM_FEED_SETTINGS;

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

const parseProductSlugs = (raw: string | undefined, maxItems?: number): string[] => {
  if (!raw) return [];
  let items: string[] = [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      items = parsed.map(item => String(item || '').trim()).filter(Boolean);
    }
  } catch {
    items = raw
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }
  return typeof maxItems === 'number' ? items.slice(0, maxItems) : items;
};

export const getPdmKaikuSettings = async (): Promise<PdmKaikuSettings> => {
  const settings = await getSiteSettings(Object.values(PDM_KAIKU_SETTING_KEYS));

  return {
    title: settings.get(PDM_KAIKU_SETTING_KEYS.title) || DEFAULT_PDM_KAIKU_SETTINGS.title,
    subtitle: settings.get(PDM_KAIKU_SETTING_KEYS.subtitle) || DEFAULT_PDM_KAIKU_SETTINGS.subtitle,
    description: settings.get(PDM_KAIKU_SETTING_KEYS.description) || DEFAULT_PDM_KAIKU_SETTINGS.description,
    lifestyleImage:
      settings.get(PDM_KAIKU_SETTING_KEYS.lifestyleImage) || DEFAULT_PDM_KAIKU_SETTINGS.lifestyleImage,
    lifestyleAlt:
      settings.get(PDM_KAIKU_SETTING_KEYS.lifestyleAlt) || DEFAULT_PDM_KAIKU_SETTINGS.lifestyleAlt,
    unfoldImage:
      settings.get(PDM_KAIKU_SETTING_KEYS.unfoldImage) || DEFAULT_PDM_KAIKU_SETTINGS.unfoldImage,
    unfoldAlt: settings.get(PDM_KAIKU_SETTING_KEYS.unfoldAlt) || DEFAULT_PDM_KAIKU_SETTINGS.unfoldAlt,
    labelImage: settings.get(PDM_KAIKU_SETTING_KEYS.labelImage) || DEFAULT_PDM_KAIKU_SETTINGS.labelImage,
    labelAlt: settings.get(PDM_KAIKU_SETTING_KEYS.labelAlt) || DEFAULT_PDM_KAIKU_SETTINGS.labelAlt,
    productSlugs: parseProductSlugs(settings.get(PDM_KAIKU_SETTING_KEYS.productSlugs), 2),
  };
};

export const getNewArrivalsSettings = async (): Promise<NewArrivalsSettings> => {
  const settings = await getSiteSettings(Object.values(NEW_ARRIVALS_SETTING_KEYS));

  return {
    title: settings.get(NEW_ARRIVALS_SETTING_KEYS.title) || DEFAULT_NEW_ARRIVALS_SETTINGS.title,
    productSlugs: parseProductSlugs(settings.get(NEW_ARRIVALS_SETTING_KEYS.productSlugs)),
  };
};

const parseInstagramPosts = (raw: string | undefined): InstagramPostItem[] => {
  if (!raw) return DEFAULT_INSTAGRAM_POSTS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return DEFAULT_INSTAGRAM_POSTS.map((fallback, index) => {
        const entry = parsed[index] as Partial<InstagramPostItem> | undefined;
        return {
          image: String(entry?.image || '').trim() || fallback.image,
          postUrl: String(entry?.postUrl || '').trim() || fallback.postUrl,
          caption: String(entry?.caption ?? fallback.caption).trim(),
          isReel: Boolean(entry?.isReel),
        };
      });
    }
  } catch {
    return DEFAULT_INSTAGRAM_POSTS;
  }
  return DEFAULT_INSTAGRAM_POSTS;
};

export const getInstagramFeedSettings = async (): Promise<InstagramFeedSettings> => {
  const settings = await getSiteSettings(Object.values(INSTAGRAM_FEED_SETTING_KEYS));

  return {
    title: settings.get(INSTAGRAM_FEED_SETTING_KEYS.title) || DEFAULT_INSTAGRAM_FEED_SETTINGS.title,
    handle:
      settings.get(INSTAGRAM_FEED_SETTING_KEYS.handle) || DEFAULT_INSTAGRAM_FEED_SETTINGS.handle,
    profileUrl:
      settings.get(INSTAGRAM_FEED_SETTING_KEYS.profileUrl) ||
      DEFAULT_INSTAGRAM_FEED_SETTINGS.profileUrl,
    posts: parseInstagramPosts(settings.get(INSTAGRAM_FEED_SETTING_KEYS.posts)),
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
    instagramLink:
      settings.get(CONTACT_SETTING_KEYS.instagramLink) || DEFAULT_CONTACT_SETTINGS.instagramLink,
    email: settings.get(CONTACT_SETTING_KEYS.email) || DEFAULT_CONTACT_SETTINGS.email,
    locationText: settings.get(CONTACT_SETTING_KEYS.locationText) || DEFAULT_CONTACT_SETTINGS.locationText,
    locationQuery: settings.get(CONTACT_SETTING_KEYS.locationQuery) || DEFAULT_CONTACT_SETTINGS.locationQuery,
    locationLink: settings.get(CONTACT_SETTING_KEYS.locationLink) || DEFAULT_CONTACT_SETTINGS.locationLink,
    hoursWeekday: settings.get(CONTACT_SETTING_KEYS.hoursWeekday) || DEFAULT_CONTACT_SETTINGS.hoursWeekday,
    hoursSaturday: settings.get(CONTACT_SETTING_KEYS.hoursSaturday) || DEFAULT_CONTACT_SETTINGS.hoursSaturday,
    hoursSunday: settings.get(CONTACT_SETTING_KEYS.hoursSunday) || DEFAULT_CONTACT_SETTINGS.hoursSunday,
    catalogPdfUrl: settings.get(CONTACT_SETTING_KEYS.catalogPdfUrl) || DEFAULT_CONTACT_SETTINGS.catalogPdfUrl,
  };
};
