// Media uploads. Firebase Storage requires a billing account, so v1 uses
// Cloudinary's free tier instead: unsigned uploads straight from the browser,
// images AND video, no card required. Create an "unsigned upload preset" in
// the Cloudinary dashboard and put both values in .env.local.
//
// When the project moves to the Firebase Blaze plan, swap this file back to
// firebase/storage - storage.rules is already written and shipped.

export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100 MB (Cloudinary free video cap)

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function isSupportedMedia(file: File) {
  return (
    file.type.startsWith("image/") ||
    file.type.startsWith("video/") ||
    file.type.startsWith("audio/")
  );
}

/** Upload to Cloudinary, tagged with the uploader's uid for traceability. */
export async function uploadMedia(file: File, uid: string): Promise<string> {
  if (!isSupportedMedia(file))
    throw new Error("Only images, videos, and audio are supported.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("File too large (max 100 MB).");
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Media uploads aren't configured yet. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET (see README)."
    );
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("tags", `uid:${uid}`);

  // `auto` lets Cloudinary route images and videos to the right pipeline.
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? "Upload failed. Try again.");
  }
  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}
