import { createClient } from "@/lib/supabase/server";
import { DashboardInnovationsClient } from "@/components/features/dashboard/dashboard-innovations-client";

async function getInnovations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return [];

  const { data } = await supabase
    .from("innovations")
    .select("id, title, slug, category, year, status, province_id!inner(name)")
    .eq("creator_id", member.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function DashboardInnovationsPage() {
  const innovations = await getInnovations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Inovasi Saya</h1>
        <p className="text-pri-silver mt-1">{innovations.length} inovasi</p>
      </div>

      <DashboardInnovationsClient innovations={innovations as any} />
    </div>
  );
}
