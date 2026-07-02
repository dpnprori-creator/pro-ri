"use client";

import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";

interface ActivityLogItem {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  ip_address: string | null;
  created_at: string;
  member_id: {
    full_name: string;
  } | null;
}

const columns: Column<ActivityLogItem>[] = [
  {
    key: "action",
    label: "Aksi",
    sortable: true,
    render: (item) => (
      <span className="text-sm text-white">{item.action}</span>
    ),
  },
  {
    key: "member_id",
    label: "User",
    render: (item) => (
      <span className="text-sm text-pri-silver">
        {item.member_id?.full_name ?? "System"}
      </span>
    ),
  },
  {
    key: "entity_type",
    label: "Tipe",
    render: (item) => (
      <span className="text-xs text-pri-gold">
        {item.entity_type || "-"}
      </span>
    ),
  },
  {
    key: "created_at",
    label: "Waktu",
    sortable: true,
    render: (item) => (
      <span className="text-xs text-pri-silver">
        {new Date(item.created_at).toLocaleString("id-ID")}
      </span>
    ),
  },
];

export function ActivityLogs({ logs }: { logs: ActivityLogItem[] }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.refresh()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        searchKeys={["action", "entity_type"]}
        searchPlaceholder="Cari aktivitas..."
        pageSize={20}
        emptyMessage="Belum ada aktivitas"
      />
    </div>
  );
}
