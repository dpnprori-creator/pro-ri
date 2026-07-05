"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  ArrowRight,
  MapPin,
  ChevronRight,
  Shield,
  BookOpen,
  GraduationCap,
  Star,
  Award,
  Briefcase,
  Cpu,
  Heart,
  Globe,
  Zap,
  Target,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ── Data Kepengurusan ──

const dewanPembina = {
  ketua: "Ir. H. Muhammad Arfan, M.M.",
  anggota: [
    "Ir. Slmaet Suparmaji, M.M.",
    "Irjen Pol (Purn) Dr. Rinny Wowor, M.Psi.",
    "Marsma TNI (Purn.) I Nyoman Trisantosa, S.I.P., M.Tr (Han)",
    "Prof. Dr. Ahmad Badawi Saluy",
  ],
};

const dewanPakar = {
  ketua: "Dr. H. Hery Erdi Andrat, S.E., M.B.A.",
  anggota: [
    "Dr. Ir. Sulfikar Sallu, M.Kom., ITIL, MTA, CSCA, C.DT, C.Ed.",
    "Dr. (Can) Lukman Abdul Fatah, S.T., M.T.",
    "Rizky G Partakusuma",
    "Dr. Jully Tjindrawan, M.B.A.",
  ],
};

const ketuaUmum = {
  ketua: "H. Adityo Handoko, S.T., M.M.",
  wakil: [
    "Dr. Bambang Supriyanto, M.M.",
    "Wahyu Hidayat, S.T.",
    "Ir. Trisulo, M.B.A., M.M.",
    "H. Eddy Supriady, S.Kom., M.M.",
    "Dr. (Can) Eko Wahyu Bintoro, S.H., M.Kom.",
    "Pahala Sibuea, S.Kom.",
    "H. Dedy Prihatin, A.Md.",
    "Ir. Ferry Firdaus, S.Pt., IPM., ASEAN Eng.",
  ],
};

const sekretariat = {
  sekretaris: "Dr. (H.C.) H. Muhamad Ied, S.E., M.M.",
  wakil: [
    "M. Rofiq Sujarwanto, A.Md., C.Pi",
    "Pudya Sanjaya, S.E.",
    "Rochmad Nurhadi, S.E.",
    "Moch. Reza Anugerah",
    "M. Nur Trijoko, S.H.",
    "Prima Yohana, S.T., M.Kom.",
    "Derry Ekasaputra, S.Kom.",
    "Muhammad Nur Huda, S.E., C.PS., CPP",
  ],
};

const bendahara = {
  bendahara: "Helmi Wahyulianto, S.E.",
  wakil: [
    "Muhammad Fathurrazaq Adjie",
    "Abu Dawud Hidayaturroby, S.T., M.T.",
    "Ir. Dika Aghniyasyak Priyo Fakih, S.T., M.Kom., CITA, CEH, CHFI",
    "Agus Arisman, S.E.",
    "Rudy Hartono, A.Md.Kom",
    "Ihsan Wahab, S.Kom",
    "Sidik Permana Ramdan, S.E.",
  ],
};

