'use server';

import { requireAdmin } from '@/lib/adminAuth';
import { deleteManagedImageIfUnused } from '@/lib/mediaCleanup';
import { prisma } from '@/lib/prisma';
import { uploadProductImage } from '@/lib/storage';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const toString = (value: FormDataEntryValue | null) => String(value || '').trim();
const toInt = (value: FormDataEntryValue | null) => {
  const text = toString(value);
  if (!text) return null;
  const num = Number(text);
  return Number.isFinite(num) ? Math.round(num) : null;
};
const toBool = (value: FormDataEntryValue | null) => value === 'on';

type GalleryEntry = {
  url: string;
  alt: string | null;
  sortOrder: number;
};

const parseGalleryFromForm = async (formData: FormData, slug: string): Promise<GalleryEntry[]> => {
  const urls = formData.getAll('galleryUrls').map(v => toString(v));
  const alts = formData.getAll('galleryAlts').map(v => toString(v));
  const files = formData.getAll('galleryFiles').filter((v): v is File => v instanceof File && v.size > 0);

  const entries: GalleryEntry[] = [];

  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i];
    if (!url) continue;
    entries.push({
      url,
      alt: alts[i] || null,
      sortOrder: (entries.length + 1) * 10,
    });
  }

  for (let i = 0; i < files.length; i += 1) {
    const uploaded = await uploadProductImage(files[i], `${slug}-gallery-${i + 1}`);
    if (uploaded?.imageUrl) {
      entries.push({
        url: uploaded.imageUrl,
        alt: null,
        sortOrder: (entries.length + 1) * 10,
      });
    }
  }

  return entries;
};

const productDataFromForm = async (formData: FormData) => {
  const slug = toString(formData.get('slug'));
  const imageFile = formData.get('imageFile');
  const uploadedImage =
    imageFile instanceof File && imageFile.size > 0 ? await uploadProductImage(imageFile, slug) : null;

  return {
    slug,
    title: toString(formData.get('title')),
    price: toInt(formData.get('price')),
    image: uploadedImage?.imageUrl || toString(formData.get('image')),
    cardImage: uploadedImage?.cardUrl,
    thumbnailImage: uploadedImage?.thumbnailUrl,
    details: toString(formData.get('details')),
    categoryId: toString(formData.get('categoryId')),
    sortOrder: Number(formData.get('sortOrder') || 0),
    isPublished: toBool(formData.get('isPublished')),
    isBestSeller: toBool(formData.get('isBestSeller')),
    imageClassName: toString(formData.get('imageClassName')) || null,
  };
};

const revalidateProductPaths = (slug?: string) => {
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/products');
  revalidatePath('/baskets');
  revalidatePath('/sitemap.xml');
  if (slug) {
    revalidatePath(`/basket/${slug}`);
  }
};

const productSlugExists = async (slug: string, ignoreProductId?: string) => {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      ...(ignoreProductId ? { id: { not: ignoreProductId } } : {}),
    },
    select: { id: true },
  });

  return Boolean(product);
};

export const createProduct = async (formData: FormData) => {
  await requireAdmin();

  const slug = toString(formData.get('slug'));

  if (slug && (await productSlugExists(slug))) {
    redirect('/admin/products/new?error=slug-exists');
  }

  const data = await productDataFromForm(formData);

  if (!data.slug || !data.title || !data.image || !data.categoryId) {
    redirect('/admin/products/new?error=missing-fields');
  }

  const galleryEntries = await parseGalleryFromForm(formData, data.slug);

  await prisma.product.create({
    data: {
      ...data,
      galleryImages: galleryEntries.length > 0 ? { create: galleryEntries } : undefined,
    },
  });

  revalidateProductPaths(data.slug);
  redirect('/admin/products?saved=1');
};

export const updateProduct = async (formData: FormData) => {
  await requireAdmin();

  const id = toString(formData.get('id'));
  const slug = toString(formData.get('slug'));

  if (!id) {
    redirect('/admin/products');
  }

  if (slug && (await productSlugExists(slug, id))) {
    redirect(`/admin/products/${id}/edit?error=slug-exists`);
  }

  const data = await productDataFromForm(formData);

  if (!data.slug || !data.title || !data.image || !data.categoryId) {
    redirect(`/admin/products/${id}/edit?error=missing-fields`);
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id },
    select: {
      slug: true,
      image: true,
      cardImage: true,
      thumbnailImage: true,
      galleryImages: { select: { url: true } },
    },
  });

  const galleryEntries = await parseGalleryFromForm(formData, data.slug);

  await prisma.product.update({
    where: { id },
    data: {
      ...data,
      cardImage:
        data.cardImage === undefined
          ? existingProduct?.image === data.image
            ? existingProduct.cardImage
            : null
          : data.cardImage,
      thumbnailImage:
        data.thumbnailImage === undefined
          ? existingProduct?.image === data.image
            ? existingProduct.thumbnailImage
            : null
          : data.thumbnailImage,
      galleryImages: {
        deleteMany: {},
        ...(galleryEntries.length > 0 ? { create: galleryEntries } : {}),
      },
    },
  });

  if (existingProduct?.image && existingProduct.image !== data.image) {
    await deleteManagedImageIfUnused(existingProduct.image, { ignoreProductId: id });
    await deleteManagedImageIfUnused(existingProduct.cardImage, { ignoreProductId: id });
    await deleteManagedImageIfUnused(existingProduct.thumbnailImage, { ignoreProductId: id });
  }

  const nextGalleryUrls = new Set(galleryEntries.map(item => item.url));
  for (const oldGalleryItem of existingProduct?.galleryImages || []) {
    if (!nextGalleryUrls.has(oldGalleryItem.url)) {
      await deleteManagedImageIfUnused(oldGalleryItem.url, { ignoreProductId: id });
    }
  }

  revalidateProductPaths(data.slug);
  if (existingProduct?.slug && existingProduct.slug !== data.slug) {
    revalidatePath(`/basket/${existingProduct.slug}`);
  }
  redirect('/admin/products?saved=1');
};

export const deleteProduct = async (formData: FormData) => {
  await requireAdmin();

  const id = toString(formData.get('id'));

  if (!id) {
    return;
  }

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      slug: true,
      image: true,
      cardImage: true,
      thumbnailImage: true,
      galleryImages: { select: { url: true } },
    },
  });

  if (!product) {
    return;
  }

  await prisma.product.delete({
    where: { id },
  });

  await deleteManagedImageIfUnused(product.image, { ignoreProductId: id });
  await deleteManagedImageIfUnused(product.cardImage, { ignoreProductId: id });
  await deleteManagedImageIfUnused(product.thumbnailImage, { ignoreProductId: id });
  for (const galleryItem of product.galleryImages) {
    await deleteManagedImageIfUnused(galleryItem.url, { ignoreProductId: id });
  }

  revalidateProductPaths(product.slug);
};

export const toggleProductPublished = async (formData: FormData) => {
  await requireAdmin();

  const id = toString(formData.get('id'));
  const isPublished = toBool(formData.get('isPublished'));

  if (!id) {
    return;
  }

  const updated = await prisma.product.update({
    where: { id },
    data: { isPublished },
    select: { slug: true },
  });

  revalidateProductPaths(updated.slug);
};
