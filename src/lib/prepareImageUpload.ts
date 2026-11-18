const MAX_UPLOAD_BYTES = 1024 * 1024;
const ALLOWED_TYPES = ['image/webp', 'image/jpeg', 'image/png'];

// Original files are cropped locally, so validate their type without a byte limit.
export const validateImageUpload = (file: File) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only WEBP, JPG, and PNG images are allowed.');
  }
};

export const prepareImageUpload = async (file: File): Promise<File> => {
  validateImageUpload(file);
  if (file.size <= MAX_UPLOAD_BYTES) return file;

  const image = new Image();
  const url = URL.createObjectURL(file);
  try {
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not resize this image.');

    for (
      let maxDimension = 1920;
      maxDimension >= 480;
      maxDimension = Math.floor(maxDimension * 0.75)
    ) {
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, 'image/webp', 0.85)
      );
      if (!blob) throw new Error('Your browser could not resize this image.');
      if (blob.size <= MAX_UPLOAD_BYTES && ALLOWED_TYPES.includes(blob.type)) {
        const extension =
          blob.type === 'image/webp' ? 'webp' : blob.type === 'image/jpeg' ? 'jpg' : 'png';
        return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.${extension}`, {
          type: blob.type,
          lastModified: file.lastModified,
        });
      }
    }
    throw new Error('Could not reduce this image enough. Please choose a smaller image.');
  } finally {
    URL.revokeObjectURL(url);
  }
};
