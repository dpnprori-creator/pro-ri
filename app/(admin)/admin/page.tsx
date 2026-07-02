import { createClient } from "@/lib/supabase/server";

async function getStats() {
  const supabase = await createClient();

  const [
    { count: totalMembers },
    { count: totalEvents },
    { count: totalInnovations },
    { count: totalCertificates },
  ] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("innovations").select("*", { count: "exact", head: true }),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
  ]);

  const { data: recentMembers } = await supabase
    .from("members")
    .select("id, full_name, email, member_id, created_at, role_id!inner(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    totalMembers: totalMembers ?? 0,
    totalEvents: totalEvents ?? 0,
    totalInnovations: totalInnovations ?? 0,
    totalCertificates: totalCertificates ?? 0,
    recentMembers: recentMembers ?? [],
  };
}

export default async function AdminPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-pri-silver mt-1">Overview sistem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-4">
          <p className="text-pri-silver text-sm">Total Members</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.totalMembers}</p>
        </div>
        <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-4">
          <p className="text-pri-silver text-sm">Total Events</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.totalEvents}</p>
        </div>
        <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-4">
          <p className="text-pri-silver text-sm">Total Inovasi</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.totalInnovations}</p>
        </div>
        <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-4">
          <p className="text-pri-silver text-sm">Total Sertifikat</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.totalCertificates}</p>
        </div>
      </div>

      <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-3">Member Terbaru</h2>
        <div className="space-y-3">
          {stats.recentMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between border-b border-pri-gold/10 pb-2">
              <div>
                <p className="text-white font-medium">{member.full_name}</p>
                <p className="text-pri-silver text-sm">{member.email}</p>
              </div>
              <span className="text-xs text-pri-gold">{member.member_id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
