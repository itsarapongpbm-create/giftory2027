'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { UserIcon } from '@/components/icons';
import { cn } from '@/utils/className';

type UserNavMenuProps = {
  className?: string;
  showText?: boolean;
};

const UserNavMenu = ({ className, showText = true }: UserNavMenuProps) => {
  const { user, isLoggedIn, logout } = useCustomerAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className={cn(
          'flex items-center gap-1.5 p-2 text-xs font-light tracking-wide text-shadow-black/80 transition-colors hover:text-maroon',
          className
        )}
      >
        <UserIcon className="size-5" />
        {showText && <span className="hidden sm:inline">เข้าสู่ระบบ</span>}
      </Link>
    );
  }

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 p-1.5 text-xs font-light text-shadow-black/80 transition-colors hover:text-maroon"
      >
        <div className="flex size-7 items-center justify-center rounded-full bg-maroon text-[11px] font-medium text-white shadow-sm">
          {initial}
        </div>
        {showText && (
          <span className="hidden max-w-[100px] truncate sm:inline md:max-w-[140px]">
            {user?.name}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-none border border-shadow-black/15 bg-white p-1 shadow-xl ring-1 ring-black/5 z-[70] animate-in fade-in-50 zoom-in-95">
          <div className="border-b border-shadow-black/10 px-3 py-2 text-left">
            <p className="truncate text-xs font-medium text-shadow-black">{user?.name}</p>
            <p className="truncate text-[11px] font-light text-shadow-black/60">{user?.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-left text-xs font-light text-shadow-black transition-colors hover:bg-shadow-black/5 hover:text-maroon"
            >
              หน้าชำระเงิน / ตะกร้า
            </Link>
          </div>

          <div className="border-t border-shadow-black/10 pt-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full px-3 py-2 text-left text-xs font-light text-main-red transition-colors hover:bg-main-red/5"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNavMenu;
