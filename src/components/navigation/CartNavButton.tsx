'use client';

import { useCart } from '@/context/CartContext';
import { CartIcon } from '@/components/icons';
import { cn } from '@/utils/className';

type CartNavButtonProps = {
  className?: string;
};

const CartNavButton = ({ className }: CartNavButtonProps) => {
  const { totalItems, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open shopping cart (${totalItems} items)`}
      className={cn(
        'group relative flex items-center justify-center p-2 text-shadow-black/80 transition-colors hover:text-maroon',
        className
      )}
    >
      <CartIcon className="size-5 transition-transform duration-200 group-hover:scale-110" />
      {totalItems > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-maroon text-[10px] font-medium text-white shadow-sm ring-2 ring-white animate-in zoom-in-50">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};

export default CartNavButton;
