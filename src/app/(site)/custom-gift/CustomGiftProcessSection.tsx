import React from 'react';

const steps = [
  {
    step: '01',
    subtitle: 'Concept & Occasion',
    title: 'ปรึกษาและวางคอนเซ็ปต์',
    description:
      'บอกเล่าโอกาสพิเศษ ธีมที่ต้องการ หรือสไตล์ของขวัญที่สื่อถึงผู้รับ เพื่อกำหนดทิศทางที่ตอบโจทย์อย่างสมบูรณ์แบบ',
    icon: (
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
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    step: '02',
    subtitle: 'Curated Selection',
    title: 'คัดสรรกล่องและไอเทมพรีเมียม',
    description:
      'เลือกสรรรูปแบบกล่องหรือกระเช้า พร้อมคัดเลือกสินค้าพรีเมียมด้านใน ทั้งสินค้านำเข้าและแบรนด์คุณภาพสูง',
    icon: (
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
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
  },
  {
    step: '03',
    subtitle: 'Signature Personalization',
    title: 'ปรับแต่งดีเทลและอัตลักษณ์เฉพาะ',
    description:
      'ใส่ใจทุกรายละเอียดด้วยการเลือกโทนสีริบบิ้น ป้ายชื่อเฉพาะบุคคล และการ์ดข้อความแทนความรู้สึกจากใจ',
    icon: (
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
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    step: '04',
    subtitle: 'Artisan Assembly & Delivery',
    title: 'จัดทำอย่างประณีตและส่งมอบ',
    description:
      'บรรจุและตกแต่งด้วยมือทุกชิ้นด้วยความพิถีพิถัน พร้อมบริการจัดส่งถึงมือผู้รับอย่างปลอดภัยและตรงเวลา',
    icon: (
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
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
];

const CustomGiftProcessSection = () => {
  return (
    <section className="relative overflow-hidden border-t border-b border-shadow-black/10 bg-[#FAF8F5] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Section Header (Matching Giftory Category Showcase Typography) */}
        <div className="text-center">
          <p className="text-xs font-light tracking-wider text-maroon sm:text-sm">
            ขั้นตอนการรังสรรค์ของขวัญชิ้นพิเศษ คัดสรรอย่างประณีต
          </p>
          <h2 className="mt-1 text-2xl font-light tracking-wide text-shadow-black sm:text-3xl lg:text-4xl">
            The Bespoke Experience
          </h2>
          <div className="mx-auto mt-3 h-[2px] w-12 bg-maroon" />
          <p className="mx-auto mt-4 max-w-2xl text-xs font-light leading-relaxed text-shadow-black/75 sm:text-sm md:text-base">
            ทุกรายละเอียดของการจัดของขวัญ ผ่านการดูแลอย่างประณีต เพื่อให้ของขวัญทุกชิ้นถ่ายทอดความรู้สึกได้อย่างสมบูรณ์แบบ
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="relative mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:mt-16">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="group relative flex flex-col justify-between overflow-hidden border border-shadow-black/10 bg-white p-7 shadow-[0_4px_24px_rgba(16,12,8,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-maroon/40 hover:shadow-[0_14px_36px_rgba(16,12,8,0.08)]"
            >
              {/* Top Accent Line on Hover */}
              <div className="absolute left-0 right-0 top-0 h-[2px] bg-transparent transition-colors duration-300 group-hover:bg-maroon" />

              {/* Large Watermark Step Number */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-2 select-none text-6xl font-extralight tracking-tighter text-shadow-black/[0.04] transition-colors duration-300 group-hover:text-maroon/[0.09]"
              >
                {item.step}
              </span>

              {/* Card Body */}
              <div className="relative z-10">
                {/* Step Tag & Icon Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-light tracking-[0.25em] text-maroon uppercase">
                      Step {item.step}
                    </span>
                    <div className="h-[1px] w-5 bg-beige" />
                  </div>

                  <div className="flex size-10 items-center justify-center rounded-full bg-beige/20 text-maroon transition-all duration-300 group-hover:bg-maroon group-hover:text-main-white">
                    {item.icon}
                  </div>
                </div>

                {/* Subtitle & Title */}
                <p className="mt-6 text-[11px] font-light uppercase tracking-[0.2em] text-shadow-black/50">
                  {item.subtitle}
                </p>
                <h3 className="mt-1 text-base font-normal tracking-wide text-shadow-black transition-colors group-hover:text-maroon sm:text-lg">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-xs font-light leading-relaxed text-shadow-black/75 sm:text-sm">
                  {item.description}
                </p>
              </div>

              {/* Bottom Decorative Footer */}
              <div className="relative z-10 mt-8 flex items-center justify-between border-t border-shadow-black/[0.06] pt-4">
                <span className="text-[10px] font-light tracking-widest text-shadow-black/40 uppercase">
                  Giftory Bespoke
                </span>
                <span
                  aria-hidden="true"
                  className="text-sm font-light text-beige transition-transform duration-300 group-hover:translate-x-1 group-hover:text-maroon"
                >
                  ›
                </span>
              </div>

              {/* Connecting Chevron on Desktop (except last item) */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-3.5 top-1/2 z-20 hidden size-7 -translate-y-1/2 items-center justify-center rounded-full border border-shadow-black/10 bg-white text-xs text-beige shadow-xs lg:flex"
                >
                  ›
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomGiftProcessSection;
