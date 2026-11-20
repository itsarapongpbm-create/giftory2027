import { NextRequest, NextResponse } from 'next/server';
import { trackFailedOtpAttempt, clearFailedAttempts } from '@/lib/rateLimit';
import { verifyShopifyCustomerCode } from '@/lib/auth/shopifyCustomer';

const SESSION_COOKIE_NAME = 'shopify_customer_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, code, challengeId } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลไม่ครบถ้วน กรุณากรอกอีเมลและรหัสยืนยัน' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = String(code).trim().replace(/\D/g, '');

    if (cleanCode.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'รหัสยืนยันต้องเป็นตัวเลข 6 หลัก' },
        { status: 400 }
      );
    }

    // Check failed attempts / brute-force protection
    const attemptCheck = trackFailedOtpAttempt(cleanEmail, 5, 900000); // 5 attempts max
    if (attemptCheck.locked) {
      return NextResponse.json(
        {
          success: false,
          error: 'คุณกรอกรหัสผิดเกินจำนวนครั้งที่กำหนด บัญชีถูกระงับชั่วคราว 15 นาที',
        },
        { status: 429 }
      );
    }

    // Read challenge from cookie if not sent in body
    const finalChallengeId =
      challengeId || req.cookies.get('shopify_auth_challenge')?.value;

    const result = await verifyShopifyCustomerCode(
      cleanEmail,
      cleanCode,
      finalChallengeId
    );

    if (!result.success || !result.accessToken || !result.customer) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'รหัสยืนยันไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง',
          attemptsLeft: attemptCheck.attemptsLeft,
        },
        { status: 400 }
      );
    }

    // Verification succeeded: reset failed attempts counter
    clearFailedAttempts(cleanEmail);

    const response = NextResponse.json({
      success: true,
      customer: result.customer,
      message: 'ยืนยันตัวตนสำเร็จ ยินดีต้อนรับเข้าสู่ระบบ',
    });

    // Store Access Token in HTTP-ONLY Secure Cookie (Strictly inaccessible by client JS)
    response.cookies.set(SESSION_COOKIE_NAME, result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: result.expiresInSeconds || SESSION_MAX_AGE,
    });

    // Clean up temporary challenge cookie
    response.cookies.set('shopify_auth_challenge', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Error in verify-code route:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการตรวจสอบรหัส กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
