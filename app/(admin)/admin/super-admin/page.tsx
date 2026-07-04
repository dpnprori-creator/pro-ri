import { createClient } from "@/lib/supabase/server";
import { getSystemHealth } from "@/features/admin/system-actions";
import { SuperAdminClient } from "./super-admin-client";

export default async function SuperAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get admin info
  let memberName = "Super Admin";
  if (user) {
    const { data: member } = await supabase
      .from("members")
      .select("full_name")
      .eq("auth_id", user.id)
      .single();
    if (member) memberName = member.full_name;
  }

  // Get system health
  const health = await getSystemHealth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-[10px] text-purple-400/80 font-mono">
              <span className="status-dot" />
              SUPER ADMIN PANEL
            </span>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              SUPER ADMIN
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Dashboard Super Admin</h1>
          <p className="text-pri-silver text-sm mt-1">
            Selamat datang, <span className="text-gradient">{memberName}</span>
            <span className="mx-2 opacity-30">|</span>
            Kontrol penuh sistem dan manajemen PRO RI
          </p>
        </div>
      </div>

      <SuperAdminClient health={health} memberName={memberName} />
    </div>
  );
}
