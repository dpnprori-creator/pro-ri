import { createClient } from "@/lib/supabase/server";
import { AdminDashboardClient } from "./admin-dashboard-client";

async function getAdminDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get admin's own member info
  const { data: adminMember } = await supabase
    .from("members")
    .select("id, full_name, role_id(name)")
    .eq("auth_id", user.id)
    .single();

  if (!adminMember) return null;

  const roleObj = adminMember.role_id as { name: string } | null;
  const roleName = roleObj?.name || "member";

  // Parallel queries for comprehensive admin stats
  const [
    { count: totalMembers },
    { count: activeMembers },
    { count: totalEvents },
    { count: totalInnovations },
    { count: totalCertificates },
    { count: totalProvinces },
    { count: totalTrainers },
    { count: totalMentors },
    { count: pendingVerifications },
    { count: pendingMemberCards },
    { count: unreadMessages },
  ] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("innovations").select("*", { count: "exact", head: true }),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
    supabase.from("provinces").select("*", { count: "exact", head: true }),
    supabase.from("member_designations").select("*", { count: "exact", head: true }).eq("designation", "trainer"),
    supabase.from("member_designations").select("*", { count: "exact", head: true }).eq("designation", "mentor"),
    supabase.from("event_registrations").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("member_cards").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
  ]);

  // Recent members
  const { data: recentMembers } = await supabase
    .from("members")
    .select("id, full_name, email, member_id, created_at, role_id!inner(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    stats: {
      totalMembers: totalMembers ?? 0,
      activeMembers: activeMembers ?? 0,
      totalEvents: totalEvents ?? 0,
      totalInnovations: totalInnovations ?? 0,
      totalCertificates: totalCertificates ?? 0,
      totalTrainers: totalTrainers ?? 0,
      totalMentors: totalMentors ?? 0,
      totalProvinces: totalProvinces ?? 0,
      pendingVerifications: pendingVerifications ?? 0,
      pendingMemberCards: pendingMemberCards ?? 0,
      unreadMessages: unreadMessages ?? 0,
    },
    recentMembers: recentMembers ?? [],
    memberName: adminMember.full_name,
    memberRole: roleName,
  };
}

export default async function AdminPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
              <span className="status-dot" />
              ADMIN PANEL
            </span>
          </div>
          <div className="flex items-center gap-3 mb-1">
            {data?.memberRole === "super_admin" ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                SUPER ADMIN
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                ADMIN
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white">
            {data?.memberRole === "super_admin" ? "Dashboard Super Admin" : "Dashboard Admin"}
          </h1>
          <p className="text-pri-silver text-sm mt-1">
            Selamat datang, <span className="text-gradient">{data?.memberName || "Admin"}</span>
            <span className="mx-2 opacity-30">|</span>
            Overview sistem dan kontrol panel PRO RI
          </p>
        </div>
      </div>

      {data ? (
        <AdminDashboardClient
          stats={data.stats}
          recentMembers={data.recentMembers}
          memberName={data.memberName}
          memberRole={data.memberRole}
        />
      ) : (
        <div className="text-center text-pri-silver py-12">Silakan login terlebih dahulu</div>
      )}
    </div>
  );
}
