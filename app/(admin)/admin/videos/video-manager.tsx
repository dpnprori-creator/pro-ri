"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Film, X } from "lucide-react";
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
import { createVideo, updateVideo, deleteVideo } from "@/features/admin/video-actions";
import { toast } from "sonner";

interface VideoRow {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  poster_url: string | null;
  sort_order: number;
  is_active: boolean;
}

const columns: Column<VideoRow>[] = [
  {
    key: "video_url",
    label: "Video",
    render: (item) => (
      <div className="h-12 w-20 rounded-md overflow-hidden bg-pri-dark flex items-center justify-center">
        <video className="h-full w-full object-cover" muted preload="metadata">
          <source src={item.video_url} />
        </video>
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

export function VideoManager({ videos }: { videos: VideoRow[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const openCreate = () => {
    setEditingVideo(null);
    setVideoPreview(null);
    setDialogOpen(true);
  };

  const openEdit = (item: VideoRow) => {
    setEditingVideo(item);
    setVideoPreview(item.video_url || null);
    setDialogOpen(true);
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoPreview(e.target.value || null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const isActive = (e.currentTarget.querySelector("[name=isActive]") as HTMLSelectElement)?.value;
    form.set("isActive", isActive);

    const result = editingVideo
      ? await updateVideo(editingVideo.id, form)
      : await createVideo(form);

    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(editingVideo ? "Video diupdate" : "Video ditambahkan");
      setDialogOpen(false);
      setVideoPreview(null);
      router.refresh();
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm("Yakin ingin menghapus video ini?")) return;
    const result = await deleteVideo(videoId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Video dihapus");
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate} className="bg-pri-red hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Video
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={videos}
        searchKeys={["title", "description"]}
        searchPlaceholder="Cari video..."
        pageSize={10}
        emptyMessage="Belum ada video"
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
              {editingVideo ? "Edit Video" : "Tambah Video Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingVideo
                ? "Ubah informasi video"
                : "Tambahkan video pendek baru untuk halaman utama"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Video URL */}
            <div className="space-y-2">
              <Label htmlFor="videoUrl">
                URL Video <span className="text-pri-red">*</span>
              </Label>
              <Input
                id="videoUrl"
                name="videoUrl"
                defaultValue={editingVideo?.video_url || ""}
                required
                onChange={handleVideoUrlChange}
                placeholder="https://example.com/video.mp4 atau link embed"
              />
              <p className="text-[10px] text-pri-silver/50">
                Masukkan URL langsung ke file video (.mp4, .webm) atau link video
              </p>
            </div>

            {/* Video Preview */}
            {videoPreview && (
              <div className="relative rounded-lg overflow-hidden bg-pri-dark">
                <video
                  src={videoPreview}
                  className="w-full max-h-40 object-contain"
                  controls
                  muted
                />
                <button
                  type="button"
                  onClick={() => setVideoPreview(null)}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">
                Judul <span className="text-pri-red">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={editingVideo?.title}
                required
                placeholder="Masukkan judul video"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea
                id="description"
                name="description"
                rows={2}
                defaultValue={editingVideo?.description || ""}
                placeholder="Deskripsi singkat video..."
                className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="posterUrl">URL Poster / Thumbnail</Label>
              <Input
                id="posterUrl"
                name="posterUrl"
                defaultValue={editingVideo?.poster_url || ""}
                placeholder="https://example.com/thumbnail.jpg"
              />
              <p className="text-[10px] text-pri-silver/50">
                Gambar yang muncul sebelum video diputar (opsional)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Urutan Tampil</Label>
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  defaultValue={editingVideo?.sort_order ?? 0}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <select
                  id="isActive"
                  name="isActive"
                  defaultValue={editingVideo?.is_active ? "true" : "false"}
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
              <Button
                type="submit"
                className="bg-pri-red hover:bg-red-700"
                disabled={saving}
              >
                {saving ? "Menyimpan..." : editingVideo ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
