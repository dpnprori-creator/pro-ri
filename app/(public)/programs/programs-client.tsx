"use client";

import { useState } from "react";
import Image from "next/image";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RegistrationModal } from "@/components/features/registration-modal";

const iconMap: Record<string, any> = {
  GraduationCap, BookOpen, Bot, Trophy, Rocket, Store, Globe, Cpu,
};

const labelColors: Record<string, string> = {
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

interface ProgramItem {
  id: string;
  title: string;
  slug: string;
  icon: string;
  label: string;
  short_description: string | null;
  target_audience: string | null;
  features: string[] | null;
  image_url: string | null;
  max_participants: number | null;
  start_date: string | null;
}

interface PublicProgramsClientProps {
  programs: ProgramItem[];
  registrations: Record<string, string>;
  isLoggedIn: boolean;
}

const defaultImages = [
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
  "https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?w=600&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
];

export const ProgramsClient = PublicProgramsClient;

export function PublicProgramsClient({
  programs,
  registrations,
  isLoggedIn,
}: PublicProgramsClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);

  const openModal = (program: ProgramItem) => {
    setSelectedProgram(program);
    setModalOpen(true);
  };

  return (
    <section className="pt-32 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 circuit-pattern opacity-20" />
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
      <div className="scan-overlay" />
      {/* Floating particles */}
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
      <div className="orbit-ring" style={{ top: '10%', right: '5%', width: '80px', height: '80px', opacity: 0.04 }} />
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80"
          alt="Technology"
          fill
          className="object-cover opacity-5"
        />
      </div>

      <div className="container-wide px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
            <Globe className="h-4 w-4 text-pri-red" />
            <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
              Program Unggulan PRO RI
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Program Unggulan <span className="text-gradient">PRO RI</span>
          </h1>
          <p className="text-lg text-pri-silver">
            Program strategis untuk membangun sumber daya manusia Indonesia unggul di bidang robotika dan kecerdasan buatan
          </p>
        </div>

        {programs.length === 0 ? (
          <div className="text-center py-20">
            <Cpu className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
            <p className="text-pri-silver">Belum ada program tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, i) => {
              const Icon = iconMap[program.icon] || GraduationCap;
              const isRegistered = registrations[program.id] === "registered" || registrations[program.id] === "approved";
              const isOpen = program.label === "dibuka" || program.label === "akan datang" || !program.label;

              return (
                <Card key={program.id} className="glass-tech overflow-hidden group">
                  <div className="corner-bracket corner-bracket-tl" />
                  <div className="corner-bracket corner-bracket-tr" />
                  <div className="corner-bracket corner-bracket-bl" />
                  <div className="corner-bracket corner-bracket-br" />
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={program.image_url || defaultImages[i % defaultImages.length]}
                      alt={program.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon via-pri-carbon/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-pri-red/90 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <Badge className={`${labelColors[program.label] || labelColors.dibuka} border`}>
                        {labelLabels[program.label] || program.label}
                      </Badge>
                    </div>
                    {isRegistered && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="success" className="text-xs flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Terdaftar
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pri-red transition-colors">
                      {program.title}
                    </h3>
                    {program.short_description && (
                      <p className="text-sm text-pri-silver mb-3">{program.short_description}</p>
                    )}
                    {program.target_audience && (
                      <p className="text-xs font-mono text-pri-silver/60 uppercase tracking-wider mb-4 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Target: {program.target_audience}
                      </p>
                    )}
                    {program.features && program.features.length > 0 && (
                      <ul className="space-y-1.5 mb-6">
                        {program.features.slice(0, 4).map((f: string, idx: number) => (
                          <li key={idx} className="text-sm text-pri-silver flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-pri-red shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {isOpen && (
                        <Button
                          onClick={() => openModal(program)}
                          size="sm"
                          className={`flex-1 h-10 text-sm ${
                            isRegistered
                              ? "bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/20"
                              : "bg-pri-red hover:bg-red-700"
                          }`}
                        >
                          {isRegistered ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              Terdaftar
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              Daftar
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 text-sm border-white/10 text-pri-silver hover:text-white"
                        asChild
                      >
                        <a href={`/programs/${program.slug}`}>
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Detail
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {selectedProgram && (
        <RegistrationModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          type="program"
          id={selectedProgram.id}
          title={selectedProgram.title}
          icon={selectedProgram.icon}
          label={selectedProgram.label}
          isRegistered={registrations[selectedProgram.id] === "registered" || registrations[selectedProgram.id] === "approved"}
        />
      )}
    </section>
  );
}
