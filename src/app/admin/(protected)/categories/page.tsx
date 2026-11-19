import Link from 'next/link';
import {
  createCategory,
  deleteCategory,
  updateCategory,
  updateCategoryShowcaseAction,
} from './actions';
import { prisma } from '@/lib/prisma';
import { getAllCategoryShowcases } from '@/lib/siteSettings';
import ConfirmSubmitButton from '../_components/ConfirmSubmitButton';
import StatusBanner from '../_components/StatusBanner';
import SubmitButton from '../_components/SubmitButton';

const inputClass =
  'w-full border border-shadow-black/20 px-3 py-2 text-sm outline-none focus:border-maroon';
const labelClass = 'text-xs font-light text-shadow-black/70 mb-1 block';

type CategoriesPageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

const errorMessages: Record<string, string> = {
  'slug-exists': 'This slug is already used by another category. Please choose a different slug.',
  'has-products': 'Cannot delete a category that still has products assigned to it.',
  'missing-fields': 'Slug and Name are required.',
};

const CategoriesPage = async ({ searchParams }: CategoriesPageProps) => {
  const { error, saved } = await searchParams;

  let categories: Array<{
    id: string;
    slug: string;
    name: string;
    sortOrder: number;
    _count: { products: number };
  }> = [];

  try {
    categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  } catch (err) {
    console.warn('DB categories query fallback:', (err as Error).message);
    categories = [
      { id: 'fallback-non-custom', slug: 'non-custom', name: 'Non Custom Baskets', sortOrder: 10, _count: { products: 22 } },
      { id: 'fallback-special-custom-design', slug: 'special-custom-design', name: 'Special Custom Design Baskets', sortOrder: 20, _count: { products: 5 } },
    ];
  }

  const slugs = categories.map(c => c.slug);
  const showcases = await getAllCategoryShowcases(slugs);

  return (
    <div className="space-y-12">
      {/* Categories Management Table */}
      <div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light">Categories</h1>
            <p className="mt-1 text-sm font-light text-shadow-black/60">
              Manage product sections and categories.
            </p>
          </div>
          <Link
            href="/baskets"
            target="_blank"
            className="border border-shadow-black/20 px-3 py-1.5 text-xs font-light hover:border-maroon hover:text-maroon"
          >
            View Baskets Hub ↗
          </Link>
        </div>

        <StatusBanner
          saved={saved === '1'}
          savedMessage="Category settings saved successfully."
          errorMessage={error ? errorMessages[error] : undefined}
        />

        <form
          action={createCategory}
          className="mt-8 grid gap-3 border border-shadow-black/10 bg-white p-4 md:grid-cols-[1fr_1fr_120px_auto]"
        >
          <input name="slug" placeholder="slug (e.g. non-custom)" required className={inputClass} />
          <input name="name" placeholder="name (e.g. Non Custom Baskets)" required className={inputClass} />
          <input
            name="sortOrder"
            type="number"
            placeholder="sort"
            defaultValue={0}
            className={inputClass}
          />
          <button type="submit" className="bg-maroon px-4 py-2 text-sm font-light text-main-white">
            Create Category
          </button>
        </form>

        <div className="mt-8 overflow-x-auto border border-shadow-black/10 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-shadow-black/10 bg-main-white">
              <tr>
                <th className="px-4 py-3 font-light">Slug</th>
                <th className="px-4 py-3 font-light">Name</th>
                <th className="px-4 py-3 font-light">Sort</th>
                <th className="px-4 py-3 font-light">Products</th>
                <th className="px-4 py-3 font-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id} className="border-b border-shadow-black/10 last:border-b-0">
                  <td className="px-4 py-3">
                    <form id={`category-${category.id}`} action={updateCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <input
                        name="slug"
                        defaultValue={category.slug}
                        required
                        className={inputClass}
                      />
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      form={`category-${category.id}`}
                      name="name"
                      defaultValue={category.name}
                      required
                      className={inputClass}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      form={`category-${category.id}`}
                      name="sortOrder"
                      type="number"
                      defaultValue={category.sortOrder}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-4 py-3 font-light">{category._count.products}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        form={`category-${category.id}`}
                        type="submit"
                        className="border border-maroon px-3 py-2 text-sm text-maroon hover:bg-maroon hover:text-white"
                      >
                        Save
                      </button>
                      <form action={deleteCategory}>
                        <input type="hidden" name="id" value={category.id} />
                        <ConfirmSubmitButton
                          type="submit"
                          message={`Delete category "${category.name}"? This cannot be undone.`}
                          disabled={category._count.products > 0}
                          className="border border-main-red px-3 py-2 text-sm text-main-red disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Showcases (Basket Hub Configuration) */}
      <div className="border-t border-shadow-black/10 pt-8">
        <div>
          <h2 className="text-xl font-light">Basket Category Showcases</h2>
          <p className="mt-1 text-sm font-light text-shadow-black/60">
            Customize the Banner Story & Cover Image displayed on the Basket Hub page (`/baskets`).
          </p>
        </div>

        <div className="mt-6 grid gap-6">
          {categories.map(category => {
            const showcase = showcases[category.slug] || {
              slug: category.slug,
              title: category.name,
              subtitle: '',
              description: '',
              coverImage: '',
              coverAlt: '',
            };

            return (
              <form
                key={category.slug}
                action={updateCategoryShowcaseAction}
                className="grid gap-4 border border-shadow-black/10 bg-white p-6"
              >
                <div className="flex items-center justify-between border-b border-shadow-black/10 pb-3">
                  <div>
                    <h3 className="text-base font-medium text-maroon">
                      {category.name} <span className="font-mono text-xs text-shadow-black/50">({category.slug})</span>
                    </h3>
                  </div>
                  <Link
                    href={`/baskets/${category.slug}`}
                    target="_blank"
                    className="text-xs font-light text-maroon hover:underline"
                  >
                    View Category Page ↗
                  </Link>
                </div>

                <input type="hidden" name="slug" value={category.slug} />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Display Title</label>
                    <input
                      name="title"
                      defaultValue={showcase.title || category.name}
                      required
                      className={inputClass}
                      placeholder="Category Title"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Subtitle / Slogan</label>
                    <input
                      name="subtitle"
                      defaultValue={showcase.subtitle}
                      className={inputClass}
                      placeholder="e.g. ชุดของขวัญปี 2026 หรือ กระเช้าสำเร็จรูปพรีเมียม"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Description / Story</label>
                  <textarea
                    name="description"
                    defaultValue={showcase.description}
                    rows={3}
                    className={inputClass}
                    placeholder="Describe the collection, items included, and gifting occasion..."
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Cover Image URL</label>
                    <input
                      name="coverImage"
                      defaultValue={showcase.coverImage}
                      className={inputClass}
                      placeholder="https://... or /images/..."
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Cover Image Alt Text</label>
                    <input
                      name="coverAlt"
                      defaultValue={showcase.coverAlt || showcase.title}
                      className={inputClass}
                      placeholder="Alt description for image"
                    />
                  </div>
                </div>

                {showcase.coverImage && (
                  <div className="mt-2">
                    <p className={labelClass}>Cover Preview:</p>
                    <div className="relative h-40 w-64 overflow-hidden rounded-md border border-shadow-black/10 bg-slate-50">
                      <img
                        src={showcase.coverImage}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <SubmitButton pendingLabel="Saving Showcase...">Save Showcase Settings</SubmitButton>
                </div>
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
