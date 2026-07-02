"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Target, Eye, Shield, Globe, Cpu, Quote, ArrowRight, MapPin, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const milestones = [
  { date: "6 Juni 2026", event: "Peluncuran PRO RI oleh PRI" },
  { date: "13 Juni 2026", event: "Pelantikan DPN PRO RI di DPP PRI Jakarta" },
  { date: "2026 (Target)", event: "Pembentukan DPD di 38 provinsi" },
];

const values = [
  {
    icon: Target,
    title: "Misi",
    description: "Menyelenggarakan pendidikan robotika merata, mendorong integrasi kurikulum robotika nasional, mengembangkan inovasi teknologi tepat guna, membangun ekosistem robotika nasional, dan menjembatani kolaborasi pemerintah-industri-akademisi-komunitas.",
  },
  {
    icon: Eye,
    title: "Visi",
    description: "Terwujudnya kedaulatan teknologi Indonesia melalui pengembangan sumber daya manusia yang unggul dalam bidang robotika dan kecerdasan buatan, guna mempercepat tercapainya Indonesia Emas 2045.",
  },
  {
    icon: Shield,
    title: "Komitmen",
    description: "Menyediakan akses pendidikan, pelatihan, dan pengembangan teknologi berkualitas untuk seluruh rakyat Indonesia, dari Sabang sampai Merauke.",
  },
  {
    icon: Globe,
    title: "Jangkauan",
    description: "Hadir di 38 provinsi Indonesia dengan struktur organisasi berjenjang: DPN (Pusat), DPD (Provinsi), dan DPC (Kabupaten/Kota).",
  },
];

const roadmap = [
  { year: "2026", phase: "Pendirian & Konsolidasi", items: ["Peluncuran PRO RI", "Pembentukan DPN, DPD, DPC", "Perumusan program kerja"] },
  { year: "2027–2028", phase: "Ekspansi Nasional", items: ["Sekolah Robotika Rakyat di 38 provinsi", "Robotika Masuk Sekolah di 500+ sekolah", "Kompetisi Robotika Nasional perdana"] },
  { year: "2029–2030", phase: "Penguatan & Dampak", items: ["Akademi AI berjalan penuh", "100+ startup melalui Inkubator Inovasi", "Robotika untuk UMKM di 10.000+ UMKM"] },
  { year: "2031–2045", phase: "Menuju Indonesia Emas", items: ["Ekosistem robotika nasional mandiri", "Indonesia sebagai kekuatan teknologi Asia"] },
];

