import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Bot,
  Trophy,
  Rocket,
  Store,
  Globe,
  Cpu,
  Users,
  CheckCircle,
  Calendar,
  ArrowRight,
  Target,
  Sparkles,
  Clock,
  ChevronRight,
  Zap,
  Activity,
  BarChart3,
  Layers,
  Timer,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProgramRegistration } from "@/components/features/programs/program-registration";

const iconMap: Record<string, any> = {
  GraduationCap, BookOpen, Bot, Trophy, Rocket, Store, Globe, Cpu,
};

const labelStyles: Record<string, string> = {
  dibuka: "bg-green-500/20 text-green-400 border-green-500/30",
  "akan datang": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ditutup: "bg-red-500/20 text-red-400 border-red-500/30",
  selesai: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const labelLabels: Record<string, string> = {
  dibuka: "Dibuka",
  "akan datang": "Akan Datang",
  ditutup: "Ditutup",
  selesai: "Selesai",
};

const defaultImages = [
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
  "https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?w=1200&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
];

async function getProgram(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!program) return { program: null, userId: null, isRegistered: false };

  let isRegistered = false;
  if (user) {
    const { data: member } = await supabase
      .from("members")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (member) {
      const { data: reg } = await supabase
        .from("program_registrations")
        .select("id")
        .eq("program_id", program.id)
        .eq("member_id", member.id)
        .maybeSingle();

      isRegistered = !!reg;
    }
  }

  // Get related programs
  const { data: relatedPrograms } = await supabase
    .from("programs")
    .select("id, title, slug, icon, short_description, label, image_url")
    .neq("id", program.id)
    .order("sort_order", { ascending: true })
    .limit(3);

  return { program, userId: user?.id ?? null, isRegistered, relatedPrograms: relatedPrograms ?? [] };
}

