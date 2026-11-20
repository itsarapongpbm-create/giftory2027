'use client';

import { MainNavbar, PagesNavbar } from './navigation';
import MainFooter from './MainFooter';
import CustomToast from '@/components/toasts/CustomToast';
import type { ContactSettings } from '@/lib/siteSettings';
import { SiteConfigProvider } from './SiteConfigContext';
import { CartProvider } from '@/context/CartContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import CartDrawer from '@/components/cart/CartDrawer';
import CustomerAuthModal from '@/components/auth/CustomerAuthModal';

type MainLayoutProps = {
  children: React.ReactNode;
  contactSettings: ContactSettings;
};

const MainLayout = ({ children, contactSettings }: MainLayoutProps) => {
  return (
    <SiteConfigProvider value={contactSettings}>
      <CustomerAuthProvider>
        <CartProvider>
          <div className="min-h-dvh w-full overflow-x-clip">
            <MainNavbar />
            <PagesNavbar />
            <main className="min-h-[calc(100dvh-260px)] w-full">{children}</main>
            <MainFooter />
            <CustomToast />
            <CartDrawer />
            <CustomerAuthModal />
          </div>
        </CartProvider>
      </CustomerAuthProvider>
    </SiteConfigProvider>
  );
};

export default MainLayout;
