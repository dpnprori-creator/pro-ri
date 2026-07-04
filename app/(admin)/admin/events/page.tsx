import { createClient } from "@/lib/supabase/server";
import { EventsManager } from "./events-manager";

async function getEvents() {
  const supabase = await createClient();
  const [events, provinces] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, slug, category, type, start_date, end_date, status, max_participants, location, description, banner_url, province_id!inner(name)")
      .order("start_date", { ascending: false }),
    supabase.from("provinces").select("id, name").order("name"),
  ]);

  return {
    events: events.data ?? [],
    provinces: provinces.data ?? [],
  };
}

export default async function AdminEventsPage() {
  const { events, provinces } = await getEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Events</h1>
        <p className="text-pri-silver mt-1">Total {events.length} event</p>
      </div>

      <EventsManager {...({ events, provinces } as any)} />
    </div>
  );
}
