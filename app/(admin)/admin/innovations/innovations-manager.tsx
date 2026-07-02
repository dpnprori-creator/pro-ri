"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Upload, X } from "lucide-react";
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
import { createInnovation, updateInnovation, deleteInnovation } from "@/features/admin/actions";
import { toast } from "sonner";

interface InnovationRow {
  id: string;
  title: string;
  category: string;
  year: number | null;
  status: string;
  description?: string | null;
  creator_id?: string | null;
  province_id?: string | null;
  image_url?: string | null;
}

interface Province {
  id: string;
  name: string;
}

const categoryLabels: Record<string, string> = {
  robotics: "Robotika", ai: "AI", iot: "IoT", programming: "Programming", research: "Research",
};

const columns: Column<InnovationRow>[] = [
  { key: "title", label: "Judul", sortable: true },
  {
    key: "category",
    label: "Kategori",
    sortable: true,
    render: (item) => (
      <Badge variant="default">{categoryLabels[item.category] || item.category}</Badge>
    ),
  },
  { key: "year", label: "Tahun", sortable: true },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (item) => (
      <Badge variant={item.status === "published" || item.status === "featured" ? "success" : "secondary"}>
        {item.status === "published" ? "Terbit" : item.status === "featured" ? "Featured" : "Draft"}
      </Badge>
    ),
  },
];

export function InnovationsManager({
  innovations,
  provinces,
}: {
  innovations: InnovationRow[];
  provinces: Province[];
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<InnovationRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditing(null);
    setImagePreview(null);
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (item: InnovationRow) => {
    setEditing(item);
    setImagePreview(item.image_url || null);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    if (imageFile) form.append("image", imageFile);

    const result = editing
      ? await updateInnovation(editing.id, form)
      : await createInnovation(form);
    setSaving(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success(editing ? "Inovasi diupdate" : "Inovasi dibuat");
      setDialogOpen(false);
      setImageFile(null);
      setImagePreview(null);
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus inovasi ini?")) return;
    const result = await deleteInnovation(id);
    if (result.error) toast.error(result.error);
    else { toast.success("Inovasi dihapus"); router.refresh(); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="bg-pri-red hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" /> Tambah Inovasi
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={innovations}
        searchKeys={["title", "category"]}
        searchPlaceholder="Cari inovasi..."
        pageSize={10}
        emptyMessage="Belum ada inovasi"
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
            <DialogTitle className="text-white">{editing ? "Edit Inovasi" : "Tambah Inovasi"}</DialogTitle>
            <DialogDescription>Isi informasi inovasi baru</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Gambar Inovasi</Label>
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
                      onClick={(e) => { e.stopPropagation(); removeImage(); }}
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
                    <p className="text-sm text-pri-silver">Klik untuk upload gambar</p>
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
              <Label htmlFor="title">Judul</Label>
              <Input id="title" name="title" defaultValue={editing?.title} required placeholder="Judul inovasi" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <select id="category" name="category" defaultValue={editing?.category || "robotics"} className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white">
                <option value="robotics">Robotika</option>
                <option value="ai">AI</option>
                <option value="iot">IoT</option>
                <option value="programming">Programming</option>
                <option value="research">Research</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea id="description" name="description" rows={4} defaultValue={editing?.description || ""} placeholder="Deskripsi inovasi..." className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creatorId">Creator ID</Label>
                <Input id="creatorId" name="creatorId" defaultValue={editing?.creator_id || ""} placeholder="Member ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provinceId">Provinsi</Label>
                <select id="provinceId" name="provinceId" className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white">
                  <option value="">Pilih provinsi</option>
                  {provinces.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Tahun</Label>
                <Input id="year" name="year" type="number" defaultValue={editing?.year || new Date().getFullYear()} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" defaultValue={editing?.status || "draft"} className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white">
                  <option value="draft">Draft</option>
                  <option value="published">Terbit</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" className="bg-pri-red hover:bg-red-700" disabled={saving}>
                {saving ? "Menyimpan..." : editing ? "Simpan" : "Buat Inovasi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
