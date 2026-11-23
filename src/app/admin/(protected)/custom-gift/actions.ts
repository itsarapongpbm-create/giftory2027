'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { customGift } from '@/constants/custom-gift';
import { requireAdmin } from '@/lib/adminAuth';
import { deleteManagedImageIfUnused } from '@/lib/mediaCleanup';
import { prisma } from '@/lib/prisma';
import { uploadSiteImage } from '@/lib/storage';
import {
  CUSTOM_GIFT_HERO_SETTING_KEYS,
  getCustomGiftHeroSettings,
} from '@/lib/siteSettings';

const toString = (value: FormDataEntryValue | null) => String(value || '').trim();
const toBool = (value: FormDataEntryValue | null) => value === 'on';
const defaultSlots = new Set(customGift.map(item => item.slot));

const revalidateCustomGiftPaths = () => {
  revalidatePath('/custom-gift');
  revalidatePath('/admin/custom-gift');
};

const customGiftDataFromForm = async (formData: FormData) => {
  const slot = Number(formData.get('slot') || 0);
  const title = toString(formData.get('title'));
  const imageFile = formData.get('imageFile');
  const uploadedImage =
    imageFile instanceof File && imageFile.size > 0
      ? await uploadSiteImage(imageFile, `custom-gift-page-${slot}`)
      : null;
  const image = uploadedImage?.imageUrl || toString(formData.get('image'));
  const imageClassNameInput = toString(formData.get('imageClassName'));
  const imageClassName = imageClassNameInput === '__default__' ? null : imageClassNameInput;
  const isPublished = toBool(formData.get('isPublished'));

  return {
    slot,
    title,
    image,
    imageClassName,
    isPublished,
  };
};

export const updateCustomGiftItem = async (formData: FormData) => {
  await requireAdmin();

  const originalSlot = Number(formData.get('originalSlot') || formData.get('slot') || 0);
  const data = await customGiftDataFromForm(formData);

  if (!originalSlot || !data.slot || !data.image) {
    return;
  }

  const existing = await prisma.customGiftItem.findUnique({
    where: { slot: originalSlot },
    select: { image: true },
  });

  if (originalSlot !== data.slot) {
    await prisma.customGiftItem.deleteMany({
      where: { slot: originalSlot },
    });
  }

  await prisma.customGiftItem.upsert({
    where: { slot: data.slot },
    create: {
      ...data,
    },
    update: {
      title: data.title,
      image: data.image,
      imageClassName: data.imageClassName,
      isPublished: data.isPublished,
    },
  });

  if (existing?.image && existing.image !== data.image) {
    await deleteManagedImageIfUnused(existing.image);
  }

  revalidateCustomGiftPaths();
  redirect('/admin/custom-gift?saved=1');
};

export const createCustomGiftItem = async (formData: FormData) => {
  await requireAdmin();

  const data = await customGiftDataFromForm(formData);

  if (!data.slot || !data.image) {
    return;
  }

  await prisma.customGiftItem.create({
    data,
  });

  revalidateCustomGiftPaths();
  redirect('/admin/custom-gift?saved=1');
};

export const deleteCustomGiftItem = async (formData: FormData) => {
  await requireAdmin();

  const slot = Number(formData.get('slot') || 0);

  if (!slot || slot === 1) {
    return;
  }

  const existing = await prisma.customGiftItem.findUnique({
    where: { slot },
    select: { image: true },
  });

  if (defaultSlots.has(slot)) {
    await prisma.customGiftItem.upsert({
      where: { slot },
      create: {
        slot,
        title: '',
        image: customGift.find(item => item.slot === slot)?.image || '',
        isPublished: false,
      },
      update: {
        isPublished: false,
      },
    });
  } else {
    await prisma.customGiftItem.deleteMany({
      where: { slot },
    });
    if (existing?.image) {
      await deleteManagedImageIfUnused(existing.image);
    }
  }

  revalidateCustomGiftPaths();
};

export const updateCustomGiftHeroSettings = async (formData: FormData) => {
  await requireAdmin();

  const previous = await getCustomGiftHeroSettings();
  const tag = toString(formData.get('tag'));
  const title = toString(formData.get('title'));
  const description = toString(formData.get('description'));
  const bgAlt = toString(formData.get('bgAlt'));

  const imageFile = formData.get('bgImageFile');
  const uploadedImage =
    imageFile instanceof File && imageFile.size > 0
      ? await uploadSiteImage(imageFile, 'custom-gift-hero-bg')
      : null;
  const bgImage = uploadedImage?.imageUrl || toString(formData.get('bgImage'));

  if (!title || !bgImage) {
    redirect('/admin/custom-gift?error=missing-fields');
  }

  const upsertSetting = (key: string, value: string) =>
    prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });

  await Promise.all([
    upsertSetting(CUSTOM_GIFT_HERO_SETTING_KEYS.tag, tag),
    upsertSetting(CUSTOM_GIFT_HERO_SETTING_KEYS.title, title),
    upsertSetting(CUSTOM_GIFT_HERO_SETTING_KEYS.description, description),
    upsertSetting(CUSTOM_GIFT_HERO_SETTING_KEYS.bgImage, bgImage),
    upsertSetting(CUSTOM_GIFT_HERO_SETTING_KEYS.bgAlt, bgAlt),
  ]);

  if (previous.bgImage && previous.bgImage !== bgImage) {
    await deleteManagedImageIfUnused(previous.bgImage);
  }

  revalidateCustomGiftPaths();
  redirect('/admin/custom-gift?saved=hero');
};
