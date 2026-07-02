"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Upload, X, GripVertical, MoveUp, MoveDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DataTable,
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
import { createHeroGalleryItem, updateHeroGalleryItem, deleteHeroGalleryItem } from "@/features/admin/actions";
import { toast } from "sonner";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  link_label: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

const columns: Column<GalleryItem>[] = [
  {
    key: "image_url",
    label: "Gambar",
    render: (item) => (
      <div className="h-12 w-20 rounded-md overflow-hidden bg-pri-dark">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            width={80}
            height={48}
            className="object-cover h-full w-full"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-pri-silver">
            No img
          </div>
        )}
      </div>
    ),
  },
  { key: "title", label: "Judul", sortable: true },
  {
    key: "sort_order",
    label: "Urutan",
    sortable: true,
    render: (item) => (
      <span className="text-xs font-mono text-pri-silver">{item.sort_order}</span>
    ),
  },
  {
    key: "is_active",
    label: "Status",
    render: (item) => (
      <Badge variant={item.is_active ? "success" : "secondary"}>
        {item.is_active ? "Aktif" : "Nonaktif"}
      </Badge>
    ),
  },
];

export function GalleryManager({ items }: { items: GalleryItem[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditingItem(null);
    setImagePreview(null);
    setImageFile(null);
    setImageUrlInput("");
    setDialogOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setImagePreview(item.image_url || null);
    setImageFile(null);
    setImageUrlInput(item.image_url || "");
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
    if (imageFile) {
      form.append("image", imageFile);
    } else if (imageUrlInput) {
      form.append("imageUrl", imageUrlInput);
    }
    // Always set isActive
    const isActive = (e.currentTarget.querySelector("[name=isActive]") as HTMLSelectElement)?.value;
    form.set("isActive", isActive);

    const result = editingItem
      ? await updateHeroGalleryItem(editingItem.id, form)
      : await createHeroGalleryItem(form);

    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(editingItem ? "Gallery item diupdate" : "Gallery item dibuat");
      setDialogOpen(false);
      setImageFile(null);
      setImagePreview(null);
      setImageUrlInput("");
      router.refresh();
    }
  };

  const handleDelete = async (galleryId: string) => {
    if (!confirm("Yakin ingin menghapus item gallery ini?")) return;
    const result = await deleteHeroGalleryItem(galleryId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Gallery item dihapus");
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="bg-pri-red hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Item Gallery
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        searchKeys={["title", "description"]}
        searchPlaceholder="Cari gallery..."
        pageSize={10}
        emptyMessage="Belum ada item gallery"
        actions={(item) => (
          <div className="flex items-center gap-2 justify-end">
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
              {editingItem ? "Edit Gallery Item" : "Tambah Gallery Item"}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? "Ubah informasi gallery" : "Tambah gambar hero baru untuk halaman utama"}
            </DialogDescription>
          </DialogHeader>

          <form key={editingItem?.id ?? 'create'} onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload / URL */}
            <div className="space-y-2">
              <Label>Gambar Hero <span className="text-pri-red">*</span></Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-pri-red/50 transition-colors group"
              >
                {imagePreview && !imageUrlInput.startsWith("http") ? (
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
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-pri-dark px-2 text-pri-silver/50">atau masukkan URL gambar</span>
                </div>
              </div>
              <Input
                value={imageUrlInput}
                onChange={(e) => {
                  setImageUrlInput(e.target.value);
                  if (e.target.value) {
                    setImageFile(null);
                    setImagePreview(e.target.value);
                  }
                }}
                placeholder="https://example.com/gambar.jpg"
                className="bg-pri-dark/50 border-white/10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Judul <span className="text-pri-red">*</span></Label>
              <Input
                id="title"
                name="title"
                defaultValue={editingItem?.title}
                required
                placeholder="Masukkan judul slide"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Keterangan / Deskripsi</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={editingItem?.description || ""}
                placeholder="Deskripsi singkat untuk slide hero..."
                className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkUrl">URL / Alamat Tujuan</Label>
                <Input
                  id="linkUrl"
                  name="linkUrl"
                  defaultValue={editingItem?.link_url || ""}
                  placeholder="https://prori.id/programs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkLabel">Teks Tombol</Label>
                <Input
                  id="linkLabel"
                  name="linkLabel"
                  defaultValue={editingItem?.link_label || "Pelajari Selengkapnya"}
                  placeholder="Pelajari Selengkapnya"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Urutan Tampil</Label>
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  defaultValue={editingItem?.sort_order ?? 0}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <select
                  id="isActive"
                  name="isActive"
                  defaultValue={editingItem?.is_active ? "true" : "false"}
                  className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Nonaktif</option>
                </select>
              </div>
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
                {saving ? "Menyimpan..." : editingItem ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
