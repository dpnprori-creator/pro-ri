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
      {/* ===== KPI STATS CARDS — Consistent height, robotic theme ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { icon: Users, label: 'Anggota Aktif', value: stats.totalMembers, bg: 'bg-pri-red/10', iconColor: 'text-pri-red', progress: stats.memberProgress, target: TARGET_MEMBERS, barColor: 'bg-pri-red', barBg: 'bg-pri-red' },
          { icon: Calendar, label: 'Event Aktif', value: stats.totalEvents, bg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
          { icon: Lightbulb, label: 'Inovasi', value: stats.totalInnovations, bg: 'bg-yellow-500/10', iconColor: 'text-yellow-400' },
          { icon: Award, label: 'Trainer', value: stats.totalTrainers, bg: 'bg-green-500/10', iconColor: 'text-green-400', progress: stats.trainerProgress, target: TARGET_TRAINERS, barColor: 'bg-green-500', barBg: 'bg-green-500' },
          { icon: TrendingUp, label: 'Mentor', value: stats.totalMentors, bg: 'bg-purple-500/10', iconColor: 'text-purple-400', progress: stats.mentorProgress, target: TARGET_MENTORS, barColor: 'bg-purple-500', barBg: 'bg-purple-500' },
          { icon: Globe, label: 'Provinsi', value: stats.totalProvinces, bg: 'bg-cyan-500/10', iconColor: 'text-cyan-400' },
        ].map((card, i) => {
          const Icon = card.icon;
          const hasProgress = 'progress' in card;
          const barColor = card.barBg || 'bg-pri-red';

          return (
            <motion.div key={i} variants={item} className="min-h-[120px]">
              <Card className="glass-tech h-full relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-0 bg-gradient-to-b from-pri-red/40 to-transparent group-hover:h-full transition-all duration-500" />
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-auto">
                    <div className={`relative h-9 w-9 rounded-lg ${card.bg} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                      <div className={`absolute inset-0 ${card.bg} opacity-10`} />
                      <Icon className={`h-4 w-4 relative z-10 ${card.iconColor}`} />
                      <div className="data-pulse-ring rounded-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-pri-silver font-mono uppercase tracking-wider truncate">
                        {card.label}
                      </p>
                      <p className="text-lg font-bold text-white tabular-nums tracking-tight">
                        {card.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {hasProgress && (
                    <div className="mt-auto pt-3">
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${card.barColor} progress-tech transition-all duration-1000`}
                          style={{ width: `${card.progress}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-pri-silver/60 mt-1.5 font-mono">
                        Target: {(card.target ?? 0).toLocaleString()} ({(card.progress ?? 0).toFixed(0)}%)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
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
