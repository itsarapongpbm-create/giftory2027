import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { isValidEmail, sendShopifyCustomerCode } from '@/lib/auth/shopifyCustomer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกอีเมล' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'รูปแบบอีเมลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง' },
        { status: 400 }
      );
    }

    // Rate Limiting: IP-based and Email-based
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-ip';
    const ipLimit = checkRateLimit(`ip:${ip}`, 5, 600000); // 5 requests per 10 mins per IP
    if (!ipLimit.success) {
      return NextResponse.json(
        { success: false, error: ipLimit.errorMessage },
        { status: 429 }
      );
    }

    const emailLimit = checkRateLimit(`email:${cleanEmail}`, 3, 600000); // 3 requests per 10 mins per email
    if (!emailLimit.success) {
      return NextResponse.json(
        { success: false, error: emailLimit.errorMessage },
        { status: 429 }
      );
    }

    // Call Shopify Customer Account API service
    const result = await sendShopifyCustomerCode(cleanEmail);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      challengeId: result.challengeId,
      expiresInSeconds: result.expiresInSeconds,
      message: 'รหัสยืนยันถูกส่งไปยังอีเมลของคุณเรียบร้อยแล้ว',
    });

    // Optionally set a secure temporary challenge cookie
    if (result.challengeId) {
      response.cookies.set('shopify_auth_challenge', result.challengeId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600, // 10 minutes
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Error in send-code route:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
