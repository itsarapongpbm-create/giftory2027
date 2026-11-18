import { identityServiceItems } from '@/constants/identity-service';
import { prisma } from './prisma';

export type HomeIdentityItem = (typeof identityServiceItems)[number] & {
  isPublished: boolean;
};

export const getHomeIdentityItems = async (options: { includeHidden?: boolean } = {}) => {
  let overrides: Awaited<ReturnType<typeof prisma.homeIdentityItem.findMany>> = [];
  try {
    overrides = await prisma.homeIdentityItem.findMany();
  } catch (error) {
    console.warn('HomeIdentity fallback (DB unavailable):', (error as Error).message);
  }
  const overridesBySlot = new Map(overrides.map(item => [item.slot, item]));
  const items: HomeIdentityItem[] = identityServiceItems.map(defaultItem => {
    const override = overridesBySlot.get(defaultItem.slot);

    return {
      ...defaultItem,
      title: override?.title || defaultItem.title,
      image: override?.image || defaultItem.image,
      imageClassName: override?.imageClassName ?? defaultItem.imageClassName,
      isPublished: override?.isPublished ?? true,
    };
  });

  return options.includeHidden ? items : items.filter(item => item.isPublished);
};

