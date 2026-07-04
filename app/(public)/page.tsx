import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pusat Robotika Rakyat Indonesia — Gerakan Robotika Nasional",
  description:
    "PRO RI — Pusat Robotika Rakyat Indonesia: gerakan nasional robotika untuk kedaulatan teknologi Indonesia. Daftar anggota, ikuti program unggulan, jaringan 38 provinsi.",
  openGraph: {
    title: "Pusat Robotika Rakyat Indonesia — PRO RI",
    description:
      "Gerakan nasional robotika untuk kedaulatan teknologi Indonesia. Daftar anggota, ikuti program unggulan, jaringan 38 provinsi.",
  },
};
import { ArrowRight, BookOpen, Users, Lightbulb, Award, MapIcon, Calendar, Target, Play, Film, ExternalLink, Cpu, GraduationCap, Bot, Trophy, Rocket, Store, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedStats, AnimatedSection, AnimatedCard, AnimatedTitle } from "@/components/features/home/animated-stats";
import { getPublicStats, getPublicEvents, getPublicInnovations, getPublicNews, getPublicFeaturedNews } from "@/features/public/data";
import { getActiveGalleryItems } from "@/features/public/gallery-data";
import { HeroGallery } from "@/components/features/home/hero-gallery";
import { RobotVideoGrid } from "@/components/features/video/video-grid";  // ISR — revalidate homepage every 60 seconds
export const revalidate = 60;

// Helper to get page content from system_settings
async function getPageContent() {
  try {
    const supabase = await createClient();
    const { data } = await (supabase as any)
      .from("system_settings")
      .select("value")
      .eq("key", "page_content")
      .single();
    if (data) return data.value as Record<string, string>;
  } catch {}
  return null;
}

const categoryLabel: Record<string, string> = {
  webinar: "Webinar", workshop: "Workshop", competition: "Kompetisi", exhibition: "Pameran",
  article: "Artikel", announcement: "Pengumuman", press_release: "Press Release",
  robotics: "Robotika", ai: "AI", iot: "IoT", programming: "Programming", research: "Research",
};

const programs = [
  { title: "Sekolah Robotika Rakyat", desc: "Program pendidikan robotika berbasis komunitas di seluruh Indonesia", icon: GraduationCap, target: "Masyarakat umum" },
  { title: "Robotika Masuk Sekolah", desc: "Integrasi kurikulum robotika ke sekolah formal dari SD hingga SMA", icon: BookOpen, target: "Pelajar SD-SMA" },
  { title: "Akademi AI", desc: "Pelatihan intensif AI: machine learning, computer vision, hingga robotics integration", icon: Bot, target: "Mahasiswa & Profesional" },
  { title: "Kompetisi Robotika Nasional", desc: "Ajang kompetisi robotika tahunan tingkat nasional berbagai kategori", icon: Trophy, target: "Pelajar & Mahasiswa" },
  { title: "Inkubator Inovasi Teknologi", desc: "Inkubasi startup teknologi robotika dengan mentoring dan pendanaan awal", icon: Rocket, target: "Wirausahawan muda" },
  { title: "Robotika untuk UMKM", desc: "Penerapan robotika dan otomatisasi untuk produktivitas UMKM", icon: Store, target: "Pelaku UMKM" },
];

const DEFAULT_CONTENT = {
  hero_title_line1: "Gerakan Robotika untuk",
  hero_title_highlight: "Kedaulatan Teknologi",
  hero_title_line2: "Indonesia",
  hero_description: "PRO RI — Pusat Robotika Rakyat Indonesia — hadir untuk membangun generasi muda yang unggul dalam penguasaan robotika dan kecerdasan buatan, demi mewujudkan Indonesia Emas 2045.",
  about_title: "Sekilas PRO RI",
  about_description: "PRO RI (Pusat Robotika Rakyat Indonesia) adalah organisasi di bawah naungan PRI yang bergerak di bidang pengembangan sumber daya manusia Indonesia dalam bidang robotika, kecerdasan buatan, dan teknologi tepat guna. Didirikan pada 6 Juni 2026, PRO RI berkomitmen untuk mempercepat penguasaan teknologi dari tingkat akar rumput hingga nasional.",
  cta_title: "Indonesia Emas 2045 Dimulai dari Sekarang",
  cta_description: "Jadilah bagian dari gerakan robotika nasional. Bersama PRO RI, kita wujudkan kedaulatan teknologi Indonesia.",
};

