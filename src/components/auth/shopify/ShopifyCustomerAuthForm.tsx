'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useShopifyAuthFlow } from '@/hooks/useShopifyAuthFlow';
import EmailStep from './EmailStep';
import OtpStep from './OtpStep';

const LOGO_URL =
  'https://images.giftoryth.com/giftoryth-public/images/logos/logo-red-transparent.webp';

type ShopifyCustomerAuthFormProps = {
  redirectUrl?: string;
};

const ShopifyCustomerAuthForm = ({
  redirectUrl = '/',
}: ShopifyCustomerAuthFormProps) => {
  const {
    step,
    email,
    setEmail,
    otpCode,
    setOtpCode,
    isEmailValid,
    isLoading,
    isResending,
    error,
    countdown,
    canResend,
    announcement,
    handleSendEmail,
    handleVerifyOtp,
    handleResendCode,
    handleEditEmail,
  } = useShopifyAuthFlow(redirectUrl);

  return (
    <div className="w-full max-w-md">
      {/* Screen reader live announcer */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="auth-status-announcer"
      >
        {announcement}
      </div>

      {/* Brand Logo Header */}
      <div className="mb-6 flex flex-col items-center justify-center sm:mb-8">
        <Link
          href="/"
          className="group inline-flex items-center justify-center transition-transform hover:scale-[1.02]"
          aria-label="Giftory home"
        >
          <Image
            src={LOGO_URL}
            alt="Giftory Logo"
            width={260}
            height={160}
            className="h-20 w-auto sm:h-24"
            priority
          />
        </Link>
      </div>

      {/* Main Auth Card */}
      <div className="relative border border-shadow-black/10 bg-white p-6 shadow-sm sm:p-8">
        {/* Back navigation button in OTP step */}
        {step === 'OTP' && (
          <button
            type="button"
            onClick={handleEditEmail}
            className="absolute left-4 top-4 flex items-center gap-1 text-xs font-light text-shadow-black/60 transition-colors hover:text-maroon sm:left-6 sm:top-6"
            aria-label="Back to email input"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <span className="hidden sm:inline">ย้อนกลับ</span>
          </button>
        )}

        {/* Step 1: Email Input */}
        {step === 'EMAIL' && (
          <EmailStep
            email={email}
            setEmail={setEmail}
            isEmailValid={isEmailValid}
            isLoading={isLoading}
            error={error}
            onSubmit={handleSendEmail}
          />
        )}

        {/* Step 2: 6-Digit OTP Verification */}
        {step === 'OTP' && (
          <OtpStep
            email={email}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            isLoading={isLoading}
            isResending={isResending}
            error={error}
            countdown={countdown}
            canResend={canResend}
            onVerify={handleVerifyOtp}
            onResend={handleResendCode}
            onEditEmail={handleEditEmail}
          />
        )}
      </div>

      {/* Footer Navigation */}
      <div className="mt-6 text-center text-xs font-light text-shadow-black/50">
        <Link
          href="/"
          className="hover:text-shadow-black hover:underline transition-colors"
        >
          ‹ กลับสู่หน้าร้านค้า Giftory
        </Link>
      </div>
    </div>
  );
};

export default ShopifyCustomerAuthForm;
