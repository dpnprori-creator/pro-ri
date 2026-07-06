"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, type Column } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createCertificate, updateCertificate, deleteCertificate } from "@/features/admin/actions";
import { toast } from "sonner";

interface CertificateRow {
  id: string;
  certificate_number: string;
  title: string;
  type: string;
  verified: boolean;
  issued_at: string;
  member_id: string;
  members: { full_name: string } | { full_name: string }[];
}

const typeLabel: Record<string, string> = {
  participant: "Partisipasi", trainer: "Trainer", mentor: "Mentor", winner: "Pemenang",
};

const columns: Column<CertificateRow>[] = [
  { key: "certificate_number", label: "No. Sertifikat", sortable: true },
  {
    key: "members",
    label: "Nama",
    sortable: true,
    render: (item) => {
      const member = Array.isArray(item.members) ? item.members[0] : item.members;
      return <span>{member?.full_name || "-"}</span>;
    },
  },
  { key: "title", label: "Judul", sortable: true },
  {
    key: "type",
    label: "Tipe",
    sortable: true,
    render: (item) => <Badge variant="default">{typeLabel[item.type] || item.type}</Badge>,
  },
  {
    key: "verified",
    label: "Verifikasi",
    sortable: true,
    render: (item) => (
      <Badge variant={item.verified ? "success" : "warning"}>
        {item.verified ? "Terverifikasi" : "Pending"}
      </Badge>
    ),
  },
  {
    key: "issued_at",
    label: "Terbit",
    sortable: true,
    render: (item) => new Date(item.issued_at).toLocaleDateString("id-ID"),
  },
];

export function CertificatesManager({ certificates }: { certificates: CertificateRow[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CertificateRow | null>(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (item: CertificateRow) => { setEditing(item); setDialogOpen(true); };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const result = editing
      ? await updateCertificate(editing.id, form)
      : await createCertificate(form);
    setSaving(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success(editing ? "Sertifikat diupdate" : "Sertifikat dibuat");
      setDialogOpen(false);
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus sertifikat ini?")) return;
    const result = await deleteCertificate(id);
    if (result.error) toast.error(result.error);
    else { toast.success("Sertifikat dihapus"); router.refresh(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="bg-pri-red hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" /> Tambah Sertifikat
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={certificates}
        searchKeys={["certificate_number", "title"]}
        searchPlaceholder="Cari sertifikat..."
        pageSize={10}
        emptyMessage="Belum ada sertifikat"
        actions={(item) => (
          <div className="flex items-center gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>Edit</Button>
            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={() => handleDelete(item.id)}>Hapus</Button>
          </div>
        )}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{editing ? "Edit Sertifikat" : "Tambah Sertifikat"}</DialogTitle>
            <DialogDescription>Isi informasi sertifikat</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="certificateNumber">Nomor Sertifikat</Label>
              <Input id="certificateNumber" name="certificateNumber" defaultValue={editing?.certificate_number} required placeholder="PRO-2026-XXXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberId">Member ID</Label>
              <Input id="memberId" name="memberId" defaultValue={editing?.member_id} required placeholder="PRORI-2026-XXXXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input id="title" name="title" defaultValue={editing?.title} required placeholder="Judul sertifikat" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipe</Label>
                <select id="type" name="type" defaultValue={editing?.type || "participant"} className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white">
                  <option value="participant">Partisipasi</option>
                  <option value="trainer">Trainer</option>
                  <option value="mentor">Mentor</option>
                  <option value="winner">Pemenang</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verified">Verifikasi</Label>
                <select id="verified" name="verified" defaultValue={editing?.verified ? "true" : "false"} className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white">
                  <option value="true">Terverifikasi</option>
                  <option value="false">Pending</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-pri-red hover:bg-red-700" disabled={saving}>
                {saving ? "Menyimpan..." : editing ? "Simpan" : "Buat Sertifikat"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
