import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MarkdownContent } from "@/components/features/news/markdown-content";
import { NewsComments } from "@/components/features/news/news-comments";
import { CopyLinkButton } from "@/components/features/news/copy-link-button";

interface CommentItem {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

async function getNews(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*, author_id!inner(full_name)")
    .eq("slug", slug)
    .single();

  return data;
}

async function getComments(newsId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_comments")
    .select("*")
    .eq("news_id", newsId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function NewsDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const news = await getNews(slug);

  if (!news) notFound();

  const comments = await getComments(news.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">{news.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-pri-silver">
          <span>Oleh {news.author_id?.full_name ?? "Admin"}</span>
          <span>{new Date(news.published_at ?? news.created_at).toLocaleDateString("id-ID")}</span>
          <CopyLinkButton slug={slug} />
        </div>
      </div>

      {news.image_url && (
        <div className="rounded-lg overflow-hidden">
          <img src={news.image_url} alt={news.title} className="w-full h-64 object-cover" />
        </div>
      )}

      <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-6">
        <MarkdownContent content={news.content ?? ""} />
      </div>

      <NewsComments newsId={news.id} initialComments={comments as CommentItem[]} />
    </div>
  );
}
