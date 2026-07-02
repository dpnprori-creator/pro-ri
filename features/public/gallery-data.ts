export interface HeroGalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  link_label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

import { createClient as createServerClient } from "@/lib/supabase/server";

export async function getActiveGalleryItems() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("hero_gallery")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getHeroGallery() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("hero_gallery")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getActivityGallery(category?: string) {
  const supabase = await createServerClient();

  let query = supabase
    .from("activity_gallery")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getMemberDesignations(memberId: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("member_designations")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });

  return data ?? [];
}
