import { createClient } from "@/lib/supabase/server";
import { PublicEventsClient } from "@/components/features/dashboard/public-events-client";

async function getEvents() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, slug, description, category, type, start_date, end_date, location, banner_url, max_participants, province_id!inner(name)")
    .eq("status", "published")
    .order("start_date", { ascending: false });

  return {
    events: events ?? [],
    userId: user?.id ?? null,
  };
}

export default async function EventsPage() {
  const { events, userId } = await getEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Events</h1>
        <p className="text-pri-silver mt-1">Kegiatan dan acara PRO RI</p>
      </div>

      <PublicEventsClient {...({ events, userId } as any)} />
    </div>
  );
}
