import type { Metadata } from 'next';
import ShopifyCustomerAuthForm from '@/components/auth/shopify/ShopifyCustomerAuthForm';

export const metadata: Metadata = {
  title: 'Sign in - Giftory Customer Accounts',
  description: 'Sign in with your email to access your Giftory account and order history.',
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{
    return_to?: string;
  }>;
};

export default async function CustomerLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectUrl = params.return_to || '/';

  return (
    <main className="flex min-h-[calc(100dvh-280px)] flex-col items-center justify-center bg-main-white px-4 py-12 sm:px-6 lg:px-8">
      <ShopifyCustomerAuthForm redirectUrl={redirectUrl} />
    </main>
  );
}
