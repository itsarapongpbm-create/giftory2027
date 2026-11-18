import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_COOKIE = 'giftoryth-admin';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const getAdminPassword = () => process.env.ADMIN_PASSWORD || '';
const getSessionSecret = () => process.env.ADMIN_SESSION_SECRET || getAdminPassword();

const safeStringEqual = (a: string, b: string) => {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);

  if (aBuf.length !== bBuf.length) {
    return false;
  }

  return timingSafeEqual(aBuf, bBuf);
};

const signPayload = (payload: string, secret: string) =>
  createHmac('sha256', secret).update(`giftoryth-admin-v2:${payload}`).digest('hex');

const createAdminToken = () => {
  const secret = getSessionSecret();
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const nonce = randomBytes(16).toString('hex');
  const payload = `${exp}.${nonce}`;
  const signature = signPayload(payload, secret);

  return `${payload}.${signature}`;
};

const verifyAdminToken = (token: string | undefined): boolean => {
  const secret = getSessionSecret();
  if (!secret || !token) {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  const [expStr, nonce, signature] = parts;
  const exp = Number(expStr);

  if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000) || !nonce || !signature) {
    return false;
  }

  const expectedSignature = signPayload(`${expStr}.${nonce}`, secret);
  return safeStringEqual(signature, expectedSignature);
};

export const isAdminPassword = (password: string) => {
  const adminPassword = getAdminPassword();
  return Boolean(adminPassword) && safeStringEqual(password, adminPassword);
};

export const setAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: MAX_AGE_SECONDS,
  });
};

export const clearAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: 0,
  });
};

export const isAdminAuthenticated = async () => {
  if (!getAdminPassword()) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token);
};

export const requireAdmin = async () => {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login');
  }
};
