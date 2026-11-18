import Link from 'next/link';
import Image from 'next/image';
import Topic from './Topic';
import { getCustomGiftSettings } from '@/lib/siteSettings';

const CustomGift = async () => {
  const customGift = await getCustomGiftSettings();

  return (
    <>
      <Topic title={customGift.title} />
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
        <Link
          href="/custom-gift"
          aria-label={customGift.title}
          className="group block overflow-hidden border border-shadow-black/10 bg-white transition-shadow duration-300 hover:shadow-lg"
        >
          <div className="grid grid-cols-5 lg:grid-cols-12">
            {/* Left: Wide Corporate Banner */}
            <div className="relative col-span-5 aspect-video w-full overflow-hidden bg-beige/20 lg:col-span-7">
              <Image
                src={customGift.leftImage}
                alt={customGift.leftAlt}
                fill
                sizes="(min-width: 1600px) 900px, (min-width: 1024px) 58vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>

            {/* Middle: Bows */}
            <div className="relative col-span-3 min-h-[220px] overflow-hidden border-t border-shadow-black/10 bg-beige/30 sm:min-h-[280px] lg:col-span-3 lg:min-h-0 lg:border-l lg:border-t-0">
              <div className="absolute inset-5 sm:inset-8">
                <Image
                  src={customGift.rightImage1}
                  alt={customGift.rightAlt1}
                  fill
                  sizes="(min-width: 1600px) 380px, (min-width: 1024px) 25vw, 60vw"
                  className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right: Tall Portrait Feature */}
            <div className="relative col-span-2 min-h-[220px] overflow-hidden border-l border-t border-shadow-black/10 bg-white sm:min-h-[280px] lg:col-span-2 lg:min-h-0 lg:border-t-0">
              <div className="absolute inset-3 sm:inset-5 lg:inset-4">
                <Image
                  src={customGift.rightImage2}
                  alt={customGift.rightAlt2}
                  fill
                  sizes="(min-width: 1600px) 260px, (min-width: 1024px) 17vw, 40vw"
                  className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default CustomGift;
