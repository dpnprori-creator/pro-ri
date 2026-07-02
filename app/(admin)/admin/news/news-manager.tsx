"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { createNews, updateNews, deleteNews } from "@/features/admin/actions";
import { toast } from "sonner";

interface NewsRow {
  id: string;
  title: string;
  category: string;
  status: string;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
}

const columns: Column<NewsRow>[] = [
  { key: "title", label: "Judul", sortable: true },
  {
    key: "category",
    label: "Kategori",
    sortable: true,
    render: (item) => (
      <Badge variant="secondary">
        {item.category === "article"
          ? "Artikel"
          : item.category === "announcement"
          ? "Pengumuman"
          : "Press Release"}
      </Badge>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (item) => (
      <Badge variant={item.status === "published" ? "success" : "secondary"}>
        {item.status === "published" ? "Terbit" : "Draft"}
      </Badge>
    ),
  },
  {
    key: "is_featured",
    label: "Hero",
    sortable: true,
    render: (item) => (
      <Badge variant={item.is_featured ? "default" : "secondary"} className={item.is_featured ? "bg-pri-red/80 text-white border-0" : ""}>
        {item.is_featured ? "Featured" : "—"}
      </Badge>
    ),
  },
  {
    key: "created_at",
    label: "Dibuat",
    sortable: true,
    render: (item) => new Date(item.created_at).toLocaleDateString("id-ID"),
  },
];

export function NewsManager({ news }: { news: NewsRow[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditingNews(null);
    setImagePreview(null);
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (item: NewsRow) => {
    setEditingNews(item);
    setImagePreview(null);
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

    // Fallback: if file input was reset but we have imageFile in state, append directly
    const existingFile = form.get("image") as File | null;
    if (!existingFile || existingFile.size === 0) {
      if (imageFile) {
        form.delete("image");
        form.append("image", imageFile);
      }
    }

    const result = editingNews
      ? await updateNews(editingNews.id, form)
      : await createNews(form);

    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(editingNews ? "Berita diupdate" : "Berita dibuat");
      setDialogOpen(false);
      setImageFile(null);
      setImagePreview(null);
      router.refresh();
    }
  };

  const handleDelete = async (newsId: string) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;
    const result = await deleteNews(newsId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Berita dihapus");
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="bg-pri-red hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Berita
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={news}
        searchKeys={["title", "category"]}
        searchPlaceholder="Cari berita..."
        pageSize={10}
        emptyMessage="Belum ada berita"
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingNews ? "Edit Berita" : "Buat Berita Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingNews ? "Ubah informasi berita" : "Isi informasi berita baru"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Gambar Berita</Label>
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
                    <p className="text-sm text-pri-silver">
                      Klik untuk upload gambar
                    </p>
                    <p className="text-xs text-pri-silver/50">
                      PNG, JPG, WebP, GIF — Maks 5MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Judul Berita</Label>
              <Input
                id="title"
                name="title"
                defaultValue={editingNews?.title}
                required
                placeholder="Masukkan judul berita"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Ringkasan (excerpt)</Label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                placeholder="Ringkasan berita..."
                className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Konten (Markdown)</Label>
              <div className="rounded-md border border-white/20 overflow-hidden">
                <textarea
                  id="content"
                  name="content"
                  rows={14}
                  placeholder="Tulis konten berita di sini... (Markdown supported: # Judul, **bold**, *italic*, - list, [link](url))"
                  className="flex w-full rounded-md border-0 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver font-mono focus:ring-0"
                />
                <div className="border-t border-white/10 bg-pri-dark/80 px-3 py-1.5 text-[10px] text-pri-silver/50 flex items-center gap-3">
                  <span># H1</span>
                  <span>## H2</span>
                  <span>**bold**</span>
                  <span>*italic*</span>
                  <span>- list</span>
                  <span>[link](url)</span>
                  <span>```code```</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  name="category"
                  defaultValue={editingNews?.category || "article"}
                  className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
                >
                  <option value="article">Artikel</option>
                  <option value="announcement">Pengumuman</option>
                  <option value="press_release">Press Release</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={editingNews?.status || "draft"}
                  className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Terbitkan</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isFeatured">Tampilkan di Hero</Label>
                <select
                  id="isFeatured"
                  name="isFeatured"
                  defaultValue={editingNews?.is_featured === true ? "true" : "false"}
                  className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
                >
                  <option value="false">Tidak</option>
                  <option value="true">Ya, Featured</option>
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
                {saving ? "Menyimpan..." : editingNews ? "Simpan" : "Buat Berita"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
