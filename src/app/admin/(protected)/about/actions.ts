'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/adminAuth';
import { deleteManagedImageIfUnused } from '@/lib/mediaCleanup';
import { ABOUT_SETTING_KEYS, getAboutSettings } from '@/lib/siteSettings';
import { prisma } from '@/lib/prisma';
import { uploadSiteImage } from '@/lib/storage';

const toString = (value: FormDataEntryValue | null) => String(value || '').trim();

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

export const updateAboutSettings = async (formData: FormData) => {
  await requireAdmin();

  const previous = await getAboutSettings();
  const firstImage = await getUploadedOrExistingImage(formData, 'firstImageFile', 'firstImage', 'about-first');
  const secondImage = await getUploadedOrExistingImage(formData, 'secondImageFile', 'secondImage', 'about-second');
  const firstAlt = toString(formData.get('firstAlt'));
  const secondAlt = toString(formData.get('secondAlt'));
  const firstParagraph = toString(formData.get('firstParagraph'));
  const secondParagraph = toString(formData.get('secondParagraph'));

  if (!firstImage || !secondImage) {
    redirect('/admin/about?error=missing-fields');
  }

  await Promise.all([
    upsertSiteSetting(ABOUT_SETTING_KEYS.firstImage, firstImage),
    upsertSiteSetting(ABOUT_SETTING_KEYS.firstAlt, firstAlt),
    upsertSiteSetting(ABOUT_SETTING_KEYS.firstParagraph, firstParagraph),
    upsertSiteSetting(ABOUT_SETTING_KEYS.secondImage, secondImage),
    upsertSiteSetting(ABOUT_SETTING_KEYS.secondAlt, secondAlt),
    upsertSiteSetting(ABOUT_SETTING_KEYS.secondParagraph, secondParagraph),
  ]);

  if (previous.firstImage !== firstImage) {
    await deleteManagedImageIfUnused(previous.firstImage);
  }
  if (previous.secondImage !== secondImage) {
    await deleteManagedImageIfUnused(previous.secondImage);
  }

  revalidatePath('/about');
  revalidatePath('/admin/about');
  redirect('/admin/about?saved=1');
};
