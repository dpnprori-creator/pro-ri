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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Program Saya</h1>
        <p className="text-pri-silver mt-1">{registrations.length} pendaftaran program</p>
      </div>

      <ProgramsList registrations={registrations} />
    </div>
  );
}
