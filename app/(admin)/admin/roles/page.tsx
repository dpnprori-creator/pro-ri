import { createClient } from "@/lib/supabase/server";
import { RolesManager } from "./roles-manager";

async function getRoles() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("roles")
    .select("*")
    .order("name", { ascending: true });

  return data ?? [];
}

export default async function AdminRolesPage() {
  const roles = await getRoles();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Role Management</h1>
        <p className="text-pri-silver mt-1">Total {roles.length} role</p>
      </div>

      <RolesManager roles={roles} />
    </div>
  );
}
