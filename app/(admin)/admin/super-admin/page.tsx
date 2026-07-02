import { createClient } from "@/lib/supabase/server";

export default async function SuperAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Super Admin Panel</h1>
        <p className="text-pri-silver mt-1">Panel khusus super admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-2">System Info</h2>
          <div className="space-y-2 text-sm text-pri-silver">
            <p>User ID: {user?.id}</p>
            <p>Email: {user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
