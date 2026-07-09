import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { AcademyLessonSidebar } from "@/components/features/academy/academy-lesson-sidebar";
import { LessonContentClient } from "@/components/features/academy/lesson-content-client";

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

  // Sequential lock: current lesson is locked if previous lesson is not completed
  // (first lesson is always unlocked)
  const { data: completions } = await supabase
    .from("lesson_completions")
    .select("lesson_id")
    .in("lesson_id", allLessonIds)
    .eq("member_id", member.id);

  const completedIds = completions?.map(c => c.lesson_id) || [];
  const isCompleted = completedIds.includes(lessonId);
  const isLocked = currentIndex > 0 && !completedIds.includes(allLessons[currentIndex - 1]?.id || "");

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

      {/* Main content — client component with VideoTracker + Sequential Lock */}
      <LessonContentClient
        lesson={{
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          video_url: lesson.video_url,
          duration_minutes: lesson.duration_minutes,
          is_free: lesson.is_free,
        }}
        course={{ id: course.id, title: course.title, slug: course.slug }}
        courseId={courseId}
        currentLessonId={lessonId}
        isCompleted={isCompleted}
        isLocked={isLocked}
        prevLesson={prevLesson ? { id: prevLesson.id, title: prevLesson.title, sort_order: prevLesson.sort_order } : null}
        nextLesson={nextLesson ? { id: nextLesson.id, title: nextLesson.title, sort_order: nextLesson.sort_order } : null}
        completedIds={completedIds}
        allLessons={allLessons.map(l => ({ id: l.id, title: l.title, sort_order: l.sort_order }))}
        enrollmentProgress={enrollment.progress_percent || 0}
      />
    </div>
  );
}
