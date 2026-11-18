import { nonCustomBasketsList, customBasketsList } from '@/constants/basket';
import { getSiteUrl, withBasePath } from '@/utils/siteUrl';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export interface SitemapProductEntry {
  slug: string;
  updatedAt?: Date | string;
}

const formatDate = (value?: Date | string) => {
  if (!value) {
    return new Date().toISOString().split('T')[0];
  }
  const date = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(date.getTime())
    ? new Date().toISOString().split('T')[0]
    : date.toISOString().split('T')[0];
};

const escapeXml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const generateSitemap = (products?: SitemapProductEntry[]): string => {
  const currentDate = formatDate();

  const urls: SitemapUrl[] = [
    {
      loc: withBasePath('/'),
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: withBasePath('/about'),
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: withBasePath('/contact'),
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: withBasePath('/baskets'),
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: withBasePath('/custom-gift'),
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9,
    },
  ];

  const productEntries: SitemapProductEntry[] = products
    ? products
    : [...nonCustomBasketsList, ...customBasketsList].map(basket => ({
        slug: basket.id,
      }));

  const seenSlugs = new Set<string>();
  for (const product of productEntries) {
    if (!product.slug || seenSlugs.has(product.slug)) {
      continue;
    }
    seenSlugs.add(product.slug);
    urls.push({
      loc: withBasePath(`/basket/${product.slug}`),
      lastmod: formatDate(product.updatedAt),
      changefreq: 'weekly',
      priority: 0.7,
    });
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
};

export const generateRobotsTxt = (): string => {
  const baseUrl = getSiteUrl();
  return `User-agent: *
Allow: /

# Disallow admin & private areas
Disallow: /admin
Disallow: /admin/
Disallow: /private/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Allow all product pages
Allow: /basket/
Allow: /baskets/
Allow: /custom-gift/
Allow: /about/
Allow: /contact/

# Allow images
Allow: /images/
Allow: /*.webp
Allow: /*.jpg
Allow: /*.png
Allow: /*.svg`;
};
