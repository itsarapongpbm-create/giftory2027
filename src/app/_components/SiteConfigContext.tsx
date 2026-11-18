'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_CONTACT_SETTINGS, type ContactSettings } from '@/lib/siteSettings';

const SiteConfigContext = createContext<ContactSettings>(DEFAULT_CONTACT_SETTINGS);

export function SiteConfigProvider({
  value,
  children,
}: {
  value: ContactSettings;
  children: React.ReactNode;
}) {
  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
