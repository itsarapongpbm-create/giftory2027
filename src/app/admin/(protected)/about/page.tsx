import Link from 'next/link';
import StatusBanner from '../_components/StatusBanner';
import AboutSettingsForm from './AboutSettingsForm';
import { updateAboutSettings } from './actions';
import { getAboutSettings } from '@/lib/siteSettings';

const inputClass = 'w-full border border-shadow-black/20 px-3 py-2 text-sm outline-none focus:border-maroon';
const labelClass = 'text-sm font-light text-shadow-black/70';

type AdminAboutPageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

const AdminAboutPage = async ({ searchParams }: AdminAboutPageProps) => {
  const [{ saved, error }, settings] = await Promise.all([searchParams, getAboutSettings()]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light">About Page</h1>
          <p className="mt-1 text-sm font-light text-shadow-black/60">
            Manage the story paragraphs and images shown on the About page.
          </p>
        </div>
        <Link href="/about" target="_blank" className="border border-shadow-black/20 px-4 py-2 text-sm font-light">
          View About
        </Link>
      </div>

      <StatusBanner
        saved={saved === '1'}
        savedMessage="About page settings saved."
        errorMessage={error === 'missing-fields' ? 'Both images are required.' : undefined}
      />

      <AboutSettingsForm
        action={updateAboutSettings}
        settings={settings}
        inputClass={inputClass}
        labelClass={labelClass}
      />
    </div>
  );
};

export default AdminAboutPage;
