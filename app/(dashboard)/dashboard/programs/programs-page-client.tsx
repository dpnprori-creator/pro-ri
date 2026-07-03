"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  GraduationCap,
  BookOpen,
  Bot,
  Trophy,
  Rocket,
  Store,
  CheckCircle,
  Clock,
  Filter,
  Users,
  ArrowRight,
  BookMarked,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { registerProgram } from "@/features/registration-actions";
import { toast } from "sonner";

const iconMap: Record<string, any> = {
  GraduationCap, BookOpen, Bot, Trophy, Rocket, Store,
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

const programEmojis: Record<string, string> = {
  academy: "🎓",
  mentor: "🧑‍🏫",
  trainer: "🎯",
  innovation: "💡",
  research: "🔬",
  community: "🌐",
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
  sort_order: number;
  max_participants: number | null;
  start_date: string | null;
}

interface RegistrationData {
  id: string;
  status: string;
  created_at: string;
  program_id: {
    id: string;
    title: string;
    slug: string;
    icon: string;
    label: string;
    status: string;
  };
}

interface ProgramsPageClientProps {
  programs: ProgramItem[];
  registrations: Record<string, { status: string; id: string }>;
  myRegistrations: RegistrationData[];
  statusCounts: Record<string, number>;
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

export function ProgramsPageClient({
  programs,
  registrations,
  myRegistrations,
  statusCounts,
  isLoggedIn,
}: ProgramsPageClientProps) {
  const router = useRouter();
  const [view, setView] = useState<"all" | "my">("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRegister = async (programId: string) => {
    setLoadingId(programId);
    const result = await registerProgram(programId);
    setLoadingId(null);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.success || "Berhasil mendaftar program!");
      router.refresh();
    }
  };

  const displayedPrograms = view === "my"
    ? programs.filter((p) => registrations[p.id])
    : programs;

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={view === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("all")}
          className={`text-xs ${view === "all" ? "bg-pri-red" : "border-white/10 text-pri-silver"}`}
        >
          <Filter className="h-3 w-3 mr-1" />
          Semua Program ({programs.length})
        </Button>
        <Button
          variant={view === "my" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("my")}
          className={`text-xs ${view === "my" ? "bg-pri-red" : "border-white/10 text-pri-silver"}`}
        >
          <BookMarked className="h-3 w-3 mr-1" />
          Program Saya ({myRegistrations.length})
        </Button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {view === "my" && myRegistrations.length === 0 ? (
          <motion.div
            key="empty-my"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 glass-card rounded-xl"
          >
            <BookOpen className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
            <p className="text-pri-silver font-medium mb-2">Belum Ada Program</p>
            <p className="text-xs text-pri-silver/60 max-w-sm mx-auto">
              Anda belum mendaftar program apapun. Beralih ke &quot;Semua Program&quot; untuk melihat dan mendaftar.
            </p>
          </motion.div>
        ) : view === "my" ? (
          <motion.div
            key="my-programs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {myRegistrations.map((reg) => {
              const program = programs.find((p) => p.id === reg.program_id.id);
              const emoji = programEmojis[reg.program_id.icon] || "📋";
              const statusColor = {
                registered: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                active: "text-green-400 bg-green-500/10 border-green-500/20",
                completed: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                cancelled: "text-red-400 bg-red-500/10 border-red-500/20",
              }[reg.status] || "text-pri-silver bg-white/5 border-white/10";

              const statusLabel = {
                registered: "Terdaftar",
                active: "Aktif",
                completed: "Selesai",
                cancelled: "Dibatalkan",
              }[reg.status] || reg.status;

              return (
                <motion.div
                  key={reg.id}
                  layout
                  className="glass-card-hover p-4 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pri-red/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0 border border-white/5">
                      {emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate group-hover:text-pri-red transition-colors">
                        {reg.program_id.title}
                      </h3>
                      <p className="text-[10px] text-pri-silver/60 mt-0.5 font-mono uppercase tracking-wider">
                        {program?.short_description?.slice(0, 60) || reg.program_id.icon}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColor}`}>
                          {reg.status === "registered" ? <Clock className="h-3 w-3" /> :
                           reg.status === "active" ? <CheckCircle className="h-3 w-3" /> :
                           <CheckCircle className="h-3 w-3" />}
                          {statusLabel}
                        </span>
                      </div>
                      <p className="text-[10px] text-pri-silver/40 mt-1 font-mono">
                        {new Date(reg.created_at).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="all-programs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {programs.map((program, i) => {
              const Icon = iconMap[program.icon] || GraduationCap;
              const existingReg = registrations[program.id];
              const isRegistered = !!existingReg;
              const isOpen = program.label === "dibuka" || program.label === "akan datang" || !program.label;

              return (
                <Card key={program.id} className="glass-tech overflow-hidden group">
                  <div className="corner-bracket corner-bracket-tl" />
                  <div className="corner-bracket corner-bracket-tr" />
                  <div className="corner-bracket corner-bracket-bl" />
                  <div className="corner-bracket corner-bracket-br" />
                  {/* Image Banner */}
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={program.image_url || defaultImages[i % defaultImages.length]}
                      alt={program.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon via-pri-carbon/60 to-transparent" />
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
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pri-red transition-colors">
                      {program.title}
                    </h3>
                    {program.short_description && (
                      <p className="text-sm text-pri-silver mb-3 line-clamp-2">{program.short_description}</p>
                    )}
                    {program.target_audience && (
                      <p className="text-xs font-mono text-pri-silver/60 uppercase tracking-wider mb-3 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Target: {program.target_audience}
                      </p>
                    )}
                    {program.features && program.features.length > 0 && (
                      <ul className="space-y-1 mb-4">
                        {program.features.slice(0, 4).map((f: string, idx: number) => (
                          <li key={idx} className="text-xs text-pri-silver flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-pri-red shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {isOpen && !isRegistered && (
                        <Button
                          onClick={() => handleRegister(program.id)}
                          disabled={loadingId === program.id}
                          size="sm"
                          className="flex-1 h-10 text-sm bg-pri-red hover:bg-red-700"
                        >
                          {loadingId === program.id ? (
                            <span className="flex items-center gap-1">
                              <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                              Mendaftar...
                            </span>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              Daftar
                            </>
                          )}
                        </Button>
                      )}
                      {isRegistered && (
                        <Button
                          disabled
                          size="sm"
                          className="flex-1 h-10 text-sm bg-green-600/20 text-green-400 cursor-default"
                        >
                          <CheckCircle className="h-4 w-4 mr-1.5" />
                          Terdaftar
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
