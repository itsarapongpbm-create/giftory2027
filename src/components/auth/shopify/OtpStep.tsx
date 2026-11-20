'use client';

import OtpDigitInput from './OtpDigitInput';
import { cn } from '@/utils/className';

type OtpStepProps = {
  email: string;
  otpCode: string;
  setOtpCode: (code: string) => void;
  isLoading: boolean;
  isResending: boolean;
  error: string | null;
  countdown: number;
  canResend: boolean;
  onVerify: (code?: string) => void;
  onResend: () => void;
  onEditEmail: () => void;
};

const OtpStep = ({
  email,
  otpCode,
  setOtpCode,
  isLoading,
  isResending,
  error,
  countdown,
  canResend,
  onVerify,
  onResend,
  onEditEmail,
}: OtpStepProps) => {
  const isComplete = otpCode.replace(/\D/g, '').length === 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete && !isLoading) {
      onVerify(otpCode);
    }
  };

  return (
    <div className="w-full">
      {/* Title & Email recipient notice */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-light tracking-tight text-shadow-black sm:text-3xl">
          Enter code
        </h1>
        <div className="mt-2 text-xs font-light text-shadow-black/70 sm:text-sm">
          <span>Sent to </span>
          <span className="font-normal text-shadow-black">{email}</span>
          <div className="mt-1">
            <button
              type="button"
              onClick={onEditEmail}
              disabled={isLoading}
              className="text-xs text-maroon underline underline-offset-2 hover:text-main"
            >
              Change email
            </button>
          </div>
        </div>
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

      {/* 6-Digit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-center text-xs font-light text-shadow-black/70">
            6-digit verification code
          </label>
          <OtpDigitInput
            value={otpCode}
            onChange={setOtpCode}
            onComplete={code => onVerify(code)}
            disabled={isLoading}
            hasError={Boolean(error)}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!isComplete || isLoading}
          className={cn(
            'flex w-full items-center justify-center border py-3 text-xs font-light uppercase tracking-widest text-white transition-all',
            isComplete && !isLoading
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
              <span>Verifying code...</span>
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {/* Resend Code Section */}
      <div className="mt-6 text-center text-xs font-light text-shadow-black/70">
        <p>Didn&apos;t receive a code?</p>
        <div className="mt-1">
          {canResend ? (
            <button
              type="button"
              onClick={onResend}
              disabled={isResending || isLoading}
              className="text-maroon underline underline-offset-2 hover:text-main"
            >
              {isResending ? 'Sending new code...' : 'Resend code'}
            </button>
          ) : (
            <span className="text-shadow-black/40">
              Resend code in {countdown}s
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpStep;
