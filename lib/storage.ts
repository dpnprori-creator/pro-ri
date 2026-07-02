import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Supabase Storage buckets
export const NEWS_BUCKET = "news";
export const EVENTS_BUCKET = "events";
export const INNOVATIONS_BUCKET = "innovations";
export const MEMBERS_BUCKET = "photos";
export const MEMBER_CARDS_BUCKET = "member-cards";
export const HERO_GALLERY_BUCKET = "hero-gallery";
export const ACTIVITY_GALLERY_BUCKET = "activity-gallery";

/**
 * Upload a File object to Supabase Storage.
 */
export async function uploadFileToStorage(
  file: File,
  bucketName: string,
  filePath: string
): Promise<string | null> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`Supabase Storage upload error (${bucketName}/${filePath}):`, error);
    return null;
  }
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteFileFromStorage(
  bucketName: string,
  filePath: string
): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.storage.from(bucketName).remove([filePath]);
    if (error) throw error;
  } catch (error) {
    console.error(`Supabase Storage delete error (${bucketName}/${filePath}):`, error);
  }
}

/**
 * Upload a Buffer directly (for server-generated content like certificates PDFs).
 */
export async function uploadBufferToStorage(
  buffer: Uint8Array | number[],
  bucketName: string,
  filePath: string,
  contentType: string = "application/pdf"
): Promise<string | null> {
  try {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const blob = new Blob([bytes as BlobPart], { type: contentType });
    const file = new File([blob], filePath.split("/").pop() || "file", { type: contentType });
    return await uploadFileToStorage(file, bucketName, filePath);
  } catch (error) {
    console.error(`Supabase Storage buffer upload error:`, error);
    return null;
  }
}

/**
 * Get the public URL for a file in Supabase Storage.
 */
export function getFileUrl(
  bucketName: string,
  filePath: string
): string {
  const supabase = createAdminClient();
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
}
