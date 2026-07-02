"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { deleteMember, updateMemberStatus } from "@/features/admin/actions";
import { toast } from "sonner";

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
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
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
              onClick={() => router.push(`/admin/members/${item.id}`)}
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
        )}
      />
    </div>
  );
}
