import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, BookOpen, Bot, Cpu, Code, CircuitBoard, GraduationCap, Play, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { AcademyEnrollButton } from "@/components/features/academy/academy-enroll-button";

const categoryIcons: Record<string, typeof BookOpen> = {
  robotics: Cpu, ai: Bot, iot: CircuitBoard,
  programming: Code, robotik: Cpu, technology: GraduationCap,
  other: BookOpen,
};

const categoryColors: Record<string, string> = {
  robotics: "from-orange-600 to-red-600", ai: "from-purple-600 to-pink-600",
  iot: "from-teal-600 to-green-600", programming: "from-blue-600 to-cyan-600",
  robotik: "from-pri-red to-red-700", technology: "from-indigo-600 to-purple-600",
  other: "from-gray-600 to-slate-600",
};

const levelLabels: Record<string, string> = {
  beginner: "Pemula", intermediate: "Menengah", advanced: "Mahir", all: "Semua Level",
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!course) notFound();

  const { data: modules } = await supabase
    .from("course_modules")
    .select(`
      *,
      course_lessons (*)
    `)
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });

  // Check if user is enrolled
  const { data: { user } } = await supabase.auth.getUser();
  let isEnrolled = false;
  let enrollmentProgress = 0;
  let completedLessonIds: string[] = [];

  if (user) {
    const { data: member } = await supabase
      .from("members")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (member) {
      const { data: enrollment } = await supabase
        .from("course_enrollments")
        .select("*")
        .eq("course_id", course.id)
        .eq("member_id", member.id)
        .maybeSingle();

      if (enrollment) {
        isEnrolled = true;
        enrollmentProgress = enrollment.progress_percent || 0;

        // Get completed lesson IDs
        const allLessonIds = modules?.flatMap(m => m.course_lessons?.map(l => l.id) || []) || [];
        if (allLessonIds.length > 0) {
          const { data: completions } = await supabase
            .from("lesson_completions")
            .select("lesson_id")
            .in("lesson_id", allLessonIds)
            .eq("member_id", member.id);
          completedLessonIds = completions?.map(c => c.lesson_id) || [];
        }
      }
    }
  }

  const Icon = categoryIcons[course.category] || BookOpen;
  const color = categoryColors[course.category] || "from-gray-600 to-slate-600";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Back */}
      <Link
        href="/academy/courses"
        className="inline-flex items-center gap-1.5 text-xs text-pri-silver hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Katalog
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start gap-8 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{course.title}</h1>
              <div className="flex items-center gap-3 text-xs text-pri-silver/50 font-mono mt-1">
                <span>{levelLabels[course.level] || course.level}</span>
                {course.total_lessons > 0 && <><span className="text-pri-silver/20">|</span><span>{course.total_lessons} lessons</span></>}
                {course.duration_hours > 0 && <><span className="text-pri-silver/20">|</span><span>{course.duration_hours} jam</span></>}
              </div>
            </div>
          </div>

          {course.description && (
            <p className="text-sm text-pri-silver/70 leading-relaxed mb-6 max-w-2xl">
              {course.description}
            </p>
          )}

          <AcademyEnrollButton
            courseId={course.id}
            courseSlug={course.slug}
            isEnrolled={isEnrolled}
            progress={enrollmentProgress}
          />
        </div>
      </div>

      {/* Modules & Lessons */}
      <div className="max-w-3xl">
        <h2 className="text-lg font-semibold text-white mb-6">Materi Pembelajaran</h2>

        {(!modules || modules.length === 0) ? (
          <div className="text-center py-12 glass-card border-white/5">
            <BookOpen className="h-10 w-10 text-pri-silver/20 mx-auto mb-2" />
            <p className="text-sm text-pri-silver/40">Materi sedang disusun</p>
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((mod, modIdx) => (
              <Card key={mod.id} className="glass-card border-white/5 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-full bg-pri-red/10 flex items-center justify-center text-[10px] font-bold text-pri-red font-mono">
                      {modIdx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{mod.title}</h3>
                      {mod.description && (
                        <p className="text-[10px] text-pri-silver/50">{mod.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {mod.course_lessons && mod.course_lessons.length > 0 && (
                  <div className="divide-y divide-white/5">
                    {mod.course_lessons.map((lesson) => {
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      const lessonHref = isEnrolled
                        ? `/academy/learn/${course.id}/${lesson.id}`
                        : "#";

                      return (
                        <Link
                          key={lesson.id}
                          href={lessonHref}
                          className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                            isEnrolled
                              ? "hover:bg-white/5 cursor-pointer"
                              : "opacity-60 cursor-default"
                          }`}
                        >
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-green-500/20 text-green-400"
                              : isEnrolled
                              ? "bg-pri-red/10 text-pri-red"
                              : "bg-white/5 text-pri-silver/30"
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="h-3.5 w-3.5" />
                            ) : isEnrolled ? (
                              <Play className="h-3 w-3 ml-0.5" />
                            ) : (
                              <Lock className="h-3 w-3" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${
                              isCompleted ? "text-green-400/80" : "text-pri-silver"
                            }`}>
                              {lesson.title}
                            </p>
                            {lesson.duration_minutes > 0 && (
                              <p className="text-[10px] text-pri-silver/40 font-mono mt-0.5">
                                {lesson.duration_minutes} menit
                              </p>
                            )}
                          </div>
                          {lesson.is_free && (
                            <span className="text-[9px] font-mono text-green-400/60 px-1.5 py-0.5 rounded bg-green-500/10">
                              GRATIS
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
