'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cropGeometry, imageCropProfiles, type ImageCropProfile } from '@/lib/imageCrop';

type Props = {
  file: File;
  profile: ImageCropProfile;
  onCancel: () => void;
  onConfirm: (file: File) => Promise<void>;
};

export default function ImageCropDialog({ file, profile, onCancel, onConfirm }: Props) {
  const config = imageCropProfiles[profile];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewsRef = useRef<(HTMLCanvasElement | null)[]>([]);
  const dragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    startX: number;
    startY: number;
  } | null>(null);
  const headingId = useId();
  const [source, setSource] = useState<HTMLImageElement | null>(null);
  const [ratio, setRatio] = useState(config.ratio || 1);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image
      .decode()
      .then(() => {
        if (!active) return;
        setSource(image);
        if (!config.ratio) setRatio(image.naturalWidth / image.naturalHeight);
      })
      .catch(() => {
        if (active) setError('เปิดรูปนี้ไม่ได้ กรุณาเลือกไฟล์รูปภาพอื่น');
      });
    return () => {
      active = false;
      URL.revokeObjectURL(url);
    };
  }, [file, config.ratio]);

  const width = Math.max(1, Math.round(ratio >= 1 ? 1920 : 1920 * ratio));
  const height = Math.max(1, Math.round(ratio >= 1 ? 1920 / ratio : 1920));
  const fitZoom = source
    ? Math.min(width / source.naturalWidth, height / source.naturalHeight) /
      Math.max(width / source.naturalWidth, height / source.naturalHeight)
    : 1;
  const previews = config.previews.length ? config.previews : [{ label: 'รูปที่จะบันทึก', ratio }];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!source || !canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const rect = cropGeometry(
      source.naturalWidth,
      source.naturalHeight,
      width,
      height,
      zoom,
      position.x,
      position.y
    );
    context.clearRect(0, 0, width, height);
    // Keep transparency for cutouts; the preview uses the site's light background.
    context.drawImage(source, rect.x, rect.y, rect.width, rect.height);
    previewsRef.current.forEach((preview, index) => {
      const previewContext = preview?.getContext('2d');
      if (!preview || !previewContext) return;
      previewContext.clearRect(0, 0, preview.width, preview.height);
      const frame = cropGeometry(width, height, preview.width, preview.height, 1, 50, 50);
      previewContext.drawImage(canvas, frame.x, frame.y, frame.width, frame.height);
      if (profile === 'homeCover') {
        previewContext.fillStyle = 'rgba(16,12,8,0.2)';
        previewContext.fillRect(0, 0, preview.width, preview.height);
      }
      if (profile === 'product' && index === 0) {
        previewContext.fillStyle = '#FCFCFF';
        previewContext.fillRect(0, preview.height * 0.78, preview.width, preview.height * 0.22);
        previewContext.fillStyle = '#7D0A0A';
        previewContext.font = '16px sans-serif';
        previewContext.fillText('ชื่อสินค้า / ราคา', 12, preview.height * 0.9);
      }
    });
  }, [source, width, height, zoom, position, profile, ratio]);

  const confirm = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !source) return;
    setSaving(true);
    setError('');
    try {
      const blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, 'image/webp', 0.9)
      );
      if (!blob) throw new Error('บันทึกภาพไม่ได้ กรุณาลองใหม่');
      const extension = blob.type === 'image/webp' ? 'webp' : 'png';
      await onConfirm(
        new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.${extension}`, { type: blob.type })
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'บันทึกภาพไม่ได้ กรุณาลองใหม่');
      setSaving(false);
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      className="fixed inset-0 m-auto max-h-[94dvh] w-[min(960px,94vw)] overflow-y-auto rounded-lg bg-main-white p-4 text-shadow-black shadow-xl backdrop:bg-black/60 sm:p-6"
      onCancel={event => {
        event.preventDefault();
        if (!saving) onCancel();
      }}
      onClick={event => event.stopPropagation()}
    >
      <h2 id={headingId} className="text-xl font-medium">
        ครอปและจัดตำแหน่งรูป
      </h2>
      <p className="mt-1 text-sm">{config.label} · ลากรูปเพื่อจัดตำแหน่ง แล้วปรับซูมตามต้องการ</p>
      {config.note && <p className="mt-2 text-sm text-shadow-black/60">{config.note}</p>}
      {profile === 'media' && source && (
        <label className="mt-4 flex items-center gap-3 text-sm">
          สัดส่วน
          <select
            aria-label="สัดส่วนครอป"
            value={ratio}
            disabled={saving}
            className="border p-2"
            onChange={event => {
              setRatio(Number(event.target.value));
              setZoom(1);
              setPosition({ x: 50, y: 50 });
            }}
          >
            <option value={source.naturalWidth / source.naturalHeight}>ต้นฉบับ</option>
            <option value={1}>1:1</option>
            <option value={2 / 3}>2:3</option>
            <option value={3 / 4}>3:4</option>
            <option value={4 / 3}>4:3</option>
            <option value={16 / 9}>16:9</option>
            <option value={64 / 25}>แบนเนอร์หน้าหลัก</option>
          </select>
        </label>
      )}
      <div className="mt-4 flex justify-center rounded border bg-gray-100 p-2">
        <div
          className="relative overflow-hidden bg-main-white"
          style={{ width: `min(100%, ${360 * ratio}px)`, aspectRatio: ratio }}
        >
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            aria-label="กรอบครอป ลากเพื่อจัดตำแหน่งรูป หรือใช้ตัวเลื่อนตำแหน่งด้านล่าง"
            className="block size-full cursor-move touch-none"
            onPointerDown={event => {
              if (saving || !source) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              dragRef.current = {
                pointerId: event.pointerId,
                x: event.clientX,
                y: event.clientY,
                startX: position.x,
                startY: position.y,
              };
            }}
            onPointerMove={event => {
              const drag = dragRef.current;
              if (!drag || !source || saving) return;
              const bounds = event.currentTarget.getBoundingClientRect();
              const rect = cropGeometry(
                source.naturalWidth,
                source.naturalHeight,
                bounds.width,
                bounds.height,
                zoom,
                50,
                50
              );
              const clamp = (value: number) => Math.min(100, Math.max(0, value));
              setPosition({
                x:
                  Math.abs(bounds.width - rect.width) < 1
                    ? 50
                    : clamp(
                        drag.startX + ((event.clientX - drag.x) / (bounds.width - rect.width)) * 100
                      ),
                y:
                  Math.abs(bounds.height - rect.height) < 1
                    ? 50
                    : clamp(
                        drag.startY +
                          ((event.clientY - drag.y) / (bounds.height - rect.height)) * 100
                      ),
              });
            }}
            onPointerUp={() => {
              dragRef.current = null;
            }}
            onPointerCancel={() => {
              dragRef.current = null;
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3"
          >
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="border border-white/35" />
            ))}
          </div>
        </div>
      </div>
      {!source && !error && <p role="status">กำลังเปิดรูป…</p>}
      <fieldset disabled={saving || !source} className="mt-4 grid gap-3">
        <label className="grid gap-1 text-sm">
          ซูม {Math.round(zoom * 100)}%
          <input
            aria-label="ซูมรูป"
            type="range"
            min={Math.min(fitZoom, zoom)}
            max={3}
            step="0.01"
            value={zoom}
            onChange={event => setZoom(Number(event.target.value))}
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1 text-sm">
            ตำแหน่งแนวนอน
            <input
              aria-label="ตำแหน่งแนวนอน"
              type="range"
              min="0"
              max="100"
              value={position.x}
              onChange={event =>
                setPosition(current => ({ ...current, x: Number(event.target.value) }))
              }
            />
          </label>
          <label className="grid gap-1 text-sm">
            ตำแหน่งแนวตั้ง
            <input
              aria-label="ตำแหน่งแนวตั้ง"
              type="range"
              min="0"
              max="100"
              value={position.y}
              onChange={event =>
                setPosition(current => ({ ...current, y: Number(event.target.value) }))
              }
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="border px-3 py-2 text-sm"
            onClick={() => {
              setZoom(1);
              setPosition({ x: 50, y: 50 });
            }}
          >
            เต็มกรอบ / รีเซ็ต
          </button>
          <button
            type="button"
            className="border px-3 py-2 text-sm"
            onClick={() => {
              setZoom(fitZoom);
              setPosition({ x: 50, y: 50 });
            }}
          >
            แสดงรูปเต็ม (อาจมีขอบว่าง)
          </button>
        </div>
      </fieldset>
      <h3 className="mb-2 mt-5 text-sm font-medium">ตัวอย่างเมื่อนำไปแสดงบนเว็บไซต์</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {previews.map((preview, index) => (
          <div key={preview.label}>
            <p className="mb-1 text-xs">{preview.label}</p>
            <div
              className="relative overflow-hidden border bg-main-white"
              style={{ aspectRatio: preview.ratio, width: `min(100%, ${220 * preview.ratio}px)` }}
            >
              <canvas
                ref={node => {
                  previewsRef.current[index] = node;
                }}
                width={Math.max(1, Math.round(Math.min(360, 360 * preview.ratio)))}
                height={Math.max(1, Math.round(Math.min(360, 360 / preview.ratio)))}
                className="block size-full"
                aria-label={preview.label}
              />
              {profile === 'homeCover' && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="border border-white px-2 py-1 text-[10px] text-white">
                    See the collection
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="sticky bottom-0 mt-5 flex justify-end gap-3 border-t bg-main-white py-3">
        <button
          type="button"
          disabled={saving}
          onClick={onCancel}
          className="border px-4 py-2 disabled:opacity-50"
        >
          ยกเลิก
        </button>
        <button
          type="button"
          disabled={saving || !source}
          onClick={confirm}
          className="bg-maroon px-4 py-2 text-white disabled:opacity-50"
        >
          {saving ? 'กำลังเตรียมรูป…' : 'ใช้รูปนี้'}
        </button>
      </div>
    </dialog>,
    document.body
  );
}
