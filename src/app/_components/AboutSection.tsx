import Image from 'next/image';
import Topic from './Topic';
import { getAboutSettings } from '@/lib/siteSettings';

const AboutSection = async () => {
  const aboutSettings = await getAboutSettings();

  return (
    <section aria-label="About" id="about">
      <Topic title="About" />

      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
        {/* Desktop 2x2 Editorial Checkerboard */}
        <div className="hidden overflow-hidden border border-shadow-black/10 bg-white lg:grid lg:grid-cols-2">
          <div className="relative h-[480px] overflow-hidden bg-beige/30 xl:h-[520px]">
            <Image
              src={aboutSettings.firstImage}
              alt={aboutSettings.firstAlt}
              fill
              sizes="(min-width: 1600px) 768px, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex h-[480px] flex-col justify-center bg-main-white px-12 xl:h-[520px] xl:px-20">
            <p className="drop-cap whitespace-pre-line text-lg font-extralight leading-relaxed tracking-wide text-maroon xl:text-2xl">
              {aboutSettings.firstParagraph}
            </p>
          </div>

          <div className="flex h-[480px] flex-col justify-center bg-beige/20 px-12 xl:h-[520px] xl:px-20">
            <p className="drop-cap whitespace-pre-line text-lg font-extralight leading-relaxed tracking-wide text-maroon xl:text-2xl">
              {aboutSettings.secondParagraph}
            </p>
          </div>
          <div className="relative h-[480px] overflow-hidden bg-beige/30 xl:h-[520px]">
            <Image
              src={aboutSettings.secondImage}
              alt={aboutSettings.secondAlt}
              fill
              sizes="(min-width: 1600px) 768px, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Mobile / Tablet Stacked Overlay Cards */}
        <div className="flex flex-col overflow-hidden border border-shadow-black/10 lg:hidden">
          <div className="relative h-[420px] bg-beige sm:h-[480px]">
            <Image
              src={aboutSettings.firstImage}
              alt={aboutSettings.firstAlt}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center bg-shadow-black/55 px-6 sm:px-14">
              <p className="drop-cap whitespace-pre-line text-sm font-light leading-relaxed tracking-wide text-main-white sm:text-base md:text-lg">
                {aboutSettings.firstParagraph}
              </p>
            </div>
          </div>
          <div className="relative h-[420px] bg-beige sm:h-[480px]">
            <Image
              src={aboutSettings.secondImage}
              alt={aboutSettings.secondAlt}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center bg-shadow-black/55 px-6 sm:px-14">
              <p className="drop-cap whitespace-pre-line text-sm font-light leading-relaxed tracking-wide text-main-white sm:text-base md:text-lg">
                {aboutSettings.secondParagraph}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
