'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CloseIcon, TrashIcon } from '@/components/icons';
import { formatPrice } from '@/utils/string';
import { cn } from '@/utils/className';

const CartDrawer = () => {
  const router = useRouter();
  const { isCartOpen, closeCart, items, totalItems, subtotal, updateQuantity, removeItem } =
    useCart();

  useEffect(() => {
    if (!isCartOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-[70] transition-opacity duration-300',
        isCartOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      )}
      aria-hidden={!isCartOpen}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-shadow-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-main-white shadow-2xl transition-transform duration-300 ease-out sm:max-w-lg',
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-shadow-black/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-light tracking-wide text-shadow-black">ตะกร้าสินค้า</h2>
            <span className="rounded-full bg-maroon/10 px-2.5 py-0.5 text-xs font-medium text-maroon">
              {totalItems} ชิ้น
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full p-2 text-shadow-black/60 transition-colors hover:bg-shadow-black/5 hover:text-shadow-black"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-maroon/5 text-maroon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="mb-1 text-base font-light text-shadow-black">
              ยังไม่มีสินค้าในตะกร้าของคุณ
            </h3>
            <p className="mb-6 text-xs text-shadow-black/60">
              เลือกชมกระเช้าของขวัญสุดพรีเมียมได้หลากหลายหมวดหมู่
            </p>
            <Link
              href="/baskets"
              onClick={closeCart}
              className="inline-flex items-center justify-center border border-maroon bg-maroon px-6 py-2.5 text-xs font-light tracking-wider text-white transition-all hover:bg-main hover:border-main"
            >
              เลือกดูกระเช้าสินค้า
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="divide-y divide-shadow-black/10">
              {items.map(item => (
                <li key={item.id} className="flex gap-4 py-4">
                  <div className="relative size-20 shrink-0 overflow-hidden border border-shadow-black/10 bg-white sm:size-24">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/basket/${item.id}`}
                          onClick={closeCart}
                          className="line-clamp-2 text-sm font-light text-shadow-black transition-colors hover:text-maroon"
                        >
                          {item.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="p-1 text-shadow-black/40 transition-colors hover:text-main-red"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                      {item.categoryName && (
                        <span className="text-[11px] text-maroon/80">{item.categoryName}</span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-shadow-black/20 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-shadow-black/70 transition-colors hover:bg-shadow-black/5"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-medium text-shadow-black">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-shadow-black/70 transition-colors hover:bg-shadow-black/5"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-light text-maroon">
                        ฿{formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-shadow-black/10 bg-white px-6 py-5">
            <div className="mb-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-shadow-black/70">
                <span>ยอดรวมสินค้า</span>
                <span>฿{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-shadow-black/70">
                <span>การ์ดอวยพรพร้อมริบบิ้น</span>
                <span className="text-emerald-700">ฟรี</span>
              </div>
              <div className="flex items-center justify-between border-t border-shadow-black/10 pt-2 text-sm font-normal text-shadow-black">
                <span>ยอดรวมสุทธิ (ยังไม่รวมค่าส่ง)</span>
                <span className="text-base font-light text-maroon">฿{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleCheckout}
                className="flex w-full items-center justify-center border border-maroon bg-maroon px-5 py-3 text-sm font-light tracking-wide text-white transition-all hover:bg-main hover:border-main"
              >
                ดำเนินการสั่งซื้อ (Checkout)
              </button>
              <button
                type="button"
                onClick={closeCart}
                className="w-full text-center text-xs text-shadow-black/60 transition-colors hover:text-shadow-black"
              >
                เลือกซื้อสินค้าต่อ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
