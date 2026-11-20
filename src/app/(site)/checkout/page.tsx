'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { formatPrice } from '@/utils/string';
import { TrashIcon } from '@/components/icons';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, totalItems, subtotal, removeItem, clearCart } = useCart();
  const { user, isLoggedIn, openAuthModal } = useCustomerAuth();

  // Form states
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');

  const [sameAsSender, setSameAsSender] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('anytime');

  // Greeting card
  const [cardTo, setCardTo] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [cardFrom, setCardFrom] = useState('');

  // Tax Invoice
  const [needTaxInvoice, setNeedTaxInvoice] = useState(false);
  const [taxCompanyName, setTaxCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'credit_card' | 'bank_transfer'>('promptpay');

  // Success Order modal
  const [orderSuccess, setOrderSuccess] = useState<null | {
    orderId: string;
    total: number;
    paymentMethod: string;
    deliveryDate: string;
  }>(null);

  // Sync user data if logged in
  useEffect(() => {
    if (user) {
      setSenderName(user.name || '');
      setSenderPhone(user.phone || '');
      setSenderEmail(user.email || '');
      if (user.address) {
        setShippingAddress(user.address);
      }
    }
  }, [user]);

  // Set default delivery date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const shippingFee = subtotal >= 3000 || subtotal === 0 ? 0 : 150;
  const grandTotal = subtotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('กรุณาเลือกสินค้าลงตะกร้าก่อนทำการสั่งซื้อ');
      return;
    }

    const finalRecipient = sameAsSender ? senderName : recipientName;
    const finalPhone = sameAsSender ? senderPhone : recipientPhone;

    if (!senderName || !senderPhone) {
      toast.error('กรุณากรอกข้อมูลผู้สั่งซื้อ');
      return;
    }

    if (!finalRecipient || !finalPhone || !shippingAddress) {
      toast.error('กรุณากรอกข้อมูลผู้รับและที่อยู่จัดส่งให้ครบถ้วน');
      return;
    }

    const mockOrderId = `GF-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    setOrderSuccess({
      orderId: mockOrderId,
      total: grandTotal,
      paymentMethod:
        paymentMethod === 'promptpay'
          ? 'QR PromptPay'
          : paymentMethod === 'credit_card'
            ? 'บัตรเครดิต/เดบิต'
            : 'โอนผ่านบัญชีธนาคาร',
      deliveryDate: deliveryDate || 'ส่งเร็วที่สุด',
    });

    clearCart();
  };

  if (orderSuccess) {
    return (
      <div className="mx-auto min-h-[600px] max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg
            className="size-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          สั่งซื้อจำลองสำเร็จ (Demo Order Placed)
        </span>

        <h1 className="mt-3 text-2xl font-light text-shadow-black">
          ขอบพระคุณสำหรับการสั่งซื้อ
        </h1>
        <p className="mt-1 text-sm text-shadow-black/70">
          ระบบได้รับคำสั่งซื้อของคุณเรียบร้อยแล้ว
        </p>

        <div className="mt-8 border border-shadow-black/10 bg-white p-6 text-left shadow-sm">
          <div className="flex items-center justify-between border-b border-shadow-black/10 pb-4">
            <div>
              <p className="text-xs text-shadow-black/50">หมายเลขคำสั่งซื้อ</p>
              <p className="text-lg font-mono font-medium text-maroon">{orderSuccess.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-shadow-black/50">ยอดชำระสุทธิ</p>
              <p className="text-lg font-light text-maroon">฿{formatPrice(orderSuccess.total)}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
            <div>
              <p className="text-shadow-black/50">ช่องทางชำระเงิน:</p>
              <p className="font-medium text-shadow-black">{orderSuccess.paymentMethod}</p>
            </div>
            <div>
              <p className="text-shadow-black/50">วันที่นัดส่งมอบ:</p>
              <p className="font-medium text-shadow-black">{orderSuccess.deliveryDate}</p>
            </div>
          </div>

          {orderSuccess.paymentMethod === 'QR PromptPay' && (
            <div className="mt-6 rounded-sm border border-maroon/20 bg-main-yellow/20 p-4 text-center">
              <p className="text-xs font-medium text-maroon">สแกนจ่ายผ่าน PromptPay QR</p>
              <div className="mx-auto my-3 flex size-36 items-center justify-center border-2 border-dashed border-maroon/40 bg-white text-xs text-shadow-black/50">
                [ QR Code จำลอง ]
              </div>
              <p className="text-[11px] text-shadow-black/60">
                เมื่อชำระเสร็จสิ้น ระบบจะยืนยันคำสั่งซื้อโดยอัตโนมัติ
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/baskets"
            className="border border-maroon bg-maroon px-8 py-3 text-xs font-light tracking-wider text-white transition-all hover:bg-main hover:border-main"
          >
            เลือกดูกระเช้าอื่นต่อ
          </Link>
          <Link
            href="/"
            className="border border-shadow-black/20 bg-white px-8 py-3 text-xs font-light tracking-wider text-shadow-black transition-all hover:border-maroon"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto min-h-[500px] max-w-xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-maroon/5 text-maroon">
          <svg
            className="size-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-light text-shadow-black">ไม่มีสินค้าในตะกร้า</h1>
        <p className="mt-2 text-xs text-shadow-black/60">
          คุณยังไม่ได้เลือกกระเช้าของขวัญ กรุณาเลือกสินค้าที่ต้องการเพื่อสั่งซื้อ
        </p>
        <Link
          href="/baskets"
          className="mt-6 inline-block border border-maroon bg-maroon px-6 py-2.5 text-xs font-light tracking-wider text-white transition-all hover:bg-main hover:border-main"
        >
          เลือกดูกระเช้าสินค้า
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-main-white py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="mb-2 text-xs text-shadow-black/60">
            <Link href="/" className="hover:underline">
              หน้าแรก
            </Link>{' '}
            / <span className="text-shadow-black">ชำระเงิน</span>
          </nav>
          <h1 className="text-2xl font-light tracking-wide text-shadow-black md:text-3xl">
            สั่งซื้อสินค้า & ชำระเงิน (Checkout)
          </h1>
          <div className="mt-2 h-[2px] w-12 bg-maroon" />
        </div>

        {/* Member Status Notification */}
        {!isLoggedIn ? (
          <div className="mb-8 flex flex-col items-start justify-between gap-3 border border-beige bg-main-yellow/30 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium text-maroon">คุณมีบัญชีสมาชิก Giftory แล้วหรือยัง?</p>
              <p className="text-[11px] text-shadow-black/70">
                เข้าสู่ระบบเพื่อดึงข้อมูลที่อยู่ และสะสมคะแนนจากทุกการสั่งซื้อ
              </p>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="border border-maroon bg-white px-4 py-1.5 text-xs text-maroon transition-colors hover:bg-maroon hover:text-white"
            >
              เข้าสู่ระบบทันที
            </button>
          </div>
        ) : (
          <div className="mb-8 flex items-center justify-between border border-emerald-200 bg-emerald-50/50 p-3 text-xs text-emerald-800">
            <span>
              เข้าสู่ระบบในชื่อ: <strong>{user?.name}</strong> ({user?.email})
            </span>
            <span className="text-[11px] text-emerald-600">สมาชิก Giftory Member</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Forms (Col 7) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Step 1: Sender Info */}
            <section className="border border-shadow-black/10 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-medium tracking-wide text-shadow-black">
                <span className="flex size-5 items-center justify-center rounded-full bg-maroon text-[11px] text-white">
                  1
                </span>
                <span>ข้อมูลผู้สั่งซื้อ (Sender Information)</span>
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-light text-shadow-black/70">
                    ชื่อ-นามสกุล ผู้สั่งซื้อ *
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    placeholder="เช่น คุณสมชาย ใจดี"
                    className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs focus:border-maroon focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-light text-shadow-black/70">
                    เบอร์โทรศัพท์ติดต่อ *
                  </label>
                  <input
                    type="tel"
                    value={senderPhone}
                    onChange={e => setSenderPhone(e.target.value)}
                    placeholder="08X-XXX-XXXX"
                    className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs focus:border-maroon focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-light text-shadow-black/70">
                    อีเมล (สำหรับรับใบเสร็จ) *
                  </label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={e => setSenderEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs focus:border-maroon focus:outline-none"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Step 2: Recipient & Address */}
            <section className="border border-shadow-black/10 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-medium tracking-wide text-shadow-black">
                <span className="flex size-5 items-center justify-center rounded-full bg-maroon text-[11px] text-white">
                  2
                </span>
                <span>ข้อมูลผู้รับและที่อยู่จัดส่ง (Recipient & Delivery)</span>
              </h2>

              <div className="mb-4">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-shadow-black">
                  <input
                    type="checkbox"
                    checked={sameAsSender}
                    onChange={e => setSameAsSender(e.target.checked)}
                    className="checkbox checkbox-xs rounded-none border-maroon text-maroon"
                  />
                  <span>ผู้รับคือคนเดียวกับผู้สั่งซื้อ</span>
                </label>
              </div>

              {!sameAsSender && (
                <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-light text-shadow-black/70">
                      ชื่อ-นามสกุล ผู้รับ *
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={e => setRecipientName(e.target.value)}
                      placeholder="เช่น ท่านประธาน / คุณวิภาดา"
                      className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs focus:border-maroon focus:outline-none"
                      required={!sameAsSender}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-light text-shadow-black/70">
                      เบอร์โทรศัพท์ผู้รับ *
                    </label>
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={e => setRecipientPhone(e.target.value)}
                      placeholder="08X-XXX-XXXX"
                      className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs focus:border-maroon focus:outline-none"
                      required={!sameAsSender}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-light text-shadow-black/70">
                  ที่อยู่สำหรับจัดส่งอย่างละเอียด *
                </label>
                <textarea
                  rows={3}
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                  placeholder="บ้านเลขที่, ชื่ออาคาร/หมู่บ้าน, ซอย, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                  className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs focus:border-maroon focus:outline-none"
                  required
                />
              </div>

              {/* Delivery Date & Time */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-light text-shadow-black/70">
                    วันที่ต้องการให้นำส่ง *
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs focus:border-maroon focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-light text-shadow-black/70">
                    ช่วงเวลาที่สะดวก
                  </label>
                  <select
                    value={deliveryTimeSlot}
                    onChange={e => setDeliveryTimeSlot(e.target.value)}
                    className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs focus:border-maroon focus:outline-none"
                  >
                    <option value="anytime">เวลาใดก็ได้ในวันนั้น (09:00 - 18:00)</option>
                    <option value="morning">ช่วงเช้า (09:00 - 12:00)</option>
                    <option value="afternoon">ช่วงบ่าย (13:00 - 17:00)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Step 3: Greeting Card */}
            <section className="border border-shadow-black/10 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-medium tracking-wide text-shadow-black">
                  <span className="flex size-5 items-center justify-center rounded-full bg-maroon text-[11px] text-white">
                    3
                  </span>
                  <span>การ์ดอวยพร & ริบบิ้น (ฟรี)</span>
                </h2>
                <span className="text-[11px] text-emerald-700">แถมฟรีทุกกระเช้า</span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-light text-shadow-black/70">
                      ถึง (To)
                    </label>
                    <input
                      type="text"
                      value={cardTo}
                      onChange={e => setCardTo(e.target.value)}
                      placeholder="เช่น คุณกมลวรรณ / ทีมงาน..."
                      className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs focus:border-maroon focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-light text-shadow-black/70">
                      ลงชื่อจาก (From)
                    </label>
                    <input
                      type="text"
                      value={cardFrom}
                      onChange={e => setCardFrom(e.target.value)}
                      placeholder="เช่น ครอบครัวสุขสันต์ / บจก. พรีเมียม..."
                      className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs focus:border-maroon focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-light text-shadow-black/70">
                    ข้อความอวยพร (Message)
                  </label>
                  <textarea
                    rows={2}
                    value={cardMessage}
                    onChange={e => setCardMessage(e.target.value)}
                    placeholder="สุขสันต์วันปีใหม่ ขอให้สุขภาพแข็งแรง กิจการเจริญรุ่งเรือง..."
                    className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs focus:border-maroon focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Optional Tax Invoice */}
            <section className="border border-shadow-black/10 bg-white p-5 shadow-sm">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-shadow-black">
                <input
                  type="checkbox"
                  checked={needTaxInvoice}
                  onChange={e => setNeedTaxInvoice(e.target.checked)}
                  className="checkbox checkbox-xs rounded-none border-maroon text-maroon"
                />
                <span className="font-medium">ต้องการใบกำกับภาษีเต็มรูปแบบ (Corporate / Individual Tax Invoice)</span>
              </label>

              {needTaxInvoice && (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-light text-shadow-black/70">
                      ชื่อบริษัท / นิติบุคคล หรือ บุคคลธรรมดา
                    </label>
                    <input
                      type="text"
                      value={taxCompanyName}
                      onChange={e => setTaxCompanyName(e.target.value)}
                      placeholder="เช่น บริษัท กิฟตอรี่ จำกัด (มหาชน)"
                      className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs focus:border-maroon focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-light text-shadow-black/70">
                      เลขประจำตัวผู้เสียภาษี (Tax ID 13 หลัก)
                    </label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={e => setTaxId(e.target.value)}
                      placeholder="010XXXXXXXXXX"
                      className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs focus:border-maroon focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Step 4: Payment Selection */}
            <section className="border border-shadow-black/10 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-medium tracking-wide text-shadow-black">
                <span className="flex size-5 items-center justify-center rounded-full bg-maroon text-[11px] text-white">
                  4
                </span>
                <span>เลือกวิธีการชำระเงิน (Payment Method)</span>
              </h2>

              <div className="space-y-2">
                {/* PromptPay */}
                <label
                  className={`flex cursor-pointer items-center justify-between border p-3 transition-colors ${
                    paymentMethod === 'promptpay'
                      ? 'border-maroon bg-main-yellow/10'
                      : 'border-shadow-black/15 bg-main-white hover:bg-shadow-black/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'promptpay'}
                      onChange={() => setPaymentMethod('promptpay')}
                      className="radio radio-xs text-maroon"
                    />
                    <div>
                      <p className="text-xs font-medium text-shadow-black">
                        PromptPay QR Code (แนะนำ)
                      </p>
                      <p className="text-[11px] text-shadow-black/60">
                        สแกนชำระทันทีผ่าน Mobile Banking ทุกธนาคาร ตรวจสอบยอดอัตโนมัติ
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-maroon">QR Code</span>
                </label>

                {/* Credit Card */}
                <label
                  className={`flex cursor-pointer items-center justify-between border p-3 transition-colors ${
                    paymentMethod === 'credit_card'
                      ? 'border-maroon bg-main-yellow/10'
                      : 'border-shadow-black/15 bg-main-white hover:bg-shadow-black/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                      className="radio radio-xs text-maroon"
                    />
                    <div>
                      <p className="text-xs font-medium text-shadow-black">
                        บัตรเครดิต / บัตรเดบิต
                      </p>
                      <p className="text-[11px] text-shadow-black/60">Visa, Mastercard, JCB</p>
                    </div>
                  </div>
                  <span className="text-xs font-light text-shadow-black/50">Credit / Debit</span>
                </label>

                {/* Bank Transfer */}
                <label
                  className={`flex cursor-pointer items-center justify-between border p-3 transition-colors ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-maroon bg-main-yellow/10'
                      : 'border-shadow-black/15 bg-main-white hover:bg-shadow-black/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="radio radio-xs text-maroon"
                    />
                    <div>
                      <p className="text-xs font-medium text-shadow-black">
                        โอนผ่านบัญชีธนาคาร (แนบสลิป)
                      </p>
                      <p className="text-[11px] text-shadow-black/60">
                        ธนาคารกสิกรไทย / ไทยพาณิชย์
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-light text-shadow-black/50">Bank Transfer</span>
                </label>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary (Col 5) */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 border border-shadow-black/10 bg-white p-6 shadow-sm">
              <h2 className="border-b border-shadow-black/10 pb-3 text-base font-light text-shadow-black">
                สรุปคำสั่งซื้อ ({totalItems} ชิ้น)
              </h2>

              {/* Items List */}
              <div className="my-4 max-h-72 space-y-3 overflow-y-auto divide-y divide-shadow-black/5 pr-1">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 pt-3 first:pt-0">
                    <div className="relative size-16 shrink-0 overflow-hidden border border-shadow-black/10 bg-white">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-1">
                        <p className="line-clamp-1 text-xs font-light text-shadow-black">
                          {item.title}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-0.5 text-shadow-black/30 hover:text-main-red"
                        >
                          <TrashIcon className="size-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-shadow-black/60">จำนวน: {item.quantity}</span>
                        <span className="font-light text-maroon">
                          ฿{formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 border-t border-shadow-black/10 pt-4 text-xs">
                <div className="flex justify-between text-shadow-black/70">
                  <span>ยอดรวมสินค้า</span>
                  <span>฿{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-shadow-black/70">
                  <span>ค่าจัดส่ง</span>
                  <span>{shippingFee === 0 ? 'ฟรี' : `฿${formatPrice(shippingFee)}`}</span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-[10px] text-maroon">
                    * สั่งซื้อครบ ฿3,000 จัดส่งฟรีทั่วกรุงเทพฯ
                  </p>
                )}
                <div className="flex justify-between text-shadow-black/70">
                  <span>การ์ดอวยพร & ริบบิ้น</span>
                  <span className="text-emerald-700">ฟรี</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-shadow-black/10 pt-3 text-sm font-normal text-shadow-black">
                  <span>ยอดสุทธิที่ต้องชำระ</span>
                  <span className="text-lg font-light text-maroon">฿{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center border border-maroon bg-maroon py-3.5 text-xs font-light tracking-wider text-white transition-all hover:bg-main hover:border-main"
              >
                ยืนยันการสั่งซื้อและชำระเงิน
              </button>

              <p className="mt-3 text-center text-[10px] font-light text-shadow-black/50">
                Secure Checkout — ข้อมูลของคุณจะได้รับการปกป้องอย่างปลอดภัย
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
