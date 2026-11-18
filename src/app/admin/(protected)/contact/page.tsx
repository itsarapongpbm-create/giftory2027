import Link from 'next/link';
import StatusBanner from '../_components/StatusBanner';
import ContactSettingsForm from './ContactSettingsForm';
import { updateContactSettings } from './actions';
import { getContactSettings } from '@/lib/siteSettings';

const inputClass = 'w-full border border-shadow-black/20 px-3 py-2 text-sm outline-none focus:border-maroon';
const labelClass = 'text-sm font-light text-shadow-black/70';

type AdminContactPageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

const AdminContactPage = async ({ searchParams }: AdminContactPageProps) => {
  const [{ saved, error }, settings] = await Promise.all([searchParams, getContactSettings()]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light">Contact &amp; Catalog PDF</h1>
          <p className="mt-1 text-sm font-light text-shadow-black/60">
            Manage contact details, business hours, storefront images, and downloadable Catalog PDF.
          </p>
        </div>
        <Link href="/contact" target="_blank" className="border border-shadow-black/20 px-4 py-2 text-sm font-light">
          View Contact
        </Link>
      </div>

      <StatusBanner
        saved={saved === '1'}
        savedMessage="Contact & catalog settings saved."
        errorMessage={error === 'missing-fields' ? 'Logo, Feature, and QR images are required.' : undefined}
      />

      <ContactSettingsForm
        action={updateContactSettings}
        settings={settings}
        inputClass={inputClass}
        labelClass={labelClass}
      />
    </div>
  );
};

export default AdminContactPage;