const sisterOrgs = ["MURI", "PERI", "LBH RI", "AMRI", "PATRIOT RI", "PERISAI RI Kristiani"];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=80"
            alt="AI Technology"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-pri-carbon via-pri-carbon/95 to-pri-carbon" />
        </div>
        <div className="absolute inset-0 circuit-pattern opacity-30" />
        <div className="hero-scan-line" />
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
        <div className="orbit-ring" style={{ top: '25%', right: '10%', width: '150px', height: '150px', opacity: 0.06 }} />
        <div className="orbit-ring orbit-ring-2" style={{ bottom: '15%', left: '5%', width: '100px', height: '100px', opacity: 0.04 }} />

        <div className="container-wide px-4 relative z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
              <Cpu className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Pusat Robotika Rakyat Indonesia
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Tentang{" "}
              <span className="text-gradient">PRO RI</span>
            </h1>
            <p className="text-lg text-pri-silver leading-relaxed">
              Pelajari sejarah, visi, misi, tujuan, dan peta jalan Pusat Robotika Rakyat Indonesia (PRO RI) — gerakan robotika nasional untuk kedaulatan teknologi Indonesia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sejarah PRO RI */}
      <section className="section-padding bg-pri-carbon relative">
        <div className="absolute inset-0 circuit-pattern opacity-10" />
        <div className="container-wide px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <Calendar className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Sejarah</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Sejarah Berdirinya <span className="text-gradient">PRO RI</span>
            </h2>
            <p className="text-base md:text-lg text-pri-silver leading-relaxed mb-8">
              Pada tanggal <strong className="text-white">6 Juni 2026</strong>, PRI (Perkumpulan Robotika Indonesia) secara resmi meluncurkan <strong className="text-white">Pusat Robotika Rakyat Indonesia (PRO RI)</strong> sebagai gerakan nasional untuk mempercepat penguasaan teknologi robotika dan kecerdasan buatan di Indonesia.
            </p>

            {/* Quote Nazaruddin */}
            <div className="glass rounded-xl p-6 md:p-8 mb-6 border-l-4 border-pri-red">
              <Quote className="h-8 w-8 text-pri-red mb-4 opacity-50" />
              <p className="text-base md:text-lg text-white italic leading-relaxed mb-4">
                "Kedaulatan teknologi adalah harga mati. Bangsa yang tidak menguasai teknologi akan terus bergantung pada bangsa lain. PRO RI adalah wadah bagi seluruh rakyat Indonesia untuk bersama-sama membangun kemandirian teknologi."
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
            </div>

            {/* Quote Adityo Handoko */}
            <div className="glass rounded-xl p-6 md:p-8 mb-8 border-l-4 border-pri-red">
              <Quote className="h-8 w-8 text-pri-red mb-4 opacity-50" />
              <p className="text-base md:text-lg text-white italic leading-relaxed mb-4">
                "Kami ingin memastikan bahwa pendidikan robotika tidak hanya dinikmati oleh segelintir orang di kota-kota besar, tetapi dapat menjangkau seluruh lapisan masyarakat — dari Sabang sampai Merauke."
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
            </div>

            {/* Timeline */}
            <h3 className="text-xl font-semibold text-white mb-4">Milestone</h3>
            <div className="space-y-4">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-pri-red mt-1.5" />
                    {i < milestones.length - 1 && <div className="w-px h-8 bg-white/10" />}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-pri-red">{m.date}</span>
                    <p className="text-sm text-white">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visi Misi Tujuan */}
      <section className="section-padding bg-pri-dark/50 relative">
        <div className="container-wide px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Visi, Misi & <span className="text-gradient">Komitmen</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card-hover p-6 h-full">
                  <CardContent className="p-0">
                    <v.icon className="h-8 w-8 text-pri-red mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">{v.title}</h3>
                    <p className="text-sm text-pri-silver leading-relaxed">{v.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tujuan Organisasi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Tujuan <span className="text-gradient">Organisasi</span>
            </h2>
            <div className="space-y-4">
              {[
                { num: "01", title: "Akselerasi Penguasaan Teknologi", desc: "Mempercepat penguasaan teknologi robotika dan AI di kalangan generasi muda Indonesia" },
                { num: "02", title: "Pemerataan Akses", desc: "Memastikan akses pendidikan robotika merata hingga ke daerah terpencil" },
                { num: "03", title: "Inovasi Tepat Guna", desc: "Mengembangkan solusi robotika yang aplikatif untuk pertanian, UMKM, dan layanan publik" },
                { num: "04", title: "Pengembangan Talenta", desc: "Mencetak talenta robotika nasional yang siap bersaing di tingkat global" },
                { num: "05", title: "Kolaborasi Nasional", desc: "Menjadi katalisator kolaborasi antara pemerintah, industri, akademisi, dan komunitas robotika" },
              ].map((item, i) => (
                <div key={i} className="glass rounded-xl p-5 flex items-start gap-4">
                  <span className="text-2xl font-bold text-pri-red font-mono shrink-0">{item.num}</span>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-pri-silver">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Peta Jalan */}
      <section className="section-padding bg-pri-carbon relative">
        <div className="absolute inset-0 circuit-pattern opacity-10" />
        <div className="container-wide px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Peta Jalan <span className="text-gradient">PRO RI</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Perjalanan PRO RI menuju Indonesia Emas 2045
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {roadmap.map((phase, i) => (
              <motion.div
                key={phase.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card-hover p-6 h-full">
                  <CardContent className="p-0">
                    <span className="text-xs font-mono text-pri-red">{phase.year}</span>
                    <h3 className="text-base font-semibold text-white mt-1 mb-3">{phase.phase}</h3>
                    <ul className="space-y-2">
                      {phase.items.map((item, j) => (
                        <li key={j} className="text-sm text-pri-silver flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-pri-red mt-1.5 shrink-0" />
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
      </section>

      {/* Filosofi Logo */}
      <section className="section-padding bg-pri-dark/50 relative">
        <div className="container-wide px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              Filosofi <span className="text-gradient">Logo</span>
            </h2>
            <p className="text-base text-pri-silver leading-relaxed mb-8 text-center">
              Logo PRO RI dirancang dengan filosofi yang merepresentasikan semangat gerakan robotika rakyat:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Cpu, label: "Bentuk Geometris", desc: "Melambangkan presisi, teknologi, dan kecerdasan buatan" },
                { icon: Globe, label: "Warna Merah", desc: "Semangat nasionalisme dan keberanian" },
                { icon: Target, label: "Elemen Roda Gigi", desc: "Perputaran inovasi dan industri" },
                { icon: Users, label: "Siluet Manusia", desc: "Berpusat pada pengembangan SDM" },
              ].map((item, i) => (
                <div key={i} className="glass rounded-xl p-4 flex items-start gap-3">
                  <item.icon className="h-5 w-5 text-pri-red mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">{item.label}</h3>
                    <p className="text-xs text-pri-silver mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sister Organizations */}
      <section className="section-padding bg-pri-carbon relative">
        <div className="container-wide px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Organisasi di Bawah <span className="text-gradient">PRI</span>
            </h2>
            <p className="text-pri-silver mb-8">
              PRO RI adalah bagian dari ekosistem organisasi PRI (Perkumpulan Robotika Indonesia) bersama dengan:
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {sisterOrgs.map((org) => (
                <span key={org} className="glass rounded-full px-5 py-2 text-sm text-white font-mono">
                  {org}
                </span>
              ))}
            </div>
            <Link href="/register">
              <Button size="lg" className="bg-pri-red hover:bg-red-700 text-white px-8">
                Bergabung dengan PRO RI <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
