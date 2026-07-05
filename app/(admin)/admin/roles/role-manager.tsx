"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield, Search, Mail, Fingerprint, MapPin, Calendar,
  CheckCircle, XCircle, AlertTriangle, ArrowUpDown,
  RefreshCw, Users, BadgeCheck, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateMemberRole } from "@/features/admin/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Role {
  id: string;
  name: string;
  description: string | null;
}

interface MemberWithRole {
  id: string;
  full_name: string;
  email: string;
  member_id: string;
  phone: string | null;
  status: string;
  role_id: { name: string } | null;
  province_id: { name: string } | null;
  created_at: string;
  total_events_attended: number;
  total_certificates: number;
}

interface RolesManagerProps {
  roles: Role[];
  members: MemberWithRole[];
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const roleConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  super_admin: {
    label: "Super Admin",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    icon: <Shield className="h-3.5 w-3.5 text-purple-400" />,
  },
  admin: {
    label: "Admin",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: <Shield className="h-3.5 w-3.5 text-blue-400" />,
  },
  member: {
    label: "Member",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: <Users className="h-3.5 w-3.5 text-green-400" />,
  },
};

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: "Aktif", color: "text-green-400", dot: "bg-green-400" },
  inactive: { label: "Nonaktif", color: "text-yellow-400", dot: "bg-yellow-400" },
  suspended: { label: "Suspen", color: "text-red-400", dot: "bg-red-400" },
};

function getRoleConfig(name: string | null) {
  return roleConfig[name || ""] || {
    label: name || "No Role",
    color: "text-pri-silver",
    bg: "bg-white/5",
    border: "border-white/10",
    icon: <AlertTriangle className="h-3.5 w-3.5 text-pri-silver" />,
  };
}

