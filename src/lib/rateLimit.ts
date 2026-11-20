/**
 * In-memory sliding window rate limiter for authentication endpoints.
 * In production clusters, replace with Redis (e.g. Upstash or ioredis).
 */

type RateLimitRecord = {
  timestamps: number[];
  failedAttempts: number;
  lockedUntil?: number;
};

const requestStore = new Map<string, RateLimitRecord>();

// Clean up expired records every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of requestStore.entries()) {
      record.timestamps = record.timestamps.filter(ts => now - ts < 600000);
      if (record.timestamps.length === 0 && (!record.lockedUntil || record.lockedUntil < now)) {
        requestStore.delete(key);
      }
    }
  }, 600000);
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfterSeconds?: number;
  errorMessage?: string;
};

/**
 * Check if a request exceeds rate limit.
 * @param identifier unique key (IP or Email)
 * @param maxRequests maximum allowed requests within window
 * @param windowMs window size in milliseconds
 */
export const checkRateLimit = (
  identifier: string,
  maxRequests = 3,
  windowMs = 600000 // 10 minutes
): RateLimitResult => {
  const now = Date.now();
  let record = requestStore.get(identifier);

  if (!record) {
    record = { timestamps: [], failedAttempts: 0 };
    requestStore.set(identifier, record);
  }

  // Check if temporarily locked
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds,
      errorMessage: `ส่งคำขอบ่อยเกินไป กรุณารออีก ${retryAfterSeconds} วินาที`,
    };
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter(ts => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds,
      errorMessage: `คุณขอรหัสยืนยันเกินจำนวนครั้งที่กำหนด กรุณารออีก ${retryAfterSeconds} วินาที`,
    };
  }

  record.timestamps.push(now);
  return {
    success: true,
    remaining: maxRequests - record.timestamps.length,
  };
};

/**
 * Track failed OTP attempts to prevent brute force attacks.
 */
export const trackFailedOtpAttempt = (
  email: string,
  maxAttempts = 5,
  lockoutMs = 900000 // 15 minutes lockout
): { locked: boolean; attemptsLeft: number } => {
  let record = requestStore.get(`otp_fail:${email}`);
  if (!record) {
    record = { timestamps: [], failedAttempts: 0 };
    requestStore.set(`otp_fail:${email}`, record);
  }

  record.failedAttempts += 1;

  if (record.failedAttempts >= maxAttempts) {
    record.lockedUntil = Date.now() + lockoutMs;
    return { locked: true, attemptsLeft: 0 };
  }

  return { locked: false, attemptsLeft: maxAttempts - record.failedAttempts };
};

/**
 * Clear failed attempts upon successful login.
 */
export const clearFailedAttempts = (email: string) => {
  requestStore.delete(`otp_fail:${email}`);
  requestStore.delete(email);
};
