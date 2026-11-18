'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/adminAuth';
import { deleteManagedImageIfUnused } from '@/lib/mediaCleanup';
import { prisma } from '@/lib/prisma';
import {
  CUSTOM_GIFT_SETTING_KEYS,
  getCustomGiftSettings,
  getHomeCoverImage,
  HOME_COVER_IMAGE_KEY,
} from '@/lib/siteSettings';
import { uploadSiteImage } from '@/lib/storage';

const toString = (value: FormDataEntryValue | null) => String(value || '').trim();

export const updateHomeSettings = async (formData: FormData) => {
  await requireAdmin();

  const previousCover = await getHomeCoverImage();
  const imageFile = formData.get('imageFile');
  const uploadedImage =
    imageFile instanceof File && imageFile.size > 0
      ? await uploadSiteImage(imageFile, 'home-cover')
      : null;
  const coverImage = uploadedImage?.imageUrl || toString(formData.get('coverImage'));

  if (!coverImage) {
    redirect('/admin/home?error=missing-fields');
  }

  await prisma.siteSetting.upsert({
    where: { key: HOME_COVER_IMAGE_KEY },
    create: {
      key: HOME_COVER_IMAGE_KEY,
      value: coverImage,
    },
    update: {
      value: coverImage,
    },
  });

  if (previousCover !== coverImage) {
    await deleteManagedImageIfUnused(previousCover);
  }

  revalidatePath('/');
  revalidatePath('/admin/home');
  redirect('/admin/home?saved=1');
};

const upsertSiteSetting = async (key: string, value: string) =>
  prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });

const getUploadedOrExistingImage = async (
  formData: FormData,
  fileKey: string,
  urlKey: string,
  uploadName: string
) => {
  const imageFile = formData.get(fileKey);
  const uploadedImage =
    imageFile instanceof File && imageFile.size > 0
      ? await uploadSiteImage(imageFile, uploadName)
      : null;

  return uploadedImage?.imageUrl || toString(formData.get(urlKey));
};

export const updateCustomGiftSettings = async (formData: FormData) => {
  await requireAdmin();

  const previous = await getCustomGiftSettings();
  const title = toString(formData.get('customGiftTitle'));
  const leftImage = await getUploadedOrExistingImage(formData, 'leftImageFile', 'leftImage', 'custom-gift-left');
  const rightImage1 = await getUploadedOrExistingImage(formData, 'rightImage1File', 'rightImage1', 'custom-gift-right-1');
  const rightImage2 = await getUploadedOrExistingImage(formData, 'rightImage2File', 'rightImage2', 'custom-gift-right-2');
  const leftAlt = toString(formData.get('leftAlt'));
  const rightAlt1 = toString(formData.get('rightAlt1'));
  const rightAlt2 = toString(formData.get('rightAlt2'));

  if (!title || !leftImage || !rightImage1 || !rightImage2) {
    redirect('/admin/home?error=missing-fields');
  }

  await Promise.all([
    upsertSiteSetting(CUSTOM_GIFT_SETTING_KEYS.title, title),
    upsertSiteSetting(CUSTOM_GIFT_SETTING_KEYS.leftImage, leftImage),
    upsertSiteSetting(CUSTOM_GIFT_SETTING_KEYS.leftAlt, leftAlt),
    upsertSiteSetting(CUSTOM_GIFT_SETTING_KEYS.rightImage1, rightImage1),
    upsertSiteSetting(CUSTOM_GIFT_SETTING_KEYS.rightAlt1, rightAlt1),
    upsertSiteSetting(CUSTOM_GIFT_SETTING_KEYS.rightImage2, rightImage2),
    upsertSiteSetting(CUSTOM_GIFT_SETTING_KEYS.rightAlt2, rightAlt2),
  ]);

  if (previous.leftImage !== leftImage) await deleteManagedImageIfUnused(previous.leftImage);
  if (previous.rightImage1 !== rightImage1) await deleteManagedImageIfUnused(previous.rightImage1);
  if (previous.rightImage2 !== rightImage2) await deleteManagedImageIfUnused(previous.rightImage2);

  revalidatePath('/');
  revalidatePath('/admin/home');
  redirect('/admin/home?saved=1');
};
