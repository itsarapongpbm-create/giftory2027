'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/adminAuth';
import { deleteManagedImageIfUnused } from '@/lib/mediaCleanup';
import { CONTACT_SETTING_KEYS, getContactSettings } from '@/lib/siteSettings';
import { prisma } from '@/lib/prisma';
import { uploadCatalogPdf, uploadSiteImage } from '@/lib/storage';

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

export const updateContactSettings = async (formData: FormData) => {
  await requireAdmin();

  const previous = await getContactSettings();
  const logoImage = await getUploadedOrExistingImage(formData, 'logoImageFile', 'logoImage', 'contact-logo');
  const featureImage = await getUploadedOrExistingImage(formData, 'featureImageFile', 'featureImage', 'contact-feature');
  const qrImage = await getUploadedOrExistingImage(formData, 'qrImageFile', 'qrImage', 'contact-qr');

  const catalogPdfFile = formData.get('catalogPdfFile');
  const uploadedPdf =
    catalogPdfFile instanceof File && catalogPdfFile.size > 0
      ? await uploadCatalogPdf(catalogPdfFile, 'giftoryth-catalog')
      : null;
  const catalogPdfUrl = uploadedPdf?.url || toString(formData.get('catalogPdfUrl'));

  if (!logoImage || !featureImage || !qrImage) {
    redirect('/admin/contact?error=missing-fields');
  }

  await Promise.all([
    upsertSiteSetting(CONTACT_SETTING_KEYS.logoImage, logoImage),
    upsertSiteSetting(CONTACT_SETTING_KEYS.logoAlt, toString(formData.get('logoAlt'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.featureImage, featureImage),
    upsertSiteSetting(CONTACT_SETTING_KEYS.featureAlt, toString(formData.get('featureAlt'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.qrImage, qrImage),
    upsertSiteSetting(CONTACT_SETTING_KEYS.qrAlt, toString(formData.get('qrAlt'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.tagline, toString(formData.get('tagline'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.companyName, toString(formData.get('companyName'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.companySubtitle, toString(formData.get('companySubtitle'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.phone, toString(formData.get('phone'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.hotline, toString(formData.get('hotline'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.lineId, toString(formData.get('lineId'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.lineLink, toString(formData.get('lineLink'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.email, toString(formData.get('email'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.locationText, toString(formData.get('locationText'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.locationQuery, toString(formData.get('locationQuery'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.hoursWeekday, toString(formData.get('hoursWeekday'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.hoursSaturday, toString(formData.get('hoursSaturday'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.hoursSunday, toString(formData.get('hoursSunday'))),
    upsertSiteSetting(CONTACT_SETTING_KEYS.catalogPdfUrl, catalogPdfUrl),
  ]);

  if (previous.logoImage !== logoImage) {
    await deleteManagedImageIfUnused(previous.logoImage);
  }
  if (previous.featureImage !== featureImage) {
    await deleteManagedImageIfUnused(previous.featureImage);
  }
  if (previous.qrImage !== qrImage) {
    await deleteManagedImageIfUnused(previous.qrImage);
  }
  if (previous.catalogPdfUrl !== catalogPdfUrl) {
    await deleteManagedImageIfUnused(previous.catalogPdfUrl);
  }

  revalidatePath('/', 'layout');
  revalidatePath('/contact');
  revalidatePath('/admin/contact');
  redirect('/admin/contact?saved=1');
};
