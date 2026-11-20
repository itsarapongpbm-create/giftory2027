'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSiteConfig } from './SiteConfigContext';
// import CatalogCtaSection from './CatalogCtaSection';

const MainFooter = () => {
  const { companyName } = useSiteConfig();

  // Set to true whenever we want to show the "See the Catalog" CTA above the footer
  const SHOW_CATALOG_CTA = false;

  return (
    <div>
      {/* Catalog CTA Strip (Preserved in CatalogCtaSection.tsx, currently hidden) */}
      {SHOW_CATALOG_CTA && (
        <div className="flex flex-col items-center justify-center bg-main-white px-4 py-10">
          {/* <CatalogCtaSection /> */}
        </div>
      )}

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
