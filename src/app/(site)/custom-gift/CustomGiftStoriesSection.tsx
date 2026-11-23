'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  STORY_CHAPTERS,
  type StoryArticle,
} from './customGiftStoriesData';
import CustomGiftStoryModal from './CustomGiftStoryModal';

export default function CustomGiftStoriesSection() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeStory, setActiveStory] = useState<StoryArticle | null>(null);
  const [activeStoryList, setActiveStoryList] = useState<StoryArticle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Flatten all stories for navigation
  const allStories = useMemo(() => {
    const list: StoryArticle[] = [];
    STORY_CHAPTERS.forEach((ch) => {
      list.push(ch.featuredStory);
      list.push(...ch.stories);
    });
    return list;
  }, []);

  // Filtered chapters
  const filteredChapters = useMemo(() => {
    if (selectedFilter === 'all') return STORY_CHAPTERS;
    return STORY_CHAPTERS.filter((ch) => ch.id === selectedFilter);
  }, [selectedFilter]);

  // Open Story Modal handler
  const handleOpenStory = useCallback(
    (story: StoryArticle, chapterStories?: StoryArticle[]) => {
      setActiveStory(story);
      setActiveStoryList(chapterStories || allStories);
      setIsModalOpen(true);
    },
    [allStories]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const currentStoryIndex = useMemo(() => {
    if (!activeStory || activeStoryList.length === 0) return -1;
    return activeStoryList.findIndex((s) => s.id === activeStory.id);
  }, [activeStory, activeStoryList]);

  const handlePrevStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setActiveStory(activeStoryList[currentStoryIndex - 1]);
    }
  }, [currentStoryIndex, activeStoryList]);

  const handleNextStory = useCallback(() => {
    if (currentStoryIndex >= 0 && currentStoryIndex < activeStoryList.length - 1) {
      setActiveStory(activeStoryList[currentStoryIndex + 1]);
    }
  }, [currentStoryIndex, activeStoryList]);

  return (
    <section className="relative overflow-hidden border-b border-shadow-black/10 bg-white py-16 md:py-24">
      {/* Subtle Ambient Background Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-beige/20 via-maroon/5 to-beige/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Section Header (Matching Giftory Category Showcase Typography) */}
        <div className="text-center">
          <p className="text-xs font-light tracking-wider text-maroon sm:text-sm">
            เรื่องราวเบื้องหลังความประณีต คัดสรรอย่างประณีต
          </p>
          <h2 className="mt-1 text-2xl font-light tracking-wide text-shadow-black sm:text-3xl lg:text-4xl">
            Bespoke Stories & Craftsmanship
          </h2>
          <div className="mx-auto mt-3 h-[2px] w-12 bg-maroon" />
          <p className="mx-auto mt-4 max-w-2xl text-xs font-light leading-relaxed text-shadow-black/75 sm:text-sm md:text-base">
            บันทึกเรื่องราวศิลปะแห่งการมอบของขวัญ เบื้องหลังงานฝีมือ และแรงบันดาลใจที่ถ่ายทอดลงในทุกชิ้นงานสั่งจัดพิเศษ
          </p>
        </div>

        {/* Luxury Segmented Pill Filter Tabs (Matching 3D Coverflow Segmented Style) */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3">
          <div className="inline-flex max-w-full flex-wrap items-center justify-center rounded-full border border-shadow-black/10 bg-[#FAF8F5] p-1.5 shadow-sm backdrop-blur-md sm:gap-1">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`rounded-full px-4 py-2 text-xs tracking-wide transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-sm ${
                selectedFilter === 'all'
                  ? 'border border-black/5 bg-white font-medium text-maroon shadow-md'
                  : 'font-light text-shadow-black/75 hover:text-shadow-black'
              }`}
            >
              <span>ทั้งหมด (16)</span>
            </button>

            {STORY_CHAPTERS.map((ch) => {
              const isActive = selectedFilter === ch.id;
              // Clean Title Case without hashtag
              const labelMap: Record<string, string> = {
                artisan: 'The Artisan Craft',
                gourmet: 'Curated Gourmet',
                corporate: 'Corporate Etiquette',
                celebration: 'Moments & Celebration',
              };
              const displayLabel = labelMap[ch.id] || ch.hashtag.replace('#', '').trim();

              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setSelectedFilter(ch.id)}
                  className={`rounded-full px-4 py-2 text-xs tracking-wide transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-sm ${
                    isActive
                      ? 'border border-black/5 bg-white font-medium text-maroon shadow-md'
                      : 'font-light text-shadow-black/75 hover:text-shadow-black'
                  }`}
                >
                  <span>{displayLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Subtext info */}
          <div className="flex items-center gap-2 text-xs font-light text-shadow-black/50">
            <span>คัดสรรเรื่องราวและเกร็ดความรู้</span>
            <span className="text-shadow-black/30">—</span>
            <span className="font-normal text-maroon">
              {selectedFilter === 'all'
                ? '16 บทความทั้งหมด'
                : `${filteredChapters[0]?.stories ? filteredChapters[0].stories.length + 1 : 4} บทความในหมวดนี้`}
            </span>
          </div>
        </div>

        {/* Editorial Chapters (AP Thai Large Thematic Containers) */}
        <div className="mt-12 space-y-16 md:space-y-24">
          {filteredChapters.map((chapter) => {
            const chapterAllStories = [chapter.featuredStory, ...chapter.stories];

            return (
              <div
                key={chapter.id}
                id={chapter.id}
                className={`relative overflow-hidden border border-shadow-black/10 bg-gradient-to-b ${chapter.themeGradient} p-6 sm:p-10 md:p-12 shadow-[0_6px_30px_rgba(16,12,8,0.03)]`}
              >
                {/* Chapter Header Row */}
                <div className="mb-10 flex flex-col items-start justify-between gap-4 border-b border-shadow-black/10 pb-6 sm:flex-row sm:items-end">
                  <div>
                    <span className="text-xs font-light tracking-[0.25em] text-maroon uppercase">
                      {chapter.hashtag}
                    </span>
                    <h3 className="mt-1 text-2xl font-light tracking-wide text-shadow-black sm:text-3xl md:text-4xl">
                      {chapter.title}
                    </h3>
                    <div className="mt-3 h-[2px] w-12 bg-maroon" />
                    <p className="mt-3 max-w-2xl text-xs font-light leading-relaxed text-shadow-black/75 sm:text-sm">
                      {chapter.subtitle}
                    </p>
                  </div>

                  <span className={`inline-block border px-3.5 py-1.5 text-xs font-light tracking-widest uppercase ${chapter.badgeColor}`}>
                    Chapter {chapter.hashtag.replace('#', '')}
                  </span>
                </div>

                {/* Asymmetric Top Row: 1/3 Mood Tile + 2/3 Featured Story Card */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
                  {/* 1/3 Mood Inspiration Tile */}
                  <div className="flex flex-col justify-between border border-shadow-black/10 bg-white p-7 sm:p-8 lg:col-span-4">
                    <div>
                      <div className="flex size-10 items-center justify-center rounded-full bg-beige/25 text-maroon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>

                      <span className="mt-6 block text-[11px] font-light tracking-[0.25em] text-maroon uppercase">
                        Editorial Perspective
                      </span>

                      <h4 className="mt-2 text-lg font-light leading-snug tracking-wide text-shadow-black sm:text-xl">
                        {chapter.description}
                      </h4>
                    </div>

                    <div className="mt-8 border-t border-shadow-black/10 pt-4">
                      <span className="text-[10px] font-light tracking-widest text-shadow-black/40 uppercase">
                        Giftory Signature Story
                      </span>
                    </div>
                  </div>

                  {/* 2/3 Horizontal Featured Story Card */}
                  <div
                    onClick={() => handleOpenStory(chapter.featuredStory, chapterAllStories)}
                    className="group relative cursor-pointer overflow-hidden border border-shadow-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-maroon/40 hover:shadow-xl sm:grid sm:grid-cols-12 lg:col-span-8"
                  >
                    {/* Image Column */}
                    <div className="relative min-h-[260px] overflow-hidden bg-gray-100 sm:col-span-6 sm:min-h-full">
                      <Image
                        src={chapter.featuredStory.image}
                        alt={chapter.featuredStory.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* AP Thai Style Diagonal Arrow Action Button on Hover */}
                      <div className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full border border-white/30 bg-maroon text-white shadow-lg transition-transform duration-300 group-hover:scale-110 sm:bottom-4 sm:right-4">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex flex-col justify-between p-7 sm:col-span-6 sm:p-8">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-light tracking-[0.2em] text-maroon uppercase">
                            {chapter.featuredStory.categoryTag}
                          </span>
                          <span className="text-shadow-black/30">·</span>
                          <span className="text-[11px] font-light tracking-wider text-shadow-black/60 uppercase">
                            {chapter.featuredStory.subCategory}
                          </span>
                        </div>

                        <h4 className="mt-3 text-lg font-normal leading-snug tracking-wide text-shadow-black transition-colors group-hover:text-maroon sm:text-xl">
                          {chapter.featuredStory.title}
                        </h4>

                        <p className="mt-3 line-clamp-3 text-xs font-light leading-relaxed text-shadow-black/75 sm:text-sm">
                          {chapter.featuredStory.excerpt}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-shadow-black/10 pt-4">
                        <span className="text-xs font-light text-shadow-black/50">
                          {chapter.featuredStory.readTime}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-light text-maroon transition-transform group-hover:translate-x-1">
                          <span>อ่านเรื่องราวฉบับเต็ม</span>
                          <span aria-hidden="true">›</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: 3-Card Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {chapter.stories.map((story) => (
                    <div
                      key={story.id}
                      onClick={() => handleOpenStory(story, chapterAllStories)}
                      className="group relative flex cursor-pointer flex-col justify-between overflow-hidden border border-shadow-black/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-maroon/40 hover:shadow-lg"
                    >
                      <div>
                        {/* 3:2 Landscape Image Container */}
                        <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100">
                          <Image
                            src={story.image}
                            alt={story.title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          />

                          {/* AP Thai Style Hover Arrow Button */}
                          <div className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full border border-white/30 bg-maroon text-white shadow-md opacity-90 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="7" y1="17" x2="17" y2="7" />
                              <polyline points="7 7 17 7 17 17" />
                            </svg>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-light tracking-[0.2em] text-maroon uppercase">
                              {story.categoryTag}
                            </span>
                            <span className="text-shadow-black/30">·</span>
                            <span className="text-[10px] font-light tracking-wider text-shadow-black/60 uppercase">
                              {story.subCategory}
                            </span>
                          </div>

                          <h5 className="mt-2.5 line-clamp-2 text-base font-normal leading-snug tracking-wide text-shadow-black transition-colors group-hover:text-maroon">
                            {story.title}
                          </h5>

                          <p className="mt-2 line-clamp-2 text-xs font-light leading-relaxed text-shadow-black/70">
                            {story.excerpt}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between border-t border-shadow-black/[0.06] px-6 py-3.5">
                        <span className="text-[11px] font-light text-shadow-black/50">
                          {story.readTime}
                        </span>
                        <span className="text-xs font-light text-maroon transition-transform group-hover:translate-x-1">
                          อ่านต่อ ›
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Brand Values Reassurance Strip */}
        <div className="mt-16 border border-beige/40 bg-[#FAF8F5] p-8 md:p-12">
          <div className="text-center">
            <span className="text-xs font-light tracking-[0.3em] text-maroon uppercase">
              Our Core Philosophy
            </span>
            <h3 className="mt-2 text-2xl font-light tracking-wide text-shadow-black sm:text-3xl">
              ปรัชญาแห่งความพิถีพิถันของ Giftory TH
            </h3>
            <div className="mx-auto my-3 h-[2px] w-12 bg-maroon" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-shadow-black/10 bg-white p-6">
              <span className="text-xs font-light tracking-widest text-maroon uppercase">01 / Material</span>
              <h4 className="mt-2 text-base font-normal text-shadow-black">วัสดุแท้จากธรรมชาติ</h4>
              <p className="mt-2 text-xs font-light leading-relaxed text-shadow-black/75">
                เลือกใช้หนังแท้ ไม้ธรรมชาติ และผ้าเนื้อดีที่ทนทานและนำกลับมาใช้งานได้จริง
              </p>
            </div>

            <div className="border border-shadow-black/10 bg-white p-6">
              <span className="text-xs font-light tracking-widest text-maroon uppercase">02 / Craft</span>
              <h4 className="mt-2 text-base font-normal text-shadow-black">รังสรรค์ด้วยมือทุกชิ้น</h4>
              <p className="mt-2 text-xs font-light leading-relaxed text-shadow-black/75">
                ใส่ใจในทุกรายละเอียด ฝีเข็ม การเข้ามุม และการผูกโบว์ด้วยความชำนาญ
              </p>
            </div>

            <div className="border border-shadow-black/10 bg-white p-6">
              <span className="text-xs font-light tracking-widest text-maroon uppercase">03 / Identity</span>
              <h4 className="mt-2 text-base font-normal text-shadow-black">สะท้อนอัตลักษณ์เฉพาะ</h4>
              <p className="mt-2 text-xs font-light leading-relaxed text-shadow-black/75">
                ปรับแต่งตามโทนสีแพนโทน โลโก้ และข้อความอวยพรที่บ่งบอกตัวตนของผู้ให้
              </p>
            </div>

            <div className="border border-shadow-black/10 bg-white p-6">
              <span className="text-xs font-light tracking-widest text-maroon uppercase">04 / Memory</span>
              <h4 className="mt-2 text-base font-normal text-shadow-black">ความทรงจำเหนือกาลเวลา</h4>
              <p className="mt-2 text-xs font-light leading-relaxed text-shadow-black/75">
                ของขวัญที่สร้างความประทับใจตั้งแต่แรกเห็น และคงคุณค่าแม้เวลาจะผ่านไป
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-shadow-black/10 pt-6 sm:flex-row">
            <p className="text-xs font-light text-shadow-black/70 sm:text-sm">
              พร้อมร่วมสร้างสรรค์เรื่องราวความประทับใจไปกับเราแล้วหรือยัง?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-maroon bg-maroon px-7 py-2.5 text-xs font-light tracking-wider text-white shadow-xs transition-all hover:bg-main-red"
            >
              <span>ติดต่อทีมงาน Giftory</span>
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Story Reader Modal */}
      <CustomGiftStoryModal
        isOpen={isModalOpen}
        story={activeStory}
        onClose={handleCloseModal}
        onPrev={handlePrevStory}
        onNext={handleNextStory}
        hasPrev={currentStoryIndex > 0}
        hasNext={currentStoryIndex >= 0 && currentStoryIndex < activeStoryList.length - 1}
      />
    </section>
  );
}
