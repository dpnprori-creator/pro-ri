import { createClient } from "@/lib/supabase/server";
import { MembersDirectory } from "./members-directory";

async function getMembers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select("id, full_name, member_id, occupation, province_id!inner(name)")
    .eq("status", "active")
    .order("full_name", { ascending: true });

  return data ?? [];
}

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Direktori Anggota</h1>
        <p className="text-pri-silver mt-1">Total {members.length} anggota</p>
      </div>

      <MembersDirectory members={members as any} />
    </div>
  );
}
