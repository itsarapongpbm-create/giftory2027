import Image from 'next/image';
import Link from 'next/link';
import ConfirmSubmitButton from '../_components/ConfirmSubmitButton';
import StatusBanner from '../_components/StatusBanner';
import CustomGiftHeroSettingsForm from './CustomGiftHeroSettingsForm';
import { deleteCustomGiftItem, updateCustomGiftHeroSettings } from './actions';
import { getCustomGiftPageItems } from '@/lib/customGiftPage';
import { getCustomGiftHeroSettings } from '@/lib/siteSettings';

const PAGE_SIZE = 12;

type AdminCustomGiftPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
    saved?: string;
    error?: string;
  }>;
};

const inputClass = 'border border-shadow-black/20 px-3 py-2 text-sm outline-none focus:border-maroon';

const AdminCustomGiftPage = async ({ searchParams }: AdminCustomGiftPageProps) => {
  const [params, heroSettings] = await Promise.all([
    searchParams,
    getCustomGiftHeroSettings(),
  ]);

  const q = params.q?.trim().toLowerCase() || '';
  const status = params.status || '';
  const saved = params.saved || '';
  const error = params.error || '';
  const currentPage = Math.max(Number(params.page || 1), 1);

  const items = await getCustomGiftPageItems({ includeHidden: true });
  const filteredItems = items.filter(item => {
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      String(item.slot).includes(q);
    const matchesStatus =
      !status ||
      (status === 'published' && item.isPublished) ||
      (status === 'unpublished' && !item.isPublished);

    return matchesSearch && matchesStatus;
  });
  const totalItems = filteredItems.length;
  const totalPages = Math.max(Math.ceil(totalItems / PAGE_SIZE), 1);
  const paginatedItems = filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, totalItems);

  const pageHref = (page: number) => {
    const nextParams = new URLSearchParams();

    if (q) nextParams.set('q', q);
    if (status) nextParams.set('status', status);
    nextParams.set('page', String(page));

    return `/admin/custom-gift?${nextParams.toString()}`;
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light">Custom Gift Page</h1>
          <p className="mt-1 text-sm font-light text-shadow-black/60">
            Manage storefront custom gift hero background banner and portfolio gallery items.
          </p>
        </div>
        <Link
          href="/custom-gift"
          target="_blank"
          className="border border-shadow-black/20 px-4 py-2 text-sm font-light transition-colors hover:border-maroon hover:text-maroon"
        >
          View Storefront Page ↗
        </Link>
      </div>

      <StatusBanner
        saved={saved === '1' || saved === 'hero'}
        savedMessage={saved === 'hero' ? 'Custom gift hero background saved.' : 'Custom gift item saved.'}
        errorMessage={error === 'missing-fields' ? 'Please fill in all required fields.' : undefined}
      />

      {/* Hero & Background Settings Form */}
      <div className="mt-8">
        <CustomGiftHeroSettingsForm
          action={updateCustomGiftHeroSettings}
          settings={heroSettings}
          inputClass="w-full border border-shadow-black/20 px-3 py-2 text-sm outline-none focus:border-maroon"
          labelClass="text-sm font-light text-shadow-black/70"
        />
      </div>

      {/* Items Section Header */}
      <div className="mt-12 flex flex-wrap items-end justify-between gap-4 border-t border-shadow-black/10 pt-8">
        <div>
          <h2 className="text-xl font-light">Custom Gift Portfolio Items</h2>
          <p className="mt-1 text-sm font-light text-shadow-black/60">
            Manage slots and images shown in the gallery grid on the storefront.
          </p>
        </div>
        <Link href="/admin/custom-gift/new" className="bg-maroon px-4 py-2 text-sm font-light text-main-white">
          New Item
        </Link>
      </div>

      <form className="mt-6 grid gap-3 border border-shadow-black/10 bg-white p-4 md:grid-cols-[1fr_180px_auto_auto]">
        <input name="q" defaultValue={q} placeholder="Search title or slot" className={inputClass} />
        <select name="status" defaultValue={status} className={inputClass}>
          <option value="">All status</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
        <button type="submit" className="bg-maroon px-4 py-2 text-sm font-light text-main-white">
          Filter
        </button>
        <Link href="/admin/custom-gift" className="border border-shadow-black/20 px-4 py-2 text-center text-sm font-light">
          Reset
        </Link>
      </form>

      <div className="mt-4 text-sm font-light text-shadow-black/60">
        Showing {from}-{to} of {totalItems} items
      </div>

      <div className="mt-4 overflow-x-auto border border-shadow-black/10 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-shadow-black/10 bg-main-white">
            <tr>
              <th className="px-4 py-3 font-light">Image</th>
              <th className="px-4 py-3 font-light">Item</th>
              <th className="px-4 py-3 font-light">Sort</th>
              <th className="px-4 py-3 font-light">Status</th>
              <th className="px-4 py-3 font-light">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center font-light text-shadow-black/60">
                  No custom gift items found.
                </td>
              </tr>
            )}
            {paginatedItems.map(item => (
              <tr key={`${item.slot}-${item.image}`} className="border-b border-shadow-black/10 last:border-b-0">
                <td className="px-4 py-3">
                  <div className="relative size-16 overflow-hidden bg-main-white">
                    <Image src={item.image} alt={item.title || `Custom gift item ${item.slot}`} fill sizes="64px" className="object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-light">{item.title || `Custom Gift Item ${item.slot}`}</div>
                  <div className="mt-1 text-xs text-shadow-black/50">
                    {item.slot === 1 ? 'Featured slot' : item.id}
                  </div>
                </td>
                <td className="px-4 py-3 font-light">{item.slot}</td>
                <td className="px-4 py-3">
                  <div className={item.isPublished ? 'text-maroon' : 'text-shadow-black/40'}>
                    {item.isPublished ? 'Published' : 'Unpublished'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/custom-gift/${item.slot}/edit`} className="border border-maroon px-3 py-2 text-maroon">
                      Edit
                    </Link>
                    {item.slot !== 1 && (
                      <form action={deleteCustomGiftItem}>
                        <input type="hidden" name="slot" value={item.slot} />
                        <ConfirmSubmitButton
                          type="submit"
                          message={`Delete "${item.title || `item ${item.slot}`}"? This cannot be undone for newly added items.`}
                          className="border border-main-red px-3 py-2 text-main-red"
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {currentPage > 1 ? (
            <Link href={pageHref(currentPage - 1)} className="border border-shadow-black/20 px-3 py-1.5 text-sm font-light">
              Previous
            </Link>
          ) : (
            <span className="border border-shadow-black/10 px-3 py-1.5 text-sm font-light text-shadow-black/30">
              Previous
            </span>
          )}

          <span className="px-3 py-1.5 text-sm font-light">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link href={pageHref(currentPage + 1)} className="border border-shadow-black/20 px-3 py-1.5 text-sm font-light">
              Next
            </Link>
          ) : (
            <span className="border border-shadow-black/10 px-3 py-1.5 text-sm font-light text-shadow-black/30">
              Next
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCustomGiftPage;
