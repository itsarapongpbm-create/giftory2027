import Link from 'next/link';
import StatusBanner from '../_components/StatusBanner';
import SubmitButton from '../_components/SubmitButton';
import { updateCustomGiftSettings, updateHomeSettings } from './actions';
import CustomGiftSettingsForm from './CustomGiftSettingsForm';
import HomeCoverImageField from './HomeCoverImageField';
import { getCustomGiftSettings, getHomeCoverImage } from '@/lib/siteSettings';

const inputClass = 'w-full border border-shadow-black/20 px-3 py-2 text-sm outline-none focus:border-maroon';
const labelClass = 'text-sm font-light text-shadow-black/70';

type AdminHomePageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

const AdminHomePage = async ({ searchParams }: AdminHomePageProps) => {
  const [{ saved, error }, coverImage, customGiftSettings] = await Promise.all([
    searchParams,
    getHomeCoverImage(),
    getCustomGiftSettings(),
  ]);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-light">Home Page</h1>
        <p className="mt-1 text-sm font-light text-shadow-black/60">
          Manage images shown on the storefront home page.
        </p>
      </div>

      <StatusBanner
        saved={saved === '1'}
        savedMessage="Home page settings saved."
        errorMessage={error === 'missing-fields' ? 'Please fill in all required image fields.' : undefined}
      />

      <form action={updateHomeSettings} className="mt-8 grid gap-5 border border-shadow-black/10 bg-white p-5">
        <div>
          <h2 className="text-xl font-light">Cover</h2>
          <p className="mt-1 text-sm font-light text-shadow-black/60">
            Manage the main hero image on the home page.
          </p>
        </div>

        <HomeCoverImageField key={coverImage} defaultImage={coverImage} inputClass={inputClass} labelClass={labelClass} />

        <div className="flex gap-3">
          <SubmitButton pendingLabel="Saving Cover...">Save Home Page</SubmitButton>
          <Link href="/admin/home/identity" className="border border-shadow-black/20 px-4 py-2 text-sm font-light">
            Identity Service
          </Link>
          <Link href="/" target="_blank" className="border border-shadow-black/20 px-4 py-2 text-sm font-light">
            View Home
          </Link>
        </div>
      </form>

      <CustomGiftSettingsForm
        action={updateCustomGiftSettings}
        settings={customGiftSettings}
        inputClass={inputClass}
        labelClass={labelClass}
      />
    </div>
  );
};

export default AdminHomePage;
