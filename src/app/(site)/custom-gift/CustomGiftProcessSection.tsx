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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-maroon"
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-maroon"
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
    title: 'ปรับแต่งดีเทลและเอกลักษณ์เฉพาะ',
    description:
      'ใส่ใจทุกรายละเอียดด้วยการเลือกโทนสีริบบิ้น ป้ายชื่อเฉพาะบุคคล และการ์ดข้อความแทนความรู้สึกจากใจ',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-maroon"
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
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-maroon"
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
    <section className="border-t border-shadow-black/10 bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-xs font-light uppercase tracking-[0.25em] text-maroon">
            The Bespoke Experience
          </p>
          <h2 className="mt-2 text-2xl font-light tracking-wide text-shadow-black sm:text-3xl">
            ขั้นตอนการรังสรรค์ของขวัญชิ้นพิเศษ
          </h2>
          <div className="mx-auto mt-3 h-[2px] w-12 bg-maroon" />
          <p className="mx-auto mt-4 max-w-2xl text-sm font-light leading-relaxed text-shadow-black/70 sm:text-base">
            ทุกรายละเอียดของการจัดของขวัญ ผ่านการดูแลอย่างประณีต เพื่อให้ของขวัญทุกชิ้นถ่ายทอดความรู้สึกได้อย่างสมบูรณ์แบบ
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(item => (
            <div
              key={item.step}
              className="flex flex-col justify-between border border-shadow-black/10 bg-main-white/40 p-6 transition-all duration-300 hover:border-maroon/30 hover:bg-white hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-light tracking-widest text-maroon/70">
                    {item.step}
                  </span>
                  <div className="flex size-9 items-center justify-center border border-shadow-black/10 bg-white">
                    {item.icon}
                  </div>
                </div>

                <p className="mt-5 text-xs font-light uppercase tracking-wider text-shadow-black/50">
                  {item.subtitle}
                </p>
                <h3 className="mt-1 text-base font-normal tracking-wide text-shadow-black">
                  {item.title}
                </h3>
                <p className="mt-3 text-xs font-light leading-relaxed text-shadow-black/70 sm:text-sm">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 h-[1px] w-8 bg-beige" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomGiftProcessSection;
