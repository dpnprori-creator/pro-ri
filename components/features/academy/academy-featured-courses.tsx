import Link from "next/link";
import { ArrowRight, Clock, BookOpen, Bot, Cpu, Code, CircuitBoard, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient as createServerClient } from "@/lib/supabase/server";

const categoryIcons: Record<string, typeof BookOpen> = {
  robotics: Cpu,
  ai: Bot,
  iot: CircuitBoard,
  programming: Code,
  robotik: Cpu,
  technology: GraduationCap,
  other: BookOpen,
};

const categoryColors: Record<string, string> = {
  robotics: "from-orange-600 to-red-600",
  ai: "from-purple-600 to-pink-600",
  iot: "from-teal-600 to-green-600",
  programming: "from-blue-600 to-cyan-600",
  robotik: "from-pri-red to-red-700",
  technology: "from-indigo-600 to-purple-600",
  other: "from-gray-600 to-slate-600",
};

export async function AcademyFeaturedCourses() {
  const supabase = await createServerClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .limit(6);

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-16">
        <GraduationCap className="h-12 w-12 text-pri-silver/20 mx-auto mb-3" />
        <p className="text-pri-silver/40 text-sm">Kursus akan segera tersedia</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => {
        const Icon = categoryIcons[course.category] || BookOpen;
        const color = categoryColors[course.category] || "from-gray-600 to-slate-600";

        return (
          <Link key={course.id} href={`/academy/courses/${course.slug}`} className="group">
            <Card className="glass-card-hover p-5 border-white/5 h-full">
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[10px] font-mono text-pri-silver/40 uppercase tracking-wider px-2 py-1 rounded bg-white/5">
                    {course.level}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-pri-red transition-colors line-clamp-2">
                  {course.title}
                </h3>
                {course.short_description && (
                  <p className="text-xs text-pri-silver/60 line-clamp-2 mb-3">
                    {course.short_description}
                  </p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-3 text-[10px] text-pri-silver/40 font-mono mt-auto">
                  {course.total_lessons > 0 && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {course.total_lessons} lessons
                    </span>
                  )}
                  {course.duration_hours > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration_hours} jam
                    </span>
                  )}
                </div>

                {/* Arrow on hover */}
                <div className="mt-3 flex items-center gap-1 text-[10px] text-pri-red opacity-0 group-hover:opacity-100 transition-opacity">
                  Mulai Belajar <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
