'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import ImageUploadInput from '@/app/admin/(protected)/_components/ImageUploadInput';
import SubmitButton from '@/app/admin/(protected)/_components/SubmitButton';
import type { ImageCropProfile } from '@/lib/imageCrop';
import type { PdmKaikuSettings } from '@/lib/siteSettings';
import { formatPrice } from '@/utils/string';

type ProductOption = {
  id: string;
  title: string;
  image: string;
  price?: number;
  categoryName: string;
};

type PdmKaikuSettingsFormProps = {
  action: (formData: FormData) => Promise<void>;
  settings: PdmKaikuSettings;
  products: ProductOption[];
  inputClass: string;
  labelClass: string;
};

type ImageFieldProps = {
  label: string;
  urlName: string;
  fileName: string;
  altName: string;
  defaultImage: string;
  defaultAlt: string;
  cropProfile: ImageCropProfile;
  imageFit?: 'cover' | 'contain';
  inputClass: string;
  labelClass: string;
};

const PdmImageField = ({
  label,
  urlName,
  fileName,
  altName,
  defaultImage,
  defaultAlt,
  cropProfile,
  imageFit = 'contain',
  inputClass,
  labelClass,
}: ImageFieldProps) => {
  const [imageUrl, setImageUrl] = useState(defaultImage);
  const [previewUrl, setPreviewUrl] = useState(defaultImage);
  const [hasUploadFile, setHasUploadFile] = useState(false);

  const previewStyle = previewUrl
    ? {
        backgroundImage: `url("${previewUrl.replace(/"/g, '\\"')}")`,
      }
    : undefined;

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="grid gap-3">
      <span className={labelClass}>{label}</span>
      <div className="relative aspect-square overflow-hidden border border-shadow-black/10 bg-main-white p-2">
        {previewUrl ? (
          <div
            aria-label={defaultAlt || label}
            role="img"
            className={
              imageFit === 'contain'
                ? 'size-full bg-contain bg-center bg-no-repeat'
                : 'size-full bg-cover bg-center'
            }
            style={previewStyle}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm font-light text-shadow-black/40">
            No image
          </div>
        )}
      </div>

      <label className="grid gap-2">
        <span className={labelClass}>Image URL</span>
        <input
          name={urlName}
          value={imageUrl}
          required={!hasUploadFile}
          onChange={event => {
            setImageUrl(event.target.value);
            setPreviewUrl(event.target.value);
          }}
          className={inputClass}
        />
      </label>

      <label className="grid gap-2">
        <span className={labelClass}>Alt Text</span>
        <input name={altName} defaultValue={defaultAlt} className={inputClass} />
      </label>

      <label className="grid gap-2">
        <span className={labelClass}>Upload Image Optional</span>
        <ImageUploadInput
          cropProfile={cropProfile}
          name={fileName}
          accept="image/webp,image/jpeg,image/png"
          onFileChange={file => {
            if (!file) {
              setHasUploadFile(false);
              setPreviewUrl(imageUrl);
              return;
            }
            setHasUploadFile(true);
            setPreviewUrl(URL.createObjectURL(file));
          }}
          className="w-full border border-dashed border-shadow-black/20 px-3 py-3 text-sm file:mr-4 file:border-0 file:bg-maroon file:px-4 file:py-2 file:text-main-white"
        />
      </label>
    </div>
  );
};

const PdmKaikuSettingsForm = ({
  action,
  settings,
  products,
  inputClass,
  labelClass,
}: PdmKaikuSettingsFormProps) => {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(settings.productSlugs.slice(0, 2));
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
    setSelectedSlugs(prev => {
      if (prev.includes(slug)) {
        return prev.filter(item => item !== slug);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, slug];
    });
  };

  return (
    <form action={action} className="mt-8 grid gap-5 border border-shadow-black/10 bg-white p-5">
      <div>
        <h2 className="text-xl font-light">PDM WEEKEND MAT BASKET</h2>
        <p className="mt-1 text-sm font-light text-shadow-black/60">
          Manage the PDM Weekend Mat Basket showcase copy, spec images, and pick up to 2 featured products.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>Section Title</span>
          <input name="pdmTitle" defaultValue={settings.title} required className={inputClass} />
        </label>

        <label className="grid gap-2">
          <span className={labelClass}>Subtitle / Collaboration Tag</span>
          <input name="pdmSubtitle" defaultValue={settings.subtitle} className={inputClass} />
        </label>
      </div>

      <label className="grid gap-2">
        <span className={labelClass}>Description</span>
        <textarea
          name="pdmDescription"
          defaultValue={settings.description}
          rows={3}
          className={inputClass}
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <PdmImageField
          key={`pdm-label:${settings.labelImage}`}
          label="1. Woven Label Detail (Left Spec)"
          urlName="labelImage"
          fileName="labelImageFile"
          altName="labelAlt"
          defaultImage={settings.labelImage}
          defaultAlt={settings.labelAlt}
          cropProfile="media"
          imageFit="contain"
          inputClass={inputClass}
          labelClass={labelClass}
        />
        <PdmImageField
          key={`pdm-unfold:${settings.unfoldImage}`}
          label="2. 2-in-1 Unfold Spec (Right Spec)"
          urlName="unfoldImage"
          fileName="unfoldImageFile"
          altName="unfoldAlt"
          defaultImage={settings.unfoldImage}
          defaultAlt={settings.unfoldAlt}
          cropProfile="media"
          imageFit="contain"
          inputClass={inputClass}
          labelClass={labelClass}
        />
      </div>

      {/* Product Selector (Max 2 checkboxes) */}
      <div className="grid gap-3 border-t border-shadow-black/10 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-normal text-shadow-black">
              Featured Products (เลือกสินค้าแสดง 2 ช่อง)
            </h3>
            <p className="text-xs font-light text-shadow-black/60">
              {selectedSlugs.length === 0
                ? 'ยังไม่ได้เลือกสินค้า — หน้าแรกจะแสดงสินค้าตัวอย่างเริ่มต้น 2 รายการโดยอัตโนมัติ'
                : `เลือกแล้ว ${selectedSlugs.length} / 2 รายการ`}
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
          <input key={slug} type="hidden" name="pdmProductSlugs" value={slug} />
        ))}

        <input
          type="search"
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="ค้นหาชื่อสินค้าหรือหมวดหมู่..."
          className={inputClass}
        />

        <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto border border-shadow-black/10 bg-main-white p-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map(product => {
            const isChecked = selectedSlugs.includes(product.id);
            const isDisabled = !isChecked && selectedSlugs.length >= 2;
            const slotNumber = isChecked ? selectedSlugs.indexOf(product.id) + 1 : null;

            return (
              <label
                key={product.id}
                className={`flex cursor-pointer items-center gap-3 border p-2.5 transition-colors ${
                  isChecked
                    ? 'border-maroon bg-maroon/5'
                    : isDisabled
                      ? 'cursor-not-allowed border-shadow-black/10 bg-white opacity-50'
                      : 'border-shadow-black/10 bg-white hover:border-maroon/40'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isDisabled}
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
                {slotNumber && (
                  <span className="shrink-0 bg-maroon px-1.5 py-0.5 text-[11px] font-light text-main-white">
                    #{slotNumber}
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
        <SubmitButton pendingLabel="Saving PDM Weekend Mat Basket...">
          Save PDM WEEKEND MAT BASKET
        </SubmitButton>
      </div>
    </form>
  );
};

export default PdmKaikuSettingsForm;
