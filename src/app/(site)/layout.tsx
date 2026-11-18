import type { ReactNode } from 'react';
import { DEFAULT_CONTACT_SETTINGS, getContactSettings } from '@/lib/siteSettings';
import MainLayout from '../_components/MainLayout';

export default async function SiteLayout({ children }: { children: ReactNode }) {
  let contactSettings = DEFAULT_CONTACT_SETTINGS;
  try {
    contactSettings = await getContactSettings();
  } catch (error) {
    console.error('Failed to load contact settings for layout, using defaults:', error);
  }

  return <MainLayout contactSettings={contactSettings}>{children}</MainLayout>;
}
