import { NextRequest, NextResponse } from 'next/server';
import { sendOrderReceiptEmail, type OrderReceiptParams } from '@/lib/email';
import { isValidEmail } from '@/lib/auth/shopifyCustomer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      toEmail,
      orderId,
      items,
      subtotal,
      shippingFee,
      discount,
      total,
      deliveryDate,
      deliveryTimeSlot,
      recipientName,
      shippingAddress,
      paymentMethod,
      cardMessage,
      cardTo,
      cardFrom,
    } = body;

    if (!toEmail || !isValidEmail(toEmail)) {
      return NextResponse.json(
        { success: false, error: 'อีเมลผู้รับไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    if (!orderId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลคำสั่งซื้อไม่ครบถ้วน' },
        { status: 400 }
      );
    }

    const receiptParams: OrderReceiptParams = {
      toEmail: toEmail.trim().toLowerCase(),
      orderId: String(orderId),
      items: items.map(i => ({
        title: String(i.title || 'กระเช้าของขวัญ Giftory'),
        quantity: Number(i.quantity) || 1,
        price: Number(i.price) || 0,
      })),
      subtotal: Number(subtotal) || 0,
      shippingFee: Number(shippingFee) || 0,
      discount: Number(discount) || 0,
      total: Number(total) || 0,
      deliveryDate: String(deliveryDate || 'ตามกำหนดการ'),
      deliveryTimeSlot: String(deliveryTimeSlot || 'เวลาทำการ'),
      recipientName: String(recipientName || 'ลูกค้าผู้รับมอบ'),
      shippingAddress: String(shippingAddress || 'ตามข้อมูลจัดส่ง'),
      paymentMethod: String(paymentMethod || 'โอนผ่านบัญชี / QR'),
      cardMessage: cardMessage ? String(cardMessage) : undefined,
      cardTo: cardTo ? String(cardTo) : undefined,
      cardFrom: cardFrom ? String(cardFrom) : undefined,
    };

    const result = await sendOrderReceiptEmail(receiptParams);

    if (!result.success) {
      console.error('Failed to send order receipt email:', result.error);
      return NextResponse.json(
        { success: false, error: result.error || 'ไม่สามารถส่งใบเสร็จได้' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: result.id,
      message: 'ส่งใบเสร็จคำสั่งซื้อไปยังอีเมลเรียบร้อยแล้ว',
    });
  } catch (error) {
    console.error('Exception in orders/receipt route:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการประมวลผลใบเสร็จ' },
      { status: 500 }
    );
  }
}
