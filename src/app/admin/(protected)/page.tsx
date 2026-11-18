import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/utils/string';

const AdminDashboardPage = async () => {
  let dbConnected = true;
  let totalProducts = 0;
  let publishedProducts = 0;
  let bestSellerCount = 0;
  let categoryCount = 0;
  let galleryImageCount = 0;
  let recentProducts: Array<{
    id: string;
    title: string;
    price: number | null;
    image: string;
    thumbnailImage: string | null;
    category: { name: string };
  }> = [];

  try {
    [
      totalProducts,
      publishedProducts,
      bestSellerCount,
      categoryCount,
      galleryImageCount,
      recentProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isPublished: true } }),
      prisma.product.count({ where: { isBestSeller: true, isPublished: true } }),
      prisma.category.count(),
      prisma.productImage.count(),
      prisma.product.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 6,
        include: { category: { select: { name: true } } },
      }),
    ]);
  } catch {
    dbConnected = false;
  }

  const stats = [
    { label: 'Total Products', value: totalProducts, href: '/admin/products' },
    { label: 'Published', value: publishedProducts, href: '/admin/products?status=published' },
    { label: 'Best Sellers', value: bestSellerCount, href: '/admin/products?status=best-seller' },
    { label: 'Categories', value: categoryCount, href: '/admin/categories' },
    { label: 'Gallery Photos', value: galleryImageCount, href: '/admin/products' },
  ];

  const quickActions = [
    { label: 'New Product', desc: 'Add a basket with gallery images', href: '/admin/products/new' },
    { label: 'Home Page', desc: 'Update hero cover & custom gift', href: '/admin/home' },
    { label: 'Contact & Catalog PDF', desc: 'Edit phone, Line, hours & PDF', href: '/admin/contact' },
    { label: 'About Page', desc: 'Edit brand story & images', href: '/admin/about' },
    { label: 'Media Library', desc: 'Upload or remove unused files', href: '/admin/media' },
    { label: 'Categories', desc: 'Organize product sections', href: '/admin/categories' },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light">Dashboard</h1>
          <p className="mt-1 text-sm font-light text-shadow-black/60">
            Overview of your Giftoryth catalog and storefront settings.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products/new" className="bg-maroon px-4 py-2 text-sm font-light text-main-white">
            + New Product
          </Link>
          <Link href="/" target="_blank" className="border border-shadow-black/20 px-4 py-2 text-sm font-light">
            Open Storefront ↗
          </Link>
        </div>
      </div>

      {!dbConnected && (
        <div className="mt-6 border border-amber-500/40 bg-amber-50 px-4 py-3 text-sm font-light text-amber-950">
          <p className="font-normal">PostgreSQL database is not connected.</p>
          <p className="mt-1 text-xs">
            Start Docker Desktop, then run{' '}
            <code className="bg-amber-100 px-1 py-0.5">npm run db:local</code>,{' '}
            <code className="bg-amber-100 px-1 py-0.5">npm run prisma:deploy</code>, and{' '}
            <code className="bg-amber-100 px-1 py-0.5">npm run prisma:seed</code> (or set{' '}
            <code className="bg-amber-100 px-1 py-0.5">DATABASE_URL</code> in <code className="bg-amber-100 px-1 py-0.5">.env</code>).
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border border-shadow-black/10 bg-white p-5 transition-colors hover:border-maroon"
          >
            <div className="text-xs font-light uppercase tracking-wider text-shadow-black/55">
              {stat.label}
            </div>
            <div className="mt-2 text-3xl font-light text-maroon">{stat.value}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section className="border border-shadow-black/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-light">Recently Updated Products</h2>
            <Link href="/admin/products" className="text-xs font-light text-maroon hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-4 divide-y divide-shadow-black/10">
            {recentProducts.length === 0 && (
              <p className="py-6 text-sm font-light text-shadow-black/60">No products yet.</p>
            )}
            {recentProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden bg-main-white">
                    <Image
                      src={product.thumbnailImage || product.image}
                      alt={product.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-light">{product.title}</div>
                    <div className="text-xs font-light text-shadow-black/55">
                      {product.category.name} • {product.price ? `฿${formatPrice(product.price)}` : 'No price'}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="shrink-0 border border-maroon px-3 py-1.5 text-xs text-maroon"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-shadow-black/10 bg-white p-5">
          <h2 className="text-lg font-light">Quick Actions</h2>
          <div className="mt-4 grid gap-2.5">
            {quickActions.map(action => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between border border-shadow-black/10 px-4 py-3 transition-colors hover:border-maroon"
              >
                <div>
                  <div className="text-sm font-light text-shadow-black">{action.label}</div>
                  <div className="text-xs font-light text-shadow-black/55">{action.desc}</div>
                </div>
                <span className="text-maroon">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
