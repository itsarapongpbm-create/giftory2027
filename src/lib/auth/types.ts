export type ShopifyCustomerProfile = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

export type SendCodeResponse = {
  success: boolean;
  challengeId?: string;
  expiresInSeconds?: number;
  error?: string;
};

export type VerifyCodeResponse = {
  success: boolean;
  customer?: ShopifyCustomerProfile;
  accessToken?: string;
  expiresInSeconds?: number;
  error?: string;
};

export const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};
