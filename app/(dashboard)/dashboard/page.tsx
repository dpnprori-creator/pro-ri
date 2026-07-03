import { createClient } from "@/lib/supabase/server";

async function getDashboardData() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  const [
    { count: totalMembers },
    { count: totalEvents },
  ] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("events").select("*", { count: "exact", head: true }).gte("end_date", new Date().toISOString()),
  ]);

  return {
    member,
    stats: {
      totalMembers: totalMembers ?? 0,
      totalEvents: totalEvents ?? 0,
    },
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data?.member) {
    return <div className="text-center text-pri-silver py-12">Silakan login terlebih dahulu</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-pri-silver mt-1">Selamat datang, {data.member.full_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-4">
          <p className="text-pri-silver text-sm">Total Member Aktif</p>
          <p className="text-2xl font-bold text-white mt-1">{data.stats.totalMembers}</p>
        </div>
        <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-4">
          <p className="text-pri-silver text-sm">Event Mendatang</p>
          <p className="text-2xl font-bold text-white mt-1">{data.stats.totalEvents}</p>
        </div>
      </div>
    </div>
  );
}
