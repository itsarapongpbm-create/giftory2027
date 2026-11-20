/**
 * Unit Tests for Shopify Customer Accounts Auth Validation & Rate Limiter
 * Can be executed with Vitest / Jest / ts-node / Node test runner
 */

import { isValidEmail } from '../src/lib/auth/shopifyCustomer';
import { checkRateLimit, trackFailedOtpAttempt, clearFailedAttempts } from '../src/lib/rateLimit';

// Test 1: Email Validation
export const testEmailValidation = () => {
  const validEmails = [
    'customer@example.com',
    'first.last@domain.co.th',
    'user+tag@sub.domain.org',
    'support@giftoryth.com',
  ];

  const invalidEmails = [
    '',
    'plainaddress',
    '@missingusername.com',
    'username@.com',
    'username@domain',
    'user space@domain.com',
    'user@domain..com',
  ];

  for (const email of validEmails) {
    if (!isValidEmail(email)) {
      throw new Error(`Expected "${email}" to be valid, but was rejected.`);
    }
  }

  for (const email of invalidEmails) {
    if (isValidEmail(email)) {
      throw new Error(`Expected "${email}" to be invalid, but was accepted.`);
    }
  }

  console.log('✓ testEmailValidation passed (all valid/invalid test cases checked)');
};

// Test 2: OTP Format Validation
export const testOtpFormatValidation = () => {
  const sanitize = (code: string) => code.replace(/\D/g, '');
  const isValidOtp = (code: string) => sanitize(code).length === 6;

  if (!isValidOtp('123456')) throw new Error('123456 should be valid');
  if (!isValidOtp('000000')) throw new Error('000000 should be valid');
  if (isValidOtp('12345')) throw new Error('5 digits should be invalid');
  if (isValidOtp('1234567')) throw new Error('7 digits should be invalid');
  if (isValidOtp('abcdef')) throw new Error('Letters should be invalid');
  if (isValidOtp('')) throw new Error('Empty string should be invalid');

  console.log('✓ testOtpFormatValidation passed');
};

// Test 3: Rate Limiting Sliding Window
export const testRateLimiting = () => {
  const testId = `test_rate_limit_${Date.now()}`;

  // Request 1: success
  const r1 = checkRateLimit(testId, 3, 10000);
  if (!r1.success || r1.remaining !== 2) throw new Error('r1 should succeed with 2 remaining');

  // Request 2: success
  const r2 = checkRateLimit(testId, 3, 10000);
  if (!r2.success || r2.remaining !== 1) throw new Error('r2 should succeed with 1 remaining');

  // Request 3: success (exhausts remaining)
  const r3 = checkRateLimit(testId, 3, 10000);
  if (!r3.success || r3.remaining !== 0) throw new Error('r3 should succeed with 0 remaining');

  // Request 4: blocked (exceeds limit)
  const r4 = checkRateLimit(testId, 3, 10000);
  if (r4.success) throw new Error('r4 should be blocked by rate limit');

  console.log('✓ testRateLimiting passed (sliding window throttled properly)');
};

// Test 4: Brute Force Attempt Throttling
export const testFailedOtpThrottling = () => {
  const testEmail = `brute_force_${Date.now()}@example.com`;

  // Attempts 1 to 4 should not lock
  for (let i = 1; i <= 4; i++) {
    const attempt = trackFailedOtpAttempt(testEmail, 5, 60000);
    if (attempt.locked) throw new Error(`Attempt ${i} should not be locked`);
  }

  // 5th attempt should lock account
  const lockAttempt = trackFailedOtpAttempt(testEmail, 5, 60000);
  if (!lockAttempt.locked) throw new Error('5th attempt must trigger temporary lockout');

  // Clear attempts
  clearFailedAttempts(testEmail);
  const freshAttempt = trackFailedOtpAttempt(testEmail, 5, 60000);
  if (freshAttempt.locked) throw new Error('Cleared attempts should not be locked');

  console.log('✓ testFailedOtpThrottling passed (brute force lockout enforced)');
};

// Self-executing runner if invoked via Node.js
if (typeof process !== 'undefined' && process.argv[1]?.includes('auth-validation.test')) {
  try {
    testEmailValidation();
    testOtpFormatValidation();
    testRateLimiting();
    testFailedOtpThrottling();
    console.log('\nAll auth unit tests passed successfully! (4/4 suites)');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}
