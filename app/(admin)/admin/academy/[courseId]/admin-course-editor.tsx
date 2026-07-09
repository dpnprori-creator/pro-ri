"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, Edit3, ChevronDown, ChevronRight,
  BookOpen, Video, FileText, GripVertical, Loader2, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  updateCourse, createModule, updateModule, deleteModule,
  createLesson, updateLesson, deleteLesson
} from "@/features/academy/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  video_url: string | null;
  duration_minutes: number;
  is_free: boolean;
  sort_order: number;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  course_lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  category: string;
  level: string;
  status: string;
  learning_path: string | null;
  image_url: string | null;
  duration_hours: number;
  total_lessons: number;
  modules: Module[];
}

interface AdminCourseEditorProps {
  course: Course;
}

export function AdminCourseEditor({ course }: AdminCourseEditorProps) {
  const router = useRouter();
  const [expandedModules, setExpandedModules] = useState<string[]>(
    course.modules.map(m => m.id)
  );
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [openModuleDialog, setOpenModuleDialog] = useState(false);
  const [openLessonDialog, setOpenLessonDialog] = useState(false);
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [moduleLessonModuleId, setModuleLessonModuleId] = useState<string>("");

  const toggleModule = (id: string) => {
    setExpandedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // Course Edit
  async function handleUpdateCourse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateCourse(course.id, formData);
    setSaving(false);
    if (result.error) toast.error(result.error);
    else { toast.success("Kursus diupdate"); setOpenCourseDialog(false); router.refresh(); }
  }

  // Module Create
  async function handleCreateModule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.set("courseId", course.id);
    formData.set("title", (e.currentTarget.elements.namedItem("title") as HTMLInputElement).value);
    const result = await createModule(formData);
    setSaving(false);
    if (result.error) toast.error(result.error);
    else { toast.success("Modul ditambahkan"); setOpenModuleDialog(false); router.refresh(); }
  }

  // Module Edit
  async function handleUpdateModule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingModule) return;
    setSaving(true);
    const formData = new FormData();
    formData.set("moduleId", editingModule.id);
    formData.set("title", (e.currentTarget.elements.namedItem("title") as HTMLInputElement).value);
    formData.set("description", (e.currentTarget.elements.namedItem("description") as HTMLTextAreaElement).value);
    const result = await updateModule(formData);
    setSaving(false);
    if (result.error) toast.error(result.error);
    else { toast.success("Modul diupdate"); setEditingModule(null); router.refresh(); }
  }

  // Module Delete
  async function handleDeleteModule(moduleId: string) {
    if (!confirm("Hapus modul ini? Semua pelajaran di dalamnya akan ikut terhapus.")) return;
    const result = await deleteModule(moduleId, course.id);
    if (result.error) toast.error(result.error);
    else { toast.success("Modul dihapus"); router.refresh(); }
  }

  // Lesson Create
  async function handleCreateLesson(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    formData.set("moduleId", moduleLessonModuleId);
    const result = await createLesson(formData);
    setSaving(false);
    if (result.error) toast.error(result.error);
    else { toast.success("Pelajaran ditambahkan"); setOpenLessonDialog(false); router.refresh(); }
  }

  // Lesson Edit
  async function handleUpdateLesson(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingLesson) return;
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    formData.set("lessonId", editingLesson.id);
    const result = await updateLesson(formData);
    setSaving(false);
    if (result.error) toast.error(result.error);
    else { toast.success("Pelajaran diupdate"); setEditingLesson(null); router.refresh(); }
  }

  // Lesson Delete
  async function handleDeleteLesson(lessonId: string) {
    if (!confirm("Hapus pelajaran ini?")) return;
    const result = await deleteLesson(lessonId, course.id);
    if (result.error) toast.error(result.error);
    else { toast.success("Pelajaran dihapus"); router.refresh(); }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Course Info */}
      <div className="lg:col-span-1 space-y-4">
        <div className="glass-card p-5 border-white/5">
          <h2 className="text-sm font-semibold text-white mb-3">Informasi Kursus</h2>
          <div className="space-y-2 text-xs text-pri-silver/60">
            <p><span className="text-pri-silver/40">Status:</span> <span className="text-white">{course.status}</span></p>
            <p><span className="text-pri-silver/40">Kategori:</span> {course.category}</p>
            <p><span className="text-pri-silver/40">Level:</span> {course.level}</p>
            <p><span className="text-pri-silver/40">Modul:</span> {course.modules.length}</p>
            <p><span className="text-pri-silver/40">Total Pelajaran:</span> {course.modules.reduce((s, m) => s + (m.course_lessons?.length || 0), 0)}</p>
            {course.description && (
              <p className="mt-2 pt-2 border-t border-white/5">
                <span className="text-pri-silver/40">Deskripsi:</span><br />
                {course.description}
              </p>
            )}
          </div>
          <Button
            variant="outline" size="sm"
            className="w-full mt-4 border-white/10 text-pri-silver hover:text-white text-xs"
            onClick={() => setOpenCourseDialog(true)}
          >
            <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit Informasi
          </Button>
        </div>

        <div className="glass-card p-5 border-white/5">
          <h2 className="text-sm font-semibold text-white mb-3">Link Cepat</h2>
          <div className="space-y-2">
            <a href={`/academy/courses/${course.slug}`} target="_blank" className="block text-xs text-pri-red hover:text-red-400">Lihat halaman publik →</a>
            <a href={`/academy/learn/${course.id}/${course.modules[0]?.course_lessons?.[0]?.id || ""}`} target="_blank" className="block text-xs text-pri-silver/60 hover:text-white">Preview pembelajaran →</a>
          </div>
        </div>
      </div>

      {/* Right: Modules & Lessons */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Modul & Pelajaran</h2>
          <Dialog open={openModuleDialog} onOpenChange={setOpenModuleDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-pri-red hover:bg-red-700 text-white text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Modul
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/10 bg-pri-dark max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Tambah Modul Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateModule} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="moduleTitle">Judul Modul</Label>
                  <Input id="title" name="title" required className="bg-pri-carbon/50" />
                </div>
                <Button type="submit" disabled={saving} className="w-full bg-pri-red hover:bg-red-700 text-white">
                  {saving ? "Menyimpan..." : "Tambah Modul"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {course.modules.length === 0 ? (
          <div className="text-center py-12 glass-card border-white/5">
            <BookOpen className="h-10 w-10 text-pri-silver/20 mx-auto mb-2" />
            <p className="text-sm text-pri-silver/40">Belum ada modul. Tambah modul pertama!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id} className="glass-card border-white/5 overflow-hidden">
                {/* Module Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/5">
                  <button onClick={() => toggleModule(mod.id)} className="text-pri-silver/30 hover:text-white">
                    {expandedModules.includes(mod.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  <span className="h-5 w-5 rounded-full bg-pri-red/10 flex items-center justify-center text-[9px] font-bold text-pri-red font-mono">{modIdx + 1}</span>
                  <span className="text-sm font-medium text-white flex-1">{mod.title}</span>
                  <span className="text-[9px] text-pri-silver/30 font-mono">{mod.course_lessons?.length || 0} pelajaran</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-pri-silver hover:text-white"
                    onClick={() => { setEditingModule(mod); }}>
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-pri-silver hover:text-red-400"
                    onClick={() => handleDeleteModule(mod.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                {/* Lessons */}
                {expandedModules.includes(mod.id) && (
                  <div className="divide-y divide-white/5">
                    {mod.course_lessons?.map((lesson) => (
                      <div key={lesson.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                        <div className="h-6 w-6 rounded-full bg-pri-red/5 flex items-center justify-center shrink-0">
                          {lesson.video_url ? <Video className="h-3 w-3 text-pri-silver/40" /> : <FileText className="h-3 w-3 text-pri-silver/40" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate">{lesson.title}</p>
                          <p className="text-[9px] text-pri-silver/30 font-mono">
                            {lesson.duration_minutes > 0 ? `${lesson.duration_minutes} mnt` : ""}
                            {lesson.is_free ? <span className="text-green-400/60 ml-2">GRATIS</span> : ""}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-pri-silver hover:text-white shrink-0"
                          onClick={() => setEditingLesson(lesson)}>
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-pri-silver hover:text-red-400 shrink-0"
                          onClick={() => handleDeleteLesson(lesson.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <div className="px-4 py-2">
                      <Button
                        variant="ghost" size="sm"
                        className="text-xs text-pri-silver/50 hover:text-pri-red w-full justify-start"
                        onClick={() => { setModuleLessonModuleId(mod.id); setOpenLessonDialog(true); }}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Tambah Pelajaran
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Module Dialog */}
      <Dialog open={!!editingModule && !openModuleDialog} onOpenChange={(open) => { if (!open) setEditingModule(null); }}>
        <DialogContent className="border-white/10 bg-pri-dark max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Modul</DialogTitle>
          </DialogHeader>
          {editingModule && (
            <form onSubmit={handleUpdateModule} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul Modul</Label>
                <Input name="title" defaultValue={editingModule.title} required className="bg-pri-carbon/50" />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi (opsional)</Label>
                <textarea name="description" defaultValue={editingModule.description || ""} rows={2}
                  className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white resize-none" />
              </div>
              <Button type="submit" disabled={saving} className="w-full bg-pri-red hover:bg-red-700 text-white">
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Dialog */}
      <Dialog open={!!editingLesson} onOpenChange={(open) => { if (!open) setEditingLesson(null); }}>
        <DialogContent className="border-white/10 bg-pri-dark max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Pelajaran</DialogTitle>
          </DialogHeader>
          {editingLesson && (
            <form onSubmit={handleUpdateLesson} className="space-y-4">
              <div className="space-y-2">
                <Label>Judul Pelajaran</Label>
                <Input name="title" defaultValue={editingLesson.title} required className="bg-pri-carbon/50" />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <textarea name="description" defaultValue={editingLesson.description || ""} rows={2}
                  className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white resize-none" />
              </div>
              <div className="space-y-2">
                <Label>Konten (Markdown / teks)</Label>
                <textarea name="content" defaultValue={editingLesson.content || ""} rows={6}
                  className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white resize-none font-mono" />
              </div>
              <div className="space-y-2">
                <Label>URL Video (YouTube embed)</Label>
                <Input name="videoUrl" defaultValue={editingLesson.video_url || ""} className="bg-pri-carbon/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Durasi (menit)</Label>
                  <Input name="durationMinutes" type="number" defaultValue={editingLesson.duration_minutes} className="bg-pri-carbon/50" />
                </div>
                <div className="space-y-2 flex items-end pb-2">
                  <label className="flex items-center gap-2 text-xs text-pri-silver">
                    <input type="checkbox" name="isFree" defaultChecked={editingLesson.is_free} className="rounded border-white/20" />
                    Gratis (tanpa login)
                  </label>
                </div>
              </div>
              <Button type="submit" disabled={saving} className="w-full bg-pri-red hover:bg-red-700 text-white">
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Lesson Dialog */}
      <Dialog open={openLessonDialog && !editingLesson} onOpenChange={(open) => { if (!open) setOpenLessonDialog(false); }}>
        <DialogContent className="border-white/10 bg-pri-dark max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Tambah Pelajaran Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateLesson} className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Pelajaran</Label>
              <Input name="title" required className="bg-pri-carbon/50" />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <textarea name="description" rows={2}
                className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white resize-none" />
            </div>
            <div className="space-y-2">
              <Label>Konten</Label>
              <textarea name="content" rows={6}
                className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white resize-none font-mono" />
            </div>
            <div className="space-y-2">
              <Label>URL Video</Label>
              <Input name="videoUrl" className="bg-pri-carbon/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Durasi (menit)</Label>
                <Input name="durationMinutes" type="number" defaultValue={0} className="bg-pri-carbon/50" />
              </div>
              <div className="space-y-2 flex items-end pb-2">
                <label className="flex items-center gap-2 text-xs text-pri-silver">
                  <input type="checkbox" name="isFree" className="rounded border-white/20" />
                  Gratis
                </label>
              </div>
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-pri-red hover:bg-red-700 text-white">
              {saving ? "Menyimpan..." : "Tambah Pelajaran"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Course Info Dialog */}
      <Dialog open={openCourseDialog} onOpenChange={setOpenCourseDialog}>
        <DialogContent className="border-white/10 bg-pri-dark max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Informasi Kursus</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCourse} className="space-y-4">
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input name="title" defaultValue={course.title} required className="bg-pri-carbon/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <select name="category" defaultValue={course.category} className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white">
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
                <Label>Level</Label>
                <select name="level" defaultValue={course.level} className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white">
                  <option value="beginner">Pemula</option>
                  <option value="intermediate">Menengah</option>
                  <option value="advanced">Mahir</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi Singkat</Label>
              <Input name="short_description" defaultValue={course.short_description || ""} className="bg-pri-carbon/50" />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi Lengkap</Label>
              <textarea name="description" defaultValue={course.description || ""} rows={4}
                className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Durasi (jam)</Label>
                <Input name="duration_hours" type="number" defaultValue={course.duration_hours} className="bg-pri-carbon/50" />
              </div>
              <div className="space-y-2">
                <Label>Learning Path</Label>
                <Input name="learningPath" defaultValue={course.learning_path || ""} className="bg-pri-carbon/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select name="status" defaultValue={course.status} className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-pri-red hover:bg-red-700 text-white">
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
