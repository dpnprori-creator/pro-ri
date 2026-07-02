"use server";

import { createAdminClient } from "@/lib/supabase/admin";

// Upload to Supabase Storage bucket
export async function uploadToSupabaseStorage(
  bucketName: string,
  filePath: string,
  file: File
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// Delete from Supabase Storage
export async function deleteFromStorage(bucketName: string, filePath: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.storage.from(bucketName).remove([filePath]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

// Upload a photo to the photos bucket
export async function uploadPhoto(
  memberId: string,
  file: File,
  type: "photo" | "signature"
) {
  const ext = file.name.split(".").pop() || "jpg";
  const filePath = `${memberId}/${type}_${Date.now()}.${ext}`;

  return uploadToSupabaseStorage("photos", filePath, file);
}
