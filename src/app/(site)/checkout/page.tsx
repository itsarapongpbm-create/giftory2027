'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { formatPrice } from '@/utils/string';
import { TrashIcon } from '@/components/icons';
import GoogleMapDeliveryPicker, { type LocationData } from '@/components/checkout/GoogleMapDeliveryPicker';
import toast from 'react-hot-toast';

type CheckoutStep = 1 | 2 | 3;

interface DateOption {
  value: string;
  dayOfWeek: string;
  dayNumber: string;
  monthName: string;
  isToday?: boolean;
  isTomorrow?: boolean;
}

export default function CheckoutPage() {
  const { items, totalItems, subtotal, removeItem, clearCart } = useCart();
  const { user, isLoggedIn, openAuthModal } = useCustomerAuth();

  // Navigation Stepper
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);

  // Delivery Method: Delivery vs Studio Pick-up
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');

  // STEP 1: Recipient Information
  const [recipientFirstName, setRecipientFirstName] = useState('');
  const [recipientLastName, setRecipientLastName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [province, setProvince] = useState('กรุงเทพมหานคร');
  const [district, setDistrict] = useState('');
  const [subdistrict, setSubdistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [pinnedLocation, setPinnedLocation] = useState<LocationData | null>(null);

  const handleLocationSelect = useCallback((data: LocationData) => {
    setPinnedLocation(data);
    if (data.province) setProvince(data.province);
    if (data.district) setDistrict(data.district);
    if (data.subdistrict) setSubdistrict(data.subdistrict);
    if (data.postalCode) setPostalCode(data.postalCode);
    if (data.streetAddress) {
      setAddressLine1(prev => (prev ? prev : (data.streetAddress ?? '')));
    }
  }, []);

  // STEP 1: Sender (Buyer) Information
  const [isSameAsRecipient, setIsSameAsRecipient] = useState(false);
  const [senderFirstName, setSenderFirstName] = useState('');
  const [senderLastName, setSenderLastName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

  // STEP 2: Delivery Schedule
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('morning');
  const [selectedInstructionTags, setSelectedInstructionTags] = useState<string[]>([]);
  const [customInstructions, setCustomInstructions] = useState('');

  // STEP 2: Bespoke Greeting Card
  const [cardTo, setCardTo] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [cardFrom, setCardFrom] = useState('');

  // STEP 2: Tax Invoice (Optional)
  const [needTaxInvoice, setNeedTaxInvoice] = useState(false);
  const [taxCompanyName, setTaxCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [taxBranch, setTaxBranch] = useState('สำนักงานใหญ่');
  const [taxAddress, setTaxAddress] = useState('');

  // STEP 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'credit_card' | 'bank_transfer'>('promptpay');

  // Coupon / Promo Code
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<null | { code: string; discount: number; label: string }>(null);

  // Success Order State
  const [orderSuccess, setOrderSuccess] = useState<null | {
    orderId: string;
    total: number;
    paymentMethod: string;
    deliveryDate: string;
    deliveryTimeSlot: string;
    recipientName: string;
    pinnedCoords?: string;
  }>(null);

  // Autofill Sender Info if Logged In
  useEffect(() => {
    if (user) {
      if (user.name) {
        const parts = user.name.trim().split(' ');
        setSenderFirstName(parts[0] || '');
        setSenderLastName(parts.slice(1).join(' ') || '');
      }
      if (user.phone) {
        setSenderPhone(user.phone);
      }
      if (user.email) {
        setSenderEmail(user.email);
      }
    }
  }, [user]);

  // Generate Date Options (Next 10 days starting tomorrow)
  const dateOptions: DateOption[] = useMemo(() => {
    const list: DateOption[] = [];
    const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสฯ', 'ศุกร์', 'เสาร์'];
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
    ];

    const today = new Date();
    for (let i = 1; i <= 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayOfWeek = i === 1 ? 'พรุ่งนี้' : thaiDays[d.getDay()];
      const dayNumber = String(d.getDate());
      const monthName = thaiMonths[d.getMonth()];
      const value = d.toISOString().split('T')[0];

      list.push({
        value,
        dayOfWeek,
        dayNumber,
        monthName,
        isTomorrow: i === 1,
      });
    }
    return list;
  }, []);

  // Set default date to tomorrow
  useEffect(() => {
    if (dateOptions.length > 0 && !selectedDate) {
      setSelectedDate(dateOptions[0].value);
    }
  }, [dateOptions, selectedDate]);

  // If user toggles "isSameAsRecipient", sync data
  useEffect(() => {
    if (isSameAsRecipient) {
      setSenderFirstName(recipientFirstName);
      setSenderLastName(recipientLastName);
      setSenderPhone(recipientPhone);
    }
  }, [isSameAsRecipient, recipientFirstName, recipientLastName, recipientPhone]);

  // Shipping Fee calculation
  const shippingFee = useMemo(() => {
    if (deliveryMethod === 'pickup') return 0;
    if (subtotal >= 3000 || subtotal === 0) return 0;
    return 150;
  }, [deliveryMethod, subtotal]);

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.discount;
  }, [appliedCoupon]);

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Missing fields for step 1
  const missingStep1Fields = useMemo(() => {
    const missing: string[] = [];
    if (deliveryMethod === 'delivery') {
      if (!recipientFirstName.trim()) missing.push('ชื่อผู้รับ');
      if (!recipientPhone.trim()) missing.push('เบอร์โทรศัพท์ผู้รับ');
      if (!district.trim()) missing.push('เขต/อำเภอ');
      if (!postalCode.trim()) missing.push('รหัสไปรษณีย์');
      if (!addressLine1.trim()) missing.push('ที่อยู่จัดส่ง');
    }
    if (!isSameAsRecipient) {
      if (!senderFirstName.trim()) missing.push('ชื่อผู้สั่งซื้อ');
      if (!senderPhone.trim()) missing.push('เบอร์โทรผู้สั่งซื้อ');
      if (!senderEmail.trim()) missing.push('อีเมลผู้สั่งซื้อ');
    }
    return missing;
  }, [
    deliveryMethod,
    recipientFirstName,
    recipientPhone,
    district,
    postalCode,
    addressLine1,
    isSameAsRecipient,
    senderFirstName,
    senderPhone,
    senderEmail,
  ]);

  // Missing fields for step 2
  const missingStep2Fields = useMemo(() => {
    const missing: string[] = [];
    if (deliveryMethod === 'delivery' && !selectedDate) {
      missing.push('วันที่จัดส่ง');
    }
    return missing;
  }, [deliveryMethod, selectedDate]);

  // Coupon Handlers
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === 'GIFTORY10') {
      const discount = Math.round(subtotal * 0.1);
      setAppliedCoupon({ code: cleanCode, discount, label: 'ส่วนลด 10% พิเศษสำหรับสมาชิก' });
      toast.success('ใช้โค้ดส่วนลด 10% เรียบร้อยแล้ว');
      setCouponCode('');
    } else if (cleanCode === 'WELCOME100') {
      const discount = Math.min(subtotal, 100);
      setAppliedCoupon({ code: cleanCode, discount, label: 'ส่วนลดต้อนรับ ฿100' });
      toast.success('ใช้โค้ดส่วนลด ฿100 เรียบร้อยแล้ว');
      setCouponCode('');
    } else {
      toast.error('รหัสส่วนลดไม่ถูกต้อง หรือหมดอายุแล้ว');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast('ยกเลิกโค้ดส่วนลดแล้ว');
  };

  // Quick Greetings Templates
  const handleSelectGreeting = (text: string) => {
    setCardMessage(text);
  };

  // Quick Delivery Tag Toggle
  const handleToggleInstructionTag = (tag: string) => {
    setSelectedInstructionTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Step Navigations
  const handleGoToStep2 = () => {
    if (missingStep1Fields.length > 0) {
      toast.error(`กรุณากรอก: ${missingStep1Fields.join(', ')}`);
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleGoToStep3 = () => {
    if (missingStep2Fields.length > 0) {
      toast.error(`กรุณากรอก: ${missingStep2Fields.join(', ')}`);
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Final Order Placement
  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast.error('กรุณาเลือกสินค้าลงตะกร้าก่อนทำการสั่งซื้อ');
      return;
    }

    if (missingStep1Fields.length > 0) {
      setCurrentStep(1);
      toast.error(`กรุณากรอก: ${missingStep1Fields.join(', ')}`);
      return;
    }

    const mockOrderId = `GF-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const deliveryTimeLabel =
      selectedTimeSlot === 'morning'
        ? 'รอบเช้า (09:00 - 12:00)'
        : selectedTimeSlot === 'afternoon'
          ? 'รอบบ่าย (13:00 - 17:00)'
          : 'รอบเย็น / นัดหมายพิเศษ (17:00 - 20:00)';

    setOrderSuccess({
      orderId: mockOrderId,
      total: grandTotal,
      paymentMethod:
        paymentMethod === 'promptpay'
          ? 'PromptPay QR Code'
          : paymentMethod === 'credit_card'
            ? 'บัตรเครดิต / บัตรเดบิต'
            : 'โอนผ่านบัญชีธนาคาร',
      deliveryDate: deliveryMethod === 'pickup' ? 'รับที่ Giftory Studio' : selectedDate,
      deliveryTimeSlot: deliveryMethod === 'pickup' ? 'เวลาทำการ (10:00 - 19:00)' : deliveryTimeLabel,
      recipientName:
        deliveryMethod === 'pickup'
          ? `${senderFirstName} ${senderLastName}`.trim() || 'ลูกค้าผู้สั่งซื้อ'
          : `${recipientFirstName} ${recipientLastName}`.trim(),
      pinnedCoords: pinnedLocation ? `${pinnedLocation.lat.toFixed(5)}, ${pinnedLocation.lng.toFixed(5)}` : undefined,
    });

    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Empty Cart Screen
  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="mx-auto min-h-[520px] max-w-xl px-4 py-24 text-center">
        <div className="mx-auto mb-5 flex size-20 items-center justify-center border border-maroon/20 bg-beige/10 text-maroon">
          <svg
            className="size-10 stroke-[1.5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-light tracking-wide text-shadow-black">
          ยังไม่มีรายการสินค้าในตะกร้า
        </h1>
        <p className="mt-2 text-xs font-light text-shadow-black/60">
          กรุณาเลือกสรรกระเช้าของขวัญอันทรงคุณค่าเพื่อดำเนินการสั่งซื้อ
        </p>
        <Link
          href="/baskets"
          className="mt-6 inline-block border border-maroon bg-maroon px-8 py-3 text-xs font-light tracking-wider text-white transition-all hover:bg-main-red hover:border-main-red"
        >
          เลือกชมคอลเลกชันกระเช้า
        </Link>
      </div>
    );
  }

  // Success Screen
  if (orderSuccess) {
    return (
      <div className="mx-auto min-h-[640px] max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center border border-maroon bg-maroon text-white">
          <svg
            className="size-8 stroke-[1.5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span className="inline-block border border-beige bg-main-yellow/30 px-3 py-1 text-[11px] font-light tracking-widest uppercase text-maroon">
          Order Successfully Placed
        </span>

        <h1 className="mt-3 text-2xl font-light tracking-wide text-shadow-black md:text-3xl">
          ขอบพระคุณสำหรับการไว้วางใจ
        </h1>
        <p className="mt-2 text-xs font-light text-shadow-black/70">
          ระบบได้รับคำสั่งซื้อและข้อมูลของขวัญเรียบร้อยแล้ว เจ้าหน้าที่ฝ่ายบริการลูกค้าจะดูแลการจัดเตรียมอย่างประณีตที่สุด
        </p>

        <div className="mt-8 border border-shadow-black/10 bg-white p-6 text-left shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-shadow-black/10 pb-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[11px] font-light tracking-wider text-shadow-black/50 uppercase">
                หมายเลขคำสั่งซื้อ (Order Reference)
              </p>
              <p className="text-xl font-light tracking-wider text-maroon">{orderSuccess.orderId}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[11px] font-light tracking-wider text-shadow-black/50 uppercase">
                ยอดสุทธิที่ชำระ
              </p>
              <p className="text-2xl font-light text-maroon">฿{formatPrice(orderSuccess.total)}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
            <div>
              <p className="font-light text-shadow-black/50">ผู้รับมอบของขวัญ:</p>
              <p className="mt-0.5 font-normal text-shadow-black">{orderSuccess.recipientName}</p>
            </div>
            <div>
              <p className="font-light text-shadow-black/50">ช่องทางชำระเงิน:</p>
              <p className="mt-0.5 font-normal text-shadow-black">{orderSuccess.paymentMethod}</p>
            </div>
            <div>
              <p className="font-light text-shadow-black/50">กำหนดส่งมอบ:</p>
              <p className="mt-0.5 font-normal text-shadow-black">{orderSuccess.deliveryDate}</p>
            </div>
            <div>
              <p className="font-light text-shadow-black/50">ช่วงเวลา:</p>
              <p className="mt-0.5 font-normal text-shadow-black">{orderSuccess.deliveryTimeSlot}</p>
            </div>
            {orderSuccess.pinnedCoords && (
              <div>
                <p className="font-light text-shadow-black/50">พิกัดแผนที่นำทาง:</p>
                <p className="mt-0.5 font-mono text-[11px] text-maroon">{orderSuccess.pinnedCoords}</p>
              </div>
            )}
          </div>

          {orderSuccess.paymentMethod === 'PromptPay QR Code' && (
            <div className="mt-6 border border-maroon/20 bg-main-yellow/15 p-5 text-center">
              <p className="text-xs font-medium tracking-wide text-maroon">
                PromptPay QR Code สแกนชำระทันที
              </p>
              <div className="mx-auto my-3 flex size-40 items-center justify-center border border-dashed border-maroon/30 bg-white text-xs font-light text-shadow-black/50">
                [ QR Code จำลอง ฿{formatPrice(orderSuccess.total)} ]
              </div>
              <p className="text-[11px] font-light text-shadow-black/60">
                เมื่อชำระเสร็จสิ้น ระบบจะยืนยันคำสั่งซื้อและส่งเอกสารไปยังอีเมลของท่านโดยอัตโนมัติ
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/baskets"
            className="border border-maroon bg-maroon px-8 py-3 text-xs font-light tracking-wider text-white transition-all hover:bg-main-red hover:border-main-red"
          >
            เลือกชมกระเช้าอื่นเพิ่มเติม
          </Link>
          <Link
            href="/"
            className="border border-shadow-black/20 bg-white px-8 py-3 text-xs font-light tracking-wider text-shadow-black transition-all hover:border-maroon hover:text-maroon"
          >
            กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-main-white py-8 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-6">
          <nav className="mb-2 text-xs font-light text-shadow-black/50">
            <Link href="/" className="hover:underline">
              หน้าแรก
            </Link>{' '}
            / <span className="text-shadow-black">บริการส่งมอบของขวัญ & ชำระเงิน</span>
          </nav>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="text-2xl font-light tracking-wider text-shadow-black md:text-3xl">
              Gifting Concierge & Checkout
            </h1>
            <span className="text-xs font-light tracking-widest text-maroon uppercase">
              Giftory Bespoke Service
            </span>
          </div>
          <div className="mt-3 h-[1px] w-full bg-shadow-black/10" />
        </div>

        {/* Member Authentication Status Banner */}
        {!isLoggedIn ? (
          <div className="mb-8 flex flex-col items-start justify-between gap-3 border border-beige bg-main-yellow/25 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium text-maroon">
                เข้าสู่ระบบสมาชิก Giftory Member เพื่อรับสิทธิพิเศษ
              </p>
              <p className="text-[11px] font-light text-shadow-black/70">
                ดึงข้อมูลที่อยู่ผู้สั่งซื้ออัตโนมัติ และสะสมคะแนนจากทุกการสั่งซื้อของขวัญ
              </p>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="border border-maroon bg-white px-4 py-2 text-xs font-light tracking-wider text-maroon transition-colors hover:bg-maroon hover:text-white"
            >
              เข้าสู่ระบบสมาชิก
            </button>
          </div>
        ) : (
          <div className="mb-8 flex items-center justify-between border border-beige bg-main-yellow/20 px-4 py-3 text-xs text-shadow-black">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 bg-maroon" />
              <span className="font-light">
                สมาชิกผู้สั่งซื้อ: <strong>{user?.name || user?.email}</strong>
              </span>
            </div>
            <span className="text-[11px] font-light tracking-wider text-maroon uppercase">
              Giftory Member Verified
            </span>
          </div>
        )}

        {/* Luxury Minimal Editorial Stepper */}
        <div className="mb-10 border border-shadow-black/10 bg-white p-3 shadow-xs sm:p-4">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex flex-col items-center justify-center py-2 transition-colors sm:flex-row sm:gap-2 ${
                currentStep === 1
                  ? 'border-b-2 border-maroon font-medium text-maroon'
                  : 'text-shadow-black/60 hover:text-shadow-black'
              }`}
            >
              <span className="font-mono text-[11px] tracking-wider text-maroon/80">01</span>
              <span className="tracking-wide">ข้อมูลจัดส่งและผู้รับ</span>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => {
                if (missingStep1Fields.length === 0) setCurrentStep(2);
              }}
              className={`flex flex-col items-center justify-center py-2 transition-colors sm:flex-row sm:gap-2 ${
                currentStep === 2
                  ? 'border-b-2 border-maroon font-medium text-maroon'
                  : 'text-shadow-black/60 hover:text-shadow-black'
              }`}
            >
              <span className="font-mono text-[11px] tracking-wider text-maroon/80">02</span>
              <span className="tracking-wide">กำหนดการส่งมอบ & การ์ด</span>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => {
                if (missingStep1Fields.length === 0 && missingStep2Fields.length === 0) {
                  setCurrentStep(3);
                }
              }}
              className={`flex flex-col items-center justify-center py-2 transition-colors sm:flex-row sm:gap-2 ${
                currentStep === 3
                  ? 'border-b-2 border-maroon font-medium text-maroon'
                  : 'text-shadow-black/60 hover:text-shadow-black'
              }`}
            >
              <span className="font-mono text-[11px] tracking-wider text-maroon/80">03</span>
              <span className="tracking-wide">ตรวจสอบ & ชำระเงิน</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout: Form Left (7 Cols) & Voucher Right (5 Cols) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: ACTIVE STEP FORM */}
          <div className="space-y-6 lg:col-span-7">
            {/* ============================================================== */}
            {/* STEP 1: DELIVERY METHOD & ADDRESS                              */}
            {/* ============================================================== */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Delivery Mode Toggle (Segmented Tab) */}
                <div className="border border-shadow-black/10 bg-white p-5 shadow-xs">
                  <p className="mb-3 text-xs font-light tracking-wider text-shadow-black/60 uppercase">
                    รูปแบบการรับมอบสินค้า (Fulfillment Method)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`flex flex-col items-start border p-4 text-left transition-all ${
                        deliveryMethod === 'delivery'
                          ? 'border-maroon bg-main-yellow/15 text-shadow-black'
                          : 'border-shadow-black/15 bg-white text-shadow-black/70 hover:border-shadow-black/30'
                      }`}
                    >
                      <span className="text-xs font-medium text-shadow-black">
                        บริการจัดส่งถึงผู้รับ (Delivery Service)
                      </span>
                      <span className="mt-1 text-[11px] font-light text-shadow-black/60">
                        จัดส่งด้วยพนักงานขนส่งพรีเมียมโดยตรงถึงบ้านหรือที่ทำงาน
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`flex flex-col items-start border p-4 text-left transition-all ${
                        deliveryMethod === 'pickup'
                          ? 'border-maroon bg-main-yellow/15 text-shadow-black'
                          : 'border-shadow-black/15 bg-white text-shadow-black/70 hover:border-shadow-black/30'
                      }`}
                    >
                      <span className="text-xs font-medium text-shadow-black">
                        รับสินค้าเองที่สตูดิโอ (Studio Pick-up)
                      </span>
                      <span className="mt-1 text-[11px] font-light text-shadow-black/60">
                        Giftory Studio • ไม่มีค่าจัดส่ง
                      </span>
                    </button>
                  </div>
                </div>

                {/* Recipient Information (Only shown if delivery) */}
                {deliveryMethod === 'delivery' && (
                  <section className="border border-shadow-black/10 bg-white p-6 shadow-xs">
                    <div className="mb-4 flex items-baseline justify-between border-b border-shadow-black/10 pb-3">
                      <h2 className="text-sm font-medium tracking-wide text-shadow-black">
                        ข้อมูลผู้รับของขวัญ (Recipient Details)
                      </h2>
                      <span className="text-[11px] font-light text-maroon">* ข้อมูลที่จำเป็น</span>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            ชื่อผู้รับ *
                          </label>
                          <input
                            type="text"
                            value={recipientFirstName}
                            onChange={e => setRecipientFirstName(e.target.value)}
                            placeholder="เช่น คุณกมลวรรณ"
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2.5 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            นามสกุลผู้รับ
                          </label>
                          <input
                            type="text"
                            value={recipientLastName}
                            onChange={e => setRecipientLastName(e.target.value)}
                            placeholder="เช่น เจริญสุข"
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2.5 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-light text-shadow-black/70">
                          เบอร์โทรศัพท์ผู้รับ *
                        </label>
                        <input
                          type="tel"
                          value={recipientPhone}
                          onChange={e => setRecipientPhone(e.target.value)}
                          placeholder="08X-XXX-XXXX หรือ เบอร์ติดต่อต่างประเทศ"
                          className="w-full border border-shadow-black/20 bg-main-white px-3 py-2.5 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                          required
                        />
                        <p className="mt-1 text-[11px] font-light text-shadow-black/50">
                          พนักงานจัดส่งจะติดต่อหมายเลขนี้ก่อนนำส่งมอบของขวัญ
                        </p>
                      </div>

                      {/* Google Maps Pin Delivery Location */}
                      <GoogleMapDeliveryPicker onLocationSelect={handleLocationSelect} />

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            จังหวัด *
                          </label>
                          <input
                            type="text"
                            value={province}
                            onChange={e => setProvince(e.target.value)}
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2.5 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            เขต / อำเภอ *
                          </label>
                          <input
                            type="text"
                            value={district}
                            onChange={e => setDistrict(e.target.value)}
                            placeholder="เช่น วัฒนา / คลองเตย"
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2.5 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            แขวง / ตำบล
                          </label>
                          <input
                            type="text"
                            value={subdistrict}
                            onChange={e => setSubdistrict(e.target.value)}
                            placeholder="เช่น คลองตันเหนือ"
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2.5 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-1">
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            รหัสไปรษณีย์ *
                          </label>
                          <input
                            type="text"
                            value={postalCode}
                            onChange={e => setPostalCode(e.target.value)}
                            placeholder="10110"
                            maxLength={5}
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2.5 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                            required
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            ที่อยู่ บรรทัด 1 (บ้านเลขที่, ถนน, ซอย, อาคาร) *
                          </label>
                          <input
                            type="text"
                            value={addressLine1}
                            onChange={e => setAddressLine1(e.target.value)}
                            placeholder="เช่น 123/45 อาคารเอ็กเซกคิวทีฟ ทาวเวอร์ ชั้น 18"
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2.5 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-light text-shadow-black/70">
                          ที่อยู่ บรรทัด 2 (หมายเหตุอาคาร / ชื่อแผนก / เลขห้อง - ไม่บังคับ)
                        </label>
                        <input
                          type="text"
                          value={addressLine2}
                          onChange={e => setAddressLine2(e.target.value)}
                          placeholder="เช่น ฝ่ายบริหารจัดการ ชั้น 22 หรือ ติดต่อประชาสัมพันธ์ตึกหน้า"
                          className="w-full border border-shadow-black/20 bg-main-white px-3 py-2.5 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* Studio Pick-up Notice (If pickup selected) */}
                {deliveryMethod === 'pickup' && (
                  <div className="border border-beige bg-main-yellow/20 p-5">
                    <p className="text-xs font-medium text-maroon">
                      สถานที่รับสินค้า: Giftory Studio
                    </p>
                    <p className="mt-1 text-xs font-light text-shadow-black/80 leading-relaxed">
                      อาคารกิฟตอรี่ สตูดิโอ สุขุมวิท กรุงเทพฯ (เปิดทำการทุกวัน 10:00 - 19:00 น.)
                    </p>
                    <p className="mt-2 text-[11px] font-light text-shadow-black/60">
                      เมื่อชำระเงินเรียบร้อย เจ้าหน้าที่จะประสานงานจัดเตรียมกระเช้าพร้อมผูกริบบิ้นให้ท่านมารับตามเวลาที่สะดวก
                    </p>
                  </div>
                )}

                {/* Sender / Buyer Information */}
                <section className="border border-shadow-black/10 bg-white p-6 shadow-xs">
                  <div className="mb-4 flex items-baseline justify-between border-b border-shadow-black/10 pb-3">
                    <h2 className="text-sm font-medium tracking-wide text-shadow-black">
                      ข้อมูลผู้สั่งซื้อ (Sender / Your Information)
                    </h2>
                    {deliveryMethod === 'delivery' && (
                      <label className="flex cursor-pointer items-center gap-2 text-xs text-shadow-black/80">
                        <input
                          type="checkbox"
                          checked={isSameAsRecipient}
                          onChange={e => setIsSameAsRecipient(e.target.checked)}
                          className="checkbox checkbox-xs rounded-none border-maroon text-maroon"
                        />
                        <span>ผู้รับคือคนเดียวกับผู้สั่งซื้อ</span>
                      </label>
                    )}
                  </div>

                  {!isSameAsRecipient ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            ชื่อผู้สั่งซื้อ *
                          </label>
                          <input
                            type="text"
                            value={senderFirstName}
                            onChange={e => setSenderFirstName(e.target.value)}
                            placeholder="เช่น สมศักดิ์"
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2.5 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            นามสกุลผู้สั่งซื้อ
                          </label>
                          <input
                            type="text"
                            value={senderLastName}
                            onChange={e => setSenderLastName(e.target.value)}
                            placeholder="เช่น วงศ์สว่าง"
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2.5 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            เบอร์โทรศัพท์ติดต่อ *
                          </label>
                          <input
                            type="tel"
                            value={senderPhone}
                            onChange={e => setSenderPhone(e.target.value)}
                            placeholder="08X-XXX-XXXX"
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2.5 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            อีเมล (สำหรับรับใบเสร็จและสถานะคำสั่งซื้อ) *
                          </label>
                          <input
                            type="email"
                            value={senderEmail}
                            onChange={e => setSenderEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2.5 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="flex cursor-pointer items-center gap-2 text-xs text-shadow-black/80">
                          <input
                            type="checkbox"
                            checked={subscribeNewsletter}
                            onChange={e => setSubscribeNewsletter(e.target.checked)}
                            className="checkbox checkbox-xs rounded-none border-maroon text-maroon"
                          />
                          <span>รับสิทธิพิเศษและข่าวสารคอลเลกชันใหม่จาก Giftory TH</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-shadow-black/10 bg-main-yellow/10 p-3 text-xs text-shadow-black/70">
                      ข้อมูลผู้สั่งซื้อใช้ชุดเดียวกับข้อมูลผู้รับเรียบร้อยแล้ว
                    </div>
                  )}
                </section>

                {/* Step 1 Action Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleGoToStep2}
                    className="flex items-center gap-2 border border-maroon bg-maroon px-8 py-3 text-xs font-light tracking-wider text-white transition-all hover:bg-main-red hover:border-main-red"
                  >
                    <span>ขั้นตอนต่อไป: กำหนดการส่งมอบ & การ์ดอวยพร</span>
                    <span>›</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 2: DELIVERY SCHEDULE & BESPOKE GREETING CARD              */}
            {/* ============================================================== */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Delivery Date & Time (If Delivery) */}
                {deliveryMethod === 'delivery' && (
                  <section className="border border-shadow-black/10 bg-white p-6 shadow-xs">
                    <div className="mb-4 flex items-baseline justify-between border-b border-shadow-black/10 pb-3">
                      <h2 className="text-sm font-medium tracking-wide text-shadow-black">
                        กำหนดการส่งมอบ (Delivery Schedule)
                      </h2>
                      <span className="text-[11px] font-light text-maroon">* เลือกวันจัดส่ง</span>
                    </div>

                    {/* Horizontal Date Picker Strip */}
                    <div className="mb-5">
                      <label className="mb-2 block text-xs font-light text-shadow-black/70">
                        เลือกวันที่ต้องการให้นำส่งของขวัญ
                      </label>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {dateOptions.map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setSelectedDate(opt.value)}
                            className={`flex min-w-[76px] flex-col items-center justify-center border p-2.5 transition-all ${
                              selectedDate === opt.value
                                ? 'border-maroon bg-maroon text-white shadow-xs'
                                : 'border-shadow-black/15 bg-white text-shadow-black hover:border-maroon/50'
                            }`}
                          >
                            <span className="text-[10px] font-light opacity-80">{opt.dayOfWeek}</span>
                            <span className="my-0.5 text-base font-light">{opt.dayNumber}</span>
                            <span className="text-[10px] font-light opacity-80">{opt.monthName}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Slot Selection */}
                    <div className="mb-6">
                      <label className="mb-2 block text-xs font-light text-shadow-black/70">
                        ช่วงเวลาส่งมอบที่สะดวก
                      </label>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <button
                          type="button"
                          onClick={() => setSelectedTimeSlot('morning')}
                          className={`border p-3 text-left transition-all ${
                            selectedTimeSlot === 'morning'
                              ? 'border-maroon bg-main-yellow/15 text-shadow-black'
                              : 'border-shadow-black/15 bg-white text-shadow-black/70 hover:border-shadow-black/30'
                          }`}
                        >
                          <p className="text-xs font-medium text-maroon">รอบเช้า</p>
                          <p className="text-[11px] font-light text-shadow-black/60">09:00 - 12:00 น.</p>
                          <p className="mt-1 text-[10px] text-shadow-black/50">สำหรับสถานที่ทำงาน</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedTimeSlot('afternoon')}
                          className={`border p-3 text-left transition-all ${
                            selectedTimeSlot === 'afternoon'
                              ? 'border-maroon bg-main-yellow/15 text-shadow-black'
                              : 'border-shadow-black/15 bg-white text-shadow-black/70 hover:border-shadow-black/30'
                          }`}
                        >
                          <p className="text-xs font-medium text-maroon">รอบบ่าย</p>
                          <p className="text-[11px] font-light text-shadow-black/60">13:00 - 17:00 น.</p>
                          <p className="mt-1 text-[10px] text-shadow-black/50">ช่วงเวลามาตรฐาน</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedTimeSlot('evening')}
                          className={`border p-3 text-left transition-all ${
                            selectedTimeSlot === 'evening'
                              ? 'border-maroon bg-main-yellow/15 text-shadow-black'
                              : 'border-shadow-black/15 bg-white text-shadow-black/70 hover:border-shadow-black/30'
                          }`}
                        >
                          <p className="text-xs font-medium text-maroon">รอบเย็น / พิเศษ</p>
                          <p className="text-[11px] font-light text-shadow-black/60">17:00 - 20:00 น.</p>
                          <p className="mt-1 text-[10px] text-shadow-black/50">สำหรับงานเลี้ยง/ที่พัก</p>
                        </button>
                      </div>
                    </div>

                    {/* Special Concierge Delivery Tags */}
                    <div>
                      <label className="mb-2 block text-xs font-light text-shadow-black/70">
                        คำแนะนำพิเศษสำหรับการส่งมอบ (คลิกเลือกได้หลายข้อ)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'โทรนัดหมายล่วงหน้าก่อนเข้าส่ง',
                          'ส่งมอบถึงมือผู้รับโดยตรง',
                          'ส่งมอบฝ่ายต้อนรับ / ประชาสัมพันธ์',
                          'ติดต่อเลขานุการ / ผู้ช่วย',
                          'ฝากที่เคาน์เตอร์นิติบุคคล / อาคาร',
                        ].map(tag => {
                          const isSelected = selectedInstructionTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleToggleInstructionTag(tag)}
                              className={`border px-3 py-1.5 text-xs font-light transition-all ${
                                isSelected
                                  ? 'border-maroon bg-maroon text-white'
                                  : 'border-shadow-black/20 bg-main-white text-shadow-black/70 hover:border-maroon/40'
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-3">
                        <input
                          type="text"
                          value={customInstructions}
                          onChange={e => setCustomInstructions(e.target.value)}
                          placeholder="คำแนะนำเพิ่มเติมสำหรับผู้จัดส่ง (ถ้ามี)..."
                          className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                        />
                      </div>
                    </div>
                  </section>
                )}

                {/* Bespoke Greeting Card & Satin Ribbon */}
                <section className="border border-shadow-black/10 bg-white p-6 shadow-xs">
                  <div className="mb-4 flex items-baseline justify-between border-b border-shadow-black/10 pb-3">
                    <div>
                      <h2 className="text-sm font-medium tracking-wide text-shadow-black">
                        การ์ดอวยพรและริบบิ้นพรีเมียม (Bespoke Greeting Card)
                      </h2>
                      <p className="text-[11px] font-light text-shadow-black/60">
                        พิมพ์ข้อความลงบนการ์ดกระดาษเนื้อพรีเมียม ผูกคู่ริบบิ้นผ้าซาติน ฟรีทุกกระเช้า
                      </p>
                    </div>
                    <span className="text-[11px] font-light tracking-wider text-maroon uppercase">
                      Complimentary
                    </span>
                  </div>

                  {/* Quick Greeting Templates */}
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-light text-shadow-black/70">
                      เลือกข้อความอวยพรสำเร็จรูป:
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectGreeting(
                            'สวัสดีปีใหม่ ขออวยพรให้ท่านและครอบครัวมีความสุข สุขภาพแข็งแรง และกิจการรุ่งเรืองตลอดปี'
                          )
                        }
                        className="border border-shadow-black/15 bg-main-white p-2 text-left text-xs font-light text-shadow-black/80 transition-colors hover:border-maroon hover:bg-main-yellow/10"
                      >
                        — อวยพรปีใหม่ & สุขภาพ
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectGreeting(
                            'ขอแสดงความยินดีในวาระอันเป็นมงคลนี้ ขอให้ประสบความสำเร็จและเจริญก้าวหน้ายิ่งขึ้นไป'
                          )
                        }
                        className="border border-shadow-black/15 bg-main-white p-2 text-left text-xs font-light text-shadow-black/80 transition-colors hover:border-maroon hover:bg-main-yellow/10"
                      >
                        — แสดงความยินดีในวาระมงคล
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectGreeting(
                            'กราบขอบพระคุณสำหรับความร่วมมือ มิตรภาพ และความไว้วางใจอันดียิ่งเสมอมา'
                          )
                        }
                        className="border border-shadow-black/15 bg-main-white p-2 text-left text-xs font-light text-shadow-black/80 transition-colors hover:border-maroon hover:bg-main-yellow/10"
                      >
                        — ขอบพระคุณพันธมิตรธุรกิจ
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectGreeting(
                            'สุขสันต์วันเกิด ขอให้มีสุขภาพพลานามัยสมบูรณ์ มีความสุขสดใส และสมปรารถนาในทุกสิ่ง'
                          )
                        }
                        className="border border-shadow-black/15 bg-main-white p-2 text-left text-xs font-light text-shadow-black/80 transition-colors hover:border-maroon hover:bg-main-yellow/10"
                      >
                        — อวยพรวันเกิด
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-light text-shadow-black/70">
                        ถึง (To)
                      </label>
                      <input
                        type="text"
                        value={cardTo}
                        onChange={e => setCardTo(e.target.value)}
                        placeholder="เช่น คุณกมลวรรณ หรือ ทีมงานบริหาร..."
                        className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-light text-shadow-black/70">
                        จาก (From)
                      </label>
                      <input
                        type="text"
                        value={cardFrom}
                        onChange={e => setCardFrom(e.target.value)}
                        placeholder="เช่น บริษัท สยาม พรีเมียม พาร์ตเนอร์ส จำกัด"
                        className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-xs font-light text-shadow-black/70">
                      ข้อความอวยพรบนการ์ด (Message)
                    </label>
                    <textarea
                      rows={3}
                      value={cardMessage}
                      onChange={e => setCardMessage(e.target.value)}
                      placeholder="พิมพ์ข้อความที่ต้องการพิมพ์ลงบนการ์ดของขวัญ..."
                      className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs text-shadow-black transition-colors focus:border-maroon focus:outline-none"
                    />
                  </div>

                  {/* Card Mockup Preview */}
                  {(cardTo || cardMessage || cardFrom) && (
                    <div className="mt-5 border border-beige bg-main-yellow/20 p-5 shadow-xs">
                      <div className="border border-dashed border-maroon/30 bg-white p-6 text-center">
                        <span className="text-[10px] font-light tracking-widest text-maroon uppercase">
                          • Giftory Signature Card •
                        </span>
                        {cardTo && (
                          <p className="mt-3 text-xs font-medium text-shadow-black">ถึง: {cardTo}</p>
                        )}
                        <p className="my-3 text-xs font-light italic leading-relaxed text-shadow-black/80">
                          &ldquo;{cardMessage || 'ข้อความอวยพรของคุณ'}&rdquo;
                        </p>
                        {cardFrom && (
                          <p className="text-right text-xs font-light text-maroon">จาก: {cardFrom}</p>
                        )}
                      </div>
                    </div>
                  )}
                </section>

                {/* Tax Invoice Section */}
                <section className="border border-shadow-black/10 bg-white p-6 shadow-xs">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-shadow-black">
                    <input
                      type="checkbox"
                      checked={needTaxInvoice}
                      onChange={e => setNeedTaxInvoice(e.target.checked)}
                      className="checkbox checkbox-xs rounded-none border-maroon text-maroon"
                    />
                    <span className="font-medium">
                      ต้องการใบกำกับภาษีเต็มรูปแบบ (Tax Invoice / e-Tax)
                    </span>
                  </label>

                  {needTaxInvoice && (
                    <div className="mt-4 space-y-3 pt-3 border-t border-shadow-black/10">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            ชื่อนิติบุคคล / บุคคลธรรมดา
                          </label>
                          <input
                            type="text"
                            value={taxCompanyName}
                            onChange={e => setTaxCompanyName(e.target.value)}
                            placeholder="บริษัท กิฟตอรี่ เทรดดิ้ง จำกัด"
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs text-shadow-black focus:border-maroon focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            เลขประจำตัวผู้เสียภาษี (13 หลัก)
                          </label>
                          <input
                            type="text"
                            value={taxId}
                            onChange={e => setTaxId(e.target.value)}
                            placeholder="010XXXXXXXXXX"
                            maxLength={13}
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs text-shadow-black focus:border-maroon focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            สาขา
                          </label>
                          <input
                            type="text"
                            value={taxBranch}
                            onChange={e => setTaxBranch(e.target.value)}
                            placeholder="สำนักงานใหญ่ หรือ สาขาที่..."
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs text-shadow-black focus:border-maroon focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-light text-shadow-black/70">
                            ที่อยู่ออกใบกำกับภาษี
                          </label>
                          <input
                            type="text"
                            value={taxAddress}
                            onChange={e => setTaxAddress(e.target.value)}
                            placeholder="ที่อยู่ตาม ภ.พ.20 หรือบัตรประชาชน"
                            className="w-full border border-shadow-black/20 bg-main-white px-3 py-2 text-xs text-shadow-black focus:border-maroon focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Step 2 Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="border border-shadow-black/20 bg-white px-6 py-3 text-xs font-light tracking-wider text-shadow-black transition-all hover:border-maroon hover:text-maroon"
                  >
                    ‹ ย้อนกลับ
                  </button>
                  <button
                    type="button"
                    onClick={handleGoToStep3}
                    className="flex items-center gap-2 border border-maroon bg-maroon px-8 py-3 text-xs font-light tracking-wider text-white transition-all hover:bg-main-red hover:border-main-red"
                  >
                    <span>ขั้นตอนต่อไป: ตรวจสอบ & ชำระเงิน</span>
                    <span>›</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 3: PAYMENT METHOD & FINAL REVIEW                          */}
            {/* ============================================================== */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Payment Methods */}
                <section className="border border-shadow-black/10 bg-white p-6 shadow-xs">
                  <div className="mb-4 flex items-baseline justify-between border-b border-shadow-black/10 pb-3">
                    <h2 className="text-sm font-medium tracking-wide text-shadow-black">
                      ช่องทางการชำระเงิน (Payment Method)
                    </h2>
                    <span className="text-[11px] font-light text-shadow-black/60">
                      ระบบชำระเงินมาตรฐานความปลอดภัยสูง
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* PromptPay */}
                    <label
                      className={`flex cursor-pointer items-start justify-between border p-4 transition-all ${
                        paymentMethod === 'promptpay'
                          ? 'border-maroon bg-main-yellow/15'
                          : 'border-shadow-black/15 bg-white hover:border-shadow-black/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'promptpay'}
                          onChange={() => setPaymentMethod('promptpay')}
                          className="mt-1 radio radio-xs text-maroon"
                        />
                        <div>
                          <p className="text-xs font-medium text-shadow-black">
                            PromptPay QR Code (แนะนำ)
                          </p>
                          <p className="text-[11px] font-light text-shadow-black/60">
                            สแกนชำระทันทีผ่าน Mobile Banking ทุกธนาคาร ตรวจสอบยอดเงินอัตโนมัติ
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-medium text-maroon">QR Payment</span>
                    </label>

                    {/* Credit Card */}
                    <label
                      className={`flex cursor-pointer items-start justify-between border p-4 transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'border-maroon bg-main-yellow/15'
                          : 'border-shadow-black/15 bg-white hover:border-shadow-black/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'credit_card'}
                          onChange={() => setPaymentMethod('credit_card')}
                          className="mt-1 radio radio-xs text-maroon"
                        />
                        <div>
                          <p className="text-xs font-medium text-shadow-black">
                            บัตรเครดิต / บัตรเดบิต (Credit / Debit Card)
                          </p>
                          <p className="text-[11px] font-light text-shadow-black/60">
                            รองรับ Visa, Mastercard, JCB พร้อมระบบความปลอดภัย 3D Secure
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-light text-shadow-black/50">VISA / MC / JCB</span>
                    </label>

                    {/* Bank Transfer */}
                    <label
                      className={`flex cursor-pointer items-start justify-between border p-4 transition-all ${
                        paymentMethod === 'bank_transfer'
                          ? 'border-maroon bg-main-yellow/15'
                          : 'border-shadow-black/15 bg-white hover:border-shadow-black/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'bank_transfer'}
                          onChange={() => setPaymentMethod('bank_transfer')}
                          className="mt-1 radio radio-xs text-maroon"
                        />
                        <div>
                          <p className="text-xs font-medium text-shadow-black">
                            โอนผ่านบัญชีธนาคาร (Bank Transfer)
                          </p>
                          <p className="text-[11px] font-light text-shadow-black/60">
                            ธนาคารกสิกรไทย / ไทยพาณิชย์ และแนบสลิปเพื่อยืนยันคำสั่งซื้อ
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-light text-shadow-black/50">Bank Account</span>
                    </label>
                  </div>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 border border-beige bg-main-yellow/20 p-4 text-xs font-light text-shadow-black">
                      <p className="font-medium text-maroon">ข้อมูลบัญชีสำหรับการโอนเงิน:</p>
                      <p className="mt-1">ธนาคารกสิกรไทย (KBANK) • บัญชีกระแสรายวัน</p>
                      <p className="font-mono text-sm font-medium text-shadow-black">098-7-65432-1</p>
                      <p className="text-[11px] text-shadow-black/70">ชื่อบัญชี: บจก. กิฟตอรี่ เทรดดิ้ง</p>
                    </div>
                  )}
                </section>

                {/* Delivery & Gift Summary Overview Card */}
                <section className="border border-shadow-black/10 bg-white p-6 shadow-xs">
                  <h3 className="mb-3 text-xs font-medium tracking-wide text-shadow-black uppercase">
                    สรุปข้อมูลการส่งมอบ (Delivery Review)
                  </h3>
                  <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
                    <div>
                      <p className="text-shadow-black/50">ผู้รับมอบ:</p>
                      <p className="font-medium text-shadow-black">
                        {deliveryMethod === 'pickup'
                          ? 'รับสินค้าเองที่ Giftory Studio'
                          : `${recipientFirstName} ${recipientLastName} (${recipientPhone})`}
                      </p>
                    </div>
                    <div>
                      <p className="text-shadow-black/50">ที่อยู่จัดส่ง:</p>
                      <p className="font-medium text-shadow-black">
                        {deliveryMethod === 'pickup'
                          ? 'Giftory Studio สุขุมวิท'
                          : `${addressLine1} ${addressLine2 ? addressLine2 + ' ' : ''}${district} ${province} ${postalCode}`}
                      </p>
                      {pinnedLocation && (
                        <p className="mt-1 text-[11px] font-light text-maroon">
                          พิกัดนำทาง: {pinnedLocation.lat.toFixed(5)}, {pinnedLocation.lng.toFixed(5)}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-shadow-black/50">วันที่ & ช่วงเวลา:</p>
                      <p className="font-medium text-shadow-black">
                        {selectedDate}{' '}
                        {selectedTimeSlot === 'morning'
                          ? '(รอบเช้า)'
                          : selectedTimeSlot === 'afternoon'
                            ? '(รอบบ่าย)'
                            : '(รอบเย็น)'}
                      </p>
                    </div>
                    <div>
                      <p className="text-shadow-black/50">ผู้สั่งซื้อ:</p>
                      <p className="font-medium text-shadow-black">
                        {isSameAsRecipient
                          ? 'คนเดียวกับผู้รับ'
                          : `${senderFirstName} ${senderLastName} (${senderPhone})`}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Step 3 Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="border border-shadow-black/20 bg-white px-6 py-3 text-xs font-light tracking-wider text-shadow-black transition-all hover:border-maroon hover:text-maroon"
                  >
                    ‹ ย้อนกลับ
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="border border-maroon bg-maroon px-8 py-3.5 text-xs font-light tracking-wider text-white transition-all hover:bg-main-red hover:border-main-red"
                  >
                    ยืนยันคำสั่งซื้อ & ชำระเงิน (฿{formatPrice(grandTotal)})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: GIFT SUMMARY VOUCHER (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 border border-shadow-black/10 bg-white p-6 shadow-xs">
              <div className="border-b border-shadow-black/10 pb-3">
                <span className="text-[10px] font-light tracking-widest text-maroon uppercase">
                  Bespoke Gift Voucher
                </span>
                <h2 className="mt-0.5 text-base font-light text-shadow-black">
                  สรุปรายการสั่งซื้อ ({totalItems} ชิ้น)
                </h2>
              </div>

              {/* Items List */}
              <div className="my-4 max-h-64 space-y-3 overflow-y-auto divide-y divide-shadow-black/5 pr-1">
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
                          aria-label={`Remove ${item.title}`}
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

              {/* Coupon Form */}
              <div className="border-t border-shadow-black/10 pt-4">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="รหัสส่วนลด (เช่น GIFTORY10)"
                    className="flex-1 border border-shadow-black/20 bg-main-white px-3 py-2 text-xs uppercase focus:border-maroon focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="border border-maroon bg-white px-4 py-2 text-xs font-light text-maroon transition-colors hover:bg-maroon hover:text-white"
                  >
                    ใช้โค้ด
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="mt-2 flex items-center justify-between border border-beige bg-main-yellow/20 px-3 py-1.5 text-xs">
                    <span className="text-maroon font-light">
                      {appliedCoupon.label} (-฿{formatPrice(appliedCoupon.discount)})
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-shadow-black/50 hover:text-main-red"
                    >
                      ลบ
                    </button>
                  </div>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="mt-4 space-y-2 border-t border-shadow-black/10 pt-4 text-xs">
                <div className="flex justify-between text-shadow-black/70">
                  <span>ยอดรวมกระเช้าของขวัญ</span>
                  <span>฿{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-maroon">
                    <span>ส่วนลดโปรโมชั่น ({appliedCoupon.code})</span>
                    <span>-฿{formatPrice(appliedCoupon.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-shadow-black/70">
                  <span>ค่าบริการจัดส่ง</span>
                  <span>
                    {shippingFee === 0 ? 'ฟรี (Complimentary)' : `฿${formatPrice(shippingFee)}`}
                  </span>
                </div>
                {deliveryMethod === 'delivery' && shippingFee > 0 && (
                  <p className="text-[10px] text-maroon">
                    * บริการจัดส่งฟรีเมื่อสั่งซื้อครบ ฿3,000 ทั่วกรุงเทพฯ
                  </p>
                )}

                <div className="flex justify-between text-shadow-black/70">
                  <span>การ์ดอวยพรพิมพ์ข้อความ & ริบบิ้น</span>
                  <span className="text-maroon">ฟรี</span>
                </div>
                <div className="flex justify-between text-shadow-black/70">
                  <span>ภาพถ่ายยืนยันเมื่อส่งมอบสำเร็จ</span>
                  <span className="text-maroon">ฟรี</span>
                </div>

                <div className="flex items-baseline justify-between border-t border-shadow-black/10 pt-3 text-sm font-normal text-shadow-black">
                  <span>ยอดสุทธิที่ต้องชำระ</span>
                  <span className="text-xl font-light text-maroon">฿{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Live Validation Alert Note */}
              {missingStep1Fields.length > 0 && currentStep === 1 && (
                <div className="mt-4 border border-beige bg-main-yellow/20 p-3 text-[11px] font-light text-maroon">
                  กรุณาระบุข้อมูลต่อไปนี้: {missingStep1Fields.join(' • ')}
                </div>
              )}

              {/* Security & Concierge Assurance */}
              <div className="mt-6 border-t border-shadow-black/10 pt-4 text-center">
                <p className="text-[11px] font-light tracking-wide text-shadow-black/60">
                  Secure Checkout — การันตีคุณภาพและส่งมอบตรงเวลาโดย Giftory
                </p>
                <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-shadow-black/40">
                  <span>PromptPay</span>
                  <span>•</span>
                  <span>Visa</span>
                  <span>•</span>
                  <span>Mastercard</span>
                  <span>•</span>
                  <span>JCB</span>
                  <span>•</span>
                  <span>Bank Transfer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
