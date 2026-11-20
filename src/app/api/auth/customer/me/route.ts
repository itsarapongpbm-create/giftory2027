import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'shopify_customer_session';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, customer: null }, { status: 401 });
  }

  // Token is valid in session cookie
  return NextResponse.json({
    authenticated: true,
    tokenPreview: `${token.substring(0, 10)}...`,
  });
}
