"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { uploadToSupabaseStorage } from "./storage";

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // bare video ID
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Auto-generate poster/thumbnail URL from video URL
 */
function autoGeneratePosterUrl(videoUrl: string): string | null {
  const ytId = extractYouTubeId(videoUrl);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
  }
  return null;
}

export async function getAdminVideos() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("videos")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function createVideo(formData: FormData) {
  const supabase = await createServerClient();

  // Handle file upload untuk video
  let videoUrl = formData.get("video_url") as string || formData.get("videoUrl") as string;
  const videoFile = formData.get("video") as File | null;

  if (!videoUrl && videoFile && videoFile.size > 0 && videoFile.name) {
    try {
      const ext = videoFile.name.split(".").pop() || "mp4";
      const path = `videos/${Date.now()}.${ext}`;
      videoUrl = await uploadToSupabaseStorage("videos", path, videoFile);
    } catch (err) {
      console.error("Video upload error:", err);
    }
  }

  // Handle poster image upload
  let posterUrl: string | null = formData.get("poster_url") as string || formData.get("posterUrl") as string;
  const posterFile = formData.get("poster") as File | null;

  if (!posterUrl && posterFile && posterFile.size > 0 && posterFile.name) {
    try {
      const ext = posterFile.name.split(".").pop() || "jpg";
      const path = `posters/${Date.now()}.${ext}`;
      posterUrl = await uploadToSupabaseStorage("videos", path, posterFile);
    } catch (err) {
      console.error("Poster upload error:", err);
    }
  }

  // Auto-generate poster from YouTube URL if no poster provided
  if (!posterUrl && videoUrl) {
    posterUrl = autoGeneratePosterUrl(videoUrl);
  }

  if (!videoUrl) return { error: "URL video atau file video wajib diisi" };

  const { error } = await supabase.from("videos").insert({
    title: formData.get("title") as string,
    description: formData.get("description") as string || null,
    video_url: videoUrl,
    poster_url: posterUrl,
    sort_order: parseInt(formData.get("sort_order") as string || formData.get("sortOrder") as string) || 0,
    is_active: formData.get("is_active") === "true" || formData.get("isActive") === "true",
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/videos");
  return { success: true };
}

export async function updateVideo(id: string, formData: FormData) {
  const supabase = await createServerClient();

  // Handle file upload untuk video
  let videoUrl = formData.get("video_url") as string || formData.get("videoUrl") as string;
  const videoFile = formData.get("video") as File | null;

  if (!videoUrl && videoFile && videoFile.size > 0 && videoFile.name) {
    try {
      const ext = videoFile.name.split(".").pop() || "mp4";
      const path = `videos/${Date.now()}.${ext}`;
      videoUrl = await uploadToSupabaseStorage("videos", path, videoFile);
    } catch (err) {
      console.error("Video upload error:", err);
    }
  }

  // Handle poster image upload
  let posterUrl: string | null = formData.get("poster_url") as string || formData.get("posterUrl") as string;
  const posterFile = formData.get("poster") as File | null;

  if (!posterUrl && posterFile && posterFile.size > 0 && posterFile.name) {
    try {
      const ext = posterFile.name.split(".").pop() || "jpg";
      const path = `posters/${Date.now()}.${ext}`;
      posterUrl = await uploadToSupabaseStorage("videos", path, posterFile);
    } catch (err) {
      console.error("Poster upload error:", err);
    }
  }

  // Auto-generate poster from YouTube URL if no poster provided
  if (!posterUrl && videoUrl) {
    posterUrl = autoGeneratePosterUrl(videoUrl);
  }

  const { error } = await supabase
    .from("videos")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string || null,
      video_url: videoUrl,
      poster_url: posterUrl,
      sort_order: parseInt(formData.get("sort_order") as string || formData.get("sortOrder") as string) || 0,
      is_active: formData.get("is_active") === "true" || formData.get("isActive") === "true",
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/videos");
  return { success: true };
}

export async function deleteVideo(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("videos").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/videos");
  return { success: true };
}
