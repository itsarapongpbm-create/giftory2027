import Link from 'next/link';
import { LineIcon } from '@/components/icons';
import type { ContactSettings } from '@/lib/siteSettings';

type CustomGiftConsultationSectionProps = {
  contactSettings?: ContactSettings | null;
};

const CustomGiftConsultationSection = ({
  contactSettings,
}: CustomGiftConsultationSectionProps) => {
  const lineId = contactSettings?.lineId || '@giftoryth';
  const lineLink =
    contactSettings?.lineLink ||
    (lineId.startsWith('http')
      ? lineId
      : `https://line.me/R/ti/p/@${lineId.replace(/^@/, '')}`);
  const phone = contactSettings?.hotline || contactSettings?.phone || '06-4444-2454';
  const rawPhone = phone.replace(/[^0-9+]/g, '');

  return (
    <section className="border-t border-shadow-black/10 bg-[#FAF7F2] py-14 md:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 md:px-8">
        <p className="text-xs font-light uppercase tracking-[0.25em] text-maroon">
          Bespoke Consultation
        </p>
        <h2 className="mt-2 text-2xl font-light tracking-wide text-shadow-black sm:text-3xl">
          ร่วมสร้างสรรค์ของขวัญชิ้นพิเศษกับ Giftory TH
        </h2>
        <div className="mx-auto mt-3 h-[2px] w-12 bg-maroon" />

        <p className="mx-auto mt-4 max-w-2xl text-sm font-light leading-relaxed text-shadow-black/75 sm:text-base">
          บอกเล่าโอกาสพิเศษหรือความประทับใจที่คุณมองหา ทีมงานพร้อมให้คำปรึกษาและร่วมออกแบบของขวัญที่สะท้อนความใส่ใจของคุณได้อย่างสมบูรณ์แบบ
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={lineLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-maroon px-7 py-3 text-sm font-light tracking-wide text-main-white transition-all duration-200 hover:bg-main-red"
          >
            <LineIcon className="size-5 fill-white" />
            <span>ปรึกษาผ่าน LINE</span>
          </a>

          {phone && (
            <a
              href={`tel:${rawPhone}`}
              className="inline-flex items-center gap-2.5 border border-shadow-black/20 bg-white px-7 py-3 text-sm font-light tracking-wide text-shadow-black transition-all duration-200 hover:border-maroon hover:text-maroon"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>โทร {phone}</span>
            </a>
          )}
        </div>

        <div className="mt-8">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 text-xs font-light tracking-wider text-shadow-black/60 transition-colors hover:text-maroon"
          >
            <span>ดูช่องทางติดต่อทั้งหมด</span>
            <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CustomGiftConsultationSection;
