import { createClient } from "@/lib/supabase/server";
import { DashboardEventsClient } from "@/components/features/dashboard/dashboard-events-client";

async function getEvents() {
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
    .from("event_registrations")
    .select("*, event_id!inner(id, title, slug, start_date, end_date, category, status, location)")
    .eq("member_id", member.id)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function DashboardEventsPage() {
  const registrations = await getEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Events Saya</h1>
        <p className="text-pri-silver mt-1">{registrations.length} pendaftaran event</p>
      </div>

      <DashboardEventsClient {...({ registrations } as any)} />
    </div>
  );
}
