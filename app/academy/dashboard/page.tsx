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

  // Calculate stats
  const total = enrollments?.length || 0;
  const completed = enrollments?.filter(e => e.status === "completed").length || 0;
  const inProgress = enrollments?.filter(e => e.status === "active" && (e.progress_percent || 0) > 0).length || 0;
  const notStarted = enrollments?.filter(e => e.status === "active" && (e.progress_percent || 0) === 0).length || 0;

  return {
    memberName: member.full_name,
    enrollments: enrollments || [],
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
