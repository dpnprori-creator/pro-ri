import { createClient } from "@/lib/supabase/server";
import { ProgramsManager } from "./programs-manager";

async function getPrograms() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("programs")
    .select("id, title, slug, status, label, sort_order, max_participants, start_date, created_at")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export default async function AdminProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Programs</h1>
        <p className="text-pri-silver mt-1">Total {programs.length} program</p>
      </div>

      <ProgramsManager programs={programs} />
    </div>
  );
}
