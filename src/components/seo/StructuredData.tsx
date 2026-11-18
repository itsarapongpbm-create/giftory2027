import { customBasketsList, nonCustomBasketsList } from '@/constants/basket';
import { getSiteUrl, withBasePath } from '@/utils/siteUrl';
import { EmailAddress, LineLink } from '@/constants/contact';
import type { ContactSettings } from '@/lib/siteSettings';

const BASE_URL = getSiteUrl();

export type StructuredDataProduct = {
  id: string;
  title: string;
  price?: number;
  image: string;
};

const THAILAND_AREAS = [
  { '@type': 'Country', name: 'Thailand' },
  { '@type': 'City', name: 'กรุงเทพมหานคร' },
  { '@type': 'City', name: 'เชียงใหม่' },
  { '@type': 'City', name: 'เชียงราย' },
  { '@type': 'City', name: 'พัทยา' },
  { '@type': 'City', name: 'ภูเก็ต' },
  { '@type': 'City', name: 'กระบี่' },
  { '@type': 'City', name: 'สุราษฎร์ธานี' },
  { '@type': 'City', name: 'นครศรีธรรมราช' },
  { '@type': 'City', name: 'ขอนแก่น' },
  { '@type': 'City', name: 'อุดรธานี' },
  { '@type': 'City', name: 'อุบลราชธานี' },
  { '@type': 'City', name: 'นครราชสีมา' },
  { '@type': 'City', name: 'ชลบุรี' },
  { '@type': 'City', name: 'ระยอง' },
  { '@type': 'City', name: 'นนทบุรี' },
  { '@type': 'City', name: 'ปทุมธานี' },
  { '@type': 'City', name: 'สมุทรปราการ' },
];

export const buildBusinessStructuredData = (
  products: StructuredDataProduct[],
  contact?: Partial<ContactSettings>
) => {
  const prices = products.map(p => p.price).filter((p): p is number => typeof p === 'number' && p > 0);
  const priceRange =
    prices.length > 0 ? `฿${Math.min(...prices)}-฿${Math.max(...prices)}` : '฿890-฿4990';

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'giftoryth',
    description:
      'กระเช้าของขวัญพรีเมียม ดีไซน์ทันสมัยไม่ซ้ำใคร เลือกสินค้าได้ตามความต้องการ เหมาะกับทุกโอกาส จัดส่งด่วนทั่วไทย',
    url: BASE_URL,
    logo: 'https://images.giftoryth.com/giftoryth-public/images/logos/logo-red-transparent.webp',
    image:
      products[0]?.image ||
      'https://images.giftoryth.com/giftoryth-public/images/Basket/04.webp',
    telephone: contact?.phone || '02-060-2828',
    email: contact?.email || EmailAddress,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact?.locationText || '46/14 Rim Khlong Bang Kho Road, Bang Kho, Chom Thong',
      addressLocality: 'Bangkok',
      addressRegion: 'Bangkok',
      postalCode: '10150',
      addressCountry: 'TH',
    },
    areaServed: THAILAND_AREAS,
    openingHours: 'Mo-Fr 09:00-18:00, Sa 09:00-16:00',
    priceRange,
    paymentAccepted: 'เงินสด, บัตรเครดิต, การโอนเงิน',
    currenciesAccepted: 'THB',
    sameAs: [contact?.lineLink || LineLink],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'กระเช้าของขวัญ',
      itemListElement: products.slice(0, 12).map((basket, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Product',
          name: basket.title,
          description: `กระเช้าของขวัญพรีเมียม: ${basket.title}`,
          image: basket.image,
          url: withBasePath(`/basket/${basket.id}`),
          brand: {
            '@type': 'Brand',
            name: 'giftoryth',
          },
          offers: {
            '@type': 'Offer',
            price: basket.price ?? 0,
            priceCurrency: 'THB',
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: 'giftoryth',
            },
          },
        },
      })),
    },
  };
};

export const buildProductItemListStructuredData = (products: StructuredDataProduct[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: products.map((basket, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: basket.title || `Gift basket ${basket.id}`,
    url: withBasePath(`/basket/${basket.id}`),
    image: basket.image,
  })),
});

export const businessStructuredData = buildBusinessStructuredData(nonCustomBasketsList);

export const productItemListStructuredData = buildProductItemListStructuredData([
  ...nonCustomBasketsList,
  ...customBasketsList,
]);

export const generateProductStructuredData = (product: {
  id: string;
  title: string;
  price: number;
  image: string;
  galleryImages?: Array<{ url: string }>;
  details?: React.ReactNode;
}) => {
  const productName = product.title?.trim() || `Gift basket ${product.id}`;
  const images = [product.image, ...(product.galleryImages || []).map(img => img.url)];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: `Premium gift basket: ${productName}`,
    image: images.length > 1 ? images : product.image,
    url: withBasePath(`/basket/${product.id}`),
    brand: {
      '@type': 'Brand',
      name: 'giftoryth',
    },
    category: 'Gift Baskets',
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'THB',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: withBasePath(`/basket/${product.id}`),
      seller: {
        '@type': 'Organization',
        name: 'giftoryth',
        url: BASE_URL,
      },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'TH',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        returnPolicySeasonalOverride: [],
        returnMethod: 'https://schema.org/MailReturn',
        returnFees: 'https://schema.org/FreeReturn',
        returnWindow: {
          '@type': 'QuantitativeValue',
          value: 14,
          unitCode: 'DAY',
        },
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          currency: 'THB',
          value: 0,
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'TH',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 5,
            unitCode: 'DAY',
          },
        },
      },
    },
  };
};

export const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'giftoryth',
  description:
    'กระเช้าของขวัญพรีเมียม ดีไซน์ทันสมัยไม่ซ้ำใคร เลือกสินค้าได้ตามความต้องการ เหมาะกับทุกโอกาส จัดส่งด่วนทั่วไทย',
  url: BASE_URL,
  publisher: {
    '@type': 'Organization',
    name: 'giftoryth',
    logo: {
      '@type': 'ImageObject',
      url: 'https://images.giftoryth.com/giftoryth-public/images/logos/logo-red-transparent.webp',
    },
  },
};

export const generateBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What types of gift baskets do you offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer premium gift baskets including non-custom baskets, special custom design baskets, and custom gift arrangements. Our products range from ฿890 to ฿4990.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you deliver to all provinces in Thailand?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we deliver to all 77 provinces in Thailand including Bangkok, Chiang Mai, Phuket, Pattaya, and every other province nationwide. Contact us via Line for specific delivery arrangements.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I customize my gift basket?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We offer custom gift arrangements and special custom design baskets. Contact us via Line for personalized consultation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods do you accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept cash, credit cards, and bank transfers. All transactions are secure and reliable.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does delivery take to different provinces?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Delivery times vary by province. Bangkok and nearby areas: 1-2 days. Major cities: 2-3 days. Remote areas: 3-5 days. Contact us for specific delivery times to your location.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer free delivery nationwide?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we offer free delivery to all provinces in Thailand for orders above a certain amount. Contact us via Line for current delivery terms and conditions.',
      },
    },
  ],
};
