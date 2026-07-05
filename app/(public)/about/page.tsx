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
  GraduationCap,
  Store,
  Bot,
  Star,
  Clock,
  Activity,
  BarChart3,
  Monitor,
  Layers,
  CheckCircle,
  Hexagon,
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

const visi = {
  icon: Eye,
  title: "Visi",
  description: "Menjadi pusat pengembangan robotika rakyat terbesar di Indonesia yang melahirkan generasi inovatif, mandiri, berdaya saing global, serta mampu mendorong kemandirian teknologi nasional menuju Indonesia Emas 2045.",
  gradient: "from-blue-500 to-cyan-400",
};

const misiPoints = [
  "Meningkatkan literasi robotika, Artificial Intelligence, coding, dan teknologi digital di seluruh Indonesia.",
  "Menyelenggarakan pendidikan, pelatihan, sertifikasi, dan pembinaan teknologi yang mudah diakses masyarakat.",
  "Mencetak talenta muda unggul di bidang robotika dan inovasi teknologi.",
  "Mendorong lahirnya startup dan wirausaha berbasis teknologi.",
  "Menghubungkan dunia pendidikan, industri, pemerintah, komunitas, dan dunia usaha dalam satu ekosistem kolaboratif.",
  "Mengembangkan teknologi yang memberikan manfaat nyata bagi masyarakat Indonesia.",
];

const nilaiNilai = [
  { icon: Shield, title: "Integritas", desc: "Menjunjung tinggi kejujuran, profesionalisme, tanggung jawab, dan etika dalam setiap tindakan.", gradient: "from-pri-red to-red-400" },
  { icon: Lightbulb, title: "Inovasi", desc: "Terus menciptakan solusi baru yang mampu menjawab tantangan zaman melalui riset dan pengembangan teknologi.", gradient: "from-blue-500 to-cyan-400" },
  { icon: Heart, title: "Kolaborasi", desc: "Membangun budaya gotong royong melalui sinergi lintas sektor demi kemajuan bersama.", gradient: "from-green-500 to-emerald-400" },
  { icon: Rocket, title: "Kemandirian", desc: "Mendorong lahirnya teknologi nasional yang mampu mengurangi ketergantungan terhadap teknologi asing.", gradient: "from-purple-500 to-pink-400" },
  { icon: Award, title: "Kebermanfaatan", desc: "Setiap inovasi yang dikembangkan harus memberikan manfaat nyata bagi masyarakat Indonesia.", gradient: "from-amber-500 to-orange-400" },
];

const tujuanProRI = [
  { num: "01", icon: BookOpen, title: "Mencerdaskan Rakyat", desc: "Menyediakan pendidikan robotika, AI, coding, dan teknologi digital yang dapat diakses oleh seluruh lapisan masyarakat." },
  { num: "02", icon: Users, title: "Memberdayakan Rakyat", desc: "Mengembangkan pelatihan, inovasi, dan pemanfaatan teknologi untuk meningkatkan produktivitas ekonomi masyarakat." },
  { num: "03", icon: Star, title: "Memajukan Rakyat", desc: "Melahirkan generasi unggul yang memiliki kemampuan teknologi, karakter kepemimpinan, dan daya saing global." },
  { num: "04", icon: Globe, title: "Memperkuat Kolaborasi Nasional", desc: "Membangun sinergi antara pemerintah, dunia pendidikan, industri, komunitas, dan masyarakat dalam mengembangkan teknologi nasional." },
  { num: "05", icon: Heart, title: "Memberikan Dampak Nyata", desc: "Menciptakan solusi teknologi yang mampu meningkatkan kesejahteraan masyarakat serta mendukung pembangunan Indonesia." },
];

