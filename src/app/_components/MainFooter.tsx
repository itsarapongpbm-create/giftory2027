'use client';

import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { OutlineButton } from '@/components/buttons';
import { ContactForm } from '@/components/forms';
import { useSiteConfig } from './SiteConfigContext';

const MainFooter = () => {
  const { lineId, lineLink, instagramLink, email, hotline, phone, locationLink, locationText, companyName } =
    useSiteConfig();

  const displayPhone = hotline || phone;
  const telHref = `tel:${displayPhone.replace(/[^0-9+]/g, '')}`;
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent('Inquiry from giftoryth.com')}`;

  const copySilently = async (text: string, label: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast.success(`${label}: ${text} (คัดลอกแล้ว)`, { duration: 2500 });
      }
    } catch {
      // Ignore clipboard errors on restricted contexts
    }
  };

  return (
    <div>
      {/* Catalog CTA Strip */}
      <div className="flex flex-col items-center justify-center bg-main-white px-4 py-10">
        <OutlineButton
          color="primary"
          size="lg"
          onClick={() =>
            (document.getElementById('open_catalog_dialog') as HTMLDialogElement)?.showModal()
          }
        >
          See the Catalog
        </OutlineButton>
        <dialog id="open_catalog_dialog" className="modal !rounded-none !p-0">
          <div className="modal-box w-full !rounded-none !p-0">
            <form method="dialog">
              <button
                aria-label="Close catalog dialog"
                className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4"
              >
                ✕
              </button>
            </form>
            <ContactForm />
          </div>
        </dialog>
      </div>

      {/* Minimal Dark Footer */}
      <footer className="border-t border-white/10 bg-[#0E0C0B] px-6 py-10 text-main-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          {/* Brand Logo */}
          <Link
            href="/"
            aria-label="giftory home"
            className="flex h-12 items-center justify-center overflow-hidden opacity-95 transition-opacity duration-200 hover:opacity-100"
          >
            <Image
              src="/images/logos/logo-white-transparent.webp"
              alt="giftory logo"
              width={200}
              height={141}
              className="h-24 w-auto"
            />
          </Link>

          {/* 4 App-Colored Hover Links */}
          <nav
            aria-label="Contact links"
            className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 sm:gap-x-9"
          >
            {/* LINE */}
            <a
              href={lineLink}
              target="_blank"
              rel="noopener noreferrer"
              title={`LINE ${lineId}`}
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-main-white/45 transition-all duration-200 hover:text-[#06C755] hover:drop-shadow-[0_0_10px_rgba(6,199,85,0.55)]"
            >
              <svg
                className="size-[17px] shrink-0 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
              <span>LINE</span>
            </a>

            {/* INSTAGRAM */}
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram @giftory.th"
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-main-white/45 transition-all duration-200 hover:text-[#E4405F] hover:drop-shadow-[0_0_10px_rgba(228,64,95,0.55)]"
            >
              <svg
                className="size-[17px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>INSTAGRAM</span>
            </a>

            {/* EMAIL */}
            <a
              href={mailtoHref}
              onClick={() => copySilently(email, 'Email')}
              title={email}
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-main-white/45 transition-all duration-200 hover:text-[#EA4335] hover:drop-shadow-[0_0_10px_rgba(234,67,53,0.55)]"
            >
              <svg
                className="size-[17px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>EMAIL</span>
            </a>

            {/* PHONE */}
            <a
              href={telHref}
              onClick={() => copySilently(displayPhone, 'Phone')}
              title={displayPhone}
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-main-white/45 transition-all duration-200 hover:text-[#38BDF8] hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.55)]"
            >
              <svg
                className="size-[17px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>PHONE</span>
            </a>

            {/* LOCATION */}
            <a
              href={locationLink}
              target="_blank"
              rel="noopener noreferrer"
              title={locationText}
              className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-main-white/45 transition-all duration-200 hover:text-[#FBBC04] hover:drop-shadow-[0_0_10px_rgba(251,188,4,0.55)]"
            >
              <svg
                className="size-[17px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>LOCATION</span>
            </a>
          </nav>

          {/* Bottom Copyright Line */}
          <p className="mt-6 text-[11px] font-light tracking-[0.14em] text-main-white/35">
            © 2026 GIFTORY · {companyName} · Providing reliable since 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainFooter;
