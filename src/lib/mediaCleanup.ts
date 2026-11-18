import { prisma } from './prisma';
import { deleteStorageObjectPairByUrl, isManagedStorageUrl } from './storage';

export const countManagedUrlUsages = async (url: string, options: { ignoreProductId?: string } = {}) => {
  const [
    productCount,
    productImageCount,
    siteSettingCount,
    identityCount,
    customGiftCount,
    homeCatalogCount,
  ] = await Promise.all([
    prisma.product.count({
      where: {
        OR: [{ image: url }, { cardImage: url }, { thumbnailImage: url }],
        ...(options.ignoreProductId ? { id: { not: options.ignoreProductId } } : {}),
      },
    }),
    prisma.productImage.count({
      where: {
        url,
        ...(options.ignoreProductId ? { productId: { not: options.ignoreProductId } } : {}),
      },
    }),
    prisma.siteSetting.count({
      where: { value: url },
    }),
    prisma.homeIdentityItem.count({
      where: { image: url },
    }),
    prisma.customGiftItem.count({
      where: { image: url },
    }),
    prisma.homeCatalogItem.count({
      where: { image: url },
    }),
  ]);

  return (
    productCount +
    productImageCount +
    siteSettingCount +
    identityCount +
    customGiftCount +
    homeCatalogCount
  );
};

export const deleteManagedImageIfUnused = async (
  imageUrl: string | null | undefined,
  options: { ignoreProductId?: string } = {}
) => {
  if (!imageUrl || !isManagedStorageUrl(imageUrl)) {
    return false;
  }

  const usageCount = await countManagedUrlUsages(imageUrl, options);
  if (usageCount > 0) {
    return false;
  }

  try {
    return await deleteStorageObjectPairByUrl(imageUrl);
  } catch (error) {
    console.error('Failed to delete unused storage object:', error);
    return false;
  }
};
