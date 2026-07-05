"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, UserCheck, ExternalLink, Download, X } from "lucide-react";
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
import { createProgram, updateProgram, deleteProgram } from "@/features/admin/programs-actions";
import { downloadCSV, formatProgramsCSV } from "@/lib/export-utils";
import { toast } from "sonner";

interface ProgramRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  label: string;
  sort_order: number;
  max_participants: number | null;
  start_date: string | null;
  created_at: string;
}

const iconOptions = [
  { value: "GraduationCap", label: "🎓 GraduationCap" },
  { value: "BookOpen", label: "📖 BookOpen" },
  { value: "Bot", label: "🤖 Bot" },
  { value: "Trophy", label: "🏆 Trophy" },
  { value: "Rocket", label: "🚀 Rocket" },
  { value: "Store", label: "🏪 Store" },
  { value: "Globe", label: "🌍 Globe" },
  { value: "Cpu", label: "💻 Cpu" },
];

const statusLabels: Record<string, string> = {
  draft: "Draft",
  published: "Terbit",
  archived: "Arsip",
};

const labelLabels: Record<string, string> = {
  dibuka: "Dibuka",
  "akan datang": "Akan Datang",
  ditutup: "Ditutup",
  selesai: "Selesai",
};

const columns: Column<ProgramRow>[] = [
  { key: "title", label: "Judul", sortable: true },
  {
    key: "label",
    label: "Label",
    sortable: true,
    render: (item) => {
      const colors: Record<string, string> = {
        dibuka: "bg-green-500/20 text-green-400",
        "akan datang": "bg-yellow-500/20 text-yellow-400",
        ditutup: "bg-red-500/20 text-red-400",
        selesai: "bg-gray-500/20 text-gray-400",
      };
      return (
        <Badge className={colors[item.label] || "bg-gray-500/20 text-gray-400"}>
          {labelLabels[item.label] || item.label}
        </Badge>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (item) => (
      <Badge variant={item.status === "published" ? "success" : "secondary"}>
        {statusLabels[item.status] || item.status}
      </Badge>
    ),
  },
  { key: "sort_order", label: "Urutan", sortable: true },
  { key: "max_participants", label: "Max Peserta", sortable: true, render: (item) => item.max_participants?.toLocaleString() || "—" },
  {
    key: "created_at",
    label: "Dibuat",
    sortable: true,
    render: (item) => new Date(item.created_at).toLocaleDateString("id-ID"),
  },
];

export function ProgramsManager({ programs }: { programs: ProgramRow[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [registrationsOpen, setRegistrationsOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<ProgramRow | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [benefits, setBenefits] = useState<string[]>([]);

  // Fetch full program data when editing
  const [editProgramData, setEditProgramData] = useState<any>(null);

  const openCreate = () => {
    setSelectedProgram(null);
    setEditProgramData(null);
    setBenefits([]);
    setDialogOpen(true);
  };

  const openEdit = async (program: ProgramRow) => {
    setSelectedProgram(program);
    // Fetch full data for the program
    try {
      const { getProgramBySlug } = await import("@/features/admin/programs-actions");
      const fullData = await getProgramBySlug(program.slug);
      setEditProgramData(fullData);
      setBenefits(fullData?.features || []);
    } catch {
      setEditProgramData(null);
      setBenefits([]);
    }
    setDialogOpen(true);
  };

  const openRegistrations = async (program: ProgramRow) => {
    setSelectedProgram(program);
    setRegistrationsOpen(true);
    
    // Fetch registrations
    try {
      const { getProgramRegistrations } = await import("@/features/admin/programs-actions");
      const regs = await getProgramRegistrations(program.id);
      setRegistrations(regs);
    } catch (err) {
      toast.error("Gagal memuat data pendaftar");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const result = selectedProgram
      ? await updateProgram(selectedProgram.id, form)
      : await createProgram(form);

    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(selectedProgram ? "Program diupdate" : "Program dibuat");
      setDialogOpen(false);
      router.refresh();
    }
  };

  const handleDelete = async (programId: string) => {
    if (!confirm("Yakin ingin menghapus program ini?")) return;
    const result = await deleteProgram(programId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Program dihapus");
      router.refresh();
    }
  };

  const handleRegistrationStatus = async (regId: string, status: string) => {
    const { updateProgramRegistrationStatus } = await import("@/features/admin/programs-actions");
    const result = await updateProgramRegistrationStatus(regId, status);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Status pendaftar diupdate");
      // Refresh registrations
      if (selectedProgram) {
        const { getProgramRegistrations } = await import("@/features/admin/programs-actions");
        const regs = await getProgramRegistrations(selectedProgram.id);
        setRegistrations(regs);
      }
    }
  };

  const handleExportCSV = () => {
    const rows = formatProgramsCSV(programs);
    downloadCSV(rows, "data-program");
    toast.success("Data program diexpor ke CSV");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="border-white/10 text-pri-silver hover:text-white"
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          Export CSV
        </Button>
        <Button onClick={openCreate} className="bg-pri-red hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Program
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={programs}
        searchKeys={["title"]}
        searchPlaceholder="Cari program..."
        pageSize={10}
        emptyMessage="Belum ada program"
        actions={(item) => (
          <div className="flex items-center gap-2 justify-end">
            <a
              href={`/programs/${item.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Lihat di Frontend"
              className="inline-flex items-center justify-center h-8 px-2 text-xs text-pri-silver hover:text-white hover:bg-white/5 rounded transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openRegistrations(item)}
              title="Lihat Pendaftar"
            >
              <UserCheck className="h-4 w-4 mr-1" />
              Pendaftar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
              Edit
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedProgram ? "Edit Program" : "Buat Program Baru"}
            </DialogTitle>
            <DialogDescription>
              {selectedProgram ? "Ubah informasi program" : "Isi informasi program baru"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Program</Label>
              <Input
                id="title"
                name="title"
                defaultValue={selectedProgram?.title}
                required
                placeholder="Masukkan judul program"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Deskripsi Singkat</Label>
              <Input
                id="short_description"
                name="short_description"
                defaultValue={editProgramData?.short_description || ""}
                placeholder="Deskripsi singkat untuk card"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Lengkap</Label>                <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={editProgramData?.description || ""}
                placeholder="Deskripsi lengkap program. Ceritakan tentang program ini secara detail..."
                className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Ikon</Label>
                <select
                  id="icon"
                  name="icon"
                  defaultValue={editProgramData?.icon || "GraduationCap"}
                  className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL Gambar</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Benefits / Features — Dynamic Add/Remove dengan React State */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Benefit / Fitur Program</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setBenefits([...benefits, ""])}
                  className="border-green-500/30 text-green-400 hover:text-green-300 text-xs h-8"
                >
                  + Tambah Benefit
                </Button>
              </div>
              <div className="space-y-2">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-pri-red shrink-0 w-6">{i + 1}</span>
                    <input
                      value={b}
                      onChange={(e) => {
                        const newBenefits = [...benefits];
                        newBenefits[i] = e.target.value;
                        setBenefits(newBenefits);
                      }}
                      className="flex h-9 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
                      placeholder="Cth: Modul belajar terstruktur, perangkat praktik disediakan..."
                    />
                    <button
                      type="button"
                      onClick={() => setBenefits(benefits.filter((_, idx) => idx !== i))}
                      className="text-red-400 hover:text-red-300 shrink-0 px-1"
                      title="Hapus"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {benefits.length === 0 && (
                  <p className="text-xs text-pri-silver/50 italic">
                    Belum ada benefit. Klik "Tambah Benefit" untuk menambahkan.
                  </p>
                )}
              </div>
              <input type="hidden" name="features" value={JSON.stringify(benefits)} />
              <p className="text-[10px] text-pri-silver/60">
                Tambahkan benefit/fitur program. Setiap baris akan ditampilkan sebagai poin benefit di halaman publik.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_audience">Target Peserta</Label>
              <Input
                id="target_audience"
                name="target_audience"
                placeholder="Mahasiswa, fresh graduate, profesional"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={selectedProgram?.status || "draft"}
                  className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Terbitkan</option>
                  <option value="archived">Arsip</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <select
                  id="label"
                  name="label"
                  defaultValue={selectedProgram?.label || "dibuka"}
                  className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
                >
                  <option value="dibuka">Dibuka</option>
                  <option value="akan datang">Akan Datang</option>
                  <option value="ditutup">Ditutup</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_participants">Max Peserta</Label>
                <Input
                  id="max_participants"
                  name="max_participants"
                  type="number"
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Urutan</Label>
                <Input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Online / Jakarta"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Tanggal Mulai</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Tanggal Selesai</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-pri-red hover:bg-red-700" disabled={saving}>
                {saving ? "Menyimpan..." : selectedProgram ? "Simpan" : "Buat Program"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Registrations Dialog */}
      <Dialog open={registrationsOpen} onOpenChange={setRegistrationsOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-pri-red" />
              Pendaftar Program: {selectedProgram?.title}
            </DialogTitle>
            <DialogDescription>
              Total {registrations.length} pendaftar
            </DialogDescription>
          </DialogHeader>

          {registrations.length === 0 ? (
            <div className="text-center py-8 text-pri-silver text-sm">
              Belum ada pendaftar
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map((reg: any) => (
                <div
                  key={reg.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">
                      {reg.members?.full_name || "—"}
                    </p>
                    <p className="text-xs text-pri-silver">
                      {reg.members?.email} {reg.members?.phone ? `• ${reg.members.phone}` : ""}
                    </p>
                    <p className="text-[10px] text-pri-silver/50 mt-0.5">
                      No: {reg.members?.member_id} • Daftar: {new Date(reg.registered_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <Badge
                      className={
                        reg.status === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : reg.status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : reg.status === "registered"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                      }
                    >
                      {reg.status}
                    </Badge>
                    {reg.status === "registered" && (
                      <>
                        <button
                          onClick={() => handleRegistrationStatus(reg.id, "approved")}
                          className="text-xs text-green-400 hover:text-green-300"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => handleRegistrationStatus(reg.id, "rejected")}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Tolak
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