export default async function ProgramDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const { program, userId, isRegistered, relatedPrograms } = await getProgram(slug);

  if (!program) notFound();

  const IconComponent = iconMap[program.icon] || GraduationCap;
  const programIndex = [program.slug].reduce((acc, s, i) => {
    const idx = ["sekolah-robotika-rakyat", "robotika-masuk-sekolah", "akademi-ai", "kompetisi-robotika-nasional", "inkubator-inovasi-teknologi", "robotika-untuk-umkm"].indexOf(s);
    return idx >= 0 ? idx : i;
  }, 0);
  const heroImage = program.image_url || defaultImages[programIndex % defaultImages.length];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden min-h-[50vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={program.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon via-pri-carbon/85 to-pri-carbon/70" />
          <div className="absolute inset-0 circuit-pattern opacity-[0.08]" />
          <div className="absolute inset-0 bg-gradient-to-r from-pri-red/10 to-transparent" />
        </div>
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
        <div className="orbit-ring" style={{ top: '20%', right: '5%', width: '100px', height: '100px', opacity: 0.06 }} />
        <div className="orbit-ring orbit-ring-2" style={{ bottom: '25%', left: '8%', width: '70px', height: '70px', opacity: 0.04 }} />

        <div className="container-wide px-4 relative z-10">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-pri-silver/60 mb-4 font-mono">
              <Link href="/" className="hover:text-pri-red transition-colors">Beranda</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/programs" className="hover:text-pri-red transition-colors">Program</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-pri-silver">{program.title}</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-xl bg-pri-red/90 flex items-center justify-center shadow-lg shadow-pri-red/20">
                <IconComponent className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`${labelStyles[program.label] || labelStyles.dibuka} border text-xs px-3 py-1`}>
                  {labelLabels[program.label] || program.label}
                </Badge>
                {program.start_date && (
                  <span className="flex items-center gap-1 text-xs text-pri-silver/70 font-mono">
                    <Calendar className="h-3 w-3" />
                    {new Date(program.start_date).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {program.title}
            </h1>

            {program.short_description && (
              <p className="text-base md:text-lg text-pri-silver max-w-2xl leading-relaxed mb-6">
                {program.short_description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {program.target_audience && (
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                  <Users className="h-4 w-4 text-pri-red" />
                  <span className="text-xs text-pri-silver">
                    Target: <span className="text-white font-medium">{program.target_audience}</span>
                  </span>
                </div>
              )}
              {program.max_participants && (
                <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                  <Target className="h-4 w-4 text-pri-red" />
                  <span className="text-xs text-pri-silver">
                    Kuota: <span className="text-white font-medium">{program.max_participants}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section with enhanced robotik theme */}
      <section className="section-padding bg-pri-carbon/50 relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="absolute inset-0 grid-pattern opacity-[0.02]" />
        <div className="hero-scan-line" style={{ animationDuration: '6s' }} />
        <div className="tech-particles">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="tech-particle"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: '100%',
                animationDelay: `${Math.random() * 18}s`,
                animationDuration: `${16 + Math.random() * 14}s`,
              }}
            />
          ))}
        </div>
        <div className="orbit-ring" style={{ top: '15%', right: '5%', width: '80px', height: '80px', opacity: 0.04 }} />
        <div className="orbit-ring orbit-ring-2" style={{ bottom: '20%', left: '8%', width: '60px', height: '60px', opacity: 0.03 }} />
        <div className="container-wide px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description with robotik terminal-style header */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1 rounded-full bg-pri-red" />
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-pri-red" />
                    <span className="text-xs font-mono text-pri-red uppercase tracking-wider">
                      // SYSTEM_INIT
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-pri-red/30 to-transparent" />
                </div>
                <h2 className="text-xl font-bold text-white mb-4 ml-0">
                  Tentang Program
                </h2>
                <div className="glass rounded-xl p-6 border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-pri-red/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="corner-bracket corner-bracket-tl" />
                  <div className="corner-bracket corner-bracket-tr" />
                  <div className="corner-bracket corner-bracket-bl" />
                  <div className="corner-bracket corner-bracket-br" />
                  <p className="text-sm text-pri-silver leading-relaxed whitespace-pre-line relative z-10">
                    {program.description || program.short_description || "Belum ada deskripsi lengkap untuk program ini."}
                  </p>
                </div>
              </div>

              {/* Features with enhanced robotik styling */}
              {program.features && program.features.length > 0 && (
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-1 rounded-full bg-pri-red" />
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-pri-red" />
                      <span className="text-xs font-mono text-pri-red uppercase tracking-wider">
                        // FEATURES_MODULE
                      </span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-pri-red/30 to-transparent" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-4 ml-0">
                    Apa yang Anda Dapatkan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {program.features.map((feature: string, i: number) => (
                      <div
                        key={i}
                        className="glass rounded-xl p-4 flex items-start gap-3 border border-white/5 hover:border-pri-red/20 hover:bg-pri-red/[0.02] transition-all duration-300 group relative overflow-hidden"
                      >
                        {/* Animated accent line */}
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-pri-red/0 group-hover:bg-pri-red/40 transition-all duration-300" />
                        {/* Status indicator */}
                        <div className="relative">
                          <div className="h-8 w-8 rounded-lg bg-pri-red/10 flex items-center justify-center shrink-0 group-hover:bg-pri-red/20 transition-colors">
                            <CheckCircle className="h-4 w-4 text-pri-red" />
                          </div>
                          <div className="data-pulse-ring" style={{ width: '32px', height: '32px', inset: '-4px' }} />
                        </div>
                        <p className="text-sm text-pri-silver group-hover:text-white transition-colors">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Program Specs / Additional Info with terminal style */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1 rounded-full bg-pri-red" />
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-pri-red" />
                    <span className="text-xs font-mono text-pri-red uppercase tracking-wider">
                      // PROGRAM_SPECS
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-pri-red/30 to-transparent" />
                </div>
                <h2 className="text-xl font-bold text-white mb-4 ml-0">
                  Spesifikasi Program
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {program.start_date && (
                    <div className="glass rounded-xl p-5 border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 h-12 w-12 rounded-bl-full bg-pri-red/[0.03] group-hover:bg-pri-red/[0.06] transition-colors" />
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-pri-red/10 flex items-center justify-center shrink-0">
                          <Calendar className="h-4 w-4 text-pri-red" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-pri-silver/50 uppercase tracking-wider">
                            Tanggal Mulai
                          </span>
                          <p className="text-sm text-white font-semibold mt-0.5">
                            {new Date(program.start_date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {program.target_audience && (
                    <div className="glass rounded-xl p-5 border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 h-12 w-12 rounded-bl-full bg-pri-red/[0.03] group-hover:bg-pri-red/[0.06] transition-colors" />
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-pri-red/10 flex items-center justify-center shrink-0">
                          <Users className="h-4 w-4 text-pri-red" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-pri-silver/50 uppercase tracking-wider">
                            Target Peserta
                          </span>
                          <p className="text-sm text-white font-semibold mt-0.5">{program.target_audience}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {program.max_participants && (
                    <div className="glass rounded-xl p-5 border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 h-12 w-12 rounded-bl-full bg-pri-red/[0.03] group-hover:bg-pri-red/[0.06] transition-colors" />
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-pri-red/10 flex items-center justify-center shrink-0">
                          <BarChart3 className="h-4 w-4 text-pri-red" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-pri-silver/50 uppercase tracking-wider">
                            Kuota Peserta
                          </span>
                          <p className="text-sm text-white font-semibold mt-0.5 font-mono">{program.max_participants}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="glass rounded-xl p-5 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-12 w-12 rounded-bl-full bg-pri-red/[0.03] group-hover:bg-pri-red/[0.06] transition-colors" />
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-lg bg-pri-red/10 flex items-center justify-center shrink-0">
                        <Shield className="h-4 w-4 text-pri-red" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-pri-silver/50 uppercase tracking-wider">
                          Status Pendaftaran
                        </span>
                        <p className="text-sm text-white font-semibold mt-0.5">
                          {program.label === "dibuka" || !program.label ? "Terbuka" : 
                           program.label === "akan datang" ? "Akan Dibuka" : "Ditutup"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Card with enhanced styling */}
              <Card className="glass-tech sticky top-24 border-pri-red/10">
                <div className="corner-bracket corner-bracket-tl" />
                <div className="corner-bracket corner-bracket-tr" />
                <div className="corner-bracket corner-bracket-bl" />
                <div className="corner-bracket corner-bracket-br" />
                {/* Scan line effect */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-pri-red/20 to-transparent animate-scan" />
                </div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                    <div className="h-10 w-10 rounded-lg bg-pri-red/20 flex items-center justify-center relative">
                      <IconComponent className="h-5 w-5 text-pri-red" />
                      <div className="data-pulse-ring" style={{ width: '40px', height: '40px', inset: '-5px' }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{program.title}</h3>
                      <Badge className={`${labelStyles[program.label] || labelStyles.dibuka} border text-[10px] mt-1`}>
                        {labelLabels[program.label] || program.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Terminal-style info */}
                  <div className="bg-pri-dark/50 rounded-lg p-3 mb-4 font-mono text-[10px] space-y-1.5 border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-pri-silver/40">$</span>
                      <span className="text-pri-silver/60">status</span>
                      <span className="text-green-400/80">active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-pri-silver/40">$</span>
                      <span className="text-pri-silver/60">registrations</span>
                      <span className="text-white">
                        {(program.label === "dibuka" || program.label === "akan datang" || !program.label) ? "open" : "closed"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-pri-silver/40">$</span>
                      <span className="text-pri-silver/60">target_audience</span>
                      <span className="text-white">{program.target_audience || "all"}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-pri-silver">Pendaftaran</span>
                      <span className="text-white font-medium">
                        {(program.label === "dibuka" || program.label === "akan datang" || !program.label)
                          ? "Terbuka" : "Ditutup"}
                      </span>
                    </div>
                    {program.target_audience && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-pri-silver">Target</span>
                        <span className="text-white font-medium">{program.target_audience}</span>
                      </div>
                    )}
                    {program.max_participants && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-pri-silver">Kuota</span>
                        <span className="text-white font-medium font-mono">{program.max_participants}</span>
                      </div>
                    )}
                  </div>

                  <ProgramRegistration
                    programId={program.id}
                    registered={isRegistered}
                    registrationStatus={isRegistered ? "registered" : null}
                    isLoggedIn={!!userId}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Programs */}
      {relatedPrograms.length > 0 && (
        <section className="section-padding bg-pri-dark/30 relative">
          <div className="absolute inset-0 circuit-pattern opacity-[0.03]" />
          <div className="container-wide px-4 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-pri-red" />
                  Program Lainnya
                </h2>
                <p className="text-sm text-pri-silver mt-1">Jelajahi program PRO RI lainnya</p>
              </div>
              <Link href="/programs">
                <Button variant="outline" size="sm" className="border-white/10 text-pri-silver hover:text-white">
                  Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPrograms.map((rp: any) => {
                const RelIcon = iconMap[rp.icon] || GraduationCap;
                return (
                  <Link key={rp.id} href={`/programs/${rp.slug}`}>
                    <Card className="glass-tech overflow-hidden group h-full">
                      <div className="corner-bracket corner-bracket-tl" />
                      <div className="corner-bracket corner-bracket-tr" />
                      <div className="corner-bracket corner-bracket-bl" />
                      <div className="corner-bracket corner-bracket-br" />
                      <div className="relative h-36 overflow-hidden">
                        <Image
                          src={rp.image_url || defaultImages[0]}
                          alt={rp.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon via-pri-carbon/60 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <div className="h-8 w-8 rounded-lg bg-pri-red/90 flex items-center justify-center">
                            <RelIcon className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-pri-red transition-colors">
                          {rp.title}
                        </h3>
                        {rp.short_description && (
                          <p className="text-xs text-pri-silver line-clamp-2">{rp.short_description}</p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-20 circuit-pattern circuit-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pri-red/5 to-transparent" />
        <div className="container-wide relative z-10 text-center px-4">
          <Target className="h-12 w-12 text-pri-red mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Bergabung dengan <span className="text-gradient">PRO RI</span>?
          </h2>
          <p className="text-pri-silver max-w-lg mx-auto mb-8">
            Jadilah bagian dari gerakan robotika nasional. Daftar sekarang dan nikmati akses ke seluruh program PRO RI.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-pri-red hover:bg-red-700 text-white px-8 text-base glow-red">
              Daftar Anggota Sekarang <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
