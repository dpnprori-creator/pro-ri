import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Search, Bot, Cpu, Code, CircuitBoard, GraduationCap, BookOpen, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient as createServerClient } from "@/lib/supabase/server";

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

const categoryLabels: Record<string, string> = {
  robotics: "Robotika", ai: "AI", iot: "IoT",
  programming: "Programming", robotik: "Robotik",
  technology: "Teknologi", other: "Lainnya",
};

async function CoursesGrid({ category, level, search }: { category?: string; level?: string; search?: string }) {
  const supabase = await createServerClient();

  let query = supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }
  if (level && level !== "all") {
    query = query.eq("level", level);
  }

  const { data: courses } = await query;

  let filtered = courses || [];

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (c) => c.title.toLowerCase().includes(s) || c.description?.toLowerCase().includes(s)
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-20">
        <GraduationCap className="h-16 w-16 text-pri-silver/10 mx-auto mb-4" />
        <p className="text-pri-silver/40 text-sm">Belum ada kursus di kategori ini</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map((course) => {
        const Icon = categoryIcons[course.category] || BookOpen;
        const color = categoryColors[course.category] || "from-gray-600 to-slate-600";

        return (
          <Link key={course.id} href={`/academy/courses/${course.slug}`} className="group">
            <Card className="glass-card-hover p-5 border-white/5 h-full">
              <CardContent className="p-0">
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[10px] font-mono text-pri-silver/40 uppercase tracking-wider px-2 py-1 rounded bg-white/5">
                    {levelLabels[course.level] || course.level}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-pri-red transition-colors line-clamp-2">
                  {course.title}
                </h3>
                {course.short_description && (
                  <p className="text-xs text-pri-silver/60 line-clamp-2 mb-3">{course.short_description}</p>
                )}
                <div className="flex items-center gap-3 text-[10px] text-pri-silver/40 font-mono mt-auto">
                  {course.total_lessons > 0 && (
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.total_lessons} lessons</span>
                  )}
                  {course.duration_hours > 0 && (
                    <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{course.duration_hours} jam</span>
                  )}
                </div>
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

export default async function AcademyCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const activeCategory = (params.category as string) || "all";
  const activeLevel = (params.level as string) || "all";
  const activeSearch = (params.search as string) || "";
  const view = (params.view as string) || "grid";

  const categories = [
    { id: "all", label: "Semua" },
    { id: "ai", label: "AI" },
    { id: "programming", label: "Programming" },
    { id: "robotik", label: "Robotik" },
    { id: "iot", label: "IoT" },
    { id: "robotics", label: "Robotika" },
    { id: "technology", label: "Teknologi" },
  ];

  const levels = [
    { id: "all", label: "Semua Level" },
    { id: "beginner", label: "Pemula" },
    { id: "intermediate", label: "Menengah" },
    { id: "advanced", label: "Mahir" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Jelajahi <span className="text-pri-red">Kursus</span>
        </h1>
        <p className="text-pri-silver/60 text-sm">
          Temukan kursus yang sesuai dengan minat dan levelmu
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/academy/courses?category=${cat.id}&level=${activeLevel}`}
            className={`px-3 py-1.5 text-xs rounded-full transition-all ${
              activeCategory === cat.id
                ? "bg-pri-red text-white"
                : "bg-white/5 text-pri-silver hover:text-white hover:bg-white/10"
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          {levels.map((lev) => (
            <Link
              key={lev.id}
              href={`/academy/courses?category=${activeCategory}&level=${lev.id}`}
              className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                activeLevel === lev.id
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-pri-silver/50 hover:text-white"
              }`}
            >
              {lev.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pri-silver/40" />
            <input
              name="search"
              defaultValue={activeSearch}
              placeholder="Cari kursus..."
              className="pl-9 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-pri-silver/30 focus:outline-none focus:border-pri-red/50 w-48"
            />
          </div>
          <input type="hidden" name="category" value={activeCategory} />
          <input type="hidden" name="level" value={activeLevel} />
          <button type="submit" className="text-xs text-pri-silver hover:text-white px-2">Cari</button>
        </form>
      </div>

      {/* Grid */}
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-5 border-white/5 h-48 animate-pulse" />
          ))}
        </div>
      }>
        <CoursesGrid category={activeCategory} level={activeLevel} search={activeSearch} />
      </Suspense>
    </div>
  );
}
