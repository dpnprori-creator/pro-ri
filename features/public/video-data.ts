import { createClient as createServerClient } from "@/lib/supabase/server";

export async function getVideos() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getFeaturedVideo() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .single();

  return data;
}
