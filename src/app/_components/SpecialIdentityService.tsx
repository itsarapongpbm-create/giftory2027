import { getHomeIdentityItems } from '@/lib/homeIdentity';
import { cn } from '@/utils';
import Image from 'next/image';
import Topic from './Topic';

const getItemGridClass = (index: number, desktopGrid?: string) => {
  const tabletClass = index === 0 ? 'sm:row-span-2' : index === 7 ? 'sm:row-span-2' : 'sm:row-span-1';
  const desktopClass = desktopGrid
    ? desktopGrid
        .split(' ')
        .map(c => `lg:${c}`)
        .join(' ')
    : 'lg:col-span-1 lg:row-span-1';

  return cn('col-span-1 row-span-1', tabletClass, desktopClass);
};

const SpecialIdentityService = async () => {
  const identityServiceItems = await getHomeIdentityItems();

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Topic title="Special Identity Service" />

        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:grid-rows-4 lg:gap-8">
          {identityServiceItems.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                'hover:shadow-card group relative aspect-[13/14] size-full cursor-pointer overflow-hidden transition-all duration-300',
                item.className,
                getItemGridClass(index, item.desktopGrid)
              )}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className={cn(
                  'h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105',
                  item.imageClassName
                )}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-shadow-black/60 via-shadow-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialIdentityService;
