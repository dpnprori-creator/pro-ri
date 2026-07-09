"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Edit3, Trash2, Eye, BookOpen, Clock, GraduationCap,
  CheckCircle, XCircle, Loader2, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createCourse, updateCourse, deleteCourse } from "@/features/academy/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  published: "bg-green-500/10 text-green-400 border-green-500/20",
  archived: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  status: string;
  total_lessons: number;
  duration_hours: number;
  created_at: string;
  created_by: { full_name: string } | null;
}

interface AdminAcademyClientProps {
  courses: CourseItem[];
}

export function AdminAcademyClient({ courses }: AdminAcademyClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [creating, setCreating] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    const formData = new FormData(e.currentTarget);
    const result = await createCourse(formData);
    setCreating(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Kursus berhasil dibuat!");
      setOpenCreate(false);
      router.refresh();
    }
  }

  async function handleDelete(courseId: string, title: string) {
    if (!confirm(`Hapus kursus "${title}"? Semua modul dan materi akan ikut terhapus.`)) return;
    const result = await deleteCourse(courseId);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Kursus berhasil dihapus");
      router.refresh();
    }
  }

  async function handleToggleStatus(courseId: string, currentStatus: string) {
    const newStatus = currentStatus === "draft" ? "published" : currentStatus === "published" ? "archived" : "draft";
    const formData = new FormData();
    formData.set("status", newStatus);
    const result = await updateCourse(courseId, formData);
    if (result.error) toast.error(result.error);
    else {
      toast.success(`Status diubah ke ${newStatus}`);
      router.refresh();
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pri-silver/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kursus..."
              className="pl-9 pr-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-pri-silver/30 focus:outline-none focus:border-pri-red/50 w-48"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-pri-silver focus:outline-none focus:border-pri-red/50"
          >
            <option value="all">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-pri-red hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-1" /> Buat Kursus
            </Button>
          </DialogTrigger>
          <DialogContent className="border-white/10 bg-pri-dark max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Buat Kursus Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Kursus</Label>
                <Input id="title" name="title" required className="bg-pri-carbon/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <select id="category" name="category" className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white">
                    <option value="ai">AI</option>
                    <option value="programming">Programming</option>
                    <option value="robotik">Robotik</option>
                    <option value="iot">IoT</option>
                    <option value="robotics">Robotika</option>
                    <option value="technology">Teknologi</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <select id="level" name="level" className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white">
                    <option value="beginner">Pemula</option>
                    <option value="intermediate">Menengah</option>
                    <option value="advanced">Mahir</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <textarea id="description" name="description" rows={3} className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white resize-none" />
              </div>
              <Button type="submit" disabled={creating} className="w-full bg-pri-red hover:bg-red-700 text-white">
                {creating ? "Membuat..." : "Buat Kursus"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 glass-card border-white/5">
          <GraduationCap className="h-12 w-12 text-pri-silver/20 mx-auto mb-3" />
          <p className="text-pri-silver/40 text-sm">Belum ada kursus</p>
        </div>
      ) : (
        <div className="glass-card border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left px-4 py-3 text-[10px] font-mono text-pri-silver/40 uppercase tracking-wider">Judul</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-pri-silver/40 uppercase tracking-wider hidden md:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-pri-silver/40 uppercase tracking-wider hidden lg:table-cell">Level</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-pri-silver/40 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono text-pri-silver/40 uppercase tracking-wider hidden md:table-cell">Pembuat</th>
                <th className="text-right px-4 py-3 text-[10px] font-mono text-pri-silver/40 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((course) => (
                <tr key={course.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-white font-medium truncate max-w-[250px]">{course.title}</p>
                      <p className="text-[10px] text-pri-silver/30 font-mono mt-0.5">
                        {course.total_lessons} lesson{course.duration_hours > 0 ? ` · ${course.duration_hours} jam` : ""}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-pri-silver/60">{course.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-pri-silver/60">{course.level}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleStatus(course.id, course.status)}
                      className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors cursor-pointer",
                        statusColors[course.status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
                      )}
                    >
                      {course.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-pri-silver/50">{course.created_by?.full_name || "-"}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/academy/courses/${course.slug}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-pri-silver hover:text-white">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/admin/academy/${course.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-pri-silver hover:text-white">
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost" size="icon"
                        className="h-7 w-7 text-pri-silver hover:text-red-400"
                        onClick={() => handleDelete(course.id, course.title)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
