import { prisma } from '@/lib/prisma';
import { generateSitemap } from '@/utils/sitemap';

export const dynamic = 'force-dynamic';

export async function GET() {
  let products: Array<{ slug: string; updatedAt: Date }> | undefined;

  try {
    products = await prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });
  } catch (error) {
    console.error('Failed to query products for sitemap, falling back to static catalog:', error);
  }

  const sitemapXml = generateSitemap(products);

  return new Response(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
    },
  });
}
