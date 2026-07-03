import { createClient } from "@/lib/supabase/server";
import { ProgramsList } from "./programs-list";

async function getPrograms() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return [];

  const { data } = await supabase
    .from("program_registrations")
    .select("*, program_id!inner(id, title, slug, icon, label, status)")
    .eq("member_id", member.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function DashboardProgramsPage() {
  const registrations = await getPrograms();

  const statusCounts = {
    registered: registrations.filter((r) => r.status === "registered").length,
    active: registrations.filter((r) => r.status === "active").length,
    completed: registrations.filter((r) => r.status === "completed").length,
    cancelled: registrations.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
              <span className="status-dot" />
              PROGRAM SAYA
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Program Saya</h1>
          <p className="text-pri-silver text-sm mt-1">
            {registrations.length} pendaftaran program
          </p>
        </div>
      </div>

      <ProgramsList
        registrations={registrations as any}
        statusCounts={statusCounts}
      />
    </div>
  );
}
