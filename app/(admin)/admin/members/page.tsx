import { createClient } from "@/lib/supabase/server";
import { MembersTable } from "./members-table";

async function getMembers() {
  const supabase = await createClient();

  // Fetch members with their designations in parallel
  const [
    { data: members },
    { data: designations },
    { data: roles },
  ] = await Promise.all([
    supabase
      .from("members")
      .select("id, full_name, email, member_id, phone, occupation, status, role_id, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("member_designations").select("member_id, designation"),
    supabase.from("roles").select("id, name"),
  ]);

  // Map designation to each member
  const designationMap = new Map<string, { designation: string }[]>();
  for (const d of designations ?? []) {
    const list = designationMap.get(d.member_id) || [];
    list.push({ designation: d.designation });
    designationMap.set(d.member_id, list);
  }

  // Get role names
  const roleMap = new Map((roles ?? []).map((r: any) => [r.id, r.name]));

  const enrichedMembers = (members ?? []).map((m: any) => ({
    id: m.id,
    member_id: m.member_id,
    full_name: m.full_name,
    email: m.email,
    phone: m.phone,
    occupation: m.occupation,
    status: m.status,
    created_at: m.created_at,
    role_id: m.role_id,
    role_name: roleMap.get(m.role_id) || null,
    member_designations: designationMap.get(m.id) || [],
  }));

  return { members: enrichedMembers, roles: roles ?? [] };
}

export default async function AdminMembersPage() {
  const { members, roles } = await getMembers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Members</h1>
        <p className="text-pri-silver mt-1">Total {members.length} member</p>
      </div>

      <MembersTable members={members} roles={roles as any} showRoleEditor={true} />
    </div>
  );
}
