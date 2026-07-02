import Link from "next/link";
import Image from "next/image";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPublicNewsPaginated, getPublicNewsCategories } from "@/features/public/data";

const categoryLabel: Record<string, string> = {
  article: "Artikel", announcement: "Pengumuman", press_release: "Press Release",
};

const PAGE_SIZE = 12;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const activeCategory = params.category || "";

  const [{ items, total, totalPages }, categories] = await Promise.all([
    getPublicNewsPaginated({
      page: currentPage,
      pageSize: PAGE_SIZE,
      category: activeCategory || undefined,
    }),
    getPublicNewsCategories(),
  ]);

  return (
    <section className="pt-32 pb-16 circuit-pattern min-h-screen relative overflow-hidden">
      <div className="hero-scan-line" />
      <div className="tech-particles">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="tech-particle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: '100%',
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 12}s`,
            }}
          />
        ))}
      </div>
      <div className="orbit-ring" style={{ top: '20%', right: '10%', width: '100px', height: '100px', opacity: 0.05 }} />
      <div className="orbit-ring orbit-ring-2" style={{ bottom: '15%', left: '8%', width: '60px', height: '60px', opacity: 0.03 }} />
      <div className="container-wide px-4 relative z-10">
        <div className="text-center circuit-border rounded-xl p-8 mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="status-dot" />
            <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Info Terkini</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Berita & <span className="text-gradient">Media</span>
          </h1>
          <p className="text-lg text-pri-silver">
            Informasi terbaru tentang PRO RI dan ekosistem teknologi nasional
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <Link
              href="/news"
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                !activeCategory
                  ? "bg-pri-red text-white"
                  : "bg-white/5 text-pri-silver hover:bg-white/10"
              }`}
            >
              Semua
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/news?category=${cat}`}
                className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? "bg-pri-red text-white"
                    : "bg-white/5 text-pri-silver hover:bg-white/10"
                }`}
              >
                {categoryLabel[cat] || cat}
              </Link>
            ))}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
            <p className="text-pri-silver">Belum ada berita tersedia</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item: any) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <Card className="glass-tech p-0 overflow-hidden h-full group">
                      <div className="corner-bracket corner-bracket-tl" style={{ top: '2px', left: '2px' }} />
                      <div className="corner-bracket corner-bracket-tr" style={{ top: '2px', right: '2px' }} />
                      <div className="corner-bracket corner-bracket-bl" style={{ bottom: '2px', left: '2px' }} />
                      <div className="corner-bracket corner-bracket-br" style={{ bottom: '2px', right: '2px' }} />
                    <div className="relative h-48 overflow-hidden">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-pri-red/20 to-pri-dark flex items-center justify-center">
                          <Calendar className="h-12 w-12 text-pri-red/40" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-pri-red font-medium">
                          {categoryLabel[item.category] || item.category}
                        </span>
                        <span className="text-xs text-pri-silver">
                          {item.published_at
                            ? new Date(item.published_at).toLocaleDateString("id-ID")
                            : ""}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-sm text-pri-silver line-clamp-2">{item.excerpt}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {currentPage > 1 && (
                  <Link
                    href={`/news?page=${currentPage - 1}${activeCategory ? `&category=${activeCategory}` : ""}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/10 text-pri-silver hover:text-white"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Sebelumnya
                    </Button>
                  </Link>
                )}

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show pages around current page
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Link
                        key={pageNum}
                        href={`/news?page=${pageNum}${activeCategory ? `&category=${activeCategory}` : ""}`}
                        className={`h-9 min-w-[36px] rounded-lg flex items-center justify-center text-sm font-mono transition-all ${
                          pageNum === currentPage
                            ? "bg-pri-red/20 text-pri-red border border-pri-red/30"
                            : "text-pri-silver hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>

                {currentPage < totalPages && (
                  <Link
                    href={`/news?page=${currentPage + 1}${activeCategory ? `&category=${activeCategory}` : ""}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/10 text-pri-silver hover:text-white"
                    >
                      Selanjutnya
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            )}

            <p className="text-center text-xs text-pri-silver/40 mt-4">
              Menampilkan {items.length} dari {total} berita
            </p>
          </>
        )}
      </div>
    </section>
  );
}
