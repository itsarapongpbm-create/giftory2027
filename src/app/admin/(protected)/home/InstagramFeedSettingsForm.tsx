'use client';

import { useEffect, useState } from 'react';
import ImageUploadInput from '@/app/admin/(protected)/_components/ImageUploadInput';
import SubmitButton from '@/app/admin/(protected)/_components/SubmitButton';
import type { InstagramFeedSettings, InstagramPostItem } from '@/lib/siteSettings';

type InstagramFeedSettingsFormProps = {
  action: (formData: FormData) => Promise<void>;
  settings: InstagramFeedSettings;
  inputClass: string;
  labelClass: string;
};

type PostSlotProps = {
  index: number;
  post: InstagramPostItem;
  inputClass: string;
  labelClass: string;
};

const InstagramPostSlot = ({ index, post, inputClass, labelClass }: PostSlotProps) => {
  const [imageUrl, setImageUrl] = useState(post.image);
  const [previewUrl, setPreviewUrl] = useState(post.image);
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
    <div className="grid gap-3 border border-shadow-black/10 bg-main-white p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-normal text-maroon">Post #{index + 1}</span>
        <label className="flex cursor-pointer items-center gap-1.5 text-xs font-light text-shadow-black/75">
          <input
            type="checkbox"
            name={`igPostIsReel_${index}`}
            defaultChecked={post.isReel}
            className="checkbox checkbox-xs accent-maroon"
          />
          <span>Reel / คลิป (▶)</span>
        </label>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden border border-shadow-black/10 bg-white">
        {previewUrl ? (
          <div
            aria-label={post.caption || `Instagram post ${index + 1}`}
            role="img"
            className="size-full bg-cover bg-center"
            style={previewStyle}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs font-light text-shadow-black/40">
            No image
          </div>
        )}
      </div>

      <label className="grid gap-1.5">
        <span className={labelClass}>อัปโหลดรูปปก (แนะนำ 4:5)</span>
        <ImageUploadInput
          cropProfile="product"
          name={`igPostImageFile_${index}`}
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
          className="w-full border border-dashed border-shadow-black/20 px-2.5 py-2 text-xs file:mr-2.5 file:border-0 file:bg-maroon file:px-3 file:py-1.5 file:text-main-white"
        />
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>Image URL</span>
        <input
          name={`igPostImage_${index}`}
          value={imageUrl}
          required={!hasUploadFile}
          onChange={event => {
            setImageUrl(event.target.value);
            setPreviewUrl(event.target.value);
          }}
          className={inputClass}
        />
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>ลิงก์โพสต์ / Reel IG</span>
        <input
          name={`igPostUrl_${index}`}
          defaultValue={post.postUrl}
          placeholder="https://www.instagram.com/p/..."
          className={inputClass}
        />
      </label>

      <label className="grid gap-1.5">
        <span className={labelClass}>คำบรรยายสั้น (Hover)</span>
        <input
          name={`igPostCaption_${index}`}
          defaultValue={post.caption}
          placeholder="เช่น กระเช้าของขวัญปีใหม่"
          className={inputClass}
        />
      </label>
    </div>
  );
};

const InstagramFeedSettingsForm = ({
  action,
  settings,
  inputClass,
  labelClass,
}: InstagramFeedSettingsFormProps) => (
  <form action={action} className="mt-8 grid gap-5 border border-shadow-black/10 bg-white p-5">
    <div>
      <h2 className="text-xl font-light">Follow Us on Instagram</h2>
      <p className="mt-1 text-sm font-light text-shadow-black/60">
        อัปโหลดรูปปกโพสต์เด่น 5 ช่อง พร้อมวางลิงก์โพสต์หรือคลิป Reels จริงของร้าน (คลิกแล้วเด้งไปที่ IG ทันที)
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      <label className="grid gap-2">
        <span className={labelClass}>Section Title</span>
        <input name="igTitle" defaultValue={settings.title} required className={inputClass} />
      </label>
      <label className="grid gap-2">
        <span className={labelClass}>Instagram Handle</span>
        <input name="igHandle" defaultValue={settings.handle} placeholder="@giftory.th" className={inputClass} />
      </label>
      <label className="grid gap-2">
        <span className={labelClass}>Profile URL (ปุ่ม Follow on Instagram)</span>
        <input name="igProfileUrl" defaultValue={settings.profileUrl} required className={inputClass} />
      </label>
    </div>

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {settings.posts.map((post, index) => (
        <InstagramPostSlot
          key={`ig-slot-${index}:${post.image}`}
          index={index}
          post={post}
          inputClass={inputClass}
          labelClass={labelClass}
        />
      ))}
    </div>

    <div>
      <SubmitButton pendingLabel="Saving Instagram Feed...">Save Instagram Feed</SubmitButton>
    </div>
  </form>
);

export default InstagramFeedSettingsForm;
