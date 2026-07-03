"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Shield,
  Globe,
  Cpu,
  Quote,
  ArrowRight,
  Calendar,
  Users,
  Rocket,
  Sparkles,
  ChevronRight,
  Building,
  Lightbulb,
  Heart,
  Zap,
  BookOpen,
  Trophy,
  Award,
} from "lucide-react";
import { OfficeLocation } from "./office-location";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCounterAnimation } from "@/hooks/use-counter-animation";

// -- Animated Counter Component --
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const count = useCounterAnimation({ end: value, duration: 2000 });
  return <>{count}{suffix}</>;
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const milestones = [
  { date: "6 Juni 2026", event: "Peluncuran PRO RI oleh PRI di Jakarta", icon: Rocket },
  { date: "13 Juni 2026", event: "Pelantikan DPN PRO RI di DPP PRI Jakarta", icon: Users },
  { date: "Juli 2026", event: "Pendaftaran anggota nasional dibuka", icon: Users },
  { date: "2026 (Target)", event: "Pembentukan DPD di 38 provinsi", icon: Globe },
  { date: "2027 (Target)", event: "Sekolah Robotika Rakyat di 38 provinsi", icon: BookOpen },
  { date: "2028 (Target)", event: "Kompetisi Robotika Nasional perdana", icon: Trophy },
];

const values = [
  {
    icon: Target,
    title: "Misi",
    description: "Menyelenggarakan pendidikan robotika merata, mendorong integrasi kurikulum robotika nasional, mengembangkan inovasi teknologi tepat guna, membangun ekosistem robotika nasional, dan menjembatani kolaborasi pemerintah-industri-akademisi-komunitas.",
    gradient: "from-pri-red to-red-400",
  },
  {
    icon: Eye,
    title: "Visi",
    description: "Terwujudnya kedaulatan teknologi Indonesia melalui pengembangan sumber daya manusia yang unggul dalam bidang robotika dan kecerdasan buatan, guna mempercepat tercapainya Indonesia Emas 2045.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Shield,
    title: "Komitmen",
    description: "Menyediakan akses pendidikan, pelatihan, dan pengembangan teknologi berkualitas untuk seluruh rakyat Indonesia, dari Sabang sampai Merauke.",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    icon: Globe,
    title: "Jangkauan",
    description: "Hadir di 38 provinsi Indonesia dengan struktur organisasi berjenjang: DPN (Pusat), DPD (Provinsi), dan DPC (Kabupaten/Kota).",
    gradient: "from-purple-500 to-pink-400",
  },
];

const roadmap = [
  { year: "2026", phase: "Pendirian & Konsolidasi", items: ["Peluncuran PRO RI", "Pembentukan DPN, DPD, DPC", "Perumusan program kerja"], status: "completed" },
  { year: "2027–2028", phase: "Ekspansi Nasional", items: ["Sekolah Robotika Rakyat di 38 provinsi", "Robotika Masuk Sekolah di 500+ sekolah", "Kompetisi Robotika Nasional perdana"], status: "active" },
  { year: "2029–2030", phase: "Penguatan & Dampak", items: ["Akademi AI berjalan penuh", "100+ startup melalui Inkubator Inovasi", "Robotika untuk UMKM di 10.000+ UMKM"], status: "upcoming" },
  { year: "2031–2045", phase: "Menuju Indonesia Emas", items: ["Ekosistem robotika nasional mandiri", "Indonesia sebagai kekuatan teknologi Asia"], status: "upcoming" },
];

const sisterOrgs = ["MURI", "PERI", "LBH RI", "AMRI", "PATRIOT RI", "PERISAI RI Kristiani"];

