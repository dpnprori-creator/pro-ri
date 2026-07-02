"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { updateMemberStatus, deleteMember, setMemberDesignation, updateMemberRole } from "@/features/admin/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Shield, Loader2 } from "lucide-react";

interface MemberDesignation {
  designation: string;
}

interface MemberRow {
  id: string;
  member_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  occupation: string | null;
  status: string;
  created_at: string;
  role_id?: string | null;
  role_name?: string | null;
  member_designations?: MemberDesignation[];
}

interface MembersTableProps {
  members: MemberRow[];
  roles?: { id: string; name: string }[];
  showRoleEditor?: boolean;
}

const columns: Column<MemberRow>[] = [
  { key: "member_id", label: "Member ID", sortable: true, className: "font-mono text-xs" },
  { key: "full_name", label: "Nama Lengkap", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone", label: "Telepon", sortable: true },
  { key: "occupation", label: "Pekerjaan", sortable: true },
  {
    key: "role_name",
    label: "Role",
    sortable: true,
    render: (item) => {
      const roleColors: Record<string, string> = {
        super_admin: "text-red-400 bg-red-500/10 border-red-500/30",
        admin: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
        member: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      };
      const roleLabels: Record<string, string> = {
        super_admin: "Super Admin",
        admin: "Admin",
        member: "Member",
      };
      if (!item.role_name) return <span className="text-pri-silver/50 text-xs">-</span>;
      return (
        <Badge variant="default" className={`${roleColors[item.role_name] || "text-pri-silver bg-white/5 border-white/10"} text-[10px]`}>
          <Shield className="h-2.5 w-2.5 mr-0.5" />
          {roleLabels[item.role_name] || item.role_name}
        </Badge>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (item) => (
      <Badge
        variant={
          item.status === "active"
            ? "success"
            : item.status === "inactive"
            ? "warning"
            : "danger"
        }
      >
        {item.status === "active" ? "Aktif" : item.status === "inactive" ? "Tidak Aktif" : "Diblokir"}
      </Badge>
    ),
  },
  {
    key: "member_designations",
    label: "Label",
    render: (item) => (
      <div className="flex items-center gap-1">
        {item.member_designations?.some((d) => d.designation === "trainer") && (
          <Badge variant="default" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] px-1.5 py-0">
            <GraduationCap className="h-2.5 w-2.5 mr-0.5" />
            Trainer
          </Badge>
        )}
        {item.member_designations?.some((d) => d.designation === "mentor") && (
          <Badge variant="default" className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px] px-1.5 py-0">
            <BookOpen className="h-2.5 w-2.5 mr-0.5" />
            Mentor
          </Badge>
        )}
        {(!item.member_designations?.length) && (
          <span className="text-pri-silver/50 text-xs">-</span>
        )}
      </div>
    ),
  },
];

export function MembersTable({ members, roles, showRoleEditor }: MembersTableProps) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleStatusChange = async (memberId: string, status: string) => {
    setSavingId(memberId);
    const result = await updateMemberStatus(memberId, status);
    setSavingId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Status berhasil diupdate");
      router.refresh();
    }
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm("Yakin ingin menghapus anggota ini?")) return;
    setSavingId(memberId);
    const result = await deleteMember(memberId);
    setSavingId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Anggota berhasil dihapus");
      router.refresh();
    }
  };

  const handleDesignation = async (memberId: string, designation: "trainer" | "mentor", active: boolean) => {
    setSavingId(memberId);
    const result = await setMemberDesignation(memberId, designation, active);
    setSavingId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(active ? `Label ${designation} ditambahkan` : `Label ${designation} dihapus`);
      router.refresh();
    }
  };

  const handleRoleChange = async (memberId: string, roleId: string) => {
    setSavingId(memberId);
    const result = await updateMemberRole(memberId, roleId);
    setSavingId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Role berhasil diubah");
      router.refresh();
    }
  };

  const isTrainer = (item: MemberRow) => item.member_designations?.some((d) => d.designation === "trainer") ?? false;
  const isMentor = (item: MemberRow) => item.member_designations?.some((d) => d.designation === "mentor") ?? false;

  return (
    <DataTable
      columns={columns}
      data={members}
      searchKeys={["member_id", "full_name", "email", "phone"]}
      searchPlaceholder="Cari anggota..."
      pageSize={15}
      emptyMessage="Belum ada anggota terdaftar"
      actions={(item) => (
        <div className="flex items-center gap-1.5 justify-end flex-wrap">
          {/* Designation Toggles */}
          <button
            onClick={() => handleDesignation(item.id, "trainer", !isTrainer(item))}
            disabled={savingId === item.id}
            className={`px-2 py-1 rounded text-[10px] font-semibold transition-all border ${
              isTrainer(item)
                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                : "bg-transparent text-pri-silver/50 border-white/10 hover:border-blue-500/30 hover:text-blue-400"
            }`}
          >
            <GraduationCap className="h-3 w-3 inline mr-0.5" />
            T
          </button>
          <button
            onClick={() => handleDesignation(item.id, "mentor", !isMentor(item))}
            disabled={savingId === item.id}
            className={`px-2 py-1 rounded text-[10px] font-semibold transition-all border ${
              isMentor(item)
                ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                : "bg-transparent text-pri-silver/50 border-white/10 hover:border-purple-500/30 hover:text-purple-400"
            }`}
          >
            <BookOpen className="h-3 w-3 inline mr-0.5" />
            M
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Role Selector (super-admin only) */}
          {showRoleEditor && roles && (
            <select
              value={item.role_id || ""}
              onChange={(e) => handleRoleChange(item.id, e.target.value)}
              disabled={savingId === item.id}
              className="text-[10px] bg-pri-dark border border-white/10 rounded px-1.5 py-1 text-white"
            >
              <option value="" disabled>Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name === "super_admin" ? "Super Admin" : r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                </option>
              ))}
            </select>
          )}

          {/* Status */}
          <select
            value={item.status}
            onChange={(e) => handleStatusChange(item.id, e.target.value)}
            disabled={savingId === item.id}
            className="text-[10px] bg-pri-dark border border-white/10 rounded px-1.5 py-1 text-white"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
            <option value="suspended">Blokir</option>
          </select>

          {savingId === item.id && <Loader2 className="h-3 w-3 animate-spin text-pri-silver" />}

          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 text-[10px] h-6 px-1.5"
            onClick={() => handleDelete(item.id)}
            disabled={savingId === item.id}
          >
            Hapus
          </Button>
        </div>
      )}
    />
  );
}
