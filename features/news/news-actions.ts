"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getNews() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("news")
    .select("*, author_id!inner(full_name)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return data ?? [];
}

export async function getNewsBySlug(slug: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("news")
    .select("*, author_id!inner(full_name)")
    .eq("slug", slug)
    .single();

  return data;
}

export async function getNewsComments(newsId: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("news_comments")
    .select("*")
    .eq("news_id", newsId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function submitComment(formData: FormData) {
  const supabase = await createServerClient();

  const newsId = formData.get("newsId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const content = formData.get("content") as string;

  if (!newsId || !name || !content) {
    return { error: "Lengkapi data komentar" };
  }

  const { error } = await supabase.from("news_comments").insert({
    news_id: newsId,
    name,
    email: email || null,
    content,
    is_approved: true,
  });

  if (error) return { error: "Gagal menambahkan komentar" };

  return { success: true };
}

export async function incrementNewsView(slug: string) {
  const supabase = await createServerClient();
  await (supabase.rpc as any)("increment_view_count", { slug_param: slug });
}

export async function createNews(formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  const { error } = await supabase.from("news").insert({
    title: formData.get("title") as string,
    slug: (formData.get("title") as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string,
    category: (formData.get("category") as string) || "article",
    status: (formData.get("status") as string) || "draft",
    author_id: member?.id,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  return { success: true };
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("news")
    .update({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      excerpt: formData.get("excerpt") as string,
      category: formData.get("category") as string,
      status: formData.get("status") as string,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  return { success: true };
}

export async function deleteNews(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  return { success: true };
}

export async function toggleFeatured(id: string, isFeatured: boolean) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("news")
    .update({ is_featured: isFeatured })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  return { success: true };
}
