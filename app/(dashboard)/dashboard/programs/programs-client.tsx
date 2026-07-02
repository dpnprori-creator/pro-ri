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

interface DashboardProgramsClientProps {
  programs: ProgramItem[];
  registrations: Record<string, string>;
  memberId: string | null;
}

const defaultImages = [
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
  "https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?w=600&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
];

export function DashboardProgramsClient({
  programs,
  registrations,
}: DashboardProgramsClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);

  const openModal = (program: ProgramItem) => {
    setSelectedProgram(program);
    setModalOpen(true);
  };

  if (programs.length === 0) {
    return (
      <div className="text-center py-20">
        <Cpu className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
        <p className="text-pri-silver">Belum ada program tersedia</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((program, i) => {
          const Icon = iconMap[program.icon] || GraduationCap;
          const isRegistered = registrations[program.id] === "registered" || registrations[program.id] === "approved";
          const isOpen = program.label === "dibuka" || program.label === "akan datang" || !program.label;

          return (
            <Card key={program.id} className="glass-card-hover overflow-hidden group">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={program.image_url || defaultImages[i % defaultImages.length]}
                  alt={program.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon via-pri-carbon/50 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-pri-red/90 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <Badge className={`${labelColors[program.label] || labelColors.dibuka} border text-[10px]`}>
                    {labelLabels[program.label] || program.label}
                  </Badge>
                </div>
                {isRegistered && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="success" className="text-[10px] flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Terdaftar
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-white mb-1.5 line-clamp-2 group-hover:text-pri-red transition-colors">
                  {program.title}
                </h3>
                {program.short_description && (
                  <p className="text-xs text-pri-silver mb-3 line-clamp-2">{program.short_description}</p>
                )}
                <div className="flex items-center gap-3 text-[10px] text-pri-silver/60 mb-4">
                  {program.target_audience && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {program.target_audience}
                    </span>
                  )}
                  {program.max_participants && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Kuota: {program.max_participants}
                    </span>
                  )}
                  {program.start_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(program.start_date).toLocaleDateString("id-ID")}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {isOpen && (
                    <Button
                      onClick={() => openModal(program)}
                      size="sm"
                      className={`flex-1 h-9 text-xs ${
                        isRegistered
                          ? "bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/20"
                          : "bg-pri-red hover:bg-red-700"
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          Terdaftar
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          Daftar
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs border-white/10 text-pri-silver hover:text-white"
                    asChild
                  >
                    <a href={`/programs/${program.slug}`}>
                      <ArrowRight className="h-3.5 w-3.5 mr-1" />
                      Detail
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
    </>
  );
}
