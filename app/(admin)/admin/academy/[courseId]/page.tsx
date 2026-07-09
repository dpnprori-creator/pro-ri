import { notFound } from "next/navigation";
import { GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { AdminCourseEditor } from "./admin-course-editor";

async function getCourseData(courseId: string) {
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) return null;

  const { data: modules } = await supabase
    .from("course_modules")
    .select(`
      *,
      course_lessons (*)
    `)
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  return { ...course, modules: modules || [] };
}

export default async function AdminCourseEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = await getCourseData(courseId);

  if (!course) notFound();

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/academy">
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
          </p>
        </div>
      </div>

      <AdminCourseEditor course={course} />
    </div>
  );
}
