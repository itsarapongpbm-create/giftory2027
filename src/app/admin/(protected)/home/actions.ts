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
  getInstagramFeedSettings,
  getNewArrivalsSettings,
  getPdmKaikuSettings,
  HOME_COVER_IMAGE_KEY,
  INSTAGRAM_FEED_SETTING_KEYS,
  NEW_ARRIVALS_SETTING_KEYS,
  PDM_KAIKU_SETTING_KEYS,
  type InstagramPostItem,
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

export const updatePdmKaikuSettings = async (formData: FormData) => {
  await requireAdmin();

  const previous = await getPdmKaikuSettings();
  const title = toString(formData.get('pdmTitle'));
  const subtitle = toString(formData.get('pdmSubtitle'));
  const description = toString(formData.get('pdmDescription'));
  const unfoldImage = await getUploadedOrExistingImage(
    formData,
    'unfoldImageFile',
    'unfoldImage',
    'pdm-kaiku-unfold'
  );
  const labelImage = await getUploadedOrExistingImage(
    formData,
    'labelImageFile',
    'labelImage',
    'pdm-kaiku-label'
  );
  const unfoldAlt = toString(formData.get('unfoldAlt'));
  const labelAlt = toString(formData.get('labelAlt'));
  const productSlugs = formData
    .getAll('pdmProductSlugs')
    .map(value => String(value || '').trim())
    .filter(Boolean)
    .slice(0, 2);

  if (!title || !unfoldImage || !labelImage) {
    redirect('/admin/home?error=missing-fields');
  }

  await Promise.all([
    upsertSiteSetting(PDM_KAIKU_SETTING_KEYS.title, title),
    upsertSiteSetting(PDM_KAIKU_SETTING_KEYS.subtitle, subtitle),
    upsertSiteSetting(PDM_KAIKU_SETTING_KEYS.description, description),
    upsertSiteSetting(PDM_KAIKU_SETTING_KEYS.unfoldImage, unfoldImage),
    upsertSiteSetting(PDM_KAIKU_SETTING_KEYS.unfoldAlt, unfoldAlt),
    upsertSiteSetting(PDM_KAIKU_SETTING_KEYS.labelImage, labelImage),
    upsertSiteSetting(PDM_KAIKU_SETTING_KEYS.labelAlt, labelAlt),
    upsertSiteSetting(PDM_KAIKU_SETTING_KEYS.productSlugs, JSON.stringify(productSlugs)),
  ]);

  if (previous.unfoldImage !== unfoldImage) {
    await deleteManagedImageIfUnused(previous.unfoldImage);
  }
  if (previous.labelImage !== labelImage) {
    await deleteManagedImageIfUnused(previous.labelImage);
  }

  revalidatePath('/');
  revalidatePath('/admin/home');
  redirect('/admin/home?saved=1');
};

export const updateNewArrivalsSettings = async (formData: FormData) => {
  await requireAdmin();

  const current = await getNewArrivalsSettings();
  const title = toString(formData.get('newArrivalsTitle')) || current.title;
  const productSlugs = formData
    .getAll('newArrivalProductSlugs')
    .map(value => String(value || '').trim())
    .filter(Boolean);

  await Promise.all([
    upsertSiteSetting(NEW_ARRIVALS_SETTING_KEYS.title, title),
    upsertSiteSetting(NEW_ARRIVALS_SETTING_KEYS.productSlugs, JSON.stringify(productSlugs)),
  ]);

  revalidatePath('/');
  revalidatePath('/admin/home');
  redirect('/admin/home?saved=1');
};

export const updateInstagramFeedSettings = async (formData: FormData) => {
  await requireAdmin();

  const previous = await getInstagramFeedSettings();
  const title = toString(formData.get('igTitle')) || previous.title;
  const handle = toString(formData.get('igHandle'));
  const profileUrl = toString(formData.get('igProfileUrl')) || previous.profileUrl;

  const posts: InstagramPostItem[] = [];
  for (let index = 0; index < previous.posts.length; index += 1) {
    const image = await getUploadedOrExistingImage(
      formData,
      `igPostImageFile_${index}`,
      `igPostImage_${index}`,
      `instagram-post-${index + 1}`
    );
    const postUrl = toString(formData.get(`igPostUrl_${index}`)) || profileUrl;
    const caption = toString(formData.get(`igPostCaption_${index}`));
    const isReel = formData.get(`igPostIsReel_${index}`) === 'on';

    posts.push({
      image: image || previous.posts[index].image,
      postUrl,
      caption,
      isReel,
    });
  }

  await Promise.all([
    upsertSiteSetting(INSTAGRAM_FEED_SETTING_KEYS.title, title),
    upsertSiteSetting(INSTAGRAM_FEED_SETTING_KEYS.handle, handle),
    upsertSiteSetting(INSTAGRAM_FEED_SETTING_KEYS.profileUrl, profileUrl),
    upsertSiteSetting(INSTAGRAM_FEED_SETTING_KEYS.posts, JSON.stringify(posts)),
  ]);

  const currentImages = new Set(posts.map(post => post.image));
  for (const prevPost of previous.posts) {
    if (!currentImages.has(prevPost.image)) {
      await deleteManagedImageIfUnused(prevPost.image);
    }
  }

  revalidatePath('/');
  revalidatePath('/admin/home');
  redirect('/admin/home?saved=1');
};
