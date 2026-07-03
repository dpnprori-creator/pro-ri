import { createClient } from "@/lib/supabase/server";
import { ProgramsPageClient } from "./programs-page-client";

async function getProgramsData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch ALL published programs
  const { data: programs } = await supabase
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true });

  // Get user's registrations
  let registrations: Record<string, { status: string; id: string }> = {};
  let memberId: string | null = null;

  if (user) {
    const { data: member } = await supabase
      .from("members")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (member) {
      memberId = member.id;
      const { data: regs } = await supabase
        .from("program_registrations")
        .select("program_id, status, id")
        .eq("member_id", member.id);

      if (regs) {
        regs.forEach((r: any) => {
          registrations[r.program_id] = { status: r.status, id: r.id };
        });
      }
    }
  }

  // Get user's registrations as array for the old view too
  let myRegistrations: any[] = [];
  if (memberId) {
    const { data } = await supabase
      .from("program_registrations")
      .select("*, program_id!inner(id, title, slug, icon, label, status)")
      .eq("member_id", memberId)
      .order("created_at", { ascending: false });
    myRegistrations = data ?? [];
  }

  const statusCounts = {
    registered: myRegistrations.filter((r) => r.status === "registered").length,
    active: myRegistrations.filter((r) => r.status === "active").length,
    completed: myRegistrations.filter((r) => r.status === "completed").length,
    cancelled: myRegistrations.filter((r) => r.status === "cancelled").length,
  };

  return {
    programs: programs ?? [],
    registrations,
    myRegistrations,
    statusCounts,
    isLoggedIn: !!user,
    totalMyRegistrations: myRegistrations.length,
  };
}

export default async function DashboardProgramsPage() {
  const {
    programs,
    registrations,
    myRegistrations,
    statusCounts,
    isLoggedIn,
    totalMyRegistrations,
  } = await getProgramsData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
              <span className="status-dot" />
              PROGRAM
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Program Unggulan</h1>
              <p className="text-pri-silver text-sm mt-1">
                {programs.length} program tersedia • Anda terdaftar di {totalMyRegistrations} program
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProgramsPageClient
        programs={programs as any}
        registrations={registrations}
        myRegistrations={myRegistrations as any}
        statusCounts={statusCounts}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