const departemen = [
  {
    name: "Organisasi dan Kaderisasi",
    icon: Users,
    anggota: ["Mesakh Albert Gunawan", "Sigit Budinugroho", "Fahmi Hidayat"],
  },
  {
    name: "Robotika & STEM",
    icon: Cpu,
    anggota: ["M. Raihan Akbar, S.I.Kom", "Dr. (H.C.) Anta Wijaya, S.Pd"],
  },
  {
    name: "Pendidikan & Pelatihan Robotika",
    icon: GraduationCap,
    anggota: [
      "Ahmad Rosyidi, S.I.Kom",
      "Indra Rusdin, S.T., M.Si",
      "Yukis Millano Putra, S.Kom",
      "Rayhan Abdul Manaf",
      "Feni Nailah Nardaitina",
    ],
  },
  {
    name: "AI & Data Science",
    icon: Zap,
    anggota: ["M. Irsyad Achsan, S.I.Kom", "M. Farhan Abdullah"],
  },
  {
    name: "Entrepreneur & Start Up Teknologi",
    icon: Lightbulb,
    anggota: ["Uki Nusi", "Hafshoh Nurbaitina", "Aziz Nurhasan"],
  },
  {
    name: "Kepemudaan & Relawan Teknologi",
    icon: Heart,
    anggota: ["Teguh Prayogo, S.Kom", "Almer Batubara"],
  },
  {
    name: "Digitalisasi & Hub Antar Lembaga",
    icon: Globe,
    anggota: [
      "dr. Wiedo Saifan Adlin, M.H.Kes., AIFO-K",
      "Ir. Benny Andrean",
      "H. Asep Wahdiana, S.Kom.",
    ],
  },
  {
    name: "Humas & Media Digital",
    icon: Star,
    anggota: ["Parthomy Oktara, S.H.", "Sulardi", "Agus Wiebowo"],
  },
  {
    name: "Politik & Kebijakan Publik",
    icon: Shield,
    anggota: [
      "Ir. Ahsan Indridi",
      "Heryanto, S.H., S.Pd.I., M.H.",
      "Wangki Murtiawan, S.E.",
      "Ify Afiat, S.E., M.M.",
      "Dr. Dani Adiprijani",
      "Wisnu Budi, M.Sc.",
      "S. Adjidhiantomo, B.Sc.",
      "Iwan Eridan Rasjid, M.Sc.",
      "Budi Santoso",
      "Sadan Sofya, S.E., M.AB.",
      "Yusuf Seftian, B.Sc.",
    ],
  },
];

