import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isCurrentUserTrainer } from "@/features/academy/actions";
import { TrainerDashboardClient } from "./trainer-dashboard-client";

async function getTrainerCourses() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return [];

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("created_by", member.id)
    .order("created_at", { ascending: false });

  return courses ?? [];
}

export default async function TrainerDashboardPage() {
  const isTrainer = await isCurrentUserTrainer();
  if (!isTrainer) redirect("/academy/login");

  const courses = await getTrainerCourses();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="h-5 w-5 text-pri-red" />
            <span className="text-[10px] font-mono text-pri-red tracking-wider uppercase">TRAINER DASHBOARD</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Kursus Saya</h1>
          <p className="text-sm text-pri-silver/60">Kelola kursus dan materi pembelajaran Anda</p>
        </div>
        {/* Tombol Buat Kursus ada di TrainerDashboardClient */}
      </div>

      <TrainerDashboardClient courses={courses} />
    </div>
  );
}
