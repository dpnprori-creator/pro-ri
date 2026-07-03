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

  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("*, events!inner(id, title, slug, start_date, end_date, category, type, status, location, max_participants, description, province_id(name))")
    .eq("member_id", member.id)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false });

  // Flatten nested event data for DashboardEventsClient
  return (registrations ?? []).map((reg: any) => ({
    ...reg.events,
    registration_id: reg.id,
    registration_status: reg.status,
    created_at: reg.created_at,
  }));
}

export default async function DashboardEventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Events Saya</h1>
        <p className="text-pri-silver mt-1">{events.length} pendaftaran event</p>
      </div>

      <DashboardEventsClient events={events as any} />
    </div>
  );
}
