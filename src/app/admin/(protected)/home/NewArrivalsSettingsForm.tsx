'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import SubmitButton from '@/app/admin/(protected)/_components/SubmitButton';
import type { NewArrivalsSettings } from '@/lib/siteSettings';
import { formatPrice } from '@/utils/string';

type ProductOption = {
  id: string;
  title: string;
  image: string;
  price?: number;
  categoryName: string;
};

type NewArrivalsSettingsFormProps = {
  action: (formData: FormData) => Promise<void>;
  settings: NewArrivalsSettings;
  products: ProductOption[];
  inputClass: string;
  labelClass: string;
};

const NewArrivalsSettingsForm = ({
  action,
  settings,
  products,
  inputClass,
  labelClass,
}: NewArrivalsSettingsFormProps) => {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(settings.productSlugs);
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      product =>
        product.title.toLowerCase().includes(q) ||
        product.categoryName.toLowerCase().includes(q) ||
        product.id.toLowerCase().includes(q)
    );
  }, [products, search]);

  const toggleProduct = (slug: string) => {
    setSelectedSlugs(prev =>
      prev.includes(slug) ? prev.filter(item => item !== slug) : [...prev, slug]
    );
  };

  return (
    <form action={action} className="mt-8 grid gap-5 border border-shadow-black/10 bg-white p-5">
      <div>
        <h2 className="text-xl font-light">New Arrivals</h2>
        <p className="mt-1 text-sm font-light text-shadow-black/60">
          Pick products to showcase in the New Arrivals carousel on the home page.
        </p>
      </div>

      <label className="grid gap-2">
        <span className={labelClass}>Section Title</span>
        <input name="newArrivalsTitle" defaultValue={settings.title} required className={inputClass} />
      </label>

      <div className="grid gap-3 border-t border-shadow-black/10 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-normal text-shadow-black">
              New Arrival Products (ติ๊กเลือกสินค้าที่ต้องการแสดง)
            </h3>
            <p className="text-xs font-light text-shadow-black/60">
              {selectedSlugs.length === 0
                ? 'ยังไม่ได้เลือกสินค้า — หน้าแรกจะแสดงสินค้าตัวอย่างเริ่มต้น 8 รายการโดยอัตโนมัติ'
                : `เลือกแล้ว ${selectedSlugs.length} รายการ (เรียงตามลำดับที่ติ๊กเลือก)`}
            </p>
          </div>
          {selectedSlugs.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedSlugs([])}
              className="text-xs font-light text-maroon underline underline-offset-4"
            >
              ล้างที่เลือกทั้งหมด
            </button>
          )}
        </div>

        {/* Hidden inputs preserve chosen order cleanly */}
        {selectedSlugs.map(slug => (
          <input key={slug} type="hidden" name="newArrivalProductSlugs" value={slug} />
        ))}

        <input
          type="search"
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="ค้นหาชื่อสินค้าหรือหมวดหมู่..."
          className={inputClass}
        />

        <div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto border border-shadow-black/10 bg-main-white p-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map(product => {
            const isChecked = selectedSlugs.includes(product.id);
            const orderNumber = isChecked ? selectedSlugs.indexOf(product.id) + 1 : null;

            return (
              <label
                key={product.id}
                className={`flex cursor-pointer items-center gap-3 border p-2.5 transition-colors ${
                  isChecked
                    ? 'border-maroon bg-maroon/5'
                    : 'border-shadow-black/10 bg-white hover:border-maroon/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleProduct(product.id)}
                  className="checkbox checkbox-sm accent-maroon"
                />
                <div className="relative size-12 shrink-0 overflow-hidden bg-shadow-black/10">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-light text-shadow-black">{product.title}</p>
                  <p className="truncate text-xs font-light text-shadow-black/55">
                    {product.categoryName}
                    {product.price ? ` · ฿${formatPrice(product.price)}` : ''}
                  </p>
                </div>
                {orderNumber && (
                  <span className="shrink-0 bg-maroon px-1.5 py-0.5 text-[11px] font-light text-main-white">
                    #{orderNumber}
                  </span>
                )}
              </label>
            );
          })}

          {filteredProducts.length === 0 && (
            <p className="col-span-full py-6 text-center text-sm font-light text-shadow-black/50">
              ไม่พบสินค้าที่ตรงกับคำค้นหา
            </p>
          )}
        </div>
      </div>

      <div>
        <SubmitButton pendingLabel="Saving New Arrivals...">Save New Arrivals</SubmitButton>
      </div>
    </form>
  );
};

export default NewArrivalsSettingsForm;
