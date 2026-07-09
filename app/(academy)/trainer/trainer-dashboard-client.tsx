"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit3, Eye, Trash2, BookOpen, Loader2, Search, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCourse, deleteCourse } from "@/features/academy/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const levelLabels: Record<string, string> = {
  beginner: "Pemula", intermediate: "Menengah", advanced: "Mahir",
};

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
}

interface TrainerDashboardClientProps {
  courses: CourseItem[];
}

export function TrainerDashboardClient({ courses }: TrainerDashboardClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);

  const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  async function handleDelete(courseId: string, title: string) {
    if (!confirm(`Hapus kursus "${title}"? Semua data akan terhapus permanen.`)) return;
    const result = await deleteCourse(courseId);
    if (result.error) toast.error(result.error);
    else { toast.success("Kursus dihapus"); router.refresh(); }
  }

  async function handleCreate() {
    setCreating(true);
    const formData = new FormData();
    formData.set("title", `Kursus Baru ${new Date().toLocaleDateString("id-ID")}`);
    const result = await createCourse(formData);
    setCreating(false);
    if (result.error) toast.error(result.error);
    else {
      toast.success("Kursus dibuat!");
      if (result.course) router.push(`/academy/trainer/${result.course.id}`);
    }
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-20 glass-card border-white/5">
        <GraduationCap className="h-16 w-16 text-pri-silver/10 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Belum Ada Kursus</h2>
        <p className="text-sm text-pri-silver/40 mb-6 max-w-md mx-auto">
          Anda belum membuat kursus apapun. Mulai dengan membuat kursus pertama Anda!
        </p>
        <Button onClick={handleCreate} disabled={creating} className="bg-pri-red hover:bg-red-700 text-white">
          {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
          Buat Kursus Baru
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pri-silver/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kursus..."
          className="pl-9 pr-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-pri-silver/30 focus:outline-none focus:border-pri-red/50 w-full"
        />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((course) => (
          <div key={course.id} className="glass-card p-4 border-white/5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pri-red to-red-700 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-sm font-medium text-white truncate">{course.title}</h3>
                <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded-full border", statusColors[course.status])}>
                  {course.status}
                </span>
              </div>
              <p className="text-[10px] text-pri-silver/40 font-mono">
                {levelLabels[course.level] || course.level} · {course.category}
                {course.total_lessons > 0 && ` · ${course.total_lessons} pelajaran`}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Link href={`/academy/courses/${course.slug}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-pri-silver hover:text-white">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/academy/trainer/${course.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-pri-silver hover:text-white">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-pri-silver hover:text-red-400"
                onClick={() => handleDelete(course.id, course.title)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


