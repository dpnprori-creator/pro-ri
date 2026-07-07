import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type QueryOptions = {
  status?: string;
  category?: string;
  limit?: number;
  page?: number;
  search?: string;
};

export async function getPublishedEvents(options: QueryOptions = {}) {
  const supabase = await createServerClient();

  let query = supabase
    .from("events")
    .select("id, title, slug, description, category, type, start_date, end_date, location, banner_url, province_id(name), max_participants", { count: "exact" })
    .eq("status", "published")
    .order("start_date", { ascending: false });

  if (options.category) {
    query = query.eq("category", options.category);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, count } = await query;
  return { data: data ?? [], count: count ?? 0 };
}

export async function getPublishedInnovations(options: QueryOptions = {}) {
  const supabase = await createServerClient();

  let query = supabase
    .from("innovations")
    .select("id, title, slug, description, category, image_url, creator_id, province_id, year, status")
    .in("status", ["published", "featured"])
    .order("created_at", { ascending: false });

  if (options.category) {
    query = query.eq("category", options.category);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getPublishedNews(options: QueryOptions = {}) {
  const supabase = await createServerClient();

  let query = supabase
    .from("news")
    .select("id, title, slug, excerpt, image_url, category, published_at, author_id!inner(full_name)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (options.category) {
    query = query.eq("category", options.category);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getFeaturedNews() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("news")
    .select("id, title, slug, excerpt, image_url, published_at")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(3);

  return data ?? [];
}

export async function getPublicStats() {
  const supabase = await createServerClient();

  const [
    { count: totalMembers },
    { count: totalTrainers },
    { count: totalMentors },
    { count: totalEvents },
    { count: totalInnovations },
  ] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("members").select("*", { count: "exact", head: true }).eq("role_id", "trainer"),
    supabase.from("members").select("*", { count: "exact", head: true }).eq("role_id", "mentor"),
    supabase.from("events").select("*", { count: "exact", head: true }).gte("end_date", new Date().toISOString()),
    supabase.from("innovations").select("*", { count: "exact", head: true }).neq("status", "archived"),
  ]);

  const { count: totalProvinces } = await supabase
    .from("provinces")
    .select("*", { count: "exact", head: true });

  const { count: totalRegencies } = await supabase
    .from("regencies")
    .select("*", { count: "exact", head: true });

  return {
    totalMembers: totalMembers ?? 0,
    totalTrainers: totalTrainers ?? 0,
    totalMentors: totalMentors ?? 0,
    totalEvents: totalEvents ?? 0,
    totalInnovations: totalInnovations ?? 0,
    totalProvinces: totalProvinces ?? 0,
    totalRegencies: totalRegencies ?? 0,
  };
}

export async function getPublicEvents(limit?: number) {
  const supabase = await createServerClient();
  let query = supabase
    .from("events")
    .select("id, title, slug, description, category, type, start_date, end_date, location, banner_url, max_participants, province_id!inner(name)")
    .eq("status", "published")
    .order("start_date", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getPublicInnovations(limit?: number) {
  const supabase = await createServerClient();
  let query = supabase
    .from("innovations")
    .select("id, title, slug, description, category, image_url, year, status, province_id(name), creator_id(full_name)")
    .in("status", ["published", "featured"])
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getPublicInnovation(slug: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("innovations")
    .select("*, province_id(name), creator_id(full_name)")
    .in("status", ["published", "featured"])
    .eq("slug", slug)
    .single();

  return data;
}

export async function getPublicNews(limit?: number) {
  const supabase = await createServerClient();
  let query = supabase
    .from("news")
    .select("id, title, slug, excerpt, image_url, category, published_at, author_id!inner(full_name)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getPublicFeaturedNews(limit?: number) {
  const supabase = await createServerClient();
  let query = supabase
    .from("news")
    .select("id, title, slug, excerpt, image_url, category, published_at")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getRelatedNews(category: string, excludeId: string, limit: number = 4) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("news")
    .select("id, title, slug, excerpt, image_url, category, published_at")
    .eq("status", "published")
    .eq("category", category)
    .neq("id", excludeId)
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getPopularNews(limit: number = 5) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("news")
    .select("id, title, slug, excerpt, image_url, category, view_count, published_at")
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function incrementNewsView(slug: string) {
  const supabase = await createServerClient();
  await (supabase.rpc as any)("increment_news_view", { news_slug: slug });
}

export async function getPublicNewsPaginated({ page = 1, pageSize = 12, category }: { page?: number; pageSize?: number; category?: string }) {
  const supabase = await createServerClient();

  let query = supabase
    .from("news")
    .select("id, title, slug, excerpt, image_url, category, published_at, author_id!inner(full_name)", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count } = await query;
  const total = count ?? 0;

  return {
    items: data ?? [],
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPublicNewsCategories() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("news")
    .select("category")
    .eq("status", "published");

  const categories = [...new Set((data ?? []).map((item: { category: string }) => item.category))];
  return categories;
}

export async function getProvinces() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("provinces")
    .select("*")
    .order("name", { ascending: true });

  return data ?? [];
}

export async function getRegencies(provinceId: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("regencies")
    .select("*")
    .eq("province_id", provinceId)
    .order("name", { ascending: true });

  return data ?? [];
}

export async function getDistricts(regencyId: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("districts")
    .select("*")
    .eq("regency_id", regencyId)
    .order("name", { ascending: true });

  return data ?? [];
}

export async function getVillages(districtId: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("villages")
    .select("*")
    .eq("district_id", districtId)
    .order("name", { ascending: true });

  return data ?? [];
}
