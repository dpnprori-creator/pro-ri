import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Plus, Edit3, Eye, ArrowLeft, BookOpen, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        <Link href="/academy/trainer/new">
          <Button className="bg-pri-red hover:bg-red-700 text-white">
            <Plus className="h-4 w-4 mr-1" /> Buat Kursus
          </Button>
        </Link>
      </div>

      <TrainerDashboardClient courses={courses} />
    </div>
  );
}
