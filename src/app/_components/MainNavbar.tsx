'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { CloseIcon, HamburgerMenuIcon, CartIcon } from '@/components/icons';
import CartNavButton from '@/components/navigation/CartNavButton';
import UserNavMenu from '@/components/navigation/UserNavMenu';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useCart } from '@/context/CartContext';
import { cn } from '@/utils';

export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/baskets', label: 'Basket' },
  { href: '/custom-gift', label: 'Custom Gift' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

const LOGO_URL = 'https://images.giftoryth.com/giftoryth-public/images/logos/logo-red-transparent.webp';

const MainNavbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useCustomerAuth();
  const { totalItems, openCart } = useCart();

  const isActive = (path: string) => pathname === path || pathname === `${path}/`;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-shadow-black/10 bg-main-white/95 backdrop-blur-md lg:relative lg:z-[60] lg:border-b-0 lg:bg-main-white lg:backdrop-blur-none">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:px-6 lg:h-[88px]">
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="btn btn-ghost btn-circle btn-sm md:btn-md lg:hidden"
            >
              <HamburgerMenuIcon className="!size-6" />
            </button>
          </div>

          <div className="flex h-full items-center justify-center overflow-hidden">
            <Link href="/" className="flex items-center justify-center" aria-label="giftory home">
              <Image
                src={LOGO_URL}
                alt="Giftoryth Logo"
                width={320}
                height={200}
                className="h-28 w-auto sm:h-32 lg:h-40"
                priority
              />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-1.5 sm:gap-3">
            <UserNavMenu showText={true} />
            <CartNavButton />
          </div>
        </div>
      </header>

      {/* Mobile slide-over navigation drawer */}
      <div
        className={cn(
          'fixed inset-0 z-[60] transition-opacity duration-300 lg:hidden',
          isMobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          className="absolute inset-0 bg-shadow-black/35 backdrop-blur-[1px]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <aside
          className={cn(
            'relative flex h-full w-72 max-w-[82vw] flex-col bg-main-white shadow-xl transition-transform duration-300 ease-out',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-shadow-black/10 px-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex h-full items-center overflow-hidden"
            >
              <Image
                src={LOGO_URL}
                alt="Giftoryth Logo"
                width={200}
                height={125}
                className="h-24 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="btn btn-ghost btn-circle btn-sm"
            >
              <CloseIcon className="!size-5" />
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map(item => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'block rounded-sm px-3 py-2.5 text-base font-light tracking-wide transition-colors duration-200 hover:bg-shadow-black/5 hover:text-main-red',
                        active ? 'font-normal text-main-red' : 'text-shadow-black/85'
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile Drawer Auth & Cart Footer */}
          <div className="border-t border-shadow-black/10 p-4">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openCart();
              }}
              className="mb-3 flex w-full items-center justify-between border border-shadow-black/20 bg-white px-3.5 py-2.5 text-xs text-shadow-black transition-colors hover:border-maroon"
            >
              <span className="flex items-center gap-2">
                <CartIcon className="size-4" />
                <span>ตะกร้าสินค้า</span>
              </span>
              <span className="rounded-full bg-maroon px-2 py-0.5 text-[11px] text-white">
                {totalItems}
              </span>
            </button>

            {isLoggedIn ? (
              <div className="flex items-center justify-between border border-shadow-black/10 bg-white p-2.5">
                <div className="min-w-0 flex-1 pr-2">
                  <p className="truncate text-xs font-medium text-shadow-black">{user?.name}</p>
                  <p className="truncate text-[10px] text-shadow-black/60">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="shrink-0 text-xs text-main-red hover:underline"
                >
                  ออก
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full border border-maroon bg-maroon py-2.5 text-center text-xs font-light text-white transition-colors hover:bg-main hover:border-main"
              >
                เข้าสู่ระบบ / สมัครสมาชิก
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};

export default MainNavbar;
