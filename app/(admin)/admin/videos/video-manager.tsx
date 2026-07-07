"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X, Film } from "lucide-react";
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
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterUrlInput, setPosterUrlInput] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditingVideo(null);
    setVideoPreview(null);
    setVideoFile(null);
    setVideoUrlInput("");
    setPosterPreview(null);
    setPosterFile(null);
    setPosterUrlInput("");
    setDialogOpen(true);
  };

  const openEdit = (item: VideoRow) => {
    setEditingVideo(item);
    setVideoPreview(item.video_url || null);
    setVideoFile(null);
    setVideoUrlInput(item.video_url || "");
    setPosterPreview(item.poster_url || null);
    setPosterFile(null);
    setPosterUrlInput(item.poster_url || "");
    setDialogOpen(true);
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast.error("Video maksimal 100MB");
      return;
    }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handlePosterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Gambar poster maksimal 5MB");
      return;
    }
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const loadingToast = toast.loading(editingVideo ? "Menyimpan perubahan..." : "Mengupload video...");

    const form = new FormData(e.currentTarget);

    // Video file or URL
    if (videoFile) {
      form.append("video", videoFile);
    } else if (videoUrlInput) {
      form.append("videoUrl", videoUrlInput);
    }

    // Poster file or URL
    if (posterFile) {
      form.append("poster", posterFile);
    } else if (posterUrlInput) {
      form.append("posterUrl", posterUrlInput);
    }

    // Fix isActive
    const isActive = (e.currentTarget.querySelector("[name=isActive]") as HTMLSelectElement)?.value;
    form.set("isActive", isActive);

    const result = editingVideo
      ? await updateVideo(editingVideo.id, form)
      : await createVideo(form);

    setSaving(false);
    toast.dismiss(loadingToast);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(editingVideo ? "Video diupdate" : "Video ditambahkan");
      setDialogOpen(false);
      setVideoFile(null);
      setVideoPreview(null);
      setVideoUrlInput("");
      setPosterFile(null);
      setPosterPreview(null);
      setPosterUrlInput("");
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
                ? "Ubah informasi video atau upload file baru"
                : "Upload video atau masukkan URL video untuk halaman utama"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Video Upload / URL */}
            <div className="space-y-2">
              <Label>File Video <span className="text-pri-red">*</span></Label>
              <div
                onClick={() => videoInputRef.current?.click()}
                className="relative border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-pri-red/50 transition-colors group"
              >
                {videoPreview && !videoUrlInput.startsWith("http") ? (
                  <div className="relative">
                    <video
                      src={videoPreview}
                      className="w-full max-h-36 rounded-lg object-contain bg-black"
                      controls
                      muted
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoFile(null);
                        setVideoPreview(null);
                        if (videoInputRef.current) videoInputRef.current.value = "";
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
                    <p className="text-sm text-pri-silver">Klik untuk upload file video</p>
                    <p className="text-xs text-pri-silver/50">MP4, WebM, MOV — Maks 100MB</p>
                  </div>
                )}
                <input
                  ref={videoInputRef}
                  type="file"
                  name="video"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />
              </div>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-pri-dark px-2 text-pri-silver/50">atau masukkan URL video</span>
                </div>
              </div>
              <Input
                value={videoUrlInput}
                onChange={(e) => {
                  setVideoUrlInput(e.target.value);
                  if (e.target.value) {
                    setVideoFile(null);
                    setVideoPreview(e.target.value);
                  }
                }}
                placeholder="https://example.com/video.mp4"
                className="bg-pri-dark/50 border-white/10 text-sm"
              />
            </div>

            {/* Poster / Thumbnail Upload */}
            <div className="space-y-2">
              <Label>Poster / Thumbnail</Label>
              <div
                onClick={() => posterInputRef.current?.click()}
                className="relative border-2 border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer hover:border-pri-red/50 transition-colors group"
              >
                {posterPreview ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={posterPreview}
                      alt="Poster preview"
                      className="rounded-lg object-cover max-h-32 w-full"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPosterFile(null);
                        setPosterPreview(null);
                        if (posterInputRef.current) posterInputRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="h-4 w-4 text-pri-silver" />
                    <p className="text-xs text-pri-silver">Upload gambar poster</p>
                  </div>
                )}
                <input
                  ref={posterInputRef}
                  type="file"
                  name="poster"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePosterFileChange}
                  className="hidden"
                />
              </div>
              <Input
                value={posterUrlInput}
                onChange={(e) => {
                  setPosterUrlInput(e.target.value);
                  if (e.target.value) {
                    setPosterFile(null);
                    setPosterPreview(e.target.value);
                  }
                }}
                placeholder="https://example.com/thumbnail.jpg"
                className="bg-pri-dark/50 border-white/10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Judul <span className="text-pri-red">*</span></Label>
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
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-pri-red hover:bg-red-700" disabled={saving}>
                {saving ? "Menyimpan..." : editingVideo ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
