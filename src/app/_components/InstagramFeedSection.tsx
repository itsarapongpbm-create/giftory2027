import Image from 'next/image';
import { getInstagramFeedSettings } from '@/lib/siteSettings';

const InstagramFeedSection = async () => {
  const settings = await getInstagramFeedSettings();

  return (
    <section aria-label={settings.title} className="pt-4">
      {/* Compact Section Header */}
      <div className="flex flex-col items-center justify-center bg-main-white px-4 pb-6 pt-10 text-center md:pb-8 md:pt-12">
        <h2 className="text-lg font-extralight tracking-wide text-shadow-black md:text-xl xl:text-2xl">
          {settings.title}
        </h2>
        {settings.handle && (
          <a
            href={settings.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 text-xs font-light tracking-widest text-shadow-black/55 transition-colors hover:text-maroon sm:text-sm"
          >
            {settings.handle}
          </a>
        )}
        <div className="mx-auto mt-4 h-[2px] w-24 bg-shadow-black" />
      </div>

      {/* 5 Vertical Instagram Cards */}
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {settings.posts.map((post, index) => {
            const targetUrl = post.postUrl || settings.profileUrl;
            const isLastOddMobile = index === settings.posts.length - 1;

            return (
              <a
                key={`ig-post-${index}`}
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={post.caption || `Instagram post ${index + 1}`}
                className={`group relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-beige/25 shadow-sm transition-shadow duration-300 hover:shadow-md ${
                  isLastOddMobile ? 'col-span-2 aspect-[16/9] sm:col-span-1 sm:aspect-[4/5]' : ''
                }`}
              >
                <Image
                  src={post.image}
                  alt={post.caption || `Instagram post ${index + 1}`}
                  fill
                  sizes="(min-width: 1600px) 300px, (min-width: 1024px) 19vw, (min-width: 640px) 32vw, 48vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle Play Indicator for Reels / Video Posts */}
                {post.isReel && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0"
                  >
                    <span className="flex size-11 items-center justify-center rounded-full bg-shadow-black/45 text-main-white backdrop-blur-[2px]">
                      <svg className="ml-0.5 size-4 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>
                )}

                {/* Hover Overlay with IG Icon + Caption */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-shadow-black/50 p-4 text-center text-main-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <svg
                    className="size-6 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  {post.caption && (
                    <p className="mt-2.5 line-clamp-2 text-xs font-light leading-relaxed tracking-wide sm:text-sm">
                      {post.caption}
                    </p>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        {/* Bottom Follow Link */}
        <div className="mt-6 flex justify-center">
          <a
            href={settings.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border-b border-shadow-black/35 pb-1 text-sm font-light tracking-wide text-shadow-black/80 transition-colors duration-200 hover:border-maroon hover:text-maroon"
          >
            <span>Follow on Instagram</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeedSection;
