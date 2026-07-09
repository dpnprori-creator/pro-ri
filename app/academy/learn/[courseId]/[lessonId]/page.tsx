import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Play, Menu, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { AcademyLessonCompleteButton } from "@/components/features/academy/academy-lesson-complete-button";
import { AcademyLessonSidebar } from "@/components/features/academy/academy-lesson-sidebar";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const supabase = await createServerClient();

  // Get lesson
  const { data: lesson } = await supabase
    .from("course_lessons")
    .select(`
      *,
      module:module_id (*)
    `)
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  // Get course
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  // Get modules with lessons
  const { data: modules } = await supabase
    .from("course_modules")
    .select(`
      *,
      course_lessons (*)
    `)
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  // Check enrollment
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/academy/login");

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) redirect("/academy/login");

  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("member_id", member.id)
    .maybeSingle();

  if (!enrollment) redirect(`/academy/courses/${course.slug}`);

  // Get all lesson IDs and completions
  const allLessons = modules?.flatMap(m => m.course_lessons) || [];
  const allLessonIds = allLessons.map(l => l.id);
  const currentIndex = allLessonIds.indexOf(lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const { data: completions } = await supabase
    .from("lesson_completions")
    .select("lesson_id")
    .in("lesson_id", allLessonIds)
    .eq("member_id", member.id);

  const completedIds = completions?.map(c => c.lesson_id) || [];
  const isCompleted = completedIds.includes(lessonId);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar — desktop */}
      <AcademyLessonSidebar
        course={course}
        modules={modules || []}
        currentLessonId={lessonId}
        completedIds={completedIds}
        enrollmentProgress={enrollment.progress_percent || 0}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-white/10 bg-pri-carbon/80">
          <div className="flex items-center gap-3">
            <Link
              href={`/academy/courses/${course.slug}`}
              className="text-pri-silver hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-white truncate max-w-[300px]">
                {course.title}
              </p>
              <p className="text-[10px] text-pri-silver/40 font-mono">
                {lesson.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pri-red to-red-400 rounded-full transition-all"
                  style={{ width: `${enrollment.progress_percent || 0}%` }}
                />
              </div>
              <span className="text-[10px] text-pri-silver/40 font-mono">
                {enrollment.progress_percent || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
            {/* Video */}
            {lesson.video_url && (
              <div className="aspect-video rounded-xl overflow-hidden bg-black mb-8 border border-white/10">
                <iframe
                  src={lesson.video_url.replace("watch?v=", "embed/")}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Title */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {lesson.title}
                </h1>
                {lesson.description && (
                  <p className="text-sm text-pri-silver/60">{lesson.description}</p>
                )}
              </div>
              {isCompleted && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 shrink-0">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                  <span className="text-[10px] text-green-400 font-medium">Selesai</span>
                </div>
              )}
            </div>

            {/* Content */}
            {lesson.content && (
              <div className="prose prose-invert prose-sm max-w-none mb-8">
                <div className="text-sm text-pri-silver/80 leading-relaxed whitespace-pre-wrap">
                  {lesson.content}
                </div>
              </div>
            )}

            {/* Complete button & navigation */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
              <AcademyLessonCompleteButton
                lessonId={lessonId}
                courseId={courseId}
                isCompleted={isCompleted}
              />

              <div className="flex items-center gap-2">
                {prevLesson && (
                  <Link href={`/academy/learn/${courseId}/${prevLesson.id}`}>
                    <Button variant="outline" size="sm" className="border-white/10 text-pri-silver hover:text-white text-xs">
                      <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Sebelumnya
                    </Button>
                  </Link>
                )}
                {nextLesson && (
                  <Link href={`/academy/learn/${courseId}/${nextLesson.id}`}>
                    <Button size="sm" className="bg-pri-red hover:bg-red-700 text-white text-xs">
                      Selanjutnya <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
