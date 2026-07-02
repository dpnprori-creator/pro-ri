"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateMemberStatus, deleteMember } from "@/features/admin/actions";
import { toast } from "sonner";

interface AdminMemberActionsProps {
  memberId: string;
  currentStatus: string;
}

export function AdminMemberActions({ memberId, currentStatus }: AdminMemberActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setSaving(true);
    const result = await updateMemberStatus(memberId, newStatus);
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setStatus(newStatus);
      toast.success("Status berhasil diupdate");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus anggota ini? Tindakan ini tidak bisa dibatalkan.")) return;
    setSaving(true);
    const result = await deleteMember(memberId);
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Anggota berhasil dihapus");
      router.push("/admin/members");
    }
  };

  return (
    <Card className="glass-card border-red-500/20">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-pri-silver">Admin Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Change */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Status Anggota</p>
            <p className="text-xs text-pri-silver mt-0.5">Ubah status keanggotaan</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={saving}
              className="text-sm bg-pri-dark border border-white/10 rounded px-3 py-1.5 text-white"
            >
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="suspended">Blokir</option>
            </select>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <Button
            onClick={handleDelete}
            disabled={saving}
            variant="outline"
            className="w-full border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-400/50"
          >
            Hapus Anggota
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
