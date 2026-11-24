'use client';

import { useState } from 'react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { CloseIcon, LineIcon } from '@/components/icons';
import { cn } from '@/utils/className';

const CustomerAuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register, loginAsDemo } =
    useCustomerAuth();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(loginEmail);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-shadow-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md overflow-hidden bg-main-white shadow-2xl transition-all">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-shadow-black/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-maroon">GIFTORY MEMBER</span>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="rounded-full p-1.5 text-shadow-black/50 transition-colors hover:bg-shadow-black/5 hover:text-shadow-black"
            aria-label="Close modal"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 border-b border-shadow-black/10 text-center text-sm">
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className={cn(
              'py-3 font-light transition-colors',
              authModalTab === 'login'
                ? 'border-b-2 border-maroon font-normal text-maroon'
                : 'text-shadow-black/60 hover:text-shadow-black'
            )}
          >
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            onClick={() => openAuthModal('register')}
            className={cn(
              'py-3 font-light transition-colors',
              authModalTab === 'register'
                ? 'border-b-2 border-maroon font-normal text-maroon'
                : 'text-shadow-black/60 hover:text-shadow-black'
            )}
          >
            สมัครสมาชิกใหม่
          </button>
        </div>

        <div className="p-6">
          {/* Quick Demo Test Box */}
          <div className="mb-5 rounded-sm border border-beige/60 bg-main-yellow/20 p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-maroon">บัญชีทดลอง (Demo Account)</p>
                <p className="text-[11px] text-shadow-black/70">
                  กดปุ่มด้านล่างเพื่อทดลองเข้าสู่ระบบทันทีโดยไม่ต้องกรอกข้อมูล
                </p>
              </div>
              <button
                type="button"
                onClick={loginAsDemo}
                className="shrink-0 border border-maroon bg-maroon px-3 py-1.5 text-xs text-white transition-all hover:bg-main hover:border-main"
              >
                1-Click Demo
              </button>
            </div>
          </div>

          {authModalTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-light text-shadow-black/80">
                  อีเมล (Email)
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-shadow-black/20 bg-white px-3 py-2 text-sm text-shadow-black placeholder:text-shadow-black/30 focus:border-maroon focus:outline-none"
                  required
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-light text-shadow-black/80">
                    รหัสผ่าน (Password)
                  </label>
                  <a href="#" className="text-[11px] text-maroon/80 hover:underline">
                    ลืมรหัสผ่าน?
                  </a>
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-shadow-black/20 bg-white px-3 py-2 text-sm text-shadow-black placeholder:text-shadow-black/30 focus:border-maroon focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full border border-maroon bg-maroon py-2.5 text-xs font-light tracking-wider text-white transition-all hover:bg-main hover:border-main"
              >
                เข้าสู่ระบบ
              </button>

              <div className="pt-2 text-center">
                <a
                  href="/login"
                  onClick={closeAuthModal}
                  className="text-xs font-light text-maroon underline underline-offset-2 hover:text-main"
                >
                  หรือเข้าสู่ระบบด้วยรหัสยืนยัน OTP ทางอีเมล ›
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="mb-1 block text-xs font-light text-shadow-black/80">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="คุณสมชาย ใจดี"
                  className="w-full border border-shadow-black/20 bg-white px-3 py-2 text-sm text-shadow-black placeholder:text-shadow-black/30 focus:border-maroon focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-light text-shadow-black/80">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  placeholder="08X-XXX-XXXX"
                  className="w-full border border-shadow-black/20 bg-white px-3 py-2 text-sm text-shadow-black placeholder:text-shadow-black/30 focus:border-maroon focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-light text-shadow-black/80">
                  อีเมล (Email)
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border border-shadow-black/20 bg-white px-3 py-2 text-sm text-shadow-black placeholder:text-shadow-black/30 focus:border-maroon focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-light text-shadow-black/80">
                  ตั้งรหัสผ่าน
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  className="w-full border border-shadow-black/20 bg-white px-3 py-2 text-sm text-shadow-black placeholder:text-shadow-black/30 focus:border-maroon focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full border border-maroon bg-maroon py-2.5 text-xs font-light tracking-wider text-white transition-all hover:bg-main hover:border-main"
              >
                สมัครสมาชิก
              </button>
            </form>
          )}

          {/* Social Login Options */}
          <div className="mt-5 border-t border-shadow-black/10 pt-4">
            <p className="mb-3 text-center text-[11px] text-shadow-black/50">
              หรือเข้าสู่ระบบผ่านช่องทางอื่น
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={loginAsDemo}
                className="flex items-center justify-center gap-1.5 border border-[#06C755]/30 bg-[#06C755]/5 py-2 text-xs text-[#06C755] transition-colors hover:bg-[#06C755]/10"
              >
                <LineIcon className="size-4 fill-current" />
                <span>LINE Login</span>
              </button>
              <button
                type="button"
                onClick={loginAsDemo}
                className="flex items-center justify-center gap-1.5 border border-shadow-black/10 bg-white py-2 text-xs text-shadow-black/80 transition-colors hover:bg-shadow-black/5"
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                  />
                </svg>
                <span>Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuthModal;
