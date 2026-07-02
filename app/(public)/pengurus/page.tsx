"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, ArrowRight, MapPin, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const leadership = [
  { position: "Ketua", name: "Adityo Handoko", role: "Ketua PRO RI" },
  { position: "Sekretaris", name: "Muhamad Ied", role: "Sekretaris PRO RI" },
  { position: "Bendahara", name: "—", role: "(akan diumumkan)" },
];

const structureLevels = [
  { level: "DPN", name: "Dewan Pimpinan Nasional", scope: "Tingkat Pusat", desc: "Mengkoordinasikan kebijakan dan program nasional PRO RI" },
  { level: "DPD", name: "Dewan Pimpinan Daerah", scope: "Tingkat Provinsi", desc: "Mengelola dan menjalankan program PRO RI di masing-masing provinsi" },
  { level: "DPC", name: "Dewan Pimpinan Cabang", scope: "Tingkat Kota/Kabupaten", desc: "Pelaksana program PRO RI di tingkat akar rumput" },
];

export default function PengurusPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
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
                top: '100%',
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${12 + Math.random() * 12}s`,
              }}
            />
          ))}
        </div>
        <div className="orbit-ring" style={{ top: '20%', right: '10%', width: '120px', height: '120px', opacity: 0.05 }} />
        <div className="orbit-ring orbit-ring-2" style={{ bottom: '30%', left: '8%', width: '70px', height: '70px', opacity: 0.03 }} />

        <div className="container-wide px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
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
            <p className="text-lg text-pri-silver leading-relaxed max-w-2xl mx-auto">
              Struktur kepemimpinan Pusat Robotika Rakyat Indonesia — Dewan Pimpinan Nasional (DPN), Dewan Pimpinan Daerah (DPD), dan Dewan Pimpinan Cabang (DPC).
            </p>
          </motion.div>
        </div>
      </section>

      {/* DPN Leadership */}
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
              Dewan Pimpinan <span className="text-gradient">Nasional</span>
            </h2>
            <p className="text-pri-silver max-w-xl mx-auto">
              Kepemimpinan PRO RI tingkat pusat
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {leadership.map((person, i) => (
              <motion.div
                key={person.position}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >                  <Card className="glass-tech p-6 text-center h-full">
                      <div className="corner-bracket corner-bracket-tl" />
                      <div className="corner-bracket corner-bracket-tr" />
                      <div className="corner-bracket corner-bracket-bl" />
                      <div className="corner-bracket corner-bracket-br" />
                  <CardContent className="p-0">
                    <div className="h-16 w-16 rounded-full bg-pri-red/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-pri-red" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{person.name}</h3>
                    <p className="text-xs font-mono text-pri-red uppercase tracking-wider mb-2">{person.position}</p>
                    <p className="text-sm text-pri-silver">{person.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="section-padding bg-pri-dark/50 relative">
        <div className="container-wide px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
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
                    <span className="text-xs font-mono text-pri-red">{level.level}</span>
                    <h3 className="text-base font-semibold text-white mt-1 mb-1">{level.name}</h3>
                    <p className="text-xs text-pri-silver flex items-center gap-1 mb-3">
                      <MapPin className="h-3 w-3" /> {level.scope}
                    </p>
                    <p className="text-sm text-pri-silver">{level.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Visual connector between levels */}
          <div className="flex items-center justify-center gap-2 mt-8 max-w-md mx-auto">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pri-red/50 to-transparent" />
            <span className="text-xs text-pri-silver font-mono">DPN → DPD → DPC</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pri-red/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-pri-carbon relative">
        <div className="container-wide px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Informasi Lebih <span className="text-gradient">Lanjut</span>
            </h2>
            <p className="text-pri-silver mb-8">
              Hubungi kami untuk informasi lebih lanjut mengenai struktur kepengurusan dan organisasi PRO RI.
            </p>
            <Link href="/kontak">
              <Button size="lg" className="bg-pri-red hover:bg-red-700 text-white px-8">
                Hubungi Kami <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
