import { redirect } from "next/navigation";
import { GraduationCap, BookOpen, Trophy, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AcademyDashboardClient } from "./academy-dashboard-client";

async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase
    .from("members")
    .select("id, full_name")
    .eq("auth_id", user.id)
    .single();

  if (!member) return null;

  // Get all enrollments with course data
  const { data: enrollments } = await supabase
    .from("course_enrollments")
    .select(`
      *,
      courses (*)
    `)
    .eq("member_id", member.id)
    .order("enrolled_at", { ascending: false });

  // Fetch next lesson for each enrollment
  const enrollmentWithLesson = await Promise.all(
    (enrollments || []).map(async (enr) => {
      let nextLessonId: string | null = null;

      if (enr.status === "active" && enr.courses) {
        // Get all modules with lessons for this course
        const { data: modules } = await supabase
          .from("course_modules")
          .select(`
            id,
            course_lessons (id, sort_order)
          `)
          .eq("course_id", enr.course_id)
          .order("sort_order", { ascending: true });

        if (modules && modules.length > 0) {
          // Flatten and sort all lessons
          const allLessons = modules
            .flatMap(m => m.course_lessons)
            .sort((a, b) => a.sort_order - b.sort_order);

          const lessonIds = allLessons.map(l => l.id);

          // Get completed lessons for this course
          const { data: completions } = await supabase
            .from("lesson_completions")
            .select("lesson_id")
            .in("lesson_id", lessonIds)
            .eq("member_id", member.id);

          const completedIds = new Set(completions?.map(c => c.lesson_id) || []);

          // Find first incomplete lesson
          const firstIncomplete = allLessons.find(l => !completedIds.has(l.id));
          if (firstIncomplete) {
            nextLessonId = firstIncomplete.id;
          }
        }
      }

      return { ...enr, next_lesson_id: nextLessonId };
    })
  );

  // Calculate stats
  const total = enrollments?.length || 0;
  const completed = enrollments?.filter(e => e.status === "completed").length || 0;
  const inProgress = enrollments?.filter(e => e.status === "active" && (e.progress_percent || 0) > 0).length || 0;
  const notStarted = enrollments?.filter(e => e.status === "active" && (e.progress_percent || 0) === 0).length || 0;

  return {
    memberName: member.full_name,
    enrollments: enrollmentWithLesson,
    stats: { total, completed, inProgress, notStarted },
  };
}

export default async function AcademyDashboardPage() {
  const data = await getDashboardData();
  if (!data) redirect("/academy/login");

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="h-5 w-5 text-pri-red" />
          <span className="text-[10px] font-mono text-pri-red tracking-wider uppercase">
            MEMBER DASHBOARD
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
          Halo, {data.memberName}! 👋
        </h1>
        <p className="text-sm text-pri-silver/60">
          Pantau progress belajarmu di semua kursus
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        <div className="glass-card p-4 border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <p className="text-xl font-bold text-white font-mono">{data.stats.total}</p>
          <p className="text-[10px] text-pri-silver/40">Total Terdaftar</p>
        </div>
        <div className="glass-card p-4 border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
          </div>
          <p className="text-xl font-bold text-white font-mono">{data.stats.inProgress}</p>
          <p className="text-[10px] text-pri-silver/40">Sedang Berjalan</p>
        </div>
        <div className="glass-card p-4 border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
          <p className="text-xl font-bold text-white font-mono">{data.stats.notStarted}</p>
          <p className="text-[10px] text-pri-silver/40">Belum Dimulai</p>
        </div>
        <div className="glass-card p-4 border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-lg bg-pri-red/10 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-pri-red" />
            </div>
          </div>
          <p className="text-xl font-bold text-white font-mono">{data.stats.completed}</p>
          <p className="text-[10px] text-pri-silver/40">Selesai</p>
        </div>
      </div>

      {/* Enrollment List */}
      <AcademyDashboardClient enrollments={data.enrollments} />
    </div>
  );
}
