"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Fingerprint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";

interface AdminItem {
  id: string;
  full_name: string;
  email: string;
  member_id: string;
  status: string;
  created_at: string;
  role_id: {
    name: string;
  };
}

const columns: Column<AdminItem>[] = [
  { key: "full_name", label: "Nama", sortable: true },
  {
    key: "email",
    label: "Email",
    render: (item) => (
      <span className="text-sm text-pri-silver flex items-center gap-1">
        <Mail className="h-3 w-3" />
        {item.email}
      </span>
    ),
  },
  {
    key: "member_id",
    label: "Member ID",
    render: (item) => (
      <span className="text-xs font-mono text-pri-silver flex items-center gap-1">
        <Fingerprint className="h-3 w-3" />
        {item.member_id}
      </span>
    ),
  },
  {
    key: "role_id",
    label: "Role",
    render: (item) => (
      <Badge variant={item.role_id.name === "super_admin" ? "danger" : "warning"} className="text-[10px]">
        <Shield className="h-3 w-3 mr-1" />
        {item.role_id.name === "super_admin" ? "Super Admin" : "Admin"}
      </Badge>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (item) => (
      <Badge variant={item.status === "active" ? "success" : "secondary"}>
        {item.status === "active" ? "Aktif" : "Nonaktif"}
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

export function AdminsManager({ admins }: { admins: AdminItem[] }) {
  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={admins}
        searchKeys={["full_name", "email", "member_id"]}
        searchPlaceholder="Cari admin..."
        pageSize={10}
        emptyMessage="Belum ada admin"
      />
    </div>
  );
}