const structureLevels = [
  {
    level: "DPN",
    name: "Dewan Pimpinan Nasional",
    scope: "Tingkat Pusat",
    desc: "Mengkoordinasikan kebijakan dan program nasional PRO RI",
  },
  {
    level: "DPD",
    name: "Dewan Pimpinan Daerah",
    scope: "Tingkat Provinsi",
    desc: "Mengelola dan menjalankan program PRO RI di masing-masing provinsi",
  },
  {
    level: "DPC",
    name: "Dewan Pimpinan Cabang",
    scope: "Tingkat Kota/Kabupaten",
    desc: "Pelaksana program PRO RI di tingkat akar rumput",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

export default function PengurusPage() {
  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
            alt="Team"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-pri-carbon via-pri-carbon/95 to-pri-carbon" />
        </div>
        <div className="absolute inset-0 circuit-pattern opacity-30" />
        <div className="hero-scan-line" />
        <div className="tech-particles">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="tech-particle"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: "100%",
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${12 + Math.random() * 12}s`,
              }}
            />
          ))}
        </div>
        <div
          className="orbit-ring"
          style={{
            top: "20%",
            right: "10%",
            width: "120px",
            height: "120px",
            opacity: 0.05,
          }}
        />
        <div
          className="orbit-ring orbit-ring-2"
          style={{
            bottom: "30%",
            left: "8%",
            width: "70px",
            height: "70px",
            opacity: 0.03,
          }}
        />

        <div className="container-wide px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
              <Users className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Struktur Organisasi
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Susunan Pengurus{" "}
              <span className="text-gradient">PRO RI</span>
            </h1>
            <p className="text-lg text-pri-silver leading-relaxed max-w-3xl mx-auto">
              Susunan Pengurus Dewan Pimpinan Nasional Pusat Robotika Rakyat
              Indonesia Masa Bakti 2026–2030. Kepengurusan DPN dipimpin oleh para
              tokoh dari berbagai latar belakang profesional, akademisi, praktisi
              teknologi, pemerintahan, militer, pendidikan, hingga industri —
              sebagai bentuk komitmen dalam membangun ekosistem robotika nasional
              yang inklusif dan berkelanjutan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== DEWAN PEMBINA ===== */}
      <section className="section-padding bg-pri-carbon relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Shield className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Pembina
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Dewan <span className="text-gradient">Pembina</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Bertugas memberikan arahan strategis dan pembinaan organisasi
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {/* Ketua */}
            <motion.div {...fadeInUp}>
              <Card className="glass-tech p-6 text-center mb-6 border-pri-red/10">
                <div className="corner-bracket corner-bracket-tl" />
                <div className="corner-bracket corner-bracket-tr" />
                <div className="corner-bracket corner-bracket-bl" />
                <div className="corner-bracket corner-bracket-br" />
                <CardContent className="p-0">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pri-red/20 to-pri-red/5 flex items-center justify-center mx-auto mb-4 ring-2 ring-pri-red/20">
                    <Shield className="h-8 w-8 text-pri-red" />
                  </div>
                  <p className="text-xs font-mono text-pri-red uppercase tracking-wider mb-1">
                    Ketua Dewan Pembina
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {dewanPembina.ketua}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>

            {/* Anggota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dewanPembina.anggota.map((nama, i) => (
                <motion.div
                  key={nama}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="glass-tech p-4 h-full">
                    <div className="corner-bracket corner-bracket-tl" />
                    <div className="corner-bracket corner-bracket-tr" />
                    <div className="corner-bracket corner-bracket-bl" />
                    <div className="corner-bracket corner-bracket-br" />
                    <CardContent className="p-0 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-pri-red/10 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-pri-red" />
                      </div>
                      <p className="text-sm text-white">{nama}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== DEWAN PAKAR ===== */}
      <section className="section-padding bg-pri-dark/50 relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.03]" />
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Award className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Pakar
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Dewan <span className="text-gradient">Pakar</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Memberikan masukan ilmiah, akademik, dan teknis terhadap pengembangan organisasi
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {/* Ketua */}
            <motion.div {...fadeInUp}>
              <Card className="glass-tech p-6 text-center mb-6 border-pri-red/10">
                <div className="corner-bracket corner-bracket-tl" />
                <div className="corner-bracket corner-bracket-tr" />
                <div className="corner-bracket corner-bracket-bl" />
                <div className="corner-bracket corner-bracket-br" />
                <CardContent className="p-0">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pri-red/20 to-pri-red/5 flex items-center justify-center mx-auto mb-4 ring-2 ring-pri-red/20">
                    <Award className="h-8 w-8 text-pri-red" />
                  </div>
                  <p className="text-xs font-mono text-pri-red uppercase tracking-wider mb-1">
                    Ketua Dewan Pakar
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {dewanPakar.ketua}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>

            {/* Anggota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dewanPakar.anggota.map((nama, i) => (
                <motion.div
                  key={nama}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="glass-tech p-4 h-full">
                    <div className="corner-bracket corner-bracket-tl" />
                    <div className="corner-bracket corner-bracket-tr" />
                    <div className="corner-bracket corner-bracket-bl" />
                    <div className="corner-bracket corner-bracket-br" />
                    <CardContent className="p-0 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-pri-red/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5 text-pri-red" />
                      </div>
                      <p className="text-sm text-white">{nama}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== KETUA UMUM & WAKIL ===== */}
      <section className="section-padding bg-pri-carbon relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Star className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Pimpinan
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ketua Umum & <span className="text-gradient">Wakil Ketua</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Kepengurusan Dewan Pimpinan Nasional PRO RI dipimpin oleh Ketua
              yang didampingi delapan Wakil Ketua
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Ketua */}
            <motion.div {...fadeInUp}>
              <Card className="glass-tech p-8 text-center mb-8 border-pri-red/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-pri-red/[0.03] to-transparent" />
                <div className="corner-bracket corner-bracket-tl" />
                <div className="corner-bracket corner-bracket-tr" />
                <div className="corner-bracket corner-bracket-bl" />
                <div className="corner-bracket corner-bracket-br" />
                <CardContent className="p-0 relative z-10">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-pri-red/30 to-pri-red/10 flex items-center justify-center mx-auto mb-4 ring-2 ring-pri-red/30 shadow-lg shadow-pri-red/10">
                    <Star className="h-10 w-10 text-pri-red" />
                  </div>
                  <p className="text-xs font-mono text-pri-red uppercase tracking-wider mb-1">
                    Ketua Umum
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {ketuaUmum.ketua}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>

            {/* Wakil Ketua */}
            <motion.div {...fadeInUp}>
              <p className="text-sm text-pri-silver text-center mb-4 font-mono">
                Wakil Ketua
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ketuaUmum.wakil.map((nama, i) => (
                <motion.div
                  key={nama}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="glass-tech p-4 h-full">
                    <div className="corner-bracket corner-bracket-tl" />
                    <div className="corner-bracket corner-bracket-tr" />
                    <div className="corner-bracket corner-bracket-bl" />
                    <div className="corner-bracket corner-bracket-br" />
                    <CardContent className="p-0 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-pri-red/10 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-pri-red" />
                      </div>
                      <p className="text-sm text-white">{nama}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEKRETARIAT ===== */}
      <section className="section-padding bg-pri-dark/50 relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.03]" />
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Briefcase className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Administrasi
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="text-gradient">Sekretariat</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Bidang administrasi organisasi
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {/* Sekretaris */}
            <motion.div {...fadeInUp}>
              <Card className="glass-tech p-6 text-center mb-6 border-pri-red/10">
                <div className="corner-bracket corner-bracket-tl" />
                <div className="corner-bracket corner-bracket-tr" />
                <div className="corner-bracket corner-bracket-bl" />
                <div className="corner-bracket corner-bracket-br" />
                <CardContent className="p-0">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pri-red/20 to-pri-red/5 flex items-center justify-center mx-auto mb-4 ring-2 ring-pri-red/20">
                    <Briefcase className="h-8 w-8 text-pri-red" />
                  </div>
                  <p className="text-xs font-mono text-pri-red uppercase tracking-wider mb-1">
                    Sekretaris
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {sekretariat.sekretaris}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>

            {/* Wakil Sekretaris */}
            <motion.div {...fadeInUp}>
              <p className="text-sm text-pri-silver text-center mb-4 font-mono">
                Wakil Sekretaris
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sekretariat.wakil.map((nama, i) => (
                <motion.div
                  key={nama}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="glass-tech p-4 h-full">
                    <div className="corner-bracket corner-bracket-tl" />
                    <div className="corner-bracket corner-bracket-tr" />
                    <div className="corner-bracket corner-bracket-bl" />
                    <div className="corner-bracket corner-bracket-br" />
                    <CardContent className="p-0 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-pri-red/10 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-pri-red" />
                      </div>
                      <p className="text-sm text-white">{nama}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENDAHARA ===== */}
      <section className="section-padding bg-pri-carbon relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Target className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Keuangan
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="text-gradient">Bendahara</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Pengelolaan keuangan organisasi
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {/* Bendahara */}
            <motion.div {...fadeInUp}>
              <Card className="glass-tech p-6 text-center mb-6 border-pri-red/10">
                <div className="corner-bracket corner-bracket-tl" />
                <div className="corner-bracket corner-bracket-tr" />
                <div className="corner-bracket corner-bracket-bl" />
                <div className="corner-bracket corner-bracket-br" />
                <CardContent className="p-0">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pri-red/20 to-pri-red/5 flex items-center justify-center mx-auto mb-4 ring-2 ring-pri-red/20">
                    <Target className="h-8 w-8 text-pri-red" />
                  </div>
                  <p className="text-xs font-mono text-pri-red uppercase tracking-wider mb-1">
                    Bendahara
                  </p>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {bendahara.bendahara}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>

            {/* Wakil Bendahara */}
            <motion.div {...fadeInUp}>
              <p className="text-sm text-pri-silver text-center mb-4 font-mono">
                Wakil Bendahara
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bendahara.wakil.map((nama, i) => (
                <motion.div
                  key={nama}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="glass-tech p-4 h-full">
                    <div className="corner-bracket corner-bracket-tl" />
                    <div className="corner-bracket corner-bracket-tr" />
                    <div className="corner-bracket corner-bracket-bl" />
                    <div className="corner-bracket corner-bracket-br" />
                    <CardContent className="p-0 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-pri-red/10 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-pri-red" />
                      </div>
                      <p className="text-sm text-white">{nama}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== DEPARTEMEN ===== */}
      <section className="section-padding bg-pri-dark/50 relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-[0.03]" />
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Cpu className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Departemen
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Departemen <span className="text-gradient">Strategis</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Menjalankan program kerja organisasi melalui berbagai departemen strategis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {departemen.map((dept, i) => {
              const DeptIcon = dept.icon;
              return (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="glass-tech p-5 h-full">
                    <div className="corner-bracket corner-bracket-tl" />
                    <div className="corner-bracket corner-bracket-tr" />
                    <div className="corner-bracket corner-bracket-bl" />
                    <div className="corner-bracket corner-bracket-br" />
                    <CardContent className="p-0">
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                        <div className="h-10 w-10 rounded-lg bg-pri-red/15 flex items-center justify-center">
                          <DeptIcon className="h-5 w-5 text-pri-red" />
                        </div>
                        <h3 className="text-sm font-semibold text-white leading-tight">
                          {dept.name}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {dept.anggota.map((anggota, j) => (
                          <li
                            key={j}
                            className="text-xs text-pri-silver flex items-start gap-2"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-pri-red/60 mt-1 shrink-0" />
                            {anggota}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {departemen.length > 0 && (
            <motion.div {...fadeInUp} className="text-center mt-8">
              <div className="glass inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs text-pri-silver font-mono border border-white/5">
                <Users className="h-3.5 w-3.5 text-pri-red" />
                Total{" "}
                {departemen.reduce((sum, d) => sum + d.anggota.length, 0)} anggota
                di {departemen.length} departemen
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== STRUKTUR ORGANISASI ===== */}
      <section className="section-padding bg-pri-carbon relative overflow-hidden">
        <div className="container-wide px-4 relative z-10">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <MapPin className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Jenjang
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Struktur <span className="text-gradient">Organisasi</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              PRO RI memiliki struktur organisasi berjenjang dari pusat hingga daerah
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {structureLevels.map((level, i) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-tech p-6 h-full">
                  <div className="corner-bracket corner-bracket-tl" />
                  <div className="corner-bracket corner-bracket-tr" />
                  <div className="corner-bracket corner-bracket-bl" />
                  <div className="corner-bracket corner-bracket-br" />
                  <CardContent className="p-0">
                    <span className="text-xs font-mono text-pri-red">
                      {level.level}
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1 mb-1">
                      {level.name}
                    </h3>
                    <p className="text-xs text-pri-silver flex items-center gap-1 mb-3">
                      <MapPin className="h-3 w-3" /> {level.scope}
                    </p>
                    <p className="text-sm text-pri-silver">{level.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-8 max-w-md mx-auto">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pri-red/50 to-transparent" />
            <span className="text-xs text-pri-silver font-mono">
              DPN → DPD → DPC
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pri-red/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section-padding bg-pri-dark/50 relative overflow-hidden">
        <div className="container-wide px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-xl mx-auto"
          >
            <Sparkles className="h-10 w-10 text-pri-red mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Informasi Lebih <span className="text-gradient">Lanjut</span>
            </h2>
            <p className="text-pri-silver mb-8">
              Hubungi kami untuk informasi lebih lanjut mengenai struktur
              kepengurusan dan organisasi PRO RI.
            </p>
            <Link href="/kontak">
              <Button
                size="lg"
                className="bg-pri-red hover:bg-red-700 text-white px-8"
              >
                Hubungi Kami <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
