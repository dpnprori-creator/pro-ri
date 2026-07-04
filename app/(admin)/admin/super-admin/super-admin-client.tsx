"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Shield, Calendar, Lightbulb, Award, Globe,
  Bell, MessageSquare, CreditCard, Activity, RefreshCw,
  BarChart3, Zap, ArrowRight, CheckCircle, AlertTriangle,
  Server, Database, Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { recalculateAllCounters } from "@/features/admin/system-actions";

interface SystemHealth {
  totalMembers: number;
  activeMembers: number;
  totalEvents: number;
  totalInnovations: number;
  totalCertificates: number;
  provincesWithMembers: number;
  pendingCards: number;
  unreadMessages: number;
  totalLogs: number;
  roleDistribution: Record<string, number>;
}

interface SuperAdminClientProps {
  health: SystemHealth;
  memberName: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function SuperAdminClient({ health, memberName }: SuperAdminClientProps) {
  const [recalculating, setRecalculating] = useState(false);

  const handleRecalculate = async () => {
    setRecalculating(true);
    const result = await recalculateAllCounters();
    setRecalculating(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Counter diupdate! Anggota: ${result.data?.activeMembers ?? "?"}, Trainer: ${result.data?.trainers ?? "?"}, Mentor: ${result.data?.mentors ?? "?"}`);
    }
  };

  const roleColors: Record<string, string> = {
    super_admin: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    admin: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    member: "text-green-400 bg-green-500/10 border-green-500/30",
  };

  const roleIcons: Record<string, React.ReactNode> = {
    super_admin: <Shield className="h-4 w-4 text-purple-400" />,
    admin: <Shield className="h-4 w-4 text-blue-400" />,
    member: <Users className="h-4 w-4 text-green-400" />,
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ===== SYSTEM KPI CARDS ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        {[
          { icon: Users, label: 'Total Member', value: health.totalMembers, bg: 'bg-pri-red/10', iconColor: 'text-pri-red' },
          { icon: Users, label: 'Aktif', value: health.activeMembers, bg: 'bg-green-500/10', iconColor: 'text-green-400' },
          { icon: Calendar, label: 'Event', value: health.totalEvents, bg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
          { icon: Lightbulb, label: 'Inovasi', value: health.totalInnovations, bg: 'bg-yellow-500/10', iconColor: 'text-yellow-400' },
          { icon: Award, label: 'Sertifikat', value: health.totalCertificates, bg: 'bg-purple-500/10', iconColor: 'text-purple-400' },
          { icon: Globe, label: 'Provinsi Aktif', value: health.provincesWithMembers, bg: 'bg-cyan-500/10', iconColor: 'text-cyan-400' },
          { icon: CreditCard, label: 'Kartu Pending', value: health.pendingCards, bg: 'bg-orange-500/10', iconColor: 'text-orange-400' },
          { icon: MessageSquare, label: 'Pesan Baru', value: health.unreadMessages, bg: 'bg-pink-500/10', iconColor: 'text-pink-400' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={i} variants={item} className="min-h-[100px]">
              <Card className="glass-tech h-full relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-0 bg-gradient-to-b from-pri-red/40 to-transparent group-hover:h-full transition-all duration-500" />
                <CardContent className="p-3 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-auto">
                    <div className={`relative h-8 w-8 rounded-lg ${card.bg} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                      <Icon className={`h-3.5 w-3.5 relative z-10 ${card.iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] text-pri-silver font-mono uppercase tracking-wider truncate">{card.label}</p>
                      <p className="text-base font-bold text-white tabular-nums tracking-tight">{card.value.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== ROLE DISTRIBUTION ===== */}
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-pri-red" />
            <h2 className="text-sm font-semibold text-white">Distribusi Role</h2>
          </div>
          <div className="space-y-2">
            {Object.entries(health.roleDistribution).map(([role, count]) => {
              const total = Object.values(health.roleDistribution).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <Card key={role} className="glass-card">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {roleIcons[role] || <Users className="h-4 w-4 text-pri-silver" />}
                        <span className="text-xs font-medium text-white capitalize">
                          {role === "super_admin" ? "Super Admin" : role}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-white font-mono">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          role === "super_admin" ? "bg-purple-500" :
                          role === "admin" ? "bg-blue-500" : "bg-green-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-pri-silver/60 mt-1 font-mono">{pct}% dari total</p>
                  </CardContent>
                </Card>
              );
            })}
            {Object.keys(health.roleDistribution).length === 0 && (
              <p className="text-xs text-pri-silver">Data role belum tersedia</p>
            )}
          </div>
        </motion.div>

        {/* ===== SYSTEM HEALTH + ACTIONS ===== */}
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-pri-red" />
            <h2 className="text-sm font-semibold text-white">System Health</h2>
          </div>
          <div className="space-y-2">
            <Card className="glass-card">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-pri-silver flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5" /> Total Logs
                  </span>
                  <span className="text-sm font-bold text-white font-mono">{health.totalLogs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-pri-silver flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Aktivitas Sistem
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="status-dot" />
                    <span className="text-[10px] text-green-400 font-mono">ONLINE</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-pri-silver flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" /> Kartu Pending
                  </span>
                  <span className={`text-sm font-bold font-mono ${health.pendingCards > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                    {health.pendingCards}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleRecalculate}
              disabled={recalculating}
              variant="outline"
              className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group"
            >
              <span className="flex items-center gap-2">
                <RefreshCw className={`h-3.5 w-3.5 ${recalculating ? 'animate-spin' : ''}`} />
                {recalculating ? "Merefresh..." : "Recalculate Counters"}
              </span>
              <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </Button>
          </div>
        </motion.div>

        {/* ===== QUICK LINKS ===== */}
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-pri-red" />
            <h2 className="text-sm font-semibold text-white">Super Admin Actions</h2>
          </div>
          <div className="space-y-2">
            <a href="/admin/settings">
              <Button variant="outline" className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group">
                <span className="flex items-center gap-2"><Server className="h-3.5 w-3.5" />System Settings</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </a>
            <a href="/admin/admins">
              <Button variant="outline" className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group">
                <span className="flex items-center gap-2"><Shield className="h-3.5 w-3.5" />Manage Admins</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </a>
            <a href="/admin/roles">
              <Button variant="outline" className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group">
                <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />Role Management</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </a>
            <a href="/admin/activity">
              <Button variant="outline" className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group">
                <span className="flex items-center gap-2"><Activity className="h-3.5 w-3.5" />Activity Logs</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </a>
            <a href="/admin/messages">
              <Button variant="outline" className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group">
                <span className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" />Messages({health.unreadMessages})</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </a>
            <a href="/admin/member-verification">
              <Button variant="outline" className="w-full justify-between border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 group">
                <span className="flex items-center gap-2"><CreditCard className="h-3.5 w-3.5" />Member Cards ({health.pendingCards})</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* ===== ADMIN INFO ===== */}
      <motion.div variants={item}>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-400" />
                <div className="data-pulse-ring rounded-full" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">{memberName}</p>
                <p className="text-[10px] text-pri-silver font-mono flex items-center gap-1">
                  <Shield className="h-3 w-3 text-purple-400" />
                  <span className="text-purple-400">Super Admin</span>
                  <span className="mx-1.5 opacity-30">|</span>
                  Kontrol Penuh Sistem PRO RI
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
