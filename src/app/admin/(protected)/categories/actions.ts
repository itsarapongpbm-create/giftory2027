'use server';

import { requireAdmin } from '@/lib/adminAuth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const toSlug = (value: FormDataEntryValue | null) => String(value || '').trim();
const toName = (value: FormDataEntryValue | null) => String(value || '').trim();
const toSortOrder = (value: FormDataEntryValue | null) => Number(value || 0);

const categorySlugExists = async (slug: string, ignoreCategoryId?: string) => {
  const category = await prisma.category.findFirst({
    where: {
      slug,
      ...(ignoreCategoryId ? { id: { not: ignoreCategoryId } } : {}),
    },
    select: { id: true },
  });

  return Boolean(category);
};

const revalidateCategoryPaths = () => {
  revalidatePath('/admin');
  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
  revalidatePath('/baskets');
};

export const createCategory = async (formData: FormData) => {
  await requireAdmin();

  const slug = toSlug(formData.get('slug'));
  const name = toName(formData.get('name'));

  if (!slug || !name) {
    redirect('/admin/categories?error=missing-fields');
  }

  if (await categorySlugExists(slug)) {
    redirect('/admin/categories?error=slug-exists');
  }

  await prisma.category.create({
    data: {
      slug,
      name,
      sortOrder: toSortOrder(formData.get('sortOrder')),
    },
  });

  revalidateCategoryPaths();
  redirect('/admin/categories?saved=1');
};

export const updateCategory = async (formData: FormData) => {
  await requireAdmin();

  const id = String(formData.get('id') || '');
  const slug = toSlug(formData.get('slug'));
  const name = toName(formData.get('name'));

  if (!id || !slug || !name) {
    redirect('/admin/categories?error=missing-fields');
  }

  if (await categorySlugExists(slug, id)) {
    redirect('/admin/categories?error=slug-exists');
  }

  await prisma.category.update({
    where: { id },
    data: {
      slug,
      name,
      sortOrder: toSortOrder(formData.get('sortOrder')),
    },
  });

  revalidateCategoryPaths();
  redirect('/admin/categories?saved=1');
};

export const deleteCategory = async (formData: FormData) => {
  await requireAdmin();

  const id = String(formData.get('id') || '');

  if (!id) {
    return;
  }

  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    redirect('/admin/categories?error=has-products');
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidateCategoryPaths();
  redirect('/admin/categories?saved=1');
};

export const updateCategoryShowcaseAction = async (formData: FormData) => {
  await requireAdmin();

  const slug = toSlug(formData.get('slug'));
  const title = String(formData.get('title') || '').trim();
  const subtitle = String(formData.get('subtitle') || '').trim();
  const description = String(formData.get('description') || '').trim();
  const coverImage = String(formData.get('coverImage') || '').trim();
  const coverAlt = String(formData.get('coverAlt') || '').trim();

  if (!slug || !title) {
    redirect('/admin/categories?error=missing-fields');
  }

  const { getCategoryShowcaseKeys } = await import('@/lib/siteSettings');
  const keys = getCategoryShowcaseKeys(slug);
  const entries: [string, string][] = [
    [keys.title, title],
    [keys.subtitle, subtitle],
    [keys.description, description],
    [keys.coverImage, coverImage],
    [keys.coverAlt, coverAlt],
  ];

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  revalidateCategoryPaths();
  revalidatePath(`/baskets/${slug}`);
  redirect('/admin/categories?saved=1');
};
