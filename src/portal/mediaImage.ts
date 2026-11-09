const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.84;
const MAX_OUTPUT_BYTES = 5 * 1024 * 1024;

/**
 * Resize and compress an image in the browser for Control Center Media uploads.
 * Returns a JPEG File ready for Supabase Storage (max edge 1600px, ~5 MB).
 */
export async function prepareMediaUpload(file: File): Promise<File> {
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowed.has(file.type)) {
    throw new Error("Choose a JPEG, PNG, or WebP image.");
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("Images must be 12 MB or smaller before compression.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not prepare that image in this browser.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = JPEG_QUALITY;
  let blob: Blob | null = await canvasToBlob(canvas, quality);
  while (blob && blob.size > MAX_OUTPUT_BYTES && quality > 0.55) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, quality);
  }
  if (!blob) throw new Error("Image compression failed. Try another file.");
  if (blob.size > MAX_OUTPUT_BYTES) {
    throw new Error("Compressed image is still over 5 MB. Try a smaller photo.");
  }

  const base = file.name.replace(/\.[^.]+$/, "") || "bawosocial-media";
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}
