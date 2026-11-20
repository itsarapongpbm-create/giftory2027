'use client';

import Link from 'next/link';
import { cn } from '@/utils/className';

type EmailStepProps = {
  email: string;
  setEmail: (email: string) => void;
  isEmailValid: boolean;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
};

const EmailStep = ({
  email,
  setEmail,
  isEmailValid,
  isLoading,
  error,
  onSubmit,
}: EmailStepProps) => {
  return (
    <div className="w-full">
      {/* Title & Description */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-light tracking-tight text-shadow-black sm:text-3xl">
          Sign in
        </h1>
        <p className="mt-2 text-xs font-light text-shadow-black/70 sm:text-sm">
          Enter your email and we&apos;ll send you a verification code
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-4 rounded-sm border border-main-red/30 bg-red-50/80 p-3 text-xs text-main-red"
        >
          <div className="flex items-center gap-2">
            <svg
              className="size-4 shrink-0 fill-current"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Email Form */}
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="customer-email"
            className="mb-1.5 block text-xs font-light text-shadow-black/80"
          >
            Email
          </label>
          <input
            id="customer-email"
            type="email"
            name="email"
            autoComplete="email"
            autoFocus
            disabled={isLoading}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@example.com"
            aria-required="true"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'email-error' : undefined}
            className={cn(
              'w-full border bg-white px-3.5 py-2.5 text-sm font-light text-shadow-black transition-colors',
              'placeholder:text-shadow-black/30 focus:outline-none',
              error
                ? 'border-main-red focus:border-main-red'
                : 'border-shadow-black/20 focus:border-maroon focus:ring-1 focus:ring-maroon/20',
              isLoading && 'bg-slate-50 opacity-60 cursor-not-allowed'
            )}
          />
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={!isEmailValid || isLoading}
          className={cn(
            'flex w-full items-center justify-center border py-3 text-xs font-light uppercase tracking-widest text-white transition-all',
            isEmailValid && !isLoading
              ? 'border-maroon bg-maroon hover:bg-main hover:border-main active:scale-[0.99]'
              : 'border-shadow-black/10 bg-shadow-black/30 text-white/80 cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="size-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Sending code...</span>
            </span>
          ) : (
            'Continue'
          )}
        </button>
      </form>

      {/* Terms and Privacy policy footer */}
      <div className="mt-6 text-center text-[11px] font-light leading-relaxed text-shadow-black/60">
        <p>
          By continuing, you agree to our{' '}
          <Link
            href="/about"
            className="text-maroon underline underline-offset-2 hover:text-main"
          >
            Terms of service
          </Link>{' '}
          and acknowledge our{' '}
          <Link
            href="/about"
            className="text-maroon underline underline-offset-2 hover:text-main"
          >
            Privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default EmailStep;
