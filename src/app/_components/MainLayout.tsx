'use client';

import { MainNavbar, PagesNavbar } from './navigation';
import MainFooter from './MainFooter';
import CustomToast from '@/components/toasts/CustomToast';
import type { ContactSettings } from '@/lib/siteSettings';
import { SiteConfigProvider } from './SiteConfigContext';

type MainLayoutProps = {
  children: React.ReactNode;
  contactSettings: ContactSettings;
};

const MainLayout = ({ children, contactSettings }: MainLayoutProps) => {
  return (
    <SiteConfigProvider value={contactSettings}>
      <div className="min-h-dvh w-full overflow-x-clip">
        <MainNavbar />
        <PagesNavbar />
        <main className="min-h-[calc(100dvh-260px)] w-full">{children}</main>
        <MainFooter />
        <CustomToast />
      </div>
    </SiteConfigProvider>
  );
};

export default MainLayout;
