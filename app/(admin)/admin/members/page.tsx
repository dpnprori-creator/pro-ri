import { createClient } from "@/lib/supabase/server";
import { MembersManager } from "./members-manager";

async function getMembers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select("id, full_name, email, member_id, phone, status, role_id!inner(name), province_id!inner(name), created_at")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminMembersPage() {
  const members = await getMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Members</h1>
        <p className="text-pri-silver mt-1">Total {members.length} member</p>
      </div>

      <MembersManager members={members as any} />
    </div>
  );
}
