'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/adminAuth';
import { defaultHomeCatalogItems } from '@/lib/homeCatalog';
import { deleteManagedImageIfUnused } from '@/lib/mediaCleanup';
import { prisma } from '@/lib/prisma';
import { uploadSiteImage } from '@/lib/storage';

const toString = (value: FormDataEntryValue | null) => String(value || '').trim();
const toBool = (value: FormDataEntryValue | null) => value === 'on';
const defaultSlots = new Set(defaultHomeCatalogItems.map(item => item.slot));

const revalidateHomeCatalogPaths = () => {
  revalidatePath('/');
  revalidatePath('/admin/home/catalog');
};

const homeCatalogDataFromForm = async (formData: FormData) => {
  const slot = Number(formData.get('slot') || 0);
  const title = toString(formData.get('title'));
  const url = toString(formData.get('url'));
  const imageFile = formData.get('imageFile');
  const uploadedImage =
    imageFile instanceof File && imageFile.size > 0
      ? await uploadSiteImage(imageFile, `home-catalog-${slot}`)
      : null;
  const image = uploadedImage?.imageUrl || toString(formData.get('image'));

  return {
    slot,
    title,
    url,
    image,
    isPublished: toBool(formData.get('isPublished')),
  };
};

export const createHomeCatalogItem = async (formData: FormData) => {
  await requireAdmin();

  const data = await homeCatalogDataFromForm(formData);

  if (!data.slot || !data.title || !data.url || !data.image) {
    redirect('/admin/home/catalog/new?error=missing-fields');
  }

  await prisma.homeCatalogItem.create({ data });
  revalidateHomeCatalogPaths();
  redirect('/admin/home/catalog?saved=1');
};

export const updateHomeCatalogItem = async (formData: FormData) => {
  await requireAdmin();

  const originalSlot = Number(formData.get('originalSlot') || formData.get('slot') || 0);
  const data = await homeCatalogDataFromForm(formData);

  if (!originalSlot || !data.slot || !data.title || !data.url || !data.image) {
    return;
  }

  const existing = await prisma.homeCatalogItem.findUnique({
    where: { slot: originalSlot },
    select: { image: true },
  });

  if (originalSlot !== data.slot) {
    await prisma.homeCatalogItem.deleteMany({
      where: { slot: originalSlot },
    });
  }

  await prisma.homeCatalogItem.upsert({
    where: { slot: data.slot },
    create: data,
    update: {
      title: data.title,
      url: data.url,
      image: data.image,
      isPublished: data.isPublished,
    },
  });

  if (existing?.image && existing.image !== data.image) {
    await deleteManagedImageIfUnused(existing.image);
  }

  revalidateHomeCatalogPaths();
  redirect('/admin/home/catalog?saved=1');
};

export const deleteHomeCatalogItem = async (formData: FormData) => {
  await requireAdmin();

  const slot = Number(formData.get('slot') || 0);

  if (!slot) {
    return;
  }

  const existing = await prisma.homeCatalogItem.findUnique({
    where: { slot },
    select: { image: true },
  });

  if (defaultSlots.has(slot)) {
    const defaultItem = defaultHomeCatalogItems.find(item => item.slot === slot);

    await prisma.homeCatalogItem.upsert({
      where: { slot },
      create: {
        slot,
        title: defaultItem?.title || '',
        image: defaultItem?.image || '',
        url: defaultItem?.url || '',
        isPublished: false,
      },
      update: {
        isPublished: false,
      },
    });
  } else {
    await prisma.homeCatalogItem.deleteMany({
      where: { slot },
    });
    if (existing?.image) {
      await deleteManagedImageIfUnused(existing.image);
    }
  }

  revalidateHomeCatalogPaths();
};
