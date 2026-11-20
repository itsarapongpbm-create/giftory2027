'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { EMAIL_REGEX, type ShopifyCustomerProfile } from '@/lib/auth/shopifyCustomer';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import toast from 'react-hot-toast';

export type AuthStep = 'EMAIL' | 'OTP';

const RESEND_COOLDOWN_SECONDS = 60;

export const useShopifyAuthFlow = (onSuccessRedirect = '/') => {
  const router = useRouter();
  const { login } = useCustomerAuth();

  const [step, setStep] = useState<AuthStep>('EMAIL');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [challengeId, setChallengeId] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [countdown, setCountdown] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  // Real-time email validation
  const isEmailValid = useMemo(() => {
    return EMAIL_REGEX.test(email.trim());
  }, [email]);

  // Resend countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Step 1: Submit email to request OTP
  const handleSendEmail = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
        setError('รูปแบบอีเมลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
        setAnnouncement('เกิดข้อผิดพลาด: รูปแบบอีเมลไม่ถูกต้อง');
        return;
      }

      setError(null);
      setIsLoading(true);
      setAnnouncement('กำลังส่งรหัสยืนยันไปยังอีเมลของคุณ...');

      try {
        const res = await fetch('/api/auth/customer/send-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          const msg = data.error || 'ไม่สามารถส่งรหัสได้ กรุณาลองใหม่อีกครั้ง';
          setError(msg);
          setAnnouncement(`เกิดข้อผิดพลาด: ${msg}`);
          toast.error(msg);
          return;
        }

        setChallengeId(data.challengeId);
        setStep('OTP');
        setCountdown(RESEND_COOLDOWN_SECONDS);
        setOtpCode('');
        const successMsg = `ส่งรหัส 6 หลักไปยัง ${cleanEmail} แล้ว`;
        setAnnouncement(successMsg);
        toast.success(successMsg);
      } catch (err) {
        console.error('sendCode fetch error:', err);
        const networkError = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต';
        setError(networkError);
        setAnnouncement(`เกิดข้อผิดพลาด: ${networkError}`);
        toast.error(networkError);
      } finally {
        setIsLoading(false);
      }
    },
    [email]
  );

  // Step 2: Submit OTP code to verify
  const handleVerifyOtp = useCallback(
    async (codeToVerify?: string) => {
      const code = (codeToVerify || otpCode).replace(/\D/g, '');
      if (code.length !== 6) {
        setError('กรุณากรอกรหัสยืนยันตัวเลข 6 หลักให้ครบถ้วน');
        setAnnouncement('เกิดข้อผิดพลาด: กรุณากรอกรหัส 6 หลักให้ครบ');
        return;
      }

      setError(null);
      setIsLoading(true);
      setAnnouncement('กำลังตรวจสอบรหัสยืนยัน...');

      try {
        const res = await fetch('/api/auth/customer/verify-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            code,
            challengeId,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          const msg = data.error || 'รหัสยืนยันไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
          setError(msg);
          setAnnouncement(`เกิดข้อผิดพลาด: ${msg}`);
          toast.error(msg);
          return;
        }

        // Successfully authenticated
        const customer: ShopifyCustomerProfile = data.customer;
        setAnnouncement('เข้าสู่ระบบสำเร็จ กำลังนำท่านเข้าสู่ระบบ...');
        toast.success(`ยินดีต้อนรับคุณ ${customer.firstName || customer.email}`);

        // Update application state (silent = true to prevent duplicate toast)
        await login(customer.email, true);

        // Redirect safely
        router.push(onSuccessRedirect);
      } catch (err) {
        console.error('verifyOtp fetch error:', err);
        const networkError = 'เกิดข้อผิดพลาดในการตรวจสอบรหัส กรุณาลองใหม่อีกครั้ง';
        setError(networkError);
        setAnnouncement(`เกิดข้อผิดพลาด: ${networkError}`);
        toast.error(networkError);
      } finally {
        setIsLoading(false);
      }
    },
    [otpCode, email, challengeId, login, router, onSuccessRedirect]
  );

  // Resend OTP code
  const handleResendCode = useCallback(async () => {
    if (countdown > 0 || isResending) return;

    setError(null);
    setIsResending(true);
    setAnnouncement('กำลังส่งรหัสยืนยันใหม่...');

    try {
      const res = await fetch('/api/auth/customer/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const msg = data.error || 'ไม่สามารถส่งรหัสใหม่ได้ กรุณารอสักครู่';
        setError(msg);
        setAnnouncement(`เกิดข้อผิดพลาด: ${msg}`);
        toast.error(msg);
        return;
      }

      setChallengeId(data.challengeId);
      setCountdown(RESEND_COOLDOWN_SECONDS);
      setOtpCode('');
      const msg = 'ส่งรหัสยืนยันใหม่เรียบร้อยแล้ว';
      setAnnouncement(msg);
      toast.success(msg);
    } catch (err) {
      console.error('resend fetch error:', err);
      const networkError = 'เกิดข้อผิดพลาดในการส่งรหัสใหม่';
      setError(networkError);
      toast.error(networkError);
    } finally {
      setIsResending(false);
    }
  }, [countdown, isResending, email]);

  // Back to edit email
  const handleEditEmail = useCallback(() => {
    setStep('EMAIL');
    setError(null);
    setOtpCode('');
    setAnnouncement('กลับมาที่หน้ากรอกอีเมล');
  }, []);

  return {
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
    canResend: countdown === 0 && !isResending,
    announcement,
    handleSendEmail,
    handleVerifyOtp,
    handleResendCode,
    handleEditEmail,
  };
};
