'use client';

import ImageUploadInput from '@/app/admin/(protected)/_components/ImageUploadInput';
import SubmitButton from '@/app/admin/(protected)/_components/SubmitButton';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { getContactSettings } from '@/lib/siteSettings';

type ContactSettings = Awaited<ReturnType<typeof getContactSettings>>;

type ContactSettingsFormProps = {
  action: (formData: FormData) => Promise<void>;
  settings: ContactSettings;
  inputClass: string;
  labelClass: string;
};

type ImageFieldProps = {
  label: string;
  urlName: string;
  fileName: string;
  altName: string;
  image: string;
  alt: string;
  inputClass: string;
  labelClass: string;
};

const ImageField = ({ label, urlName, fileName, altName, image, alt, inputClass, labelClass }: ImageFieldProps) => {
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
    <div className="grid gap-4">
      <span className={labelClass}>{label}</span>
      <div
        className="relative overflow-hidden border border-shadow-black/10 bg-main-white"
        style={{
          aspectRatio: fileName === 'qrImageFile' ? 1 : fileName === 'featureImageFile' ? 12 / 5 : 960 / 790,
        }}
      >
        {previewUrl ? (
          <Image src={previewUrl} alt={alt || label} fill sizes="520px" className="object-cover" />
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
        <input name={altName} defaultValue={alt} className={inputClass} />
      </label>

      <label className="grid gap-2">
        <span className={labelClass}>Upload Image Optional</span>
        <ImageUploadInput
          cropProfile={
            fileName === 'qrImageFile'
              ? 'square'
              : fileName === 'featureImageFile'
                ? 'contactFeature'
                : 'contactLogo'
          }
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
        <span className="text-xs font-light text-shadow-black/50">
          WEBP, JPG, or PNG. Crop and resize before upload. Saved as WEBP up to 1920px wide.
        </span>
      </label>
    </div>
  );
};

const ContactSettingsForm = ({ action, settings, inputClass, labelClass }: ContactSettingsFormProps) => (
  <form action={action} className="mt-8 grid gap-8 border border-shadow-black/10 bg-white p-5">
    <section className="grid gap-4">
      <h2 className="text-lg font-light text-maroon">Contact Information</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>Phone</span>
          <input name="phone" defaultValue={settings.phone} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Hotline</span>
          <input name="hotline" defaultValue={settings.hotline} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Line ID (Display)</span>
          <input name="lineId" defaultValue={settings.lineId} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Line URL</span>
          <input name="lineLink" defaultValue={settings.lineLink} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Email</span>
          <input name="email" type="email" defaultValue={settings.email} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Google Maps Search Query</span>
          <input name="locationQuery" defaultValue={settings.locationQuery} className={inputClass} />
        </label>
      </div>
      <label className="grid gap-2">
        <span className={labelClass}>Address / Location Text</span>
        <input name="locationText" defaultValue={settings.locationText} className={inputClass} />
      </label>
    </section>

    <section className="grid gap-4 border-t border-shadow-black/10 pt-6">
      <h2 className="text-lg font-light text-maroon">Brand Copy &amp; Business Hours</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>Company Name</span>
          <input name="companyName" defaultValue={settings.companyName} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Company Subtitle</span>
          <input name="companySubtitle" defaultValue={settings.companySubtitle} className={inputClass} />
        </label>
      </div>
      <label className="grid gap-2">
        <span className={labelClass}>Contact Page Tagline</span>
        <textarea name="tagline" defaultValue={settings.tagline} rows={3} className={`${inputClass} resize-y`} />
      </label>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2">
          <span className={labelClass}>Monday - Friday</span>
          <input name="hoursWeekday" defaultValue={settings.hoursWeekday} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Saturday</span>
          <input name="hoursSaturday" defaultValue={settings.hoursSaturday} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Sunday</span>
          <input name="hoursSunday" defaultValue={settings.hoursSunday} className={inputClass} />
        </label>
      </div>
    </section>

    <section className="grid gap-4 border-t border-shadow-black/10 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-light text-maroon">Downloadable Catalog PDF</h2>
          <p className="mt-0.5 text-xs font-light text-shadow-black/55">
            Opened when visitors submit the &ldquo;See the Catalog&rdquo; form in the storefront footer.
          </p>
        </div>
        {settings.catalogPdfUrl && (
          <a
            href={settings.catalogPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-maroon px-3 py-1.5 text-xs font-light text-maroon hover:bg-maroon/5"
          >
            Preview Current PDF ↗
          </a>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className={labelClass}>Catalog PDF URL</span>
          <input name="catalogPdfUrl" defaultValue={settings.catalogPdfUrl} className={inputClass} />
        </label>
        <label className="grid gap-2">
          <span className={labelClass}>Upload New PDF (Optional, max 25MB)</span>
          <input
            type="file"
            name="catalogPdfFile"
            accept="application/pdf,.pdf"
            className="w-full border border-dashed border-shadow-black/20 px-3 py-2 text-sm file:mr-4 file:border-0 file:bg-maroon file:px-4 file:py-1.5 file:text-main-white"
          />
        </label>
      </div>
    </section>

    <section className="grid gap-4 border-t border-shadow-black/10 pt-6">
      <h2 className="text-lg font-light text-maroon">Contact Page Images</h2>
      <div className="grid gap-5 lg:grid-cols-3">
        <ImageField
          key={'logoImage:' + settings.logoImage}
          label="Logo Image"
          urlName="logoImage"
          fileName="logoImageFile"
          altName="logoAlt"
          image={settings.logoImage}
          alt={settings.logoAlt}
          inputClass={inputClass}
          labelClass={labelClass}
        />
        <ImageField
          key={'featureImage:' + settings.featureImage}
          label="Feature Image"
          urlName="featureImage"
          fileName="featureImageFile"
          altName="featureAlt"
          image={settings.featureImage}
          alt={settings.featureAlt}
          inputClass={inputClass}
          labelClass={labelClass}
        />
        <ImageField
          key={'qrImage:' + settings.qrImage}
          label="Line QR Image"
          urlName="qrImage"
          fileName="qrImageFile"
          altName="qrAlt"
          image={settings.qrImage}
          alt={settings.qrAlt}
          inputClass={inputClass}
          labelClass={labelClass}
        />
      </div>
    </section>

    <div>
      <SubmitButton pendingLabel="Saving Settings...">Save Contact &amp; Catalog Settings</SubmitButton>
    </div>
  </form>
);

export default ContactSettingsForm;
