'use client';

import { useEffect, useState } from 'react';
import ImageUploadInput from '@/app/admin/(protected)/_components/ImageUploadInput';
import SubmitButton from '@/app/admin/(protected)/_components/SubmitButton';
import type { CustomGiftHeroSettings } from '@/lib/siteSettings';

type CustomGiftHeroSettingsFormProps = {
  action: (formData: FormData) => Promise<void>;
  settings: CustomGiftHeroSettings;
  inputClass: string;
  labelClass: string;
};

const CustomGiftHeroSettingsForm = ({
  action,
  settings,
  inputClass,
  labelClass,
}: CustomGiftHeroSettingsFormProps) => {
  const [imageUrl, setImageUrl] = useState(settings.bgImage);
  const [previewUrl, setPreviewUrl] = useState(settings.bgImage);
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
    <form action={action} className="grid gap-6 border border-shadow-black/10 bg-white p-6">
      <div>
        <h2 className="text-xl font-light">Custom Gift Page Hero & Background</h2>
        <p className="mt-1 text-sm font-light text-shadow-black/60">
          Manage the top header section, background banner image, and headline of the storefront Custom Gift page.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>Top Tag / Subtitle</span>
          <input
            name="tag"
            defaultValue={settings.tag}
            placeholder="Bespoke Gifting Service"
            className={inputClass}
          />
        </label>

        <label className="grid gap-2">
          <span className={labelClass}>Main Title</span>
          <input
            name="title"
            defaultValue={settings.title}
            placeholder="Custom Gift — ศิลปะแห่งการมอบของขวัญเฉพาะคุณ"
            required
            className={inputClass}
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className={labelClass}>Description Text</span>
        <textarea
          name="description"
          defaultValue={settings.description}
          rows={3}
          className={inputClass}
        />
      </label>

      {/* Background Image Preview & Inputs */}
      <div className="grid gap-5 border-t border-shadow-black/10 pt-5 md:grid-cols-[300px_1fr]">
        <div className="grid gap-2">
          <span className={labelClass}>Background Banner Preview</span>
          <div className="relative aspect-video w-full overflow-hidden border border-shadow-black/10 bg-main-white">
            {previewUrl ? (
              <div
                aria-label="Background preview"
                role="img"
                className="size-full bg-cover bg-center"
                style={previewStyle}
              />
            ) : (
              <div className="flex size-full items-center justify-center text-xs font-light text-shadow-black/40">
                No image
              </div>
            )}
            <div className="absolute inset-0 bg-shadow-black/50" />
            <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-xs font-light text-white">
              Preview Overlay
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className={labelClass}>Background Image URL</span>
            <input
              name="bgImage"
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
            <span className={labelClass}>Upload Background Image Optional</span>
            <ImageUploadInput
              cropProfile="homeCover"
              name="bgImageFile"
              className={inputClass}
              onFileChange={file => {
                setHasUploadFile(Boolean(file));
                if (file) {
                  const objectUrl = URL.createObjectURL(file);
                  setPreviewUrl(objectUrl);
                } else {
                  setPreviewUrl(imageUrl);
                }
              }}
            />
          </label>

          <label className="grid gap-2">
            <span className={labelClass}>Image Alt Text</span>
            <input
              name="bgAlt"
              defaultValue={settings.bgAlt}
              placeholder="Custom Gift Hero Background"
              className={inputClass}
            />
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <SubmitButton pendingLabel="Saving Hero...">Save Hero Banner</SubmitButton>
      </div>
    </form>
  );
};

export default CustomGiftHeroSettingsForm;
