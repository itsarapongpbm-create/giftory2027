'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/utils/className';

type OtpDigitInputProps = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  hasError?: boolean;
};

const LENGTH = 6;

const OtpDigitInput = ({
  value,
  onChange,
  onComplete,
  disabled = false,
  hasError = false,
}: OtpDigitInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array of 6 characters
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] || '');

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, char: string) => {
    // Only accept numeric digits
    const cleaned = char.replace(/\D/g, '');
    if (!cleaned) return;

    const newDigits = [...digits];
    newDigits[index] = cleaned[cleaned.length - 1]; // take the last entered char
    const combined = newDigits.join('');
    onChange(combined);

    if (index < LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (combined.length === LENGTH && onComplete) {
      onComplete(combined);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];

      if (digits[index]) {
        newDigits[index] = '';
        onChange(newDigits.join(''));
      } else if (index > 0) {
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < LENGTH - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (!pasted) return;

    onChange(pasted);

    const focusIndex = Math.min(pasted.length, LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === LENGTH && onComplete) {
      onComplete(pasted);
    }
  };

  return (
    <div
      role="group"
      aria-label="6-digit verification code"
      className="flex items-center justify-between gap-2 sm:gap-3"
    >
      {Array.from({ length: LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={el => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          pattern="[0-9]*"
          maxLength={1}
          value={digits[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${LENGTH}`}
          aria-invalid={hasError}
          className={cn(
            'size-11 sm:size-12 rounded-sm border text-center font-mono text-lg font-medium transition-all sm:text-xl',
            'bg-white text-shadow-black focus:outline-none',
            hasError
              ? 'border-main-red focus:border-main-red focus:ring-1 focus:ring-main-red/30'
              : 'border-shadow-black/20 focus:border-maroon focus:ring-1 focus:ring-maroon/20',
            disabled && 'bg-slate-50 opacity-60 cursor-not-allowed'
          )}
        />
      ))}
    </div>
  );
};

export default OtpDigitInput;
