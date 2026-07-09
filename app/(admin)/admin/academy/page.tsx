import { GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminAcademyClient } from "./admin-academy-client";

async function getAcademyData() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("*, created_by!left(full_name)")
    .order("created_at", { ascending: false });

  const { count: totalEnrollments } = await supabase
    .from("course_enrollments")
    .select("*", { count: "exact", head: true });

  const { count: totalCompleted } = await supabase
    .from("course_enrollments")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  return {
    courses: courses ?? [],
    totalEnrollments: totalEnrollments ?? 0,
    totalCompleted: totalCompleted ?? 0,
  };
}

export default async function AdminAcademyPage() {
  const data = await getAcademyData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-5 w-5 text-pri-red" />
            <span className="text-[10px] font-mono text-pri-red tracking-wider uppercase">ACADEMY</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Manajemen Academy</h1>
          <p className="text-pri-silver text-sm">Kelola kursus, modul, materi pembelajaran, dan pantau progress peserta</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 border-white/5">
          <p className="text-2xl font-bold text-white font-mono">{data.courses.length}</p>
          <p className="text-xs text-pri-silver/50 mt-1">Total Kursus</p>
        </div>
        <div className="glass-card p-4 border-white/5">
          <p className="text-2xl font-bold text-white font-mono">{data.totalEnrollments}</p>
          <p className="text-xs text-pri-silver/50 mt-1">Total Pendaftar</p>
        </div>
        <div className="glass-card p-4 border-white/5">
          <p className="text-2xl font-bold text-white font-mono">{data.totalCompleted}</p>
          <p className="text-xs text-pri-silver/50 mt-1">Lulus</p>
        </div>
      </div>

      {/* Course List */}
      <AdminAcademyClient courses={data.courses} />
    </div>
  );
}