const programStrategis = [
  { icon: GraduationCap, title: "Sekolah Robotika Rakyat", desc: "Program pelatihan robotika, AI, coding, dan teknologi digital bagi siswa, mahasiswa, guru, tenaga pendidik, serta masyarakat umum." },
  { icon: BookOpen, title: "Robotika Masuk Sekolah", desc: "Program implementasi pembelajaran robotika dan coding di sekolah formal maupun pendidikan nonformal." },
  { icon: Bot, title: "Akademi AI & Digital Skill", desc: "Pelatihan Artificial Intelligence, Data Science, Cyber Security, Internet of Things, Cloud Computing, serta berbagai kompetensi digital masa depan." },
  { icon: Trophy, title: "Kompetisi Robotika Nasional", desc: "Ajang pembinaan, kompetisi, dan pengembangan talenta muda di bidang robotika dan inovasi teknologi." },
  { icon: Rocket, title: "Inkubator Inovasi Teknologi", desc: "Pendampingan riset, inovasi, startup teknologi, hingga hilirisasi produk agar mampu menjadi solusi nyata bagi masyarakat." },
  { icon: Store, title: "Robotika untuk UMKM", desc: "Pemanfaatan otomasi dan teknologi untuk meningkatkan efisiensi, produktivitas, serta daya saing usaha mikro, kecil, dan menengah." },
];

const sasaranManfaat = [
  "Pelajar SD, SMP, SMA, dan SMK",
  "Mahasiswa",
  "Guru dan Tenaga Pendidik",
  "Lembaga Pendidikan Formal dan Nonformal",
  "Komunitas Teknologi",
  "Organisasi Kepemudaan",
  "UMKM",
  "Industri",
  "Pemerintah Daerah",
  "Masyarakat Umum",
];

const pilarTeknologi = [
  { icon: Cpu, title: "Hardware & Mekatronika Nasional" },
  { icon: Zap, title: "Embedded System & Mikrokontroler Nusantara" },
  { icon: Globe, title: "Robot Operating System Indonesia (ROS-ID)" },
  { icon: Bot, title: "Artificial Intelligence & Computer Vision Nasional" },
  { icon: Monitor, title: "Cloud Robotics & Edge Computing" },
  { icon: Heart, title: "Human Robot Interaction (HRI) Nusantara" },
];

const pilarUtama = [
  { icon: BookOpen, title: "Pendidikan", desc: "Membangun fondasi pengetahuan dan keterampilan teknologi sejak dini." },
  { icon: Lightbulb, title: "Inovasi", desc: "Mendorong lahirnya solusi-solusi baru yang relevan dengan kebutuhan bangsa." },
  { icon: Heart, title: "Kolaborasi", desc: "Membangun sinergi lintas sektor untuk memperkuat ekosistem teknologi nasional." },
  { icon: Award, title: "Kompetensi", desc: "Meningkatkan standar kemampuan SDM Indonesia di bidang robotika dan AI." },
  { icon: Rocket, title: "Daya Saing", desc: "Mempersiapkan talenta Indonesia agar mampu bersaing di pasar global." },
  { icon: Shield, title: "Keberlanjutan", desc: "Memastikan setiap program memberikan dampak jangka panjang bagi bangsa." },
];

const roadmap = [
  { year: "2025–2030", phase: "Fondasi & Talenta", items: ["Penyusunan regulasi & infrastruktur dasar", "Pengembangan talenta robotika nasional", "Pembentukan ekosistem robotika nasional"], status: "active" },
  { year: "2030–2035", phase: "Transformasi Sektor", items: ["Robotika di sektor pendidikan & industri", "Implementasi di pertanian, kesehatan, pertahanan", "Transformasi pelayanan publik"], status: "upcoming" },
  { year: "2035–2040", phase: "Integrasi Nasional", items: ["Robotika di seluruh sektor strategis", "Produktivitas nasional berbasis teknologi", "Penguatan rantai pasok teknologi lokal"], status: "upcoming" },
  { year: "2040–2045", phase: "Kepemimpinan Global", items: ["Indonesia mandiri & berdaulat di bidang teknologi", "Kepemimpinan global di bidang robotika", "Indonesia Emas 2045 tercapai"], status: "upcoming" },
];

const sisterOrgs = ["MURI", "PERI", "LBH RI", "AMRI", "PATRIOT RI", "PERISAI RI Kristiani"];

