'use client';

import ImageUploadInput from '@/app/admin/(protected)/_components/ImageUploadInput';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type CustomGiftItemImageFieldProps = {
  featured?: boolean;
  image: string;
  title: string;
  inputClass: string;
  labelClass: string;
};

const CustomGiftItemImageField = ({ featured = false, image, title, inputClass, labelClass }: CustomGiftItemImageFieldProps) => {
  const [imageUrl, setImageUrl] = useState(image);
  const [previewUrl, setPreviewUrl] = useState(image);
  const [hasUploadFile, setHasUploadFile] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <>
      <div className="relative overflow-hidden border border-shadow-black/10 bg-main-white" style={{ aspectRatio: featured ? 4 / 3 : 2 / 3 }}>
        {previewUrl ? (
          <Image src={previewUrl} alt={title || 'Custom gift preview'} fill sizes="320px" className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-sm font-light text-shadow-black/40">
            No image
          </div>
        )}
      </div>

      <label className="grid gap-2">
        <span className={labelClass}>Image URL</span>
        <input
          name="image"
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
        <span className={labelClass}>Upload Image Optional</span>
        <ImageUploadInput
          cropProfile={featured ? 'customGiftFeatured' : 'customGift'}
          name="imageFile"
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
        <span className="text-xs font-light text-shadow-black/50">
          WEBP, JPG, or PNG. Crop and resize before upload. Saved as WEBP up to 1920px wide.
        </span>
      </label>
    </>
  );
};

export default CustomGiftItemImageField;
