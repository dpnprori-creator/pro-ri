"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";

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

  const { error } = await supabase.from("videos").insert({
    title: formData.get("title") as string,
    description: formData.get("description") as string || null,
    video_url: formData.get("video_url") as string,
    poster_url: formData.get("poster_url") as string || null,
    is_active: formData.get("is_active") === "true",
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/videos");
  return { success: true };
}

export async function updateVideo(id: string, formData: FormData) {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("videos")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string || null,
      video_url: formData.get("video_url") as string,
      poster_url: formData.get("poster_url") as string || null,
      is_active: formData.get("is_active") === "true",
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
