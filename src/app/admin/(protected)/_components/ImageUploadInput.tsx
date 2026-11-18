'use client';

import { useEffect, useId, useRef, useState, type InputHTMLAttributes } from 'react';
import { prepareImageUpload, validateImageUpload } from '@/lib/prepareImageUpload';
import type { ImageCropProfile } from '@/lib/imageCrop';
import ImageCropDialog from './ImageCropDialog';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'multiple'> & {
  cropProfile?: ImageCropProfile;
  onFileChange?: (file: File | undefined) => void;
};

export default function ImageUploadInput({ onFileChange, cropProfile = 'media', ...props }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generation = useRef(0);
  const acceptedFile = useRef<File | undefined>(undefined);
  const [originalFile, setOriginalFile] = useState<File | undefined>(undefined);
  const [draft, setDraft] = useState<File | null>(null);
  const onFileChangeRef = useRef(onFileChange);
  const messageId = useId();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    onFileChangeRef.current = onFileChange;
  }, [onFileChange]);

  useEffect(() => {
    const input = inputRef.current;
    const reset = () => {
      generation.current += 1;
      input?.setCustomValidity('');
      acceptedFile.current = undefined;
      setOriginalFile(undefined);
      setDraft(null);
      setMessage('');
      setBusy(false);
      onFileChangeRef.current?.(undefined);
    };
    const form = input?.form;
    form?.addEventListener('reset', reset);
    return () => {
      generation.current += 1;
      form?.removeEventListener('reset', reset);
    };
  }, []);

  return (
    <>
      <input
        {...props}
        ref={inputRef}
        type="file"
        aria-busy={busy}
        aria-describedby={[props['aria-describedby'], messageId].filter(Boolean).join(' ')}
        onChange={event => {
          const input = event.currentTarget;
          generation.current += 1;
          const file = input.files?.[0];
          if (!file) {
            acceptedFile.current = undefined;
            setOriginalFile(undefined);
            setMessage('');
            input.setCustomValidity('');
            onFileChangeRef.current?.(undefined);
            return;
          }
          try {
            validateImageUpload(file);
            input.setCustomValidity('กรุณายืนยันการครอปรูปก่อนบันทึก');
            setMessage('จัดตำแหน่งรูปแล้วกด “ใช้รูปนี้”');
            setBusy(true);
            setDraft(file);
          } catch (error) {
            input.value = '';
            if (acceptedFile.current) {
              const transfer = new DataTransfer();
              transfer.items.add(acceptedFile.current);
              input.files = transfer.files;
            }
            input.setCustomValidity('');
            setMessage(error instanceof Error ? error.message : 'เปิดรูปไม่ได้');
          }
        }}
      />
      {originalFile && !draft && (
        <button
          type="button"
          className="w-fit text-sm text-maroon underline"
          onClick={() => {
            if (!originalFile) return;
            generation.current += 1;
            inputRef.current?.setCustomValidity('กรุณายืนยันการครอปรูปก่อนบันทึก');
            setBusy(true);
            setDraft(originalFile);
          }}
        >
          ปรับครอปรูปอีกครั้ง
        </button>
      )}
      {draft && (
        <ImageCropDialog
          file={draft}
          profile={cropProfile}
          onCancel={() => {
            generation.current += 1;
            const input = inputRef.current;
            if (input) {
              const transfer = new DataTransfer();
              if (acceptedFile.current) transfer.items.add(acceptedFile.current);
              input.files = transfer.files;
              input.setCustomValidity('');
            }
            setDraft(null);
            setBusy(false);
            setMessage(acceptedFile.current ? 'รูปพร้อมอัปโหลด' : '');
          }}
          onConfirm={async cropped => {
            const current = generation.current;
            const prepared = await prepareImageUpload(cropped);
            const input = inputRef.current;
            if (!input || current !== generation.current) return;
            const transfer = new DataTransfer();
            transfer.items.add(prepared);
            input.files = transfer.files;
            input.setCustomValidity('');
            acceptedFile.current = prepared;
            setOriginalFile(draft);
            setDraft(null);
            setBusy(false);
            setMessage('รูปพร้อมอัปโหลด');
            onFileChangeRef.current?.(prepared);
          }}
        />
      )}
      <span id={messageId} role="status" className="text-xs font-light text-shadow-black/70">
        {message}
      </span>
    </>
  );
}
