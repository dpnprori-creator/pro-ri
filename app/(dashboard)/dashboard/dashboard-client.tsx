"use client";

import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Lightbulb,
  Map,
  Target,
  Award,
  Zap,
  TrendingUp,
  BookOpen,
  CreditCard,
  ArrowRight,
  Activity,
  Globe,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TARGET_MEMBERS, TARGET_TRAINERS, TARGET_MENTORS } from "@/lib/constants";

interface DashboardStats {
  totalMembers: number;
  totalEvents: number;
  totalInnovations: number;
  totalTrainers: number;
  totalMentors: number;
  totalProvinces: number;
  memberProgress: number;
  trainerProgress: number;
  mentorProgress: number;
}

interface MyStats {
  innovations: number;
  certificates: number;
  events: number;
  programs: number;
  pendingCards: number;
}

interface DashboardMember {
  id: string;
  full_name: string;
  member_id: string;
  occupation: string | null;
  province_name: string | null;
  role_name: string;
}

interface DashboardClientProps {
  stats: DashboardStats;
  myStats: MyStats;
  member: DashboardMember;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function DashboardClient({ stats, myStats, member }: DashboardClientProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ===== KPI STATS CARDS ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <motion.div variants={item}>
          <Card className="glass-tech">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 rounded-lg bg-pri-red/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-4 w-4 text-pri-red" />
                  <div className="data-pulse-ring rounded-lg" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-pri-silver font-mono uppercase tracking-wider truncate">
                    Anggota Aktif
                  </p>
                  <p className="text-lg font-bold text-white tabular-nums">
                    {stats.totalMembers.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-pri-red progress-tech"
                  style={{ width: `${stats.memberProgress}%` }}
                />
              </div>
              <p className="text-[9px] text-pri-silver/60 mt-1 font-mono">
                Target: {TARGET_MEMBERS.toLocaleString()} ({stats.memberProgress.toFixed(0)}%)
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-tech">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <div className="data-pulse-ring rounded-lg" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-pri-silver font-mono uppercase tracking-wider truncate">
                    Event Aktif
                  </p>
                  <p className="text-lg font-bold text-white tabular-nums">
                    {stats.totalEvents.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-tech">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-4 w-4 text-yellow-400" />
                  <div className="data-pulse-ring rounded-lg" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-pri-silver font-mono uppercase tracking-wider truncate">
                    Inovasi
                  </p>
                  <p className="text-lg font-bold text-white tabular-nums">
                    {stats.totalInnovations.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-tech">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Award className="h-4 w-4 text-green-400" />
                  <div className="data-pulse-ring rounded-lg" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-pri-silver font-mono uppercase tracking-wider truncate">
                    Trainer
                  </p>
                  <p className="text-lg font-bold text-white tabular-nums">
                    {stats.totalTrainers.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 progress-tech"
                  style={{ width: `${stats.trainerProgress}%` }}
                />
              </div>
              <p className="text-[9px] text-pri-silver/60 mt-1 font-mono">
                Target: {TARGET_TRAINERS.toLocaleString()} ({stats.trainerProgress.toFixed(0)}%)
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-tech">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  <div className="data-pulse-ring rounded-lg" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-pri-silver font-mono uppercase tracking-wider truncate">
                    Mentor
                  </p>
                  <p className="text-lg font-bold text-white tabular-nums">
                    {stats.totalMentors.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500 progress-tech"
                  style={{ width: `${stats.mentorProgress}%` }}
                />
              </div>
              <p className="text-[9px] text-pri-silver/60 mt-1 font-mono">
                Target: {TARGET_MENTORS.toLocaleString()} ({stats.mentorProgress.toFixed(0)}%)
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-tech">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-4 w-4 text-cyan-400" />
                  <div className="data-pulse-ring rounded-lg" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-pri-silver font-mono uppercase tracking-wider truncate">
                    Provinsi
                  </p>
                  <p className="text-lg font-bold text-white tabular-nums">
                    {stats.totalProvinces.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ===== PERSONAL STATS + QUICK ACTIONS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Stats */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-pri-red" />
              <h2 className="text-sm font-semibold text-white">Aktivitas Saya</h2>
            </div>
            <Badge variant="outline" className="text-[10px] border-white/10 text-pri-silver font-mono">
              {member.member_id}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="h-8 w-8 rounded-full bg-pri-red/10 flex items-center justify-center mx-auto mb-2">
                  <Lightbulb className="h-4 w-4 text-pri-red" />
                </div>
                <p className="text-lg font-bold text-white tabular-nums">{myStats.innovations}</p>
                <p className="text-[10px] text-pri-silver font-mono">Inovasi</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                  <Award className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-lg font-bold text-white tabular-nums">{myStats.certificates}</p>
                <p className="text-[10px] text-pri-silver font-mono">Sertifikat</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-lg font-bold text-white tabular-nums">{myStats.events}</p>
                <p className="text-[10px] text-pri-silver font-mono">Event</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="h-4 w-4 text-purple-400" />
                </div>
                <p className="text-lg font-bold text-white tabular-nums">{myStats.programs}</p>
                <p className="text-[10px] text-pri-silver font-mono">Program</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-pri-red" />
            <h2 className="text-sm font-semibold text-white">Aksi Cepat</h2>
          </div>

          <div className="space-y-2">
            <Link href="/dashboard/innovations/new">
              <Button
                variant="outline"
                className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Buat Inovasi
                </span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </Link>
            <Link href="/my-member-card">
              <Button
                variant="outline"
                className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group"
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5" />
                  {myStats.pendingCards > 0 ? `Kartu Anggota (${myStats.pendingCards} pending)` : "Kartu Anggota"}
                </span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </Link>
            <Link href="/dashboard/events">
              <Button
                variant="outline"
                className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  Event Saya
                </span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </Link>
            {member.role_name === "admin" || member.role_name === "super_admin" ? (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="w-full justify-between border-purple-500/20 text-purple-400 hover:text-purple-300 hover:border-purple-500/40 group"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5" />
                    Panel Admin
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard/national-map">
                <Button
                  variant="outline"
                  className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group"
                >
                  <span className="flex items-center gap-2">
                    <Map className="h-3.5 w-3.5" />
                    Peta Nasional
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* ===== ROLE BADGE ===== */}
      <motion.div variants={item}>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full bg-pri-red/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-pri-red" />
                <div className="data-pulse-ring rounded-full" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">{member.full_name}</p>
                <p className="text-[10px] text-pri-silver font-mono">
                  {member.role_name === "admin" || member.role_name === "super_admin" ? (
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-purple-400" />
                      {member.role_name === "super_admin" ? "Super Admin" : "Admin"}
                    </span>
                  ) : (
                    member.role_name?.charAt(0).toUpperCase() + member.role_name?.slice(1) || "Member"
                  )}
                  {member.province_name && (
                    <>
                      <span className="mx-1.5 opacity-30">|</span>
                      {member.province_name}
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
                <span className="status-dot" />
                ACTIVE
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
