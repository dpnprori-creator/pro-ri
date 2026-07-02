"use client";

import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Target,
  Calendar,
  Lightbulb,
  Newspaper,
  Award,
  MapIcon,
  Activity,
} from "lucide-react";
import { TARGET_MEMBERS, TARGET_TRAINERS, TARGET_MENTORS } from "@/lib/constants";
import { useCounterAnimation } from "@/hooks/use-counter-animation";
import type { CommandCenterStats } from "@/features/command-center/data";

interface KpiTrackerProps {
  stats: CommandCenterStats;
}

const kpiCards = [
  { label: "Total Members", value: "totalMembers", icon: Users, color: "text-blue-400", suffix: "" },
  { label: "Anggota Aktif", value: "activeMembers", icon: Activity, color: "text-green-400", suffix: "" },
  { label: "Trainer", value: "totalTrainers", icon: GraduationCap, color: "text-yellow-400", suffix: "" },
  { label: "Mentor", value: "totalMentors", icon: Target, color: "text-purple-400", suffix: "" },
  { label: "Events", value: "totalEvents", icon: Calendar, color: "text-pri-red", suffix: "" },
  { label: "Inovasi", value: "totalInnovations", icon: Lightbulb, color: "text-orange-400", suffix: "" },
  { label: "Berita", value: "totalNews", icon: Newspaper, color: "text-cyan-400", suffix: "" },
  { label: "Sertifikat", value: "totalCertificates", icon: Award, color: "text-pri-silver", suffix: "" },
  { label: "Provinsi", value: "totalProvinces", icon: MapIcon, color: "text-emerald-400", suffix: "" },
] as const;

const targets = [
  {
    label: "Target 10.000 Anggota",
    current: (s: CommandCenterStats) => s.totalMembers,
    progress: (s: CommandCenterStats) => s.memberProgress,
    target: TARGET_MEMBERS,
  },
  {
    label: "Target 500 Trainer",
    current: (s: CommandCenterStats) => s.totalTrainers,
    progress: (s: CommandCenterStats) => s.trainerProgress,
    target: TARGET_TRAINERS,
  },
  {
    label: "Target 200 Mentor",
    current: (s: CommandCenterStats) => s.totalMentors,
    progress: (s: CommandCenterStats) => s.mentorProgress,
    target: TARGET_MENTORS,
  },
];

function AnimatedValue({ value, enabled = true }: { value: number; enabled?: boolean }) {
  const animated = useCounterAnimation({ end: value, duration: 2000, enabled });
  return <>{animated.toLocaleString()}</>;
}

export function KpiCards({ stats }: KpiTrackerProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {kpiCards.map((kpi, i) => {
        const value = stats[kpi.value as keyof CommandCenterStats] as number;
        const Icon = kpi.icon;
        return (
          <motion.div
            key={kpi.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="glass-tech rounded-xl p-4 border border-white/5 overflow-hidden"
          >
            <div className="corner-bracket corner-bracket-tl" />
            <div className="corner-bracket corner-bracket-tr" />
            <div className="corner-bracket corner-bracket-bl" />
            <div className="corner-bracket corner-bracket-br" />
            <div className="flex items-center justify-between mb-2 relative">
              <span className="text-xs text-pri-silver font-medium">{kpi.label}</span>
              <div className="relative">
                <Icon className={`h-4 w-4 ${kpi.color}`} />
                <div className="data-pulse-ring" style={{ width: "24px", height: "24px", inset: "-4px" }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white font-mono relative">
              <AnimatedValue value={value} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function TargetProgress({ stats }: KpiTrackerProps) {
  return (
    <div className="space-y-6">
      {targets.map((target) => {
        const current = target.current(stats);
        const progress = target.progress(stats);
        return (
          <div key={target.label}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-pri-silver font-medium">{target.label}</span>
              <span className="text-white font-mono text-xs">
                {current.toLocaleString()} / {target.target.toLocaleString()}
                <span className="text-pri-silver ml-1">({progress.toFixed(1)}%)</span>
              </span>
            </div>
            <div className="h-4 rounded-full bg-pri-dark overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-pri-red to-red-400 relative"
              >
                <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full" />
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
