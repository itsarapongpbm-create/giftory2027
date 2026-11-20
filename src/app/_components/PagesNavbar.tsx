'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils';
import CartNavButton from '@/components/navigation/CartNavButton';
import UserNavMenu from '@/components/navigation/UserNavMenu';
import { NAV_ITEMS } from './MainNavbar';

const LOGO_URL = 'https://images.giftoryth.com/giftoryth-public/images/logos/logo-red-transparent.webp';

const PagesNavbar = () => {
  const pathname = usePathname();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isStuck, setIsStuck] = useState(false);

  const isActive = (path: string) => pathname === path || pathname === `${path}/`;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="hidden h-px w-full lg:block" />
      <nav
        aria-label="Main navigation"
        className={cn(
          'sticky top-0 z-40 hidden w-full border-b transition-all duration-300 lg:block',
          isStuck
            ? 'border-shadow-black/10 bg-main-white/95 shadow-[0_4px_20px_-4px_rgba(16,12,8,0.08)] backdrop-blur-md'
            : 'border-shadow-black/10 bg-main-white'
        )}
      >
        <div className="mx-auto grid h-[52px] max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-8">
          <div className="flex h-full items-center justify-start overflow-hidden">
            <Link
              href="/"
              aria-label="giftory home"
              tabIndex={isStuck ? 0 : -1}
              className={cn(
                'flex items-center transition-all duration-300',
                isStuck ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
              )}
            >
              <Image
                src={LOGO_URL}
                alt="Giftoryth Logo"
                width={180}
                height={112}
                className="h-24 w-auto"
              />
            </Link>
          </div>

          <ul className="flex items-center gap-x-8">
            {NAV_ITEMS.map(item => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'relative inline-flex h-[52px] items-center text-[15px] tracking-wide transition-colors duration-200 hover:text-main-red',
                      active
                        ? 'font-normal text-main-red after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-main-red'
                        : 'font-light text-shadow-black/80'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div
            className={cn(
              'flex items-center justify-end gap-3 transition-all duration-300',
              isStuck ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
            )}
          >
            <UserNavMenu showText={false} />
            <CartNavButton />
          </div>
        </div>
      </nav>
    </>
  );
};

export default PagesNavbar;
