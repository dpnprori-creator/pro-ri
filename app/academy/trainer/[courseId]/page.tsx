import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { isCurrentUserTrainer } from "@/features/academy/actions";
import { TrainerCourseEditor } from "./trainer-course-editor";

async function getCourseData(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return null;

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course || course.created_by !== member.id) return null;

  const { data: modules } = await supabase
    .from("course_modules")
    .select(`*, course_lessons (*)`)
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  return { ...course, modules: modules || [] };
}

export default async function TrainerCourseEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const isTrainer = await isCurrentUserTrainer();
  if (!isTrainer) redirect("/academy/login");

  const { courseId } = await params;
  const course = await getCourseData(courseId);
  if (!course) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/academy/trainer">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-pri-silver hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="h-4 w-4 text-pri-red" />
            <span className="text-[9px] font-mono text-pri-red tracking-wider uppercase">EDITOR KURSUS</span>
          </div>
          <h1 className="text-xl font-bold text-white">{course.title}</h1>
          <p className="text-xs text-pri-silver/50 font-mono">
            {course.status} · {course.category} · {course.level}
            {course.total_lessons > 0 && ` · ${course.total_lessons} pelajaran`}
          </p>
        </div>
      </div>

      <TrainerCourseEditor course={course} />
    </div>
  );
}
