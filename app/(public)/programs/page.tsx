import { createClient } from "@/lib/supabase/server";
import { ProgramsClient } from "./programs-client";

async function getPrograms() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: programs } = await supabase
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true });

  // Get user's registrations
  let registrations: Record<string, string> = {};
  if (user) {
    const { data: member } = await supabase
      .from("members")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (member) {
      const { data: regs } = await supabase
        .from("program_registrations")
        .select("program_id, status")
        .eq("member_id", member.id);
      
      if (regs) {
        regs.forEach((r: any) => { registrations[r.program_id] = r.status; });
      }
    }
  }

  return { programs: programs ?? [], registrations, isLoggedIn: !!user };
}

export default async function ProgramsPage() {
  const { programs, registrations, isLoggedIn } = await getPrograms();

  return <ProgramsClient programs={programs} registrations={registrations} isLoggedIn={isLoggedIn} />;
}
