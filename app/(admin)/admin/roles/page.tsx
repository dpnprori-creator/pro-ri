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

async function getMembers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("members")
    .select("*, role_id(name), province_id(name)")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminRolesPage() {
  const [roles, members] = await Promise.all([getRoles(), getMembers()]);

  const roleCounts: Record<string, number> = {};
  for (const role of roles) {
    roleCounts[role.name] = members.filter((m: any) => m.role_id?.name === role.name).length;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-[10px] text-purple-400/80 font-mono">
              <span className="status-dot" />
              SUPER ADMIN — ROLE MANAGEMENT
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Role Management</h1>
          <p className="text-pri-silver text-sm mt-1">
            Kelola dan ubah role pengguna — <span className="text-purple-400">{members.length}</span> total member
          </p>
        </div>
      </div>

      {/* Role Distribution Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {roles.map((role) => {
          const count = roleCounts[role.name] || 0;
          const total = members.length || 1;
          const pct = Math.round((count / total) * 100);
          const variants: Record<string, { color: string; bg: string; icon: string }> = {
            super_admin: { color: "text-purple-400", bg: "bg-purple-500/10", icon: "👑" },
            admin: { color: "text-blue-400", bg: "bg-blue-500/10", icon: "🛡️" },
            member: { color: "text-green-400", bg: "bg-green-500/10", icon: "👤" },
            guest: { color: "text-yellow-400", bg: "bg-yellow-500/10", icon: "🔹" },
          };
          const v = variants[role.name] || { color: "text-pri-silver", bg: "bg-white/5", icon: "❓" };
          return (
            <div key={role.id} className={`${v.bg} rounded-xl p-4 border border-white/5 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.03]">
                <div className="text-[80px] leading-none -mt-4 -mr-4">{v.icon}</div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`h-2 w-2 rounded-full ${v.color.replace("text", "bg")}`} />
                  <span className={`text-xs font-semibold ${v.color}`}>
                    {role.name === "super_admin" ? "Super Admin" : role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white font-mono tabular-nums">{count}</p>
                <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${v.color.replace("text", "bg")}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-pri-silver/60 mt-1 font-mono">{pct}% dari total</p>
              </div>
            </div>
          );
        })}
      </div>

      <RolesManager roles={roles} members={members} />
    </div>
  );
}
