'use client';

import type { ButtonHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/utils/className';

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingLabel?: string;
};

export default function SubmitButton({
  children,
  pendingLabel = 'Saving...',
  className,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={cn(
        'bg-maroon px-4 py-2 text-sm font-light text-main-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      {...props}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
