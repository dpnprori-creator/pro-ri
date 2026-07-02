import { createClient } from "@/lib/supabase/server";
import { AdminsManager } from "./admins-manager";

async function getAdmins() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select("id, full_name, email, member_id, status, created_at, role_id!inner(name)")
    .in("role_id.name", ["admin", "super_admin"])
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminAdminsPage() {
  const admins = await getAdmins();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Users</h1>
        <p className="text-pri-silver mt-1">Total {admins.length} admin</p>
      </div>

      <AdminsManager admins={admins} />
    </div>
  );
}
