import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventRegistration } from "@/components/features/events/event-registration";

async function getEvent(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: event } = await supabase
    .from("events")
    .select("*, province_id!inner(name)")
    .eq("slug", slug)
    .single();

  if (!event) return { event: null, userId: null, isRegistered: false };

  let isRegistered = false;
  if (user) {
    const { data: member } = await supabase
      .from("members")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (member) {
      const { data: reg } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", event.id)
        .eq("member_id", member.id)
        .neq("status", "cancelled")
        .maybeSingle();

      isRegistered = !!reg;
    }
  }

  return { event, userId: user?.id ?? null, isRegistered };
}

export default async function EventDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const { event, userId, isRegistered } = await getEvent(slug);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{event.title}</h1>
        <p className="text-pri-silver mt-1">{event.category} - {event.type}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-4">
            <p className="text-pri-silver">{event.description}</p>
            <div className="mt-4 space-y-2 text-sm text-pri-silver">
              <p>📅 {new Date(event.start_date).toLocaleDateString("id-ID")} - {new Date(event.end_date).toLocaleDateString("id-ID")}</p>
              <p>📍 {event.location || event.province_id?.name || "Online"}</p>
              <p>👥 {event.max_participants ? `Max ${event.max_participants} peserta` : "Unlimited"}</p>
            </div>
          </div>
        </div>
        <div>
          <EventRegistration
            eventId={event.id}
            registered={isRegistered}
            registrationStatus={isRegistered ? "registered" : null}
            isLoggedIn={!!userId}
          />
        </div>
      </div>
    </div>
  );
}
