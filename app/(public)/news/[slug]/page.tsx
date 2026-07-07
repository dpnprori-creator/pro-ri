import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { MarkdownContent } from "@/components/features/news/markdown-content";
import { NewsComments } from "@/components/features/news/news-comments";
import { CopyLinkButton } from "@/components/features/news/copy-link-button";
import { getRelatedNews, getPopularNews } from "@/features/public/data";
import {
  Calendar,
  User,
  ArrowLeft,
  TrendingUp,
  Eye,
  Target,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface CommentItem {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

const categoryLabel: Record<string, string> = {
  article: "Artikel",
  announcement: "Pengumuman",
  press_release: "Press Release",
};

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

  const [comments, relatedNews, popularNews] = await Promise.all([
    getComments(news.id),
    getRelatedNews(news.category || "article", news.id),
    getPopularNews(5),
  ]);

  const shareUrl = `https://prori.id/news/${slug}`;
  const shareText = encodeURIComponent(news.title);

  return (
    <section className="pt-28 pb-16 circuit-pattern min-h-screen">
      <div className="container-wide px-4">
        {/* Back Link */}
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm text-pri-silver hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Berita
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default" className="bg-pri-red/20 text-pri-red border-pri-red/30">
                  {categoryLabel[news.category] || news.category}
                </Badge>
                {news.status === "published" && (
                  <span className="text-xs text-pri-silver/50 flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {news.view_count || 0} dilihat
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{news.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-pri-silver">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {news.author_id?.full_name ?? "Admin"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(news.published_at ?? news.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                {/* Share Buttons */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <CopyLinkButton slug={slug} />
                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-pri-silver hover:bg-blue-500/20 hover:text-blue-400 transition-all"
                    title="Bagikan ke Twitter"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-pri-silver hover:bg-blue-500/20 hover:text-blue-400 transition-all"
                    title="Bagikan ke Facebook"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-pri-silver hover:bg-blue-500/20 hover:text-blue-400 transition-all"
                    title="Bagikan ke LinkedIn"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {news.image_url && (
              <div className="rounded-xl overflow-hidden border border-white/10">
                <img src={news.image_url} alt={news.title} className="w-full h-72 md:h-96 object-cover" />
              </div>
            )}

            {/* Content */}
            <div className="bg-pri-navy/50 border border-white/10 rounded-xl p-6 md:p-8">
              <MarkdownContent content={news.content ?? ""} />
            </div>

            {/* Comments */}
            <NewsComments newsId={news.id} initialComments={comments as CommentItem[]} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular News */}
            <Card className="glass-card overflow-hidden border-white/10">
              <div className="px-5 pt-5 pb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-pri-red" />
                  Berita Terpopuler
                </h3>
              </div>
              <CardContent className="px-5 pb-5 space-y-3">
                {popularNews.length === 0 ? (
                  <p className="text-xs text-pri-silver/60 py-4 text-center">
                    Belum ada data
                  </p>
                ) : (
                  popularNews.map((item, i) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.slug}`}
                      className={`flex gap-3 group ${i < popularNews.length - 1 ? "pb-3 border-b border-white/5" : ""}`}
                    >
                      <span className="text-lg font-bold text-pri-red/30 font-mono shrink-0 mt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white line-clamp-2 group-hover:text-pri-red transition-colors leading-snug">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-pri-silver/50">
                            {item.published_at
                              ? new Date(item.published_at).toLocaleDateString("id-ID")
                              : ""}
                          </span>
                          {item.view_count > 0 && (
                            <span className="text-[10px] text-pri-silver/40 flex items-center gap-0.5">
                              <Eye className="h-2.5 w-2.5" />
                              {item.view_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="glass-card overflow-hidden border-white/10">
              <div className="px-5 pt-5 pb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Target className="h-4 w-4 text-pri-red" />
                  Kategori
                </h3>
              </div>
              <CardContent className="px-5 pb-5 space-y-2">
                {Object.entries(categoryLabel).map(([key, label]) => (
                  <Link
                    key={key}
                    href={`/news?category=${key}`}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-sm text-pri-silver group-hover:text-white transition-colors">
                      {label}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-pri-silver/30 group-hover:text-pri-red transition-colors" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related News Section */}
        {relatedNews.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-pri-red" />
                Berita Terkait
              </h2>
              <Link
                href={`/news?category=${news.category}`}
                className="text-sm text-pri-red hover:text-red-400 transition-colors flex items-center gap-1"
              >
                Lihat Semua
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedNews.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <Card className="glass-tech p-0 overflow-hidden h-full group">
                    <div className="relative h-36 overflow-hidden">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-pri-red/10 to-pri-dark flex items-center justify-center">
                          <Calendar className="h-8 w-8 text-pri-red/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {categoryLabel[item.category] || item.category}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-pri-red transition-colors">
                        {item.title}
                      </h4>
                      {item.excerpt && (
                        <p className="text-xs text-pri-silver/70 line-clamp-2 mt-1">
                          {item.excerpt}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