export default async function HomePage() {
  const [stats, events, innovations, newsItems, galleryItems, featuredNews, pageContent] = await Promise.all([
    getPublicStats(),
    getPublicEvents(4),
    getPublicInnovations(3),
    getPublicNews(3),
    getActiveGalleryItems(),
    getPublicFeaturedNews(5),
    getPageContent(),
  ]);

  const content = { ...DEFAULT_CONTENT, ...pageContent };

  const statItems = [
    { label: "Anggota", value: stats.totalMembers, icon: "Users" as const },
    { label: "Trainers", value: stats.totalTrainers, icon: "Award" as const },
    { label: "Provinsi", value: stats.totalProvinces, icon: "MapIcon" as const },
    { label: "Kab/Kota", value: stats.totalRegencies, icon: "MapIcon" as const },
    { label: "Events", value: stats.totalEvents, icon: "Calendar" as const },
    { label: "Inovasi", value: stats.totalInnovations, icon: "Lightbulb" as const },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section — Dynamic Gallery Slider (with static fallback) */}
      {galleryItems.length > 0 ? (
        <HeroGallery items={galleryItems} />
      ) : (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-pri-carbon">
          {/* 100% Opaque Background */}
          <div className="absolute inset-0 bg-pri-carbon">
            <div className="absolute inset-0 grid-pattern opacity-[0.04]" />
            <div className="absolute inset-0 circuit-pattern opacity-[0.06]" />
            <Image
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&q=80"
              alt="Robotika dan AI"
              fill
              className="object-cover opacity-[0.06]"
              priority
            />
          </div>

          {/* Decorative Robot Elements */}
          <div className="hero-hexagon" style={{ top: "15%", left: "8%" }} />
          <div className="hero-hexagon" style={{ top: "60%", right: "12%" }} />
          <div className="hero-hexagon" style={{ top: "75%", left: "50%", width: "50px", height: "87px" }} />
          <div className="hero-circuit-line" style={{ top: "25%", left: "5%", width: "200px" }} />
          <div className="hero-circuit-line" style={{ top: "35%", right: "10%", width: "150px", transform: "rotate(45deg)" }} />
          <div className="hero-circuit-line" style={{ bottom: "30%", left: "15%", width: "180px", transform: "rotate(-30deg)" }} />
          <div className="hero-gear hero-gear-1" style={{ top: "10%", right: "8%" }} />
          <div className="hero-gear hero-gear-2" style={{ bottom: "15%", left: "10%" }} />
          <div className="hero-corner-tl" />
          <div className="hero-corner-tr" />
          <div className="hero-corner-bl" />
          <div className="hero-corner-br" />
          <div className="hero-scan-line" />
          <div className="relative z-20 container-wide px-4 pt-24 md:pt-20 text-center">

            {/* Square Logo — Large */}
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="relative h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-xl overflow-hidden ring-2 ring-pri-red/20 shadow-lg shadow-pri-red/10">
                <Image
                  src="/images/logo-putih.jpeg"
                  alt="PRO RI"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4 md:mb-6 border border-pri-red/10">
              <span className="h-2 w-2 rounded-full bg-pri-red animate-pulse" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Pusat Robotika Rakyat Indonesia
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 md:mb-6 max-w-5xl mx-auto">
              {content.hero_title_line1}{" "}
              <span className="text-gradient">{content.hero_title_highlight}</span>
              <br />
              {content.hero_title_line2}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-pri-silver max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed">
              {content.hero_description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-pri-red hover:bg-red-700 text-white px-8 text-base glow-red">
                  Daftar Anggota Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/programs">
                <Button size="lg" variant="outline" className="px-8 text-base border-white/10">
                  Pelajari Program Kami
                </Button>
              </Link>
            </div>
          </div>

          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-30">
            <div className="h-8 w-5 md:h-10 md:w-6 rounded-full border border-white/15 flex items-start justify-center pt-2">
              <div className="h-2 w-1 rounded-full bg-pri-red" />
            </div>
          </div>
        </section>
      )}

      {/* Featured News — Hero Highlight */}
      {featuredNews.length > 0 && (
        <section className="py-6 bg-pri-dark/60 relative border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 circuit-pattern opacity-[0.03]" />
          <div className="container-wide relative z-10 px-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-pri-red animate-pulse" />
              <span className="text-[10px] font-mono text-pri-red uppercase tracking-wider">
                Featured News
              </span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
              {featuredNews.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="flex-shrink-0 w-72 snap-start group"
                >
                  <div className="glass rounded-lg p-4 border border-white/5 hover:border-pri-red/30 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono text-pri-red uppercase tracking-wider">
                        {categoryLabel[item.category] || item.category}
                      </span>
                      <span className="text-[10px] text-pri-silver/50">
                        {item.published_at
                          ? new Date(item.published_at).toLocaleDateString("id-ID")
                          : ""}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white line-clamp-2 group-hover:text-pri-red transition-colors">
                      {item.title}
                    </p>
                    {item.excerpt && (
                      <p className="text-xs text-pri-silver mt-1 line-clamp-1">{item.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Bar — 3 key stats */}
      <section className="py-12 bg-pri-dark/80 relative border-y border-white/5">
        <div className="container-wide px-4">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white font-mono mb-1">38</div>
              <div className="text-sm text-pri-silver">Provinsi Tersebar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white font-mono mb-1">6</div>
              <div className="text-sm text-pri-silver">Program Strategis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white font-mono mb-1">2026</div>
              <div className="text-sm text-pri-silver">Tahun Berdiri</div>
            </div>
          </div>
        </div>
      </section>

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* Sekilas PRO RI */}
      <AnimatedSection>
        <section className="section-padding bg-pri-carbon relative overflow-hidden">
          <div className="absolute inset-0 circuit-pattern opacity-10" />
          {/* Floating particles */}
          <div className="tech-particles">
            {Array.from({ length: 8 }, (_, i) => (
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
          <div className="container-wide relative z-10 px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4 relative">
                <Cpu className="h-4 w-4 text-pri-red" />
                <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Tentang PRO RI</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {content.about_title} <span className="text-gradient">PRO RI</span>
              </h2>
              <p className="text-base md:text-lg text-pri-silver leading-relaxed mb-6">
                {content.about_description}
              </p>
              <Link href="/about">
                <Button variant="outline" className="border-white/10 text-pri-silver hover:text-white">
                  Pelajari Selengkapnya <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* National Impact Stats */}
      <section className="section-padding bg-pri-carbon relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-20" />
        {/* Floating particles */}
        <div className="tech-particles">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="tech-particle"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: '100%',
                animationDelay: `${Math.random() * 12}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
        <div className="container-wide relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Dampak Nasional <span className="text-gradient">PRO RI</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Ekosistem teknologi yang tersebar di seluruh Indonesia
            </p>
          </AnimatedSection>

          <AnimatedStats stats={statItems} />
        </div>
      </section>

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* Program Unggulan */}
      <section className="section-padding bg-pri-dark/50 relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-10" />
        <div className="orbit-ring" style={{ top: '-30px', right: '-30px', width: '200px', height: '200px', opacity: 0.08 }} />
        <div className="orbit-ring orbit-ring-2" style={{ bottom: '-50px', left: '-50px', width: '150px', height: '150px', opacity: 0.06 }} />
        <div className="container-wide relative z-10 px-4">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4 relative">
              <Rocket className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Program Unggulan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Program Unggulan <span className="text-gradient">PRO RI</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Program strategis membangun SDM Indonesia unggul di bidang robotika dan AI
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {programs.map((p, i) => (
              <AnimatedCard key={p.title} delay={i * 0.08}>
                <Card className="glass-card-hover p-6 h-full">
                  <CardContent className="p-0">
                    <div className="h-12 w-12 rounded-lg bg-pri-red/10 flex items-center justify-center mb-4">
                      <p.icon className="h-6 w-6 text-pri-red" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
                    <p className="text-sm text-pri-silver leading-relaxed mb-3">{p.desc}</p>
                    <span className="text-[10px] font-mono text-pri-red uppercase tracking-wider">
                      Target: {p.target}
                    </span>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>

          <AnimatedSection className="text-center mt-10">
            <Link href="/programs">
              <Button variant="outline" className="border-white/10 text-pri-silver hover:text-white">
                Lihat Detail Program <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* Video Showcase — Robotika dalam Aksi */}
      <section className="section-padding bg-pri-dark relative overflow-hidden circuit-border">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80"
            alt="Teknologi Robotika"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pri-dark/95 via-pri-dark/80 to-pri-dark/95" />
        </div>

        <div className="container-wide relative z-10">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Play className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Video Galeri
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Robotika & <span className="text-gradient">AI</span> dalam Aksi
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Saksikan bagaimana teknologi robotika dan AI mengubah masa depan Indonesia
            </p>
          </AnimatedSection>

          <RobotVideoGrid />

          <AnimatedSection className="text-center mt-10">
            <Link href="/gallery">
              <Button variant="outline" className="border-white/10 text-pri-silver hover:text-white">
                <ExternalLink className="h-4 w-4 mr-2 text-pri-red" />
                Lihat Galeri Kegiatan
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* Latest Events */}
      {events.length > 0 && (
        <section className="section-padding bg-pri-carbon relative overflow-hidden">
          <div className="tech-particles">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="tech-particle"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: '100%',
                  animationDelay: `${Math.random() * 18}s`,
                  animationDuration: `${18 + Math.random() * 12}s`,
                }}
              />
            ))}
          </div>
          <div className="container-wide">
            <div className="flex items-center justify-between mb-12">
              <AnimatedTitle>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Kegiatan <span className="text-gradient">Terbaru</span>
                </h2>
                <p className="text-pri-silver mt-1">Event dan kegiatan PRO RI terbaru</p>
              </AnimatedTitle>
              <Link href="/events" className="text-sm text-pri-red hover:underline hidden sm:block">
                Lihat Semua →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {events.map((event: any, i: number) => (
                <AnimatedCard key={event.id} delay={i * 0.08}>
                  <Link href={`/events/${event.slug}`}>
                    <Card className="glass-card-hover p-5 h-full">
                      <CardContent className="p-0">
                        <span className="text-[10px] font-mono text-pri-red uppercase tracking-wider">
                          {categoryLabel[event.category] || event.category}
                        </span>
                        <h3 className="text-sm font-semibold text-white mt-1 mb-3 line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-xs text-pri-silver">
                          {new Date(event.start_date).toLocaleDateString("id-ID", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* Latest Innovations */}
      {innovations.length > 0 && (
        <section className="section-padding bg-pri-dark/50 relative overflow-hidden">
          <div className="orbit-ring" style={{ top: '10%', right: '5%', width: '100px', height: '100px', opacity: 0.06 }} />
          <div className="container-wide">
            <div className="flex items-center justify-between mb-12">
              <AnimatedTitle>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Inovasi <span className="text-gradient">Terkini</span>
                </h2>
                <p className="text-pri-silver mt-1">Karya inovasi teknologi dari talenta Indonesia</p>
              </AnimatedTitle>
              <Link href="/innovations" className="text-sm text-pri-red hover:underline hidden sm:block">
                Lihat Semua →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {innovations.map((item: any, i: number) => (
                <AnimatedCard key={item.id} delay={i * 0.1}>
                  <Link href={`/innovations/${item.slug}`}>
                    <Card className="glass-card-hover p-5 h-full">
                      <CardContent className="p-0">
                        <span className="text-[10px] font-mono text-pri-red uppercase tracking-wider">
                          {categoryLabel[item.category] || item.category}
                        </span>
                        <h3 className="text-sm font-semibold text-white mt-1 mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        {item.year && (
                          <p className="text-xs text-pri-silver">{item.year}</p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* Latest News */}
      {newsItems.length > 0 && (
        <section className="section-padding bg-pri-carbon relative overflow-hidden">
          <div className="orbit-ring orbit-ring-2" style={{ bottom: '5%', left: '3%', width: '120px', height: '120px', opacity: 0.05 }} />
          <div className="container-wide">
            <div className="flex items-center justify-between mb-12">
              <AnimatedTitle>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Informasi <span className="text-gradient">Terkini</span>
                </h2>
                <p className="text-pri-silver mt-1">Berita terbaru tentang PRO RI</p>
              </AnimatedTitle>
              <Link href="/news" className="text-sm text-pri-red hover:underline hidden sm:block">
                Lihat Semua →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {newsItems.map((item: any, i: number) => (
                <AnimatedCard key={item.id} delay={i * 0.1}>
                  <Link href={`/news/${item.slug}`}>
                    <Card className="glass-card-hover p-0 overflow-hidden h-full group">
                      {item.image_url ? (
                        <div className="relative h-40 overflow-hidden">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon/60 to-transparent" />
                        </div>
                      ) : (
                        <div className="h-24 bg-gradient-to-br from-pri-red/10 to-pri-dark flex items-center justify-center">
                          <span className="text-[10px] font-mono text-pri-red/40 uppercase tracking-wider">
                            {categoryLabel[item.category] || item.category}
                          </span>
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-mono text-pri-red uppercase tracking-wider">
                            {categoryLabel[item.category] || item.category}
                          </span>
                          <span className="text-[10px] text-pri-silver">
                            {item.published_at
                              ? new Date(item.published_at).toLocaleDateString("id-ID")
                              : ""}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-pri-red transition-colors">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-xs text-pri-silver mt-1 line-clamp-2">{item.excerpt}</p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Glow divider */}
      <div className="glow-divider" />

      {/* CTA Section */}
      <AnimatedSection>
      <section className="relative py-24 circuit-pattern circuit-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pri-red/5 to-transparent" />
        <div className="orbit-ring" style={{ top: '-40px', left: '10%', width: '180px', height: '180px', opacity: 0.08 }} />
        <div className="orbit-ring orbit-ring-2" style={{ bottom: '-30px', right: '15%', width: '120px', height: '120px', opacity: 0.06 }} />
        <div className="container-wide relative z-10 text-center px-4">
          <Target className="h-12 w-12 text-pri-red mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {content.cta_title}
          </h2>
          <p className="text-pri-silver max-w-lg mx-auto mb-8">
            {content.cta_description}
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-pri-red hover:bg-red-700 text-white px-8 text-base glow-red">
              Daftar Anggota Sekarang <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
      </AnimatedSection>
    </div>
  );
}
