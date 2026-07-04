"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X, UserCheck, Download } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable,
  type Column,
} from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEvent, updateEvent, deleteEvent } from "@/features/admin/actions";
import { updateEventRegistrationStatus, getEventRegistrations } from "@/features/events/actions";
import { downloadCSV, formatEventsCSV } from "@/lib/export-utils";
import { toast } from "sonner";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  category: string;
  type: string;
  start_date: string;
  end_date: string;
  location: string | null;
  status: string;
  max_participants: number | null;
  banner_url?: string | null;
}

interface RegistrationRow {
  id: string;
  status: string;
  notes: string | null;
  created_at: string;
  members: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    member_id: string;
  };
}

interface Province {
  id: string;
  name: string;
}

const categoryLabels: Record<string, string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  competition: "Kompetisi",
  exhibition: "Pameran",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  published: "Terbit",
  ongoing: "Berlangsung",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const columns: Column<EventRow>[] = [
  { key: "title", label: "Judul", sortable: true },
  {
    key: "category",
    label: "Kategori",
    sortable: true,
    render: (item) => (
      <Badge variant="default">{categoryLabels[item.category] || item.category}</Badge>
    ),
  },
  { key: "location", label: "Lokasi", sortable: true },
  {
    key: "start_date",
    label: "Mulai",
    sortable: true,
    render: (item) => new Date(item.start_date).toLocaleDateString("id-ID"),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (item) => (
      <Badge
        variant={
          item.status === "published" || item.status === "ongoing"
            ? "success"
            : item.status === "draft"
            ? "secondary"
            : "default"
        }
      >
        {statusLabels[item.status] || item.status}
      </Badge>
    ),
  },
];

export function EventsManager({
  events,
  provinces,
}: {
  events: EventRow[];
  provinces: Province[];
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [registrationsOpen, setRegistrationsOpen] = useState(false);
  const [selectedEventReg, setSelectedEventReg] = useState<EventRow | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [regLoading, setRegLoading] = useState(false);

  const openCreate = () => {
    setEditingEvent(null);
    setImagePreview(null);
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (event: EventRow) => {
    setEditingEvent(event);
    setImagePreview(event.banner_url || null);
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Gambar maksimal 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openRegistrations = async (event: EventRow) => {
    setSelectedEventReg(event);
    setRegistrationsOpen(true);
    setRegLoading(true);

    try {
      const regs = await getEventRegistrations(event.id);
      setRegistrations(regs as any);
    } catch (err) {
      console.error("Failed to load registrations:", err);
      setRegistrations([]);
    } finally {
      setRegLoading(false);
    }
  };

  const handleRegistrationAction = async (regId: string, newStatus: string) => {
    try {
      const result = await updateEventRegistrationStatus(regId, newStatus);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Status pendaftar diupdate");
        setRegistrations((prev) =>
          prev.map((r) => (r.id === regId ? { ...r, status: newStatus } : r))
        );
        router.refresh();
      }
    } catch (err) {
      toast.error("Gagal mengupdate status");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    if (imageFile) form.append("image", imageFile);

    const result = editingEvent
      ? await updateEvent(editingEvent.id, form)
      : await createEvent(form);

    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(editingEvent ? "Event diupdate" : "Event dibuat");
      setDialogOpen(false);
      setImageFile(null);
      setImagePreview(null);
      router.refresh();
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Yakin ingin menghapus event ini?")) return;
    const result = await deleteEvent(eventId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Event dihapus");
      router.refresh();
    }
  };

  const handleExportCSV = () => {
    const rows = formatEventsCSV(events);
    downloadCSV(rows, "data-event");
    toast.success("Data event diexpor ke CSV");
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
          Tambah Event
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={events}
        searchKeys={["title", "location", "category"]}
        searchPlaceholder="Cari event..."
        pageSize={10}
        emptyMessage="Belum ada event"
        actions={(item) => (
          <div className="flex items-center gap-2 justify-end">
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
              {editingEvent ? "Edit Event" : "Buat Event Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingEvent ? "Ubah informasi event" : "Isi informasi event baru"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Gambar Banner Event</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-pri-red/50 transition-colors group"
              >
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={400}
                      height={200}
                      className="rounded-lg object-cover max-h-48 w-full"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-pri-red/10 transition-colors">
                      <Upload className="h-5 w-5 text-pri-silver group-hover:text-pri-red transition-colors" />
                    </div>
                    <p className="text-sm text-pri-silver">Klik untuk upload banner</p>
                    <p className="text-xs text-pri-silver/50">PNG, JPG, WebP — Maks 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Judul Event</Label>
              <Input
                id="title"
                name="title"
                defaultValue={editingEvent?.title}
                required
                placeholder="Masukkan judul event"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  name="category"
                  defaultValue={editingEvent?.category || "webinar"}
                  className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
                >
                  <option value="webinar">Webinar</option>
                  <option value="workshop">Workshop</option>
                  <option value="competition">Kompetisi</option>
                  <option value="exhibition">Pameran</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipe</Label>
                <select
                  id="type"
                  name="type"
                  defaultValue={editingEvent?.type || "online"}
                  className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={editingEvent?.description || ""}
                placeholder="Deskripsi event..."
                className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Tanggal Mulai</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  defaultValue={editingEvent?.start_date ? editingEvent.start_date.slice(0, 16) : ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Tanggal Selesai</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  defaultValue={editingEvent?.end_date ? editingEvent.end_date.slice(0, 16) : ""}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                name="location"
                defaultValue={editingEvent?.location || ""}
                placeholder="Online (Zoom) / Jakarta / dll"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provinceId">Provinsi</Label>
                <select
                  id="provinceId"
                  name="provinceId"
                  className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
                >
                  <option value="">Pilih provinsi</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Peserta</Label>
                <Input
                  id="maxParticipants"
                  name="maxParticipants"
                  type="number"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={editingEvent?.status || "draft"}
                className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Terbitkan</option>
              </select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" className="bg-pri-red hover:bg-red-700" disabled={saving}>
                {saving ? "Menyimpan..." : editingEvent ? "Simpan" : "Buat Event"}
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
              Pendaftar Event: {selectedEventReg?.title}
            </DialogTitle>
            <DialogDescription>
              {regLoading ? "Memuat..." : `Total ${registrations.length} pendaftar`}
            </DialogDescription>
          </DialogHeader>

          {regLoading ? (
            <div className="text-center py-8 text-pri-silver text-sm">Memuat data...</div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-8 text-pri-silver text-sm">
              Belum ada pendaftar
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map((reg: RegistrationRow) => (
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
                      No: {reg.members?.member_id} • Daftar: {new Date(reg.created_at).toLocaleDateString("id-ID")}
                    </p>
                    {reg.notes && (
                      <p className="text-[10px] text-yellow-400/70 mt-0.5">Catatan: {reg.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <Badge
                      className={
                        reg.status === "approved" || reg.status === "attended"
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
                          onClick={() => handleRegistrationAction(reg.id, "approved")}
                          className="text-xs text-green-400 hover:text-green-300"
                        >
                          Setujui
                        </button>
                        <button
                          onClick={() => handleRegistrationAction(reg.id, "rejected")}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Tolak
                        </button>
                      </>
                    )}
                    {reg.status === "approved" && (
                      <button
                        onClick={() => handleRegistrationAction(reg.id, "attended")}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Hadir
                      </button>
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
