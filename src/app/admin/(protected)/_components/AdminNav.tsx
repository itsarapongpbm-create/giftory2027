'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/utils/className';

type AdminNavProps = {
  logoutAction: () => Promise<void>;
};

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/home', label: 'Home', exact: true },
  { href: '/admin/home/identity', label: 'Identity' },
  { href: '/admin/home/catalog', label: 'Home Catalog' },
  { href: '/admin/custom-gift', label: 'Custom Gift' },
  { href: '/admin/about', label: 'About' },
  { href: '/admin/contact', label: 'Contact & PDF' },
  { href: '/admin/media', label: 'Media' },
];

export default function AdminNav({ logoutAction }: AdminNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-shadow-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-base font-medium tracking-wide text-maroon">
            Giftoryth Admin
          </Link>
          <Link
            href="/"
            target="_blank"
            className="hidden border border-shadow-black/15 px-2.5 py-1 text-xs font-light text-shadow-black/70 transition-colors hover:border-maroon hover:text-maroon sm:inline-block"
          >
            View Site ↗
          </Link>
        </div>

        <nav className="hidden flex-wrap items-center gap-1 lg:flex">
          {navItems.map(item => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-2.5 py-1.5 text-sm font-light transition-colors',
                  active
                    ? 'bg-maroon text-main-white'
                    : 'text-shadow-black/75 hover:bg-maroon/5 hover:text-maroon'
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <form action={logoutAction} className="ml-2">
            <button
              type="submit"
              className="border border-shadow-black/20 px-3 py-1.5 text-sm font-light text-shadow-black/80 transition-colors hover:border-main-red hover:text-main-red"
            >
              Logout
            </button>
          </form>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen(prev => !prev)}
          className="border border-shadow-black/20 px-3 py-1.5 text-sm font-light lg:hidden"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-shadow-black/10 bg-white px-4 py-3 lg:hidden">
          <nav className="grid gap-1">
            {navItems.map(item => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-3 py-2 text-sm font-light',
                    active ? 'bg-maroon text-main-white' : 'text-shadow-black/80 hover:bg-maroon/5'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 flex items-center gap-2 border-t border-shadow-black/10 pt-3">
              <Link
                href="/"
                target="_blank"
                className="flex-1 border border-shadow-black/20 px-3 py-2 text-center text-sm font-light"
              >
                View Site ↗
              </Link>
              <form action={logoutAction} className="flex-1">
                <button
                  type="submit"
                  className="w-full border border-main-red px-3 py-2 text-sm font-light text-main-red"
                >
                  Logout
                </button>
              </form>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
