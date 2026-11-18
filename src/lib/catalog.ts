import type { Product as PrismaProduct, ProductImage as PrismaProductImage } from '@prisma/client';
import { isValidElement, type ReactNode } from 'react';
import { customBasketsList, nonCustomBasketsList } from '@/constants/basket';
import { prisma } from './prisma';

export type CatalogGalleryImage = {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
};

export type CatalogProduct = Omit<Product.ProductCardProps, 'price' | 'details'> & {
  price?: number;
  details: string;
  categorySlug: string;
  categoryName: string;
  galleryImages: CatalogGalleryImage[];
  updatedAt?: Date;
};

export type CatalogCategorySection = {
  id: string;
  slug: string;
  name: string;
  products: CatalogProduct[];
};

const BEST_SELLER_FALLBACK_IDS = new Set([
  'non-custom-04',
  'non-custom-09',
  'non-custom-13',
  'non-custom-16',
  'non-custom-03',
]);

const extractTextLines = (node: ReactNode): string[] => {
  if (node == null || typeof node === 'boolean') return [];
  if (typeof node === 'string' || typeof node === 'number') {
    const trimmed = String(node).trim();
    return trimmed ? [trimmed] : [];
  }
  if (Array.isArray(node)) {
    return node.flatMap(extractTextLines);
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    if (node.type === 'li') {
      const text = extractTextLines(node.props.children).join(' ').trim();
      return text ? [text] : [];
    }
    return extractTextLines(node.props.children);
  }
  return [];
};

const buildFallbackCatalog = (): CatalogCategorySection[] => {
  const mapList = (
    items: Array<{
      id: string;
      image: string;
      title?: string;
      price?: number;
      details?: ReactNode;
      imageClassName?: string;
    }>,
    categorySlug: string,
    categoryName: string
  ): CatalogProduct[] =>
    items.map(item => ({
      id: item.id,
      image: item.image,
      title: item.title || item.id,
      price: item.price,
      details: extractTextLines(item.details).join('\n'),
      imageClassName: item.imageClassName,
      categorySlug,
      categoryName,
      galleryImages: [],
    }));

  return [
    {
      id: 'fallback-non-custom',
      slug: 'non-custom',
      name: 'Non Custom Baskets',
      products: mapList(nonCustomBasketsList, 'non-custom', 'Non Custom Baskets'),
    },
    {
      id: 'fallback-special-custom-design',
      slug: 'special-custom-design',
      name: 'Special Custom Design Baskets',
      products: mapList(customBasketsList, 'special-custom-design', 'Special Custom Design Baskets'),
    },
  ];
};

const toCatalogProduct = (
  product: PrismaProduct & {
    category: {
      slug: string;
      name: string;
    };
    galleryImages?: PrismaProductImage[];
  }
): CatalogProduct => ({
  id: product.slug,
  image: product.image,
  cardImage: product.cardImage ?? undefined,
  title: product.title,
  price: product.price ?? undefined,
  details: product.details,
  imageClassName: product.imageClassName ?? undefined,
  categorySlug: product.category.slug,
  categoryName: product.category.name,
  galleryImages: (product.galleryImages || [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(img => ({
      id: img.id,
      url: img.url,
      alt: img.alt ?? undefined,
      sortOrder: img.sortOrder,
    })),
  updatedAt: product.updatedAt,
});

export const getPublishedProductsByCategory = async (categorySlug: string) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        category: {
          slug: categorySlug,
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      include: {
        category: {
          select: { slug: true, name: true },
        },
      },
    });

    return products.map(toCatalogProduct);
  } catch (error) {
    console.warn('Catalog fallback (DB unavailable):', (error as Error).message);
    return buildFallbackCatalog().find(s => s.slug === categorySlug)?.products || [];
  }
};

export const getPublishedProductSections = async (): Promise<CatalogCategorySection[]> => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        products: {
          some: {
            isPublished: true,
          },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        products: {
          where: {
            isPublished: true,
          },
          orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
          include: {
            category: {
              select: { slug: true, name: true },
            },
          },
        },
      },
    });

    return categories.map(category => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      products: category.products.map(toCatalogProduct),
    }));
  } catch (error) {
    console.warn('Catalog sections fallback (DB unavailable):', (error as Error).message);
    return buildFallbackCatalog();
  }
};

export const getPublishedProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        category: {
          select: { slug: true, name: true },
        },
        galleryImages: {
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        },
      },
    });

    return product ? toCatalogProduct(product) : null;
  } catch (error) {
    console.warn('Product detail fallback (DB unavailable):', (error as Error).message);
    return (
      buildFallbackCatalog()
        .flatMap(section => section.products)
        .find(item => item.id === slug) || null
    );
  }
};

export const getRelatedPublishedProducts = async (
  categorySlug: string,
  excludeSlug: string,
  limit = 4
) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        slug: { not: excludeSlug },
        category: { slug: categorySlug },
      },
      orderBy: [{ isBestSeller: 'desc' }, { sortOrder: 'asc' }, { title: 'asc' }],
      take: limit,
      include: {
        category: {
          select: { slug: true, name: true },
        },
      },
    });

    return products.map(toCatalogProduct);
  } catch (error) {
    console.warn('Related products fallback (DB unavailable):', (error as Error).message);
    return (
      buildFallbackCatalog()
        .find(s => s.slug === categorySlug)
        ?.products.filter(p => p.id !== excludeSlug)
        .slice(0, limit) || []
    );
  }
};

export const getBestSellerProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        isBestSeller: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      include: {
        category: {
          select: { slug: true, name: true },
        },
      },
    });

    return products.map(toCatalogProduct);
  } catch (error) {
    console.warn('Best sellers fallback (DB unavailable):', (error as Error).message);
    return buildFallbackCatalog()
      .flatMap(s => s.products)
      .filter(p => BEST_SELLER_FALLBACK_IDS.has(p.id));
  }
};

export const getAllPublishedProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }, { title: 'asc' }],
      include: {
        category: {
          select: { slug: true, name: true },
        },
      },
    });

    return products.map(toCatalogProduct);
  } catch (error) {
    console.warn('All products fallback (DB unavailable):', (error as Error).message);
    return buildFallbackCatalog().flatMap(s => s.products);
  }
};