export function RolesManager({ roles, members }: RolesManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ member: MemberWithRole; newRole: string } | null>(null);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = members
    .filter((m) => {
      if (search) {
        const q = search.toLowerCase();
        if (!m.full_name.toLowerCase().includes(q) &&
            !m.email.toLowerCase().includes(q) &&
            !m.member_id.toLowerCase().includes(q) &&
            !(m.phone && m.phone.includes(q))) return false;
      }
      if (roleFilter !== "all" && m.role_id?.name !== roleFilter) return false;
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "full_name": cmp = a.full_name.localeCompare(b.full_name); break;
        case "email": cmp = a.email.localeCompare(b.email); break;
        case "member_id": cmp = a.member_id.localeCompare(b.member_id); break;
        case "status": cmp = a.status.localeCompare(b.status); break;
        case "role": cmp = (a.role_id?.name || "").localeCompare(b.role_id?.name || ""); break;
        case "province": cmp = (a.province_id?.name || "").localeCompare(b.province_id?.name || ""); break;
        case "events": cmp = (a.total_events_attended || 0) - (b.total_events_attended || 0); break;
        default: cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleRoleChange = async (memberId: string, newRoleId: string) => {
    setSavingId(memberId);
    const result = await updateMemberRole(memberId, newRoleId);
    setSavingId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Role berhasil diubah");
      router.refresh();
    }
    setConfirmDialog(null);
  };

  const requestRoleChange = (member: MemberWithRole, newRoleId: string) => {
    const currentRole = member.role_id?.name || "no role";
    const newRole = roles.find((r) => r.id === newRoleId)?.name || "unknown";
    if (currentRole === newRole) return;
    if (newRole === "super_admin") {
      setConfirmDialog({ member, newRole: newRoleId });
    } else {
      handleRoleChange(member.id, newRoleId);
    }
  };

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-xs font-medium text-pri-silver uppercase tracking-wider hover:text-white transition-colors"
    >
      {label}
      <ArrowUpDown className={`h-3 w-3 transition-opacity ${sortField === field ? "opacity-100 text-pri-red" : "opacity-30"}`} />
    </button>
  );

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {/* ===== FILTERS & STATS BAR ===== */}
      <motion.div variants={itemAnim}>
        <Card className="glass-tech overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pri-red/30 to-transparent" />
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pri-silver" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama, email, ID member..."
                  className="pl-9 bg-pri-dark/50 border-white/10 text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[130px] h-9 text-xs bg-pri-dark/50 border-white/10">
                    <SelectValue placeholder="Semua Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Role</SelectItem>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.name}>
                        {r.name === "super_admin" ? "Super Admin" : r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px] h-9 text-xs bg-pri-dark/50 border-white/10">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                    <SelectItem value="suspended">Suspen</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs text-pri-silver"
                  onClick={() => { setSearch(""); setRoleFilter("all"); setStatusFilter("all"); }}
                >
                  Reset
                </Button>
              </div>

              {/* Count */}
              <div className="text-xs text-pri-silver font-mono whitespace-nowrap">
                <span className="text-white font-semibold">{filtered.length}</span> / {members.length} member
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== MEMBER TABLE ===== */}
      <motion.div variants={itemAnim}>
        <Card className="glass-tech overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pri-red/30 to-transparent" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-pri-dark/30">
                  <th className="px-4 py-3 text-left"><SortHeader field="full_name" label="Nama" /></th>
                  <th className="px-4 py-3 text-left"><SortHeader field="email" label="Email" /></th>
                  <th className="px-4 py-3 text-left"><SortHeader field="member_id" label="Member ID" /></th>
                  <th className="px-4 py-3 text-left"><SortHeader field="role" label="Role" /></th>
                  <th className="px-4 py-3 text-left"><SortHeader field="status" label="Status" /></th>
                  <th className="px-4 py-3 text-left"><SortHeader field="province" label="Provinsi" /></th>
                  <th className="px-4 py-3 text-left"><SortHeader field="events" label="Event" /></th>
                  <th className="px-4 py-3 text-right"><SortHeader field="created_at" label="Bergabung" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-pri-silver/30" />
                        <p className="text-sm text-pri-silver">Tidak ada member ditemukan</p>
                        <p className="text-xs text-pri-silver/50">Coba ubah filter pencarian</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((member, i) => {
                    const rc = getRoleConfig(member.role_id?.name || null);
                    const sc = statusConfig[member.status] || { label: member.status, color: "text-pri-silver", dot: "bg-pri-silver" };
                    const isSaving = savingId === member.id;

                    return (
                      <motion.tr
                        key={member.id}
                        variants={itemAnim}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg ${rc.bg} flex items-center justify-center flex-shrink-0`}>
                              {rc.icon}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{member.full_name}</p>
                              {member.phone && (
                                <p className="text-[10px] text-pri-silver/50">{member.phone}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-pri-silver flex items-center gap-1">
                            <Mail className="h-3 w-3 opacity-50" />
                            {member.email}
                          </span>
                        </td>

                        {/* Member ID */}
                        <td className="px-4 py-3">
                          <span className="text-[11px] font-mono text-pri-silver/70 flex items-center gap-1">
                            <Fingerprint className="h-3 w-3 opacity-50" />
                            {member.member_id}
                          </span>
                        </td>

                        {/* Role — Inline Dropdown */}
                        <td className="px-4 py-3">
                          <div className="relative min-w-[130px]">
                            {isSaving ? (
                              <div className="flex items-center gap-2 h-9 px-2 rounded-lg border border-purple-500/30 bg-purple-500/5">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
                                <span className="text-[11px] text-purple-400 font-mono">menyimpan...</span>
                              </div>
                            ) : (
                              <select
                                value={member.role_id?.name || ""}
                                onChange={(e) => {
                                  const selectedRole = roles.find((r) => r.name === e.target.value);
                                  if (selectedRole) requestRoleChange(member, selectedRole.id);
                                }}
                                className={`w-full appearance-none rounded-lg border px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-all
                                  ${rc.bg} ${rc.color} ${rc.border}
                                  hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-pri-red/50
                                  bg-no-repeat bg-[right_6px_center] bg-[length:12px]
                                  group-hover:border-white/20`}
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0a0a0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")` }}
                              >
                                <option value="" disabled className="bg-pri-dark text-pri-silver">Pilih Role</option>
                                {roles.map((role) => (
                                  <option key={role.id} value={role.name} className="bg-pri-dark text-white">
                                    {role.name === "super_admin" ? "Super Admin" : role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                            <span className={`text-[11px] font-medium ${sc.color}`}>{sc.label}</span>
                          </div>
                        </td>

                        {/* Province */}
                        <td className="px-4 py-3">
                          <span className="text-[11px] text-pri-silver/60 flex items-center gap-1">
                            <MapPin className="h-3 w-3 opacity-50" />
                            {member.province_id?.name || "-"}
                          </span>
                        </td>

                        {/* Event Count */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-mono text-pri-silver border-white/10">
                              {member.total_events_attended || 0}
                            </Badge>
                            {member.total_certificates > 0 && (
                              <BadgeCheck className="h-3.5 w-3.5 text-green-400/60" />
                            )}
                          </div>
                        </td>

                        {/* Join Date */}
                        <td className="px-4 py-3 text-right">
                          <span className="text-[11px] text-pri-silver/50 font-mono flex items-center justify-end gap-1">
                            <Calendar className="h-3 w-3 opacity-50" />
                            {new Date(member.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-[10px] text-pri-silver/50 font-mono">
              {filtered.length} member ditampilkan — klik dropdown Role untuk mengubah
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] text-pri-silver h-7"
              onClick={() => router.refresh()}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* ===== CONFIRM DIALOG (for super_admin assignment) ===== */}
      <Dialog open={!!confirmDialog} onOpenChange={() => setConfirmDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-purple-400" />
              Konfirmasi Perubahan Role
            </DialogTitle>
            <DialogDescription>
              Anda akan mengubah role member ini menjadi Super Admin
            </DialogDescription>
          </DialogHeader>

          {confirmDialog && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <p className="text-sm text-white font-medium">{confirmDialog.member.full_name}</p>
                <p className="text-xs text-pri-silver mt-1">{confirmDialog.member.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px] border-white/10">
                    {confirmDialog.member.role_id?.name || "No Role"}
                  </Badge>
                  <span className="text-pri-silver/50">→</span>
                  <Badge variant="danger" className="text-[10px]">
                    Super Admin
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-pri-silver/70">
                Super Admin memiliki akses penuh ke seluruh sistem. Pastikan Anda yakin dengan perubahan ini.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setConfirmDialog(null)}>
              Batal
            </Button>
            <Button
              type="button"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                if (confirmDialog) handleRoleChange(confirmDialog.member.id, confirmDialog.newRole);
              }}
            >
              <Shield className="h-4 w-4 mr-2" />
              Ya, Jadikan Super Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
