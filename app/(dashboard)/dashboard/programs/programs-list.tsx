"use client";

import { useState } from "react";
import { Calendar, BookOpen, BadgeCheck, XCircle, Clock, CheckCircle2, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ProgramData {
  id: string;
  title: string;
  slug: string;
  icon: string;
  label: string;
  status: string;
}

interface RegistrationItem {
  id: string;
  status: string;
  created_at: string;
  program_id: ProgramData;
}

interface ProgramsListProps {
  registrations: RegistrationItem[];
  statusCounts: {
    registered: number;
    active: number;
    completed: number;
    cancelled: number;
  };
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  registered: {
    label: "Terdaftar",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  active: {
    label: "Aktif",
    color: "text-green-400 bg-green-500/10 border-green-500/20",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  completed: {
    label: "Selesai",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    icon: <BadgeCheck className="h-3.5 w-3.5" />,
  },
  cancelled: {
    label: "Dibatalkan",
    color: "text-red-400 bg-red-500/10 border-red-500/20",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

const programIcons: Record<string, string> = {
  academy: "🎓",
  mentor: "🧑‍🏫",
  trainer: "🎯",
  innovation: "💡",
  research: "🔬",
  community: "🌐",
};

export function ProgramsList({ registrations, statusCounts }: ProgramsListProps) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all"
    ? registrations
    : registrations.filter((r) => r.status === filter);

  if (registrations.length === 0) {
    return (
      <div className="text-center py-20 glass-card rounded-xl">
        <BookOpen className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
        <p className="text-pri-silver font-medium mb-2">Belum Ada Program</p>
        <p className="text-xs text-pri-silver/60 max-w-sm mx-auto">
          Anda belum mendaftar program apapun. Jelajahi program-progam unggulan PRO RI dan daftarkan diri Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={`text-xs ${filter === "all" ? "bg-pri-red" : "border-white/10 text-pri-silver"}`}
        >
          <Filter className="h-3 w-3 mr-1" />
          Semua ({registrations.length})
        </Button>
        {Object.entries(statusCounts).map(([key, count]) => {
          if (count === 0) return null;
          const config = statusConfig[key];
          return (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(key)}
              className={`text-xs ${filter === key ? "bg-pri-red" : "border-white/10 text-pri-silver"}`}
            >
              {config?.icon}
              <span className="ml-1">{config?.label} ({count})</span>
            </Button>
          );
        })}
      </div>

      {/* Program Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {filtered.map((reg) => {
            const statConfig = statusConfig[reg.status] || statusConfig.registered;
            const icon = programIcons[reg.program_id.icon] || "📋";

            return (
              <motion.div
                key={reg.id}
                layout
                className="glass-card-hover p-4 relative overflow-hidden group"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pri-red/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0 border border-white/5">
                    {icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-pri-red transition-colors">
                      {reg.program_id.title}
                    </h3>

                    {/* Label */}
                    <p className="text-[10px] text-pri-silver/60 mt-0.5 font-mono uppercase tracking-wider">
                      {reg.program_id.label || reg.program_id.icon}
                    </p>

                    {/* Status + Date */}
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statConfig.color}`}
                      >
                        {statConfig.icon}
                        {statConfig.label}
                      </span>
                    </div>

                    <p className="text-[10px] text-pri-silver/40 mt-1 font-mono">
                      {new Date(reg.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-pri-silver text-sm">
          Tidak ada program dengan status ini
        </div>
      )}
    </div>
  );
}
