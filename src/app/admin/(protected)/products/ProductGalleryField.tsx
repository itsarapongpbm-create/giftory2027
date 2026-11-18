'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export type InitialGalleryItem = {
  id?: string;
  url: string;
  alt?: string | null;
};

type ProductGalleryFieldProps = {
  initialImages?: InitialGalleryItem[];
  inputClass: string;
  labelClass: string;
};

type GalleryRow = {
  key: string;
  url: string;
  alt: string;
};

export default function ProductGalleryField({
  initialImages = [],
  inputClass,
  labelClass,
}: ProductGalleryFieldProps) {
  const [rows, setRows] = useState<GalleryRow[]>(() =>
    initialImages.map((item, idx) => ({
      key: item.id || `existing-${idx}`,
      url: item.url,
      alt: item.alt || '',
    }))
  );
  const [newFilePreviews, setNewFilePreviews] = useState<Array<{ name: string; url: string }>>([]);

  useEffect(() => {
    return () => {
      for (const preview of newFilePreviews) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [newFilePreviews]);

  const addEmptyRow = () => {
    setRows(prev => [
      ...prev,
      { key: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`, url: '', alt: '' },
    ]);
  };

  const updateRow = (key: string, field: 'url' | 'alt', value: string) => {
    setRows(prev => prev.map(row => (row.key === key ? { ...row, [field]: value } : row)));
  };

  const removeRow = (key: string) => {
    setRows(prev => prev.filter(row => row.key !== key));
  };

  const moveRow = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    setRows(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved);
      return copy;
    });
  };

  return (
    <div className="grid gap-4 border-t border-shadow-black/10 pt-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className={labelClass}>Additional Gallery Images (Optional)</span>
          <p className="mt-0.5 text-xs font-light text-shadow-black/55">
            Show multiple angles or close-up shots on the product detail page.
          </p>
        </div>
        <button
          type="button"
          onClick={addEmptyRow}
          className="border border-maroon px-3 py-1.5 text-xs font-light text-maroon hover:bg-maroon/5"
        >
          + Add Image URL
        </button>
      </div>

      {rows.length > 0 && (
        <div className="grid gap-3">
          {rows.map((row, index) => (
            <div
              key={row.key}
              className="grid items-center gap-3 border border-shadow-black/10 bg-main-white/60 p-3 md:grid-cols-[64px_1fr_200px_auto]"
            >
              <div className="relative size-16 overflow-hidden border border-shadow-black/10 bg-white">
                {row.url ? (
                  <Image src={row.url} alt={row.alt || `Gallery ${index + 1}`} fill sizes="64px" className="object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center text-[10px] text-shadow-black/40">
                    Preview
                  </div>
                )}
              </div>
              <input
                name="galleryUrls"
                value={row.url}
                onChange={e => updateRow(row.key, 'url', e.target.value)}
                placeholder="https://images.giftoryth.com/..."
                className={inputClass}
              />
              <input
                name="galleryAlts"
                value={row.alt}
                onChange={e => updateRow(row.key, 'alt', e.target.value)}
                placeholder="Alt text (optional)"
                className={inputClass}
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveRow(index, -1)}
                  disabled={index === 0}
                  className="border border-shadow-black/20 px-2 py-1.5 text-xs disabled:opacity-30"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveRow(index, 1)}
                  disabled={index === rows.length - 1}
                  className="border border-shadow-black/20 px-2 py-1.5 text-xs disabled:opacity-30"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeRow(row.key)}
                  className="border border-main-red px-2.5 py-1.5 text-xs text-main-red"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="grid gap-2">
        <span className={labelClass}>Upload Multiple Gallery Images</span>
        <input
          type="file"
          name="galleryFiles"
          multiple
          accept="image/webp,image/jpeg,image/png"
          onChange={e => {
            const files = Array.from(e.currentTarget.files || []);
            setNewFilePreviews(prev => {
              prev.forEach(p => URL.revokeObjectURL(p.url));
              return files.map(file => ({ name: file.name, url: URL.createObjectURL(file) }));
            });
          }}
          className="w-full border border-dashed border-shadow-black/20 px-3 py-3 text-sm file:mr-4 file:border-0 file:bg-maroon file:px-4 file:py-2 file:text-main-white"
        />
        <span className="text-xs font-light text-shadow-black/50">
          Select one or more WEBP, JPG, or PNG files. Each will be converted to WEBP automatically.
        </span>
      </label>

      {newFilePreviews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {newFilePreviews.map(preview => (
            <div key={preview.url} className="border border-shadow-black/10 bg-white p-1.5">
              <div className="relative aspect-square overflow-hidden bg-main-white">
                <Image src={preview.url} alt={preview.name} fill sizes="120px" className="object-cover" />
              </div>
              <p className="mt-1 truncate text-[11px] font-light text-shadow-black/60">{preview.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
