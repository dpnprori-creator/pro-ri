"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, UserX, Download, User, Mail, Fingerprint, MapPin, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { deleteMember, updateMemberStatus } from "@/features/admin/actions";
import { downloadCSV, formatMembersCSV } from "@/lib/export-utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MemberItem {
  id: string;
  full_name: string;
  email: string;
  member_id: string;
  phone: string | null;
  status: string;
  created_at: string;
  role_id: { name: string } | null;
  province_id: { name: string } | null;
}

const columns: Column<MemberItem>[] = [
  {
    key: "full_name",
    label: "Nama",
    sortable: true,
    render: (item) => (
      <div>
        <p className="text-sm text-white">{item.full_name}</p>
        <p className="text-xs text-pri-silver">{item.email}</p>
      </div>
    ),
  },
  { key: "member_id", label: "Member ID", sortable: true },
  { key: "phone", label: "Telepon" },
  {
    key: "role_id",
    label: "Role",
    render: (item) => (
      <Badge variant="outline" className="text-[10px]">
        {item.role_id?.name || "N/A"}
      </Badge>
    ),
  },
  {
    key: "province_id",
    label: "Provinsi",
    render: (item) => (
      <span className="text-xs text-pri-silver">{item.province_id?.name || "-"}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (item) => (
      <Badge variant={item.status === "active" ? "success" : "secondary"}>
        {item.status}
      </Badge>
    ),
  },
  {
    key: "created_at",
    label: "Bergabung",
    sortable: true,
    render: (item) => (
      <span className="text-xs text-pri-silver">
        {new Date(item.created_at).toLocaleDateString("id-ID")}
      </span>
    ),
  },
];

export function MembersManager({ members }: { members: MemberItem[] }) {
  const router = useRouter();
  const [detailMember, setDetailMember] = useState<MemberItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleViewDetail = (item: MemberItem) => {
    setDetailMember(item);
    setDetailOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus member ini?")) return;
    const result = await deleteMember(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Member dihapus");
      router.refresh();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const result = await updateMemberStatus(id, newStatus);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Status member diubah ke ${newStatus}`);
      if (detailMember?.id === id) {
        setDetailMember((prev) => prev ? { ...prev, status: newStatus } : null);
      }
      router.refresh();
    }
  };

  const handleExportCSV = () => {
    const rows = formatMembersCSV(members);
    downloadCSV(rows, "data-member");
    toast.success("Data member diexpor ke CSV");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="border-white/10 text-pri-silver hover:text-white"
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          Export CSV
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={members}
        searchKeys={["full_name", "email", "member_id", "phone"]}
        searchPlaceholder="Cari member..."
        pageSize={15}
        emptyMessage="Belum ada member"
        actions={(item) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetail(item)}
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Detail
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleStatus(item.id, item.status)}
            >
              <UserX className="h-3.5 w-3.5 mr-1" />
              {item.status === "active" ? "Nonaktifkan" : "Aktifkan"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300"
              onClick={() => handleDelete(item.id)}
            >
              Hapus
            </Button>
          </div>
        )        }
      />


      {/* Member Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-pri-red" />
              Detail Member
            </DialogTitle>
          </DialogHeader>
          {detailMember && (
            <div className="space-y-6">
              {/* Avatar & Name */}
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-pri-red/10 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-pri-red">
                    {detailMember.full_name?.charAt(0) || "?"}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-white">{detailMember.full_name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={detailMember.status === "active" ? "success" : "secondary"}>
                    {detailMember.status === "active" ? "Aktif" : detailMember.status}
                  </Badge>
                  {detailMember.role_id && (
                    <Badge variant={detailMember.role_id.name === "super_admin" ? "danger" : "warning"}>
                      {detailMember.role_id.name}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 text-sm bg-white/[0.03] rounded-lg p-4 border border-white/5">
                <div className="flex items-center gap-3 text-pri-silver">
                  <Mail className="h-4 w-4 text-pri-red shrink-0" />
                  <span>{detailMember.email}</span>
                </div>
                <div className="flex items-center gap-3 text-pri-silver">
                  <Fingerprint className="h-4 w-4 text-pri-red shrink-0" />
                  <span className="font-mono">{detailMember.member_id}</span>
                </div>
                {detailMember.phone && (
                  <div className="flex items-center gap-3 text-pri-silver">
                    <BadgeCheck className="h-4 w-4 text-pri-red shrink-0" />
                    <span>{detailMember.phone}</span>
                  </div>
                )}
                {detailMember.province_id && (
                  <div className="flex items-center gap-3 text-pri-silver">
                    <MapPin className="h-4 w-4 text-pri-red shrink-0" />
                    <span>{detailMember.province_id.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-pri-silver">
                  <BadgeCheck className="h-4 w-4 text-pri-red shrink-0" />
                  <span>Bergabung {new Date(detailMember.created_at).toLocaleDateString("id-ID")}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/10 text-pri-silver hover:text-white"
                  onClick={() => {
                    handleToggleStatus(detailMember.id, detailMember.status);
                  }}
                >
                  <UserX className="h-3.5 w-3.5 mr-1" />
                  {detailMember.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10"
                  onClick={() => {
                    handleDelete(detailMember.id);
                    setDetailOpen(false);
                  }}
                >
                  Hapus
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
