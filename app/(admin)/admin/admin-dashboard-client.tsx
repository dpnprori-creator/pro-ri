"use client";

import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Lightbulb,
  Award,
  TrendingUp,
  Globe,
  Bell,
  MessageSquare,
  UserCheck,
  Shield,
  BarChart3,
  ArrowRight,
  Zap,
  LayoutDashboard,
  CreditCard,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AdminStats {
  totalMembers: number;
  totalEvents: number;
  totalInnovations: number;
  totalCertificates: number;
  totalTrainers: number;
  totalMentors: number;
  totalProvinces: number;
  activeMembers: number;
  pendingVerifications: number;
  pendingMemberCards: number;
  unreadMessages: number;
}

interface AdminRecentMember {
  id: string;
  full_name: string;
  email: string;
  member_id: string;
  created_at: string;
  role_id: { name: string } | null;
}

interface AdminDashboardClientProps {
  stats: AdminStats;
  recentMembers: AdminRecentMember[];
  memberName: string;
  memberRole: string;
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

export function AdminDashboardClient({ stats, recentMembers, memberName, memberRole }: AdminDashboardClientProps) {
  const isSuperAdmin = memberRole === "super_admin";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ===== KPI STATS CARDS ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { icon: Users, label: 'Total Anggota', value: stats.totalMembers, bg: 'bg-pri-red/10', iconColor: 'text-pri-red' },
          { icon: Users, label: 'Anggota Aktif', value: stats.activeMembers, bg: 'bg-green-500/10', iconColor: 'text-green-400' },
          { icon: Calendar, label: 'Event', value: stats.totalEvents, bg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
          { icon: Lightbulb, label: 'Inovasi', value: stats.totalInnovations, bg: 'bg-yellow-500/10', iconColor: 'text-yellow-400' },
          { icon: Award, label: 'Sertifikat', value: stats.totalCertificates, bg: 'bg-purple-500/10', iconColor: 'text-purple-400' },
          { icon: Globe, label: 'Provinsi', value: stats.totalProvinces, bg: 'bg-cyan-500/10', iconColor: 'text-cyan-400' },
        ].map((card, i) => {
          const Icon = card.icon;
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
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* ===== SECOND ROW: Admin-specific stats + Pending ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Second Row Stats */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-pri-red" />
            <h2 className="text-sm font-semibold text-white">Ringkasan Sistem</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { icon: TrendingUp, label: 'Trainer', value: stats.totalTrainers, color: 'bg-green-500/10', iconColor: 'text-green-400' },
              { icon: TrendingUp, label: 'Mentor', value: stats.totalMentors, color: 'bg-purple-500/10', iconColor: 'text-purple-400' },
              { icon: Bell, label: 'Verifikasi', value: stats.pendingVerifications, color: 'bg-orange-500/10', iconColor: 'text-orange-400' },
              { icon: CreditCard, label: 'Kartu Pending', value: stats.pendingMemberCards, color: 'bg-pink-500/10', iconColor: 'text-pink-400' },
              { icon: MessageSquare, label: 'Pesan Baru', value: stats.unreadMessages, color: 'bg-red-500/10', iconColor: 'text-red-400' },
            ].map((card, i) => {
              // Hide Pesan Baru if not super_admin
              if (i === 4 && !isSuperAdmin) return null;
              const Icon = card.icon;
              return (
                <Card key={i} className="glass-card">
                  <CardContent className={`p-4 text-center${i === 4 ? ' border border-red-500/20' : ''}`}>
                    <div className={`h-8 w-8 rounded-full ${card.color} flex items-center justify-center mx-auto mb-2`}>
                      <Icon className={`h-4 w-4 ${card.iconColor}`} />
                    </div>
                    <p className="text-lg font-bold text-white tabular-nums">{card.value}</p>
                    <p className="text-[10px] text-pri-silver font-mono">{card.label}</p>
                  </CardContent>
                </Card>
              );
            })}
            {/* Render empty placeholder if super_admin to maintain 5-column layout on desktop */}
            {!isSuperAdmin && <div className="hidden sm:block" />}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-pri-red" />
            <h2 className="text-sm font-semibold text-white">Aksi Cepat</h2>
          </div>
          <div className="space-y-2">
            <Link href="/admin/members">
              <Button variant="outline" className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group">
                <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />Kelola Anggota</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </Link>
            <Link href="/admin/events">
              <Button variant="outline" className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group">
                <span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />Kelola Event</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </Link>
            <Link href="/admin/verification">
              <Button variant="outline" className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group">
                <span className="flex items-center gap-2"><UserCheck className="h-3.5 w-3.5" />Verifikasi{stats.pendingVerifications > 0 ? ` (${stats.pendingVerifications})` : ''}</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </Link>
            <Link href="/admin/monitoring">
              <Button variant="outline" className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group">
                <span className="flex items-center gap-2"><LayoutDashboard className="h-3.5 w-3.5" />Monitoring</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </Link>
            {isSuperAdmin && (
              <>
                <Link href="/admin/super-admin">
                  <Button variant="outline" className="w-full justify-between border-purple-500/20 text-purple-400 hover:text-purple-300 hover:border-purple-500/40 group">
                    <span className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" />Super Admin Panel</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </Button>
                </Link>
                <Link href="/admin/messages">
                  <Button variant="outline" className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group">
                    <span className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" />Pesan Kontak{stats.unreadMessages > 0 ? ` (${stats.unreadMessages})` : ''}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* ===== RECENT MEMBERS ===== */}
      <motion.div variants={item}>
        <Card className="glass-tech overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-pri-red" />
                <h2 className="text-sm font-semibold text-white">Member Terbaru</h2>
              </div>
              <Link href="/admin/members">
                <Button variant="ghost" size="sm" className="text-[10px] text-pri-silver hover:text-white h-7 px-2">
                  Lihat Semua <ArrowRight className="h-3 w-3 ml-1 inline" />
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-white/5">
              {recentMembers.map((member) => {
                const roleName = member.role_id?.name || "member";
                const roleColor = roleName === "super_admin" ? "text-purple-400 bg-purple-500/10" :
                                  roleName === "admin" ? "text-blue-400 bg-blue-500/10" :
                                  "text-green-400 bg-green-500/10";
                return (
                  <div key={member.id} className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-pri-red/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-pri-red">
                          {member.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">{member.full_name}</p>
                        <p className="text-[10px] text-pri-silver font-mono truncate">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${roleColor}`}>
                        {roleName === "super_admin" ? "Super Admin" : roleName.charAt(0).toUpperCase() + roleName.slice(1)}
                      </span>
                      <span className="text-[10px] text-pri-silver/50 font-mono">{member.member_id}</span>
                    </div>
                  </div>
                );
              })}
              {recentMembers.length === 0 && (
                <div className="px-4 py-8 text-center text-pri-silver text-sm">
                  Belum ada anggota terdaftar
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== ADMIN INFO CARD ===== */}
      <motion.div variants={item}>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full bg-pri-red/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-pri-red" />
                <div className="data-pulse-ring rounded-full" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">{memberName}</p>
                <p className="text-[10px] text-pri-silver font-mono flex items-center gap-1">
                  {isSuperAdmin ? (
                    <>
                      <Shield className="h-3 w-3 text-purple-400" />
                      <span className="text-purple-400">Super Admin</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-3 w-3 text-blue-400" />
                      <span className="text-blue-400">Admin</span>
                    </>
                  )}
                  <span className="mx-1.5 opacity-30">|</span>
                  Panel Administrasi PRO RI
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
                <span className="status-dot" />
                ONLINE
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
