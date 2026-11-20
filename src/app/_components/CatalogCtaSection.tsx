'use client';

import { OutlineButton } from '@/components/buttons';
import { ContactForm } from '@/components/forms';

/**
 * Catalog CTA Button & Modal Dialog
 * Stored for future reuse whenever needed on any page or section.
 */
const CatalogCtaSection = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-main-white px-4 py-10">
      <OutlineButton
        color="primary"
        size="lg"
        onClick={() =>
          (document.getElementById('open_catalog_dialog') as HTMLDialogElement)?.showModal()
        }
      >
        See the Catalog
      </OutlineButton>
      <dialog id="open_catalog_dialog" className="modal !rounded-none !p-0">
        <div className="modal-box w-full !rounded-none !p-0">
          <form method="dialog">
            <button
              aria-label="Close catalog dialog"
              className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4"
            >
              ✕
            </button>
          </form>
          <ContactForm />
        </div>
      </dialog>
    </div>
  );
};

export default CatalogCtaSection;
