"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen, Play, CheckCircle, Clock, Lock,
  GraduationCap, Search, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  image_url: string | null;
  total_lessons: number;
  duration_hours: number;
}

interface Enrollment {
  id: string;
  course_id: string;
  member_id: string;
  status: string;
  progress_percent: number;
  enrolled_at: string;
  completed_at: string | null;
  courses: Course | null;
}

interface AcademyDashboardClientProps {
  enrollments: Enrollment[];
}

const levelLabels: Record<string, string> = {
  beginner: "Pemula", intermediate: "Menengah", advanced: "Mahir",
};

const categoryLabels: Record<string, string> = {
  ai: "AI", programming: "Programming", robotik: "Robotik",
  iot: "IoT", robotics: "Robotika", technology: "Teknologi", other: "Lainnya",
};

function getProgressColor(percent: number): string {
  if (percent >= 100) return "from-green-500 to-emerald-400";
  if (percent >= 50) return "from-pri-red to-red-400";
  if (percent >= 25) return "from-yellow-500 to-orange-400";
  return "from-pri-silver/40 to-pri-silver/20";
}

export function AcademyDashboardClient({ enrollments }: AcademyDashboardClientProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");

  const filtered = enrollments.filter((e) => {
    const matchStatus = filter === "all" || e.status === filter;
    const matchSearch = e.courses?.title.toLowerCase().includes(search.toLowerCase()) ?? true;
    return matchStatus && matchSearch;
  });

  // Sort: in progress first, then not started, then completed
  const sorted = [...filtered].sort((a, b) => {
    const order = { active: 0, completed: 2, dropped: 3 };
    if (a.status !== b.status) return (order[a.status as keyof typeof order] || 0) - (order[b.status as keyof typeof order] || 0);
    // Within same status, sort by progress (higher first)
    return (b.progress_percent || 0) - (a.progress_percent || 0);
  });

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-20 glass-card border-white/5">
        <div className="h-16 w-16 rounded-full bg-pri-red/5 flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="h-8 w-8 text-pri-red/30" />
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">Belum Ada Kursus</h2>
        <p className="text-sm text-pri-silver/40 mb-6 max-w-md mx-auto">
          Anda belum mendaftar kursus apapun. Mulai belajar dengan menjelajahi katalog kursus!
        </p>
        <Link href="/academy/courses">
          <Button className="bg-pri-red hover:bg-red-700 text-white">
            <BookOpen className="h-4 w-4 mr-2" /> Jelajahi Kursus
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {[
            { id: "all" as const, label: "Semua" },
            { id: "active" as const, label: "Sedang Berjalan" },
            { id: "completed" as const, label: "Selesai" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full transition-all",
                filter === f.id
                  ? "bg-pri-red text-white"
                  : "bg-white/5 text-pri-silver hover:text-white hover:bg-white/10"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pri-silver/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kursus..."
            className="pl-9 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-pri-silver/30 focus:outline-none focus:border-pri-red/50 w-full sm:w-48"
          />
        </div>
      </div>

      {/* Enrollment Cards */}
      {sorted.length === 0 ? (
        <div className="text-center py-12 glass-card border-white/5">
          <p className="text-sm text-pri-silver/40">Tidak ada kursus yang cocok dengan filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((enrollment) => {
            const course = enrollment.courses;
            if (!course) return null;
            const progress = enrollment.progress_percent || 0;
            const isCompleted = enrollment.status === "completed";

            return (
              <div
                key={enrollment.id}
                className={cn(
                  "glass-card overflow-hidden border transition-all duration-300 group",
                  isCompleted ? "border-green-500/10" : "border-white/5 hover:border-white/10"
                )}
              >
                {/* Progress bar top accent */}
                <div className="h-1 bg-white/5 w-full">
                  <div
                    className={cn("h-full bg-gradient-to-r transition-all duration-700", getProgressColor(progress))}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-mono text-pri-silver/40 uppercase tracking-wider">
                          {categoryLabels[course.category] || course.category}
                        </span>
                        <span className="text-[9px] text-pri-silver/20">·</span>
                        <span className="text-[9px] font-mono text-pri-silver/40">
                          {levelLabels[course.level] || course.level}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white truncate group-hover:text-pri-red transition-colors">
                        {course.title}
                      </h3>
                    </div>
                    {isCompleted ? (
                      <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      </div>
                    ) : progress > 0 ? (
                      <div className="h-8 w-8 rounded-full bg-pri-red/10 flex items-center justify-center shrink-0">
                        <Play className="h-3.5 w-3.5 text-pri-red ml-0.5" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                        <Lock className="h-3.5 w-3.5 text-pri-silver/30" />
                      </div>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-pri-silver/40 font-mono">Progress</span>
                      <span className={cn(
                        "text-[10px] font-mono",
                        isCompleted ? "text-green-400" : "text-pri-silver/60"
                      )}>
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full bg-gradient-to-r rounded-full transition-all duration-700", getProgressColor(progress))}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-[10px] text-pri-silver/30 font-mono mb-4">
                    {course.total_lessons > 0 && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {course.total_lessons} pelajaran
                      </span>
                    )}
                    {course.duration_hours > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.duration_hours} jam
                      </span>
                    )}
                    {isCompleted && enrollment.completed_at && (
                      <span className="flex items-center gap-1 text-green-400/40">
                        <CheckCircle className="h-3 w-3" />
                        Selesai
                      </span>
                    )}
                  </div>

                  {/* Action */}
                  <Link href={`/academy/courses/${course.slug}`}>
                    <Button
                      size="sm"
                      className={cn(
                        "w-full text-xs",
                        isCompleted
                          ? "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
                          : "bg-pri-red hover:bg-red-700 text-white"
                      )}
                    >
                      {isCompleted ? (
                        <>Lihat Detail <ArrowRight className="h-3 w-3 ml-1" /></>
                      ) : progress > 0 ? (
                        <>Lanjutkan <ArrowRight className="h-3 w-3 ml-1" /></>
                      ) : (
                        <>Mulai Belajar <ArrowRight className="h-3 w-3 ml-1" /></>
                      )}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
