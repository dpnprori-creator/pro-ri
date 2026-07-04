import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function DebugPage() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold text-red-400">❌ Not authenticated</h1>
        <p className="text-pri-silver mt-2">Silakan login terlebih dahulu</p>
      </div>
    );
  }

  // Query using regular client (with RLS)
  const { data: memberRegular, error: errRegular } = await supabase
    .from("members")
    .select("id, auth_id, member_id, email, full_name, role_id, status")
    .eq("auth_id", user.id)
    .maybeSingle();

  // Query using admin client (bypass RLS)
  const { data: memberAdmin, error: errAdmin } = await adminSupabase
    .from("members")
    .select("id, auth_id, member_id, email, full_name, role_id, status")
    .eq("auth_id", user.id)
    .maybeSingle();

  // Get role name if role_id exists — admin client
  let roleNameAdmin = null;
  if (memberAdmin?.role_id) {
    const { data: role } = await adminSupabase
      .from("roles")
      .select("id, name")
      .eq("id", memberAdmin.role_id)
      .single();
    roleNameAdmin = role?.name;
  }

  // Get all roles
  const { data: allRoles } = await adminSupabase
    .from("roles")
    .select("id, name");

  // Get member using regular client with join
  const { data: memberWithJoin, error: errJoin } = await supabase
    .from("members")
    .select("id, role_id(name)")
    .eq("auth_id", user.id)
    .maybeSingle();

  // Get member using ADMIN client with join (perbandingan)
  const { data: memberWithJoinAdmin, error: errJoinAdmin } = await adminSupabase
    .from("members")
    .select("id, role_id(name)")
    .eq("auth_id", user.id)
    .maybeSingle();

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">🔍 Debug: User &amp; Role Info</h1>

      {/* Auth User */}
      <Section title="Auth User (supabase.auth.getUser())">
        <pre className="text-xs text-green-300">{JSON.stringify({ id: user.id, email: user.email }, null, 2)}</pre>
      </Section>

      {/* Regular Client Query */}
      <Section title="Regular Client (anon key + RLS)" status={errRegular ? "❌ Error" : memberRegular ? "✅ Found" : "⚠️ No data"}>
        {errRegular && <p className="text-red-400 text-sm">Error: {errRegular.message}</p>}
        <pre className="text-xs">{JSON.stringify(memberRegular, null, 2)}</pre>
      </Section>

      {/* Admin Client Query */}
      <Section title="Admin Client (service_role key - bypass RLS)" status={errAdmin ? "❌ Error" : memberAdmin ? "✅ Found" : "⚠️ No data"}>
        {errAdmin && <p className="text-red-400 text-sm">Error: {errAdmin.message}</p>}
        <pre className="text-xs">{JSON.stringify(memberAdmin, null, 2)}</pre>
      </Section>

      {/* Role from admin client */}
      <Section title="Role Name (resolved from role_id)" status={roleNameAdmin ? `🎯 ${roleNameAdmin}` : "⚠️ No role"}>
        <pre className="text-xs">{JSON.stringify({ role_id: memberAdmin?.role_id, role_name: roleNameAdmin }, null, 2)}</pre>
      </Section>

      {/* Role Join (regular client) */}
      <Section title="Regular Client Join - role_id(name)" status={errJoin ? `❌ ${errJoin.message}` : memberWithJoin ? "✅ Found" : "⚠️ No data"}>
        {errJoin && <p className="text-red-400 text-sm">Error: {errJoin.message}</p>}
        <pre className="text-xs">{JSON.stringify(memberWithJoin, null, 2)}</pre>
      </Section>

      {/* Role Join (admin client) */}
      <Section title="Admin Client Join - role_id(name)" status={errJoinAdmin ? `❌ ${errJoinAdmin.message}` : memberWithJoinAdmin ? "✅ Found" : "⚠️ No data"}>
        {errJoinAdmin && <p className="text-red-400 text-sm">Error: {errJoinAdmin.message}</p>}
        <pre className="text-xs">{JSON.stringify(memberWithJoinAdmin, null, 2)}</pre>
      </Section>

      {/* All Roles */}
      <Section title="All Roles in Database">
        <pre className="text-xs">{JSON.stringify(allRoles, null, 2)}</pre>
      </Section>

      {/* CSS */}
      <style>{`
        body { background: #0a0a0f; }
        pre { background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; overflow-x: auto; }
      `}</style>
    </div>
  );
}

function Section({ title, status, children }: { title: string; status?: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/10 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {status && <span className="text-xs font-mono text-pri-silver">{status}</span>}
      </div>
      {children}
    </div>
  );
}
