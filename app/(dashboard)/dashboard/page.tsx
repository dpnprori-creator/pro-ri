import { createClient } from "@/lib/supabase/server";
import { APP_NAME_SHORT, TARGET_MEMBERS, TARGET_TRAINERS, TARGET_MENTORS } from "@/lib/constants";
import { DashboardClient } from "./dashboard-client";

async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase
    .from("members")
    .select("id, full_name, member_id, occupation, province_id, role_id(name)")
    .eq("auth_id", user.id)
    .single();

  if (!member) return null;

  const roleObj = member.role_id as { name: string } | null;
  const roleName = roleObj?.name || "member";

  // Parallel queries for dashboard stats
  const [
    { count: totalMembers },
    { count: totalEvents },
    { count: totalInnovations },
    { count: totalTrainers },
    { count: totalMentors },
    { count: totalProvinces },
    { count: myInnovations },
    { count: myCertificates },
    { count: myEventRegistrations },
    { count: myProgramRegistrations },
    { count: pendingVerifications },
  ] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("events").select("*", { count: "exact", head: true }).gte("end_date", new Date().toISOString()),
    supabase.from("innovations").select("*", { count: "exact", head: true }).neq("status", "archived"),
    supabase.from("member_designations").select("*", { count: "exact", head: true }).eq("designation", "trainer"),
    supabase.from("member_designations").select("*", { count: "exact", head: true }).eq("designation", "mentor"),
    supabase.from("provinces").select("*", { count: "exact", head: true }),
    supabase.from("innovations").select("*", { count: "exact", head: true }).eq("creator_id", member.id),
    supabase.from("certificates").select("*", { count: "exact", head: true }).eq("member_id", member.id),
    supabase.from("event_registrations").select("*", { count: "exact", head: true }).eq("member_id", member.id).neq("status", "cancelled"),
    supabase.from("program_registrations").select("*", { count: "exact", head: true }).eq("member_id", member.id).neq("status", "cancelled"),
    supabase.from("member_cards").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "pending"),
  ]);

  // Get member's province name
  let provinceName = null;
  if (member.province_id) {
    const { data: prov } = await supabase
      .from("provinces")
      .select("name")
      .eq("id", member.province_id)
      .single();
    provinceName = prov?.name || null;
  }

  return {
    member: {
      ...member,
      role_name: roleName,
      province_name: provinceName,
    },
    stats: {
      totalMembers: totalMembers ?? 0,
      totalEvents: totalEvents ?? 0,
      totalInnovations: totalInnovations ?? 0,
      totalTrainers: totalTrainers ?? 0,
      totalMentors: totalMentors ?? 0,
      totalProvinces: totalProvinces ?? 0,
      memberProgress: Math.min(((totalMembers ?? 0) / TARGET_MEMBERS) * 100, 100),
      trainerProgress: Math.min(((totalTrainers ?? 0) / TARGET_TRAINERS) * 100, 100),
      mentorProgress: Math.min(((totalMentors ?? 0) / TARGET_MENTORS) * 100, 100),
    },
    myStats: {
      innovations: myInnovations ?? 0,
      certificates: myCertificates ?? 0,
      events: myEventRegistrations ?? 0,
      programs: myProgramRegistrations ?? 0,
      pendingCards: pendingVerifications ?? 0,
    },
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data?.member) {
    return <div className="text-center text-pri-silver py-12">Silakan login terlebih dahulu</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
              <span className="status-dot" />
              DASHBOARD
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Selamat datang, <span className="text-gradient">{data.member.full_name}</span>
          </h1>
          <p className="text-pri-silver text-sm mt-1">
            {data.member.member_id}
            {data.member.province_name && ` • ${data.member.province_name}`}
            {data.member.occupation && ` • ${data.member.occupation}`}
          </p>
        </div>
      </div>

      <DashboardClient
        stats={data.stats}
        myStats={data.myStats}
        member={data.member as any}
      />
    </div>
  );
}
