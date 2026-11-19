'use client';

import Image from 'next/image';
import Link from 'next/link';
import { OutlineButton } from '@/components/buttons';
import { ContactForm } from '@/components/forms';
import { useSiteConfig } from './SiteConfigContext';

const MainFooter = () => {
  const { companyName } = useSiteConfig();

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

      {/* Minimal Clean Dark Footer */}
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

          {/* Bottom Copyright Line */}
          <p className="mt-5 text-[11px] font-light tracking-[0.14em] text-main-white/40">
            © 2026 GIFTORY · {companyName} · Providing reliable since 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainFooter;