const stats = [
  { value: 38, suffix: "+", label: "Provinsi" },
  { value: 6, suffix: "", label: "Program Strategis" },
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
              PRO RI (Pusat Robotika Rakyat Indonesia) — organisasi nasional yang berfokus pada pengembangan robotika, kecerdasan buatan (AI), coding, Internet of Things (IoT), otomasi, serta transformasi teknologi sebagai fondasi pembangunan SDM Indonesia menuju Indonesia Emas 2045.
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
            </h2>              <p className="text-base md:text-lg text-pri-silver leading-relaxed mb-6">
              Indonesia memasuki era transformasi digital yang menuntut kesiapan sumber daya manusia dalam menghadapi perkembangan teknologi yang sangat cepat. Robotika, <em>Artificial Intelligence</em> (AI), <em>Internet of Things</em> (IoT), <em>Big Data</em>, <em>Cloud Computing</em>, dan teknologi otomasi bukan lagi sekadar tren, melainkan menjadi fondasi utama pembangunan bangsa.
            </p>
            <p className="text-base md:text-lg text-pri-silver leading-relaxed mb-6">
              PRO RI lahir sebagai gerakan nasional yang bertujuan membangun ekosistem robotika rakyat melalui pendidikan, pelatihan, penelitian, inovasi, kolaborasi, dan pemberdayaan masyarakat.
            </p>
            <p className="text-base md:text-lg text-pri-silver leading-relaxed mb-8">
              Kami percaya bahwa kemajuan teknologi harus memberikan manfaat nyata bagi kehidupan masyarakat, meningkatkan produktivitas, membuka lapangan kerja baru, memperkuat industri nasional, serta mempercepat terwujudnya Indonesia sebagai negara berdaulat di bidang teknologi.
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
              Visi &{" "}
              <span className="text-gradient">Misi</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Landasan organisasi PRO RI dalam mewujudkan kedaulatan teknologi Indonesia
            </p>
          </motion.div>

          {/* Visi */}
          <div className="max-w-4xl mx-auto mb-16">
            <motion.div {...fadeInUp}>
              <Card className="glass-card-hover p-8 text-center group relative overflow-hidden border-pri-red/10">
                <div className={`absolute inset-0 bg-gradient-to-br ${visi.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                <CardContent className="p-0 relative z-10">
                  <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${visi.gradient} bg-opacity-20 flex items-center justify-center mx-auto mb-4`}>
                    <visi.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{visi.title}</h3>
                  <p className="text-base text-pri-silver leading-relaxed max-w-2xl mx-auto italic">
                    &ldquo;{visi.description}&rdquo;
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Misi */}
          <div className="max-w-4xl mx-auto mb-16">
            <motion.div {...fadeInUp} className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                <span className="text-gradient">Misi</span> PRO RI
              </h3>
              <p className="text-pri-silver">Enam misi strategis dalam membangun ekosistem teknologi nasional</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {misiPoints.map((misi, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-xl p-5 flex items-start gap-4 border border-white/5 hover:border-pri-red/20 transition-all duration-300 group"
                >
                  <div className="h-9 w-9 rounded-lg bg-pri-red/10 flex items-center justify-center shrink-0 group-hover:bg-pri-red/20 transition-colors">
                    <span className="text-sm font-bold text-pri-red font-mono">{i + 1}</span>
                  </div>
                  <p className="text-sm text-pri-silver group-hover:text-white transition-colors">{misi}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Nilai-Nilai PRO RI */}
          <div className="max-w-4xl mx-auto mb-16">
            <motion.div {...fadeInUp} className="text-center mb-8">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
                <Award className="h-4 w-4 text-pri-red" />
                <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Nilai-Nilai</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Nilai-Nilai <span className="text-gradient">PRO RI</span>
              </h3>
              <p className="text-pri-silver">Seluruh aktivitas organisasi dibangun di atas lima nilai utama</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nilaiNilai.map((n, i) => (
                <motion.div
                  key={n.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="glass-card-hover p-6 h-full group relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${n.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                    <CardContent className="p-0 relative z-10">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${n.gradient} bg-opacity-20 flex items-center justify-center mb-4`}>
                        <n.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-3">{n.title}</h3>
                      <p className="text-sm text-pri-silver leading-relaxed">{n.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tujuan PRO RI */}
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4 mx-auto w-fit">
              <Target className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Lima Pilar Utama</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
              Tujuan <span className="text-gradient">PRO RI</span>
            </h2>
            <p className="text-pri-silver text-center max-w-xl mx-auto mb-8">
              PRO RI hadir sebagai gerakan nasional yang memiliki tujuan besar dalam membangun masa depan Indonesia melalui lima pilar utama
            </p>
            <div className="space-y-4">
              {tujuanProRI.map((item, i) => (
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

      {/* ===== PROGRAM STRATEGIS ===== */}
      <section className="section-padding bg-pri-carbon relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Rocket className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Program</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Program <span className="text-gradient">Strategis</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              PRO RI menjalankan program strategis untuk memperluas literasi teknologi dan membangun ekosistem robotika Indonesia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {programStrategis.map((prog, i) => {
              const ProgIcon = prog.icon;
              return (
                <motion.div
                  key={prog.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="glass-tech p-6 h-full">
                    <div className="corner-bracket corner-bracket-tl" />
                    <div className="corner-bracket corner-bracket-tr" />
                    <div className="corner-bracket corner-bracket-bl" />
                    <div className="corner-bracket corner-bracket-br" />
                    <CardContent className="p-0">
                      <div className="h-12 w-12 rounded-xl bg-pri-red/15 flex items-center justify-center mb-4">
                        <ProgIcon className="h-6 w-6 text-pri-red" />
                      </div>
                      <h3 className="text-base font-semibold text-white mb-2">{prog.title}</h3>
                      <p className="text-sm text-pri-silver leading-relaxed">{prog.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Sasaran Penerima Manfaat */}
          <motion.div {...fadeInUp} className="text-center mt-16 mb-8">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Users className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Sasaran</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Sasaran <span className="text-gradient">Penerima Manfaat</span>
            </h3>
            <p className="text-pri-silver max-w-xl mx-auto">
              Program PRO RI ditujukan untuk seluruh lapisan masyarakat
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {sasaranManfaat.map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-full px-5 py-2.5 text-sm text-white font-mono border border-white/5 hover:border-pri-red/30 hover:bg-pri-red/5 transition-all duration-300"
              >
                {s}
              </motion.span>
            ))}
          </div>
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

      {/* ===== ENAM PILAR TEKNOLOGI ===== */}
      <section className="section-padding bg-pri-dark/50 relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.03]" />
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Layers className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Teknologi</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Enam Pilar <span className="text-gradient">Teknologi Nasional</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Untuk mewujudkan kedaulatan teknologi, PRO RI mendorong pengembangan enam lapisan teknologi nasional
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pilarTeknologi.map((pilar, i) => {
                const PilarIcon = pilar.icon;
                return (
                  <motion.div
                    key={pilar.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="glass rounded-xl p-5 flex items-center gap-4 border border-white/5 hover:border-pri-red/20 transition-all duration-300 group"
                  >
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pri-red/20 to-transparent flex items-center justify-center shrink-0">
                      <PilarIcon className="h-5 w-5 text-pri-red" />
                    </div>
                    <p className="text-sm text-white font-medium">{pilar.title}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Road connector */}
          <div className="flex items-center justify-center gap-2 mt-8 max-w-md mx-auto">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pri-red/50 to-transparent" />
            <span className="text-xs text-pri-silver font-mono">Enam Lapisan Teknologi Nasional</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pri-red/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* ===== DAMPAK ===== */}
      <section className="section-padding bg-pri-carbon relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="orbit-ring" style={{ top: "10%", right: "5%", width: "100px", height: "100px", opacity: 0.04 }} />
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <BarChart3 className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Dampak</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Dampak yang Ingin <span className="text-gradient">Dicapai</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto mb-10">
              PRO RI berkomitmen memberikan kontribusi nyata terhadap pembangunan Indonesia
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {[
                { icon: BarChart3, text: "Peningkatan produktivitas ekonomi" },
                { icon: Users, text: "Penciptaan jutaan talenta digital" },
                { icon: Cpu, text: "Penguatan industri robotika nasional" },
                { icon: Shield, text: "Peningkatan ketahanan pangan dan energi" },
                { icon: Target, text: "Penguatan sistem pertahanan berbasis teknologi" },
                { icon: Globe, text: "Transformasi layanan publik" },
                { icon: Award, text: "Lahirnya inovasi yang mampu bersaing di tingkat internasional" },
              ].map((item, i) => {
                const DampakIcon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="glass rounded-xl p-4 flex items-center gap-3 border border-white/5 hover:border-pri-red/20 transition-all duration-300 group"
                  >
                    <div className="h-10 w-10 rounded-lg bg-pri-red/10 flex items-center justify-center shrink-0">
                      <DampakIcon className="h-5 w-5 text-pri-red" />
                    </div>
                    <p className="text-sm text-pri-silver group-hover:text-white transition-colors duration-300">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FILOSOFI LOGO SECTION ===== */}
      <section className="section-padding bg-pri-dark/50 relative overflow-hidden">
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
                <Zap className="h-4 w-4 text-pri-red" />
                <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Filosofi</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Filosofi <span className="text-gradient">Logo</span>
              </h2>
              <p className="text-pri-silver max-w-lg mx-auto">
                Logo PRO RI merupakan representasi dari semangat perjuangan, inovasi, dan kemandirian teknologi Indonesia
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
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

            {/* Filosofi description */}
            <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-10">
              <p className="text-sm text-pri-silver leading-relaxed">
                Kepala harimau robotik melambangkan keberanian, kekuatan, ketangguhan, serta kemampuan bangsa Indonesia dalam menguasai teknologi masa depan. Elemen mekanikal pada kepala harimau menggambarkan presisi, rekayasa teknologi, dan inovasi berkelanjutan.
              </p>
              <p className="text-sm text-pri-silver leading-relaxed mt-4">
                Lingkaran yang mengelilingi logo melambangkan persatuan dan kolaborasi seluruh elemen bangsa, sedangkan ornamen heksagonal merepresentasikan jaringan teknologi, konektivitas, dan ekosistem digital yang saling terintegrasi.
              </p>
              <p className="text-sm text-pri-silver leading-relaxed mt-4">
                Dominasi warna merah dan putih mencerminkan semangat nasionalisme, keberanian, integritas, serta komitmen untuk membangun Indonesia yang maju melalui penguasaan teknologi. Tipografi PRO RI yang tegas dan futuristik menggambarkan organisasi yang modern, progresif, dan siap menghadapi tantangan revolusi industri masa depan.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                { icon: Cpu, label: "Kepala Harimau Robotik", desc: "Keberanian dan kekuatan bangsa dalam menguasai teknologi masa depan", gradient: "from-pri-red/10 to-transparent" },
                { icon: Globe, label: "Lingkaran & Heksagonal", desc: "Persatuan, kolaborasi, dan jaringan teknologi yang terintegrasi", gradient: "from-red-500/10 to-transparent" },
                { icon: Target, label: "Warna Merah & Putih", desc: "Semangat nasionalisme, keberanian, dan komitmen membangun Indonesia", gradient: "from-blue-500/10 to-transparent" },
                { icon: Zap, label: "Tipografi Futuristik", desc: "Organisasi modern, progresif, siap menghadapi tantangan masa depan", gradient: "from-green-500/10 to-transparent" },
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

      {/* ===== PILAR UTAMA ===== */}
      <section className="section-padding bg-pri-carbon relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Hexagon className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Pilar</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Pilar Utama <span className="text-gradient">PRO RI</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Seluruh gerakan PRO RI dibangun di atas enam pilar utama
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pilarUtama.map((pilar, i) => {
              const PilarIcon = pilar.icon;
              return (
                <motion.div
                  key={pilar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="glass-tech p-6 h-full text-center">
                    <div className="corner-bracket corner-bracket-tl" />
                    <div className="corner-bracket corner-bracket-tr" />
                    <div className="corner-bracket corner-bracket-bl" />
                    <div className="corner-bracket corner-bracket-br" />
                    <CardContent className="p-0">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-pri-red/20 to-pri-red/5 flex items-center justify-center mx-auto mb-4 ring-2 ring-pri-red/10">
                        <PilarIcon className="h-7 w-7 text-pri-red" />
                      </div>
                      <h3 className="text-base font-semibold text-white mb-2">{pilar.title}</h3>
                      <p className="text-sm text-pri-silver">{pilar.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Penutup */}
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mt-16">
            <div className="glass rounded-xl p-8 border border-white/5">
              <Quote className="h-8 w-8 text-pri-red mx-auto mb-4 opacity-50" />
              <p className="text-base text-pri-silver leading-relaxed italic">
                PRO RI percaya bahwa masa depan Indonesia tidak hanya ditentukan oleh kekayaan sumber daya alam, tetapi juga oleh kualitas sumber daya manusia yang mampu menciptakan, mengembangkan, dan menguasai teknologi.
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-lg font-bold text-white">Bersatu. Berkarya. Berdampak.</p>
                <p className="text-sm text-pri-red font-mono mt-1">Robotika Milik Rakyat, Teknologi untuk Indonesia.</p>
              </div>
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
                  Lihat Program PRO RI
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