const stats = [
  { value: 38, suffix: "+", label: "Provinsi" },
  { value: 6, suffix: "", label: "Program Unggulan" },
  { value: 2026, suffix: "", label: "Tahun Berdiri" },
  { value: 10000, suffix: "+", label: "Target Anggota" },
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=80"
            alt="AI Technology"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-pri-carbon/60 via-pri-carbon/80 to-pri-carbon" />
          <div className="absolute inset-0 circuit-pattern opacity-[0.08]" />
          <div className="absolute inset-0 bg-gradient-to-r from-pri-red/5 via-transparent to-pri-red/5" />
        </div>
        <div className="hero-scan-line" />
        <div className="tech-particles">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="tech-particle"
              style={{
                left: `${5 + Math.random() * 90}%`,
                top: "100%",
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${12 + Math.random() * 12}s`,
              }}
            />
          ))}
        </div>
        <div className="orbit-ring" style={{ top: "20%", right: "10%", width: "180px", height: "180px", opacity: 0.06 }} />
        <div className="orbit-ring orbit-ring-2" style={{ bottom: "15%", left: "5%", width: "120px", height: "120px", opacity: 0.04 }} />
        <div className="hero-corner-tl" />
        <div className="hero-corner-tr" />
        <div className="hero-corner-bl" />
        <div className="hero-corner-br" />

        <div className="container-wide px-4 relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-6 border border-pri-red/10"
            >
              <Cpu className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Pusat Robotika Rakyat Indonesia
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Tentang{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pri-red to-red-400">
                PRO RI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-pri-silver leading-relaxed max-w-2xl mx-auto mb-8"
            >
              Pelajari sejarah, visi, misi, tujuan, dan peta jalan Pusat Robotika Rakyat Indonesia (PRO RI) — 
              gerakan robotika nasional untuk kedaulatan teknologi Indonesia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link href="#sejarah">
                <Button size="lg" className="bg-pri-red hover:bg-red-700 text-white px-8 glow-red">
                  Mulai Jelajahi <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-white/10 text-white hover:text-white px-8">
                  Daftar Anggota
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-30"
        >
          <div className="h-10 w-6 rounded-full border border-white/15 flex items-start justify-center pt-2">
            <div className="h-2 w-1 rounded-full bg-pri-red" />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative py-12 bg-pri-dark/80 border-y border-white/5">
        <div className="container-wide px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white font-mono mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-pri-silver">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SEJARAH SECTION ===== */}
      <section id="sejarah" className="section-padding bg-pri-carbon relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="orbit-ring" style={{ top: "-50px", left: "10%", width: "200px", height: "200px", opacity: 0.06 }} />
        
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Calendar className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Sejarah</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Sejarah Berdirinya{" "}
              <span className="text-gradient">PRO RI</span>
            </h2>
            <p className="text-base md:text-lg text-pri-silver leading-relaxed mb-8">
              Pada tanggal <strong className="text-white">6 Juni 2026</strong>, PRI (Perkumpulan Robotika Indonesia) 
              secara resmi meluncurkan <strong className="text-white">Pusat Robotika Rakyat Indonesia (PRO RI)</strong> 
              sebagai gerakan nasional untuk mempercepat penguasaan teknologi robotika dan kecerdasan buatan di Indonesia.
            </p>

            {/* Quotes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass rounded-xl p-6 md:p-8 border-l-4 border-pri-red hover:border-l-pri-red/80 transition-all"
              >
                <Quote className="h-8 w-8 text-pri-red mb-4 opacity-50" />
                <p className="text-base md:text-lg text-white italic leading-relaxed mb-4">
                  &ldquo;Kedaulatan teknologi adalah harga mati. Bangsa yang tidak menguasai teknologi akan 
                  terus bergantung pada bangsa lain. PRO RI adalah wadah bagi seluruh rakyat Indonesia untuk 
                  bersama-sama membangun kemandirian teknologi.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-pri-red/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-pri-red" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Muhammad Nazaruddin</p>
                    <p className="text-xs text-pri-silver">Ketua Umum PRI</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass rounded-xl p-6 md:p-8 border-l-4 border-pri-red hover:border-l-pri-red/80 transition-all"
              >
                <Quote className="h-8 w-8 text-pri-red mb-4 opacity-50" />
                <p className="text-base md:text-lg text-white italic leading-relaxed mb-4">
                  &ldquo;Kami ingin memastikan bahwa pendidikan robotika tidak hanya dinikmati oleh segelintir 
                  orang di kota-kota besar, tetapi dapat menjangkau seluruh lapisan masyarakat — dari Sabang 
                  sampai Merauke.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-pri-red/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-pri-red" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Adityo Handoko</p>
                    <p className="text-xs text-pri-silver">Ketua PRO RI</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Timeline */}
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="h-6 w-1 rounded-full bg-pri-red" />
              Milestone
            </h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-pri-red via-pri-red/50 to-transparent" />
              
              <div className="space-y-6">
                {milestones.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-12"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-[14px] top-1 h-3 w-3 rounded-full border-2 border-pri-red bg-pri-carbon z-10" />
                      
                      <div className="glass rounded-xl p-5 border border-white/5 hover:border-pri-red/20 transition-all duration-300">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-lg bg-pri-red/10 flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-pri-red" />
                          </div>
                          <div>
                            <span className="text-xs font-mono text-pri-red font-semibold">{m.date}</span>
                            <p className="text-sm text-white mt-1">{m.event}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== VISI MISI SECTION ===== */}
      <section className="section-padding bg-pri-dark/50 relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.03]" />
        <div className="orbit-ring orbit-ring-2" style={{ bottom: "10%", right: "5%", width: "150px", height: "150px", opacity: 0.05 }} />
        
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Visi, Misi & Komitmen</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Visi, Misi &{" "}
              <span className="text-gradient">Komitmen</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Landasan organisasi PRO RI dalam mewujudkan kedaulatan teknologi Indonesia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="glass-card-hover p-6 h-full group relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${v.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                  <CardContent className="p-0 relative z-10">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${v.gradient} bg-opacity-20 flex items-center justify-center mb-4`}>
                      <v.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{v.title}</h3>
                    <p className="text-sm text-pri-silver leading-relaxed">{v.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tujuan Organisasi */}
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Tujuan <span className="text-gradient">Organisasi</span>
            </h2>
            <div className="space-y-4">
              {[
                { num: "01", icon: Rocket, title: "Akselerasi Penguasaan Teknologi", desc: "Mempercepat penguasaan teknologi robotika dan AI di kalangan generasi muda Indonesia" },
                { num: "02", icon: Globe, title: "Pemerataan Akses", desc: "Memastikan akses pendidikan robotika merata hingga ke daerah terpencil" },
                { num: "03", icon: Lightbulb, title: "Inovasi Tepat Guna", desc: "Mengembangkan solusi robotika yang aplikatif untuk pertanian, UMKM, dan layanan publik" },
                { num: "04", icon: Award, title: "Pengembangan Talenta", desc: "Mencetak talenta robotika nasional yang siap bersaing di tingkat global" },
                { num: "05", icon: Heart, title: "Kolaborasi Nasional", desc: "Menjadi katalisator kolaborasi antara pemerintah, industri, akademisi, dan komunitas robotika" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-5 flex items-start gap-4 border border-white/5 hover:border-pri-red/20 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-2xl font-bold text-pri-red font-mono">{item.num}</span>
                    <div className="h-10 w-10 rounded-lg bg-pri-red/10 flex items-center justify-center group-hover:bg-pri-red/20 transition-colors">
                      <item.icon className="h-5 w-5 text-pri-red" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-pri-silver">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== PETA JALAN SECTION ===== */}
      <section className="section-padding bg-pri-carbon relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Rocket className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Peta Jalan</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Peta Jalan{" "}
              <span className="text-gradient">PRO RI</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Perjalanan PRO RI menuju Indonesia Emas 2045
            </p>
          </motion.div>

          {/* Timeline Roadmap */}
          <div className="max-w-5xl mx-auto">
            {/* Desktop: Horizontal */}
            <div className="hidden lg:block relative">
              {/* Connecting line */}
              <div className="absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-pri-red via-pri-red/50 to-transparent" />
              
              <div className="grid grid-cols-4 gap-6">
                {roadmap.map((phase, i) => (
                  <motion.div
                    key={phase.year}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="relative"
                  >
                    {/* Dot on timeline */}
                    <div className={`absolute top-[46px] left-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 z-10 ${
                      phase.status === "completed" 
                        ? "bg-pri-red border-pri-red" 
                        : phase.status === "active"
                        ? "bg-pri-red border-pri-red animate-pulse"
                        : "bg-pri-carbon border-pri-silver/30"
                    }`} />
                    
                    <Card className={`glass-card-hover p-6 pt-16 h-full ${
                      phase.status === "active" ? "border-pri-red/30" : ""
                    }`}>
                      <CardContent className="p-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-pri-red">{phase.year}</span>
                          {phase.status === "active" && (
                            <span className="status-dot" />
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-white mb-3">{phase.phase}</h3>
                        <ul className="space-y-2">
                          {phase.items.map((item, j) => (
                            <li key={j} className="text-sm text-pri-silver flex items-start gap-2">
                              <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${
                                phase.status === "completed" ? "bg-green-400" : "bg-pri-red"
                              }`} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile: Vertical */}
            <div className="lg:hidden space-y-4">
              {roadmap.map((phase, i) => (
                <motion.div
                  key={phase.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={`glass-card-hover p-5 ${
                    phase.status === "active" ? "border-pri-red/30" : ""
                  }`}>
                    <CardContent className="p-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-pri-red">{phase.year}</span>
                        {phase.status === "active" && (
                          <span className="status-dot" />
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white mb-2">{phase.phase}</h3>
                      <ul className="space-y-1.5">
                        {phase.items.map((item, j) => (
                          <li key={j} className="text-sm text-pri-silver flex items-start gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${
                              phase.status === "completed" ? "bg-green-400" : "bg-pri-red"
                            }`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FILOSOFI LOGO SECTION ===== */}
      <section className="section-padding bg-pri-dark/50 relative overflow-hidden">
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
                <Zap className="h-4 w-4 text-pri-red" />
                <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Filosofi</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Filosofi <span className="text-gradient">Logo</span>
              </h2>
              <p className="text-pri-silver">
                Logo PRO RI dirancang dengan filosofi yang merepresentasikan semangat gerakan robotika rakyat
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-6">
              {/* Logo Display */}
              <div className="h-48 w-48 rounded-2xl glass flex items-center justify-center border border-white/10 p-4">
                <div className="relative h-32 w-32 rounded-xl overflow-hidden ring-2 ring-pri-red/20">
                  <Image
                    src="/images/logo-putih.jpeg"
                    alt="PRO RI Logo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Cpu, label: "Bentuk Geometris", desc: "Melambangkan presisi, teknologi, dan kecerdasan buatan", gradient: "from-pri-red/10 to-transparent" },
                { icon: Globe, label: "Warna Merah", desc: "Semangat nasionalisme dan keberanian", gradient: "from-red-500/10 to-transparent" },
                { icon: Target, label: "Elemen Roda Gigi", desc: "Perputaran inovasi dan industri", gradient: "from-blue-500/10 to-transparent" },
                { icon: Users, label: "Siluet Manusia", desc: "Berpusat pada pengembangan SDM", gradient: "from-green-500/10 to-transparent" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-5 flex items-start gap-4 border border-white/5 hover:border-pri-red/20 transition-all duration-300 group"
                >
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 w-6 text-pri-red" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{item.label}</h3>
                    <p className="text-xs text-pri-silver">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== OFFICE LOCATION ===== */}
      <OfficeLocation />

      {/* ===== SISTER ORGANIZATIONS + CTA ===== */}
      <section className="section-padding bg-pri-carbon relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="orbit-ring orbit-ring-2" style={{ top: "10%", right: "5%", width: "100px", height: "100px", opacity: 0.04 }} />
        
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Building className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Ekosistem PRI</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Organisasi di Bawah{" "}
              <span className="text-gradient">PRI</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto mb-8">
              PRO RI adalah bagian dari ekosistem organisasi PRI (Perkumpulan Robotika Indonesia) bersama dengan:
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3 mb-10"
            >
              {sisterOrgs.map((org, i) => (
                <motion.span
                  key={org}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-full px-5 py-2 text-sm text-white font-mono border border-white/5 hover:border-pri-red/30 hover:bg-pri-red/5 transition-all duration-300 cursor-default"
                >
                  {org}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register">
                <Button size="lg" className="bg-pri-red hover:bg-red-700 text-white px-8 glow-red">
                  Bergabung dengan PRO RI <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/programs">
                <Button size="lg" variant="outline" className="border-white/10 text-pri-silver hover:text-white px-8">
                  Lihat Program Unggulan
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
