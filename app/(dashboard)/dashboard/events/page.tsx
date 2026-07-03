import { createClient } from "@/lib/supabase/server";
import { DashboardEventsClient } from "@/components/features/dashboard/dashboard-events-client";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  return (registrations ?? []).map((reg: any) => ({
    ...reg.events,
    registration_id: reg.id,
    registration_status: reg.status,
    created_at: reg.created_at,
  }));
}

export default async function DashboardEventsPage() {
  const events = await getEvents();
  const upcoming = events.filter((e: any) => new Date(e.start_date) > new Date()).length;
  const past = events.length - upcoming;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
              <span className="status-dot" />
              EVENTS SAYA
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Events Saya</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-pri-silver text-sm">{events.length} pendaftaran event</p>
            {upcoming > 0 && (
              <Badge variant="success" className="text-[10px]">
                {upcoming} mendatang
              </Badge>
            )}
            {past > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                {past} selesai
              </Badge>
            )}
          </div>
        </div>
      </div>

      <DashboardEventsClient events={events as any} />
    </div>
  );
}
