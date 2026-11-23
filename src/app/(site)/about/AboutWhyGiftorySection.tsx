import React from 'react';
import Link from 'next/link';

type TrustPillar = {
  step: string;
  subtitle: string;
  title: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
};

const TRUST_PILLARS: TrustPillar[] = [
  {
    step: '01',
    subtitle: 'Brand Identity Alignment',
    title: 'สะท้อนอัตลักษณ์องค์กรอย่างสมบูรณ์แบบ',
    description:
      'ออกแบบเฉพาะแบรนด์ด้วยการเทียบเฉดสี Pantone ประจำองค์กร งานปักริบบิ้นชื่อแบรนด์ ป้ายแท็กโลหะเลเซอร์ และการปั๊มฟอยล์ทองหรูหรา เพื่อให้ของขวัญทุกชิ้นส่งต่อภาพลักษณ์ที่ดีที่สุดขององค์กรคุณ',
    tags: ['Pantone Matched', 'Embroidered Ribbon', 'Laser Engraved Tag'],
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    step: '02',
    subtitle: 'Flexible Budget Curation',
    title: 'คัดสรรไอเทมคุณภาพตามงบประมาณ',
    description:
      'ยืดหยุ่นตามโจทย์และงบประมาณขององค์กร คัดสรรสินค้ากูร์เมต์นำเข้า ขนมระดับอาร์ทิซาน ชาออร์แกนิก หรือสินค้าพรีเมียมเฉพาะด้าน โดยยังคงมาตรฐานความหรูหราและความคุ้มค่าในทุกระดับราคา',
    tags: ['Curated Import', 'Budget Optimization', 'Artisan Gourmet'],
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
        <path d="M2 9h20" />
        <path d="M10 21l-4-12" />
        <path d="M14 21l4-12" />
      </svg>
    ),
  },
  {
    step: '03',
    subtitle: 'Corporate Standard & Full Tax Invoice',
    title: 'มาตรฐานนิติบุคคล เอกสารครบวงจร',
    description:
      'เข้าใจขั้นตอนจัดซื้อขององค์กรอย่างลึกซึ้ง ออกใบเสนอราคา ใบเสร็จรับเงิน และใบกำกับภาษีเต็มรูปแบบอย่างถูกต้องแม่นยำ พร้อมเงื่อนไขการวางบิลและการชำระเงินที่สอดคล้องกับระเบียบของบริษัท',
    tags: ['Full Tax Invoice', 'Quotation Support', 'Corporate Terms'],
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    step: '04',
    subtitle: 'On-Time & Nationwide Door-to-Door',
    title: 'จัดส่งตรงเวลาถึงมือผู้รับทั่วประเทศ',
    description:
      'วางแผนและบริหารการจัดส่งระดับมืออาชีพ รับประกันส่งมอบตรงนัดหมายสำหรับงานอีเวนต์สำคัญ พร้อมบริการกระจายจัดส่งถึงมือผู้รับรายบุคคล (Direct-to-Recipient) อย่างประณีตและปลอดภัย',
    tags: ['On-Time Guarantee', 'Direct-to-Recipient', 'Careful Packing'],
    icon: (
      <svg
        width="22"
        height="22"
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

export default function AboutWhyGiftorySection() {
  return (
    <section className="relative overflow-hidden border-t border-shadow-black/10 bg-white py-16 md:py-24">
      {/* Subtle Ambient Background Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#FAF8F5] via-beige/10 to-transparent blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-xs font-light tracking-wider text-maroon sm:text-sm">
            ความไว้วางใจระดับองค์กร คัดสรรอย่างประณีต
          </p>
          <h2 className="mt-1 text-2xl font-light tracking-wide text-shadow-black sm:text-3xl lg:text-4xl">
            Why Giftory TH
          </h2>
          <div className="mx-auto mt-3 h-[2px] w-12 bg-maroon" />
          <p className="mx-auto mt-4 max-w-2xl text-xs font-light leading-relaxed text-shadow-black/75 sm:text-sm md:text-base">
            เหตุผลที่องค์กรชั้นนำและแบรนด์ระดับแนวหน้า ไว้วางใจให้ Giftory TH เป็นผู้รังสรรค์ของขวัญและกระเช้าพรีเมียมในทุกวาระสำคัญ
          </p>
        </div>

        {/* 4 Trust Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:mt-16">
          {TRUST_PILLARS.map((item) => (
            <div
              key={item.step}
              className="group relative flex flex-col justify-between overflow-hidden border border-shadow-black/10 bg-[#FAF8F5]/50 p-7 shadow-[0_4px_24px_rgba(16,12,8,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-maroon/40 hover:bg-white hover:shadow-[0_14px_36px_rgba(16,12,8,0.08)]"
            >
              {/* Top Accent Hover Line */}
              <div className="absolute left-0 right-0 top-0 h-[2px] bg-transparent transition-colors duration-300 group-hover:bg-maroon" />

              {/* Watermark Step Number */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-2 select-none text-6xl font-extralight tracking-tighter text-shadow-black/[0.04] transition-colors duration-300 group-hover:text-maroon/[0.08]"
              >
                {item.step}
              </span>

              {/* Card Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-light tracking-[0.25em] text-maroon uppercase">
                      Pillar {item.step}
                    </span>
                    <div className="h-[1px] w-5 bg-beige" />
                  </div>

                  <div className="flex size-10 items-center justify-center rounded-full bg-beige/25 text-maroon transition-all duration-300 group-hover:bg-maroon group-hover:text-white">
                    {item.icon}
                  </div>
                </div>

                <p className="mt-6 text-[11px] font-light uppercase tracking-[0.2em] text-shadow-black/50">
                  {item.subtitle}
                </p>
                <h3 className="mt-1 text-base font-normal tracking-wide text-shadow-black transition-colors group-hover:text-maroon sm:text-lg">
                  {item.title}
                </h3>

                <p className="mt-3 text-xs font-light leading-relaxed text-shadow-black/75 sm:text-sm">
                  {item.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-shadow-black/10 bg-white px-2.5 py-1 text-[10px] font-light tracking-wide text-shadow-black/70 transition-colors group-hover:border-maroon/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-8 flex items-center justify-between border-t border-shadow-black/[0.06] pt-4">
                <span className="text-[10px] font-light tracking-widest text-shadow-black/40 uppercase">
                  Corporate Assurance
                </span>
                <span
                  aria-hidden="true"
                  className="text-sm font-light text-beige transition-transform duration-300 group-hover:translate-x-1 group-hover:text-maroon"
                >
                  ›
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Concierge Reassurance Strip */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border border-beige/40 bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] p-6 shadow-xs sm:flex-row sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-maroon/20 bg-maroon/5 text-maroon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-normal tracking-wide text-shadow-black sm:text-base">
                บริการ Gift Concierge สำหรับลูกค้าองค์กร
              </h4>
              <p className="mt-0.5 text-xs font-light text-shadow-black/70 sm:text-sm">
                ทีมงานพร้อมให้คำปรึกษา ออกแบบตัวอย่าง Mockup และจัดทำใบเสนอราคาภายใน 24 ชั่วโมง
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-maroon bg-maroon px-6 py-2.5 text-xs font-light tracking-wider text-white shadow-xs transition-all duration-300 hover:bg-main-red hover:shadow-md"
          >
            <span>ขอใบเสนอราคาองค์กร</span>
            <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
