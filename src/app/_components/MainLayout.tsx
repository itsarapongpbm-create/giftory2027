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
        <main className="mt-[100px] min-h-[calc(100vh-390px)] w-full sm:mt-[120px] lg:mt-[220px]">
          {children}
        </main>
        <MainFooter />
        <CustomToast />
      </div>
    </SiteConfigProvider>
  );
};

export default MainLayout;
