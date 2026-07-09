"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, Edit3, ChevronDown, ChevronRight,
  BookOpen, Video, FileText, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

interface TrainerCourseEditorProps {
  course: Course;
}

export function TrainerCourseEditor({ course }: TrainerCourseEditorProps) {
  const router = useRouter();
  const [expandedModules, setExpandedModules] = useState<string[]>(course.modules.map(m => m.id));
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [saving, setSaving] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null); // moduleId
  const [showCourseEdit, setShowCourseEdit] = useState(false);

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
    else { toast.success("Kursus diupdate"); setShowCourseEdit(false); router.refresh(); }
  }

  // Module Create
  async function handleCreateModule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.set("courseId", course.id);
    fd.set("title", (e.currentTarget.elements.namedItem("title") as HTMLInputElement).value);
    const result = await createModule(fd);
    setSaving(false);
    if (result.error) toast.error(result.error);
    else { toast.success("Modul ditambahkan"); setShowModuleForm(false); router.refresh(); }
  }

  // Module Edit
  async function handleUpdateModule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingModule) return;
    setSaving(true);
    const fd = new FormData();
    fd.set("moduleId", editingModule.id);
    fd.set("title", (e.currentTarget.elements.namedItem("title") as HTMLInputElement).value);
    fd.set("description", (e.currentTarget.elements.namedItem("description") as HTMLTextAreaElement).value);
    const result = await updateModule(fd);
    setSaving(false);
    if (result.error) toast.error(result.error);
    else { toast.success("Modul diupdate"); setEditingModule(null); router.refresh(); }
  }

  // Module Delete
  async function handleDeleteModule(moduleId: string) {
    if (!confirm("Hapus modul? Semua pelajaran di dalamnya akan ikut terhapus.")) return;
    const result = await deleteModule(moduleId, course.id);
    if (result.error) toast.error(result.error);
    else { toast.success("Modul dihapus"); router.refresh(); }
  }

  // Lesson Create
  async function handleCreateLesson(e: React.FormEvent<HTMLFormElement>, moduleId: string) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    fd.set("moduleId", moduleId);
    const result = await createLesson(fd);
    setSaving(false);
    if (result.error) toast.error(result.error);
    else { toast.success("Pelajaran ditambahkan"); setShowLessonForm(null); router.refresh(); }
  }

  // Lesson Edit
  async function handleUpdateLesson(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingLesson) return;
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    fd.set("lessonId", editingLesson.id);
    const result = await updateLesson(fd);
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
    <div className="space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 max-w-lg">
        <div className="glass-card p-3 border-white/5 text-center">
          <p className="text-lg font-bold text-white font-mono">{course.modules.length}</p>
          <p className="text-[10px] text-pri-silver/40">Modul</p>
        </div>
        <div className="glass-card p-3 border-white/5 text-center">
          <p className="text-lg font-bold text-white font-mono">
            {course.modules.reduce((s, m) => s + (m.course_lessons?.length || 0), 0)}
          </p>
          <p className="text-[10px] text-pri-silver/40">Pelajaran</p>
        </div>
        <div className="glass-card p-3 border-white/5 text-center">
          <p className="text-lg font-bold text-white font-mono">{course.duration_hours}h</p>
          <p className="text-[10px] text-pri-silver/40">Durasi</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" className="border-white/10 text-pri-silver hover:text-white text-xs"
          onClick={() => setShowCourseEdit(true)}>
          <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit Info
        </Button>
        <Button size="sm" className="bg-pri-red hover:bg-red-700 text-white text-xs"
          onClick={() => setShowModuleForm(true)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Modul
        </Button>
      </div>

      {/* Modules & Lessons */}
      {course.modules.length === 0 && !showModuleForm ? (
        <div className="text-center py-16 glass-card border-white/5">
          <BookOpen className="h-12 w-12 text-pri-silver/20 mx-auto mb-3" />
          <p className="text-sm text-pri-silver/40">Belum ada modul. Tambah modul pertama untuk mulai menyusun materi!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {course.modules.map((mod, modIdx) => (
            <div key={mod.id} className="glass-card border-white/5 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/5">
                <button onClick={() => toggleModule(mod.id)} className="text-pri-silver/30 hover:text-white">
                  {expandedModules.includes(mod.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                <span className="h-5 w-5 rounded-full bg-pri-red/10 flex items-center justify-center text-[9px] font-bold text-pri-red font-mono">{modIdx + 1}</span>
                <span className="text-sm font-medium text-white flex-1">{mod.title}</span>
                <span className="text-[9px] text-pri-silver/30 font-mono">{mod.course_lessons?.length || 0} pelajaran</span>
                <button onClick={() => setEditingModule(mod)} className="text-pri-silver/40 hover:text-white">
                  <Edit3 className="h-3 w-3" />
                </button>
                <button onClick={() => handleDeleteModule(mod.id)} className="text-pri-silver/40 hover:text-red-400">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

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
                          {lesson.is_free && <span className="text-green-400/60 ml-2">GRATIS</span>}
                        </p>
                      </div>
                      <button onClick={() => setEditingLesson(lesson)} className="text-pri-silver/40 hover:text-white shrink-0">
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button onClick={() => handleDeleteLesson(lesson.id)} className="text-pri-silver/40 hover:text-red-400 shrink-0">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <div className="px-4 py-2">
                    {showLessonForm === mod.id ? (
                      <form onSubmit={(e) => handleCreateLesson(e, mod.id)} className="space-y-2 p-2 border border-white/10 rounded-lg">
                        <Input name="title" placeholder="Judul pelajaran..." className="bg-pri-carbon/50 text-xs h-8" required />
                        <div className="flex items-center gap-2">
                          <Input name="videoUrl" placeholder="URL video (opsional)" className="bg-pri-carbon/50 text-xs h-8 flex-1" />
                          <Button type="submit" size="sm" disabled={saving} className="bg-pri-red hover:bg-red-700 text-white text-xs h-8">
                            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : "Simpan"}
                          </Button>
                          <Button type="button" size="sm" variant="ghost" className="text-pri-silver text-xs h-8"
                            onClick={() => setShowLessonForm(null)}>Batal</Button>
                        </div>
                      </form>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-xs text-pri-silver/50 hover:text-pri-red w-full justify-start"
                        onClick={() => setShowLessonForm(mod.id)}>
                        <Plus className="h-3 w-3 mr-1" /> Tambah Pelajaran
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Module Inline */}
          {showModuleForm && (
            <form onSubmit={handleCreateModule} className="glass-card p-4 border-white/5 border-dashed space-y-2">
              <Input name="title" placeholder="Judul modul baru..." className="bg-pri-carbon/50 text-sm" required autoFocus />
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={saving} className="bg-pri-red hover:bg-red-700 text-white text-xs">
                  {saving ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                  Simpan Modul
                </Button>
                <Button type="button" variant="ghost" className="text-pri-silver text-xs"
                  onClick={() => setShowModuleForm(false)}>Batal</Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Edit Module Dialog */}
      <Dialog open={!!editingModule} onOpenChange={(o) => { if (!o) setEditingModule(null); }}>
        <DialogContent className="border-white/10 bg-pri-dark max-w-md">
          <DialogHeader><DialogTitle className="text-white">Edit Modul</DialogTitle></DialogHeader>
          {editingModule && (
            <form onSubmit={handleUpdateModule} className="space-y-4">
              <div><Label>Judul</Label><Input name="title" defaultValue={editingModule.title} required className="bg-pri-carbon/50" /></div>
              <div><Label>Deskripsi</Label>
                <textarea name="description" defaultValue={editingModule.description || ""} rows={2}
                  className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white resize-none" />
              </div>
              <Button type="submit" disabled={saving} className="w-full bg-pri-red text-white">{saving ? "..." : "Simpan"}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Dialog */}
      <Dialog open={!!editingLesson} onOpenChange={(o) => { if (!o) setEditingLesson(null); }}>
        <DialogContent className="border-white/10 bg-pri-dark max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-white">Edit Pelajaran</DialogTitle></DialogHeader>
          {editingLesson && (
            <form onSubmit={handleUpdateLesson} className="space-y-4">
              <div><Label>Judul</Label><Input name="title" defaultValue={editingLesson.title} required className="bg-pri-carbon/50" /></div>
              <div><Label>Deskripsi</Label>
                <textarea name="description" defaultValue={editingLesson.description || ""} rows={2}
                  className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white resize-none" />
              </div>
              <div><Label>Konten</Label>
                <textarea name="content" defaultValue={editingLesson.content || ""} rows={6}
                  className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white resize-none font-mono" />
              </div>
              <div><Label>URL Video</Label><Input name="videoUrl" defaultValue={editingLesson.video_url || ""} className="bg-pri-carbon/50" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Durasi (menit)</Label><Input name="durationMinutes" type="number" defaultValue={editingLesson.duration_minutes} className="bg-pri-carbon/50" /></div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-xs text-pri-silver">
                    <input type="checkbox" name="isFree" defaultChecked={editingLesson.is_free} className="rounded border-white/20" /> Gratis
                  </label>
                </div>
              </div>
              <Button type="submit" disabled={saving} className="w-full bg-pri-red text-white">{saving ? "Menyimpan..." : "Simpan"}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={showCourseEdit} onOpenChange={setShowCourseEdit}>
        <DialogContent className="border-white/10 bg-pri-dark max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Edit Informasi Kursus</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdateCourse} className="space-y-4">
            <div><Label>Judul</Label><Input name="title" defaultValue={course.title} required className="bg-pri-carbon/50" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Kategori</Label>
                <select name="category" defaultValue={course.category} className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white">
                  <option value="ai">AI</option><option value="programming">Programming</option>
                  <option value="robotik">Robotik</option><option value="iot">IoT</option>
                  <option value="robotics">Robotika</option><option value="technology">Teknologi</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              <div><Label>Level</Label>
                <select name="level" defaultValue={course.level} className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white">
                  <option value="beginner">Pemula</option><option value="intermediate">Menengah</option><option value="advanced">Mahir</option>
                </select>
              </div>
            </div>
            <div><Label>Deskripsi Singkat</Label><Input name="short_description" defaultValue={course.short_description || ""} className="bg-pri-carbon/50" /></div>
            <div><Label>Deskripsi</Label>
              <textarea name="description" defaultValue={course.description || ""} rows={3}
                className="w-full px-3 py-2 text-sm bg-pri-carbon/50 border border-white/10 rounded-lg text-white resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Durasi (jam)</Label><Input name="duration_hours" type="number" defaultValue={course.duration_hours} className="bg-pri-carbon/50" /></div>
              <div><Label>Learning Path</Label><Input name="learningPath" defaultValue={course.learning_path || ""} className="bg-pri-carbon/50" /></div>
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-pri-red text-white">{saving ? "Menyimpan..." : "Simpan"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
