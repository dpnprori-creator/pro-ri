import { createClient } from "@/lib/supabase/server";
import { NewsManager } from "./news-manager";

async function getNews() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("id, title, category, status, is_featured, published_at, created_at, author_id!inner(full_name)")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminNewsPage() {
  const news = await getNews();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Berita</h1>
        <p className="text-pri-silver mt-1">Total {news.length} berita</p>
      </div>

      <NewsManager news={news as any} />
    </div>
  );
}
