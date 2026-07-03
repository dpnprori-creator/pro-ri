import { Calendar, Sparkles } from "lucide-react";
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
    <section className="pt-32 pb-16 circuit-pattern relative overflow-hidden min-h-screen">
      <div className="hero-scan-line" />
      <div className="tech-particles">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="tech-particle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: '100%',
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 12}s`,
            }}
          />
        ))}
      </div>
      <div className="orbit-ring" style={{ top: '20%', right: '8%', width: '100px', height: '100px', opacity: 0.05 }} />
      <div className="orbit-ring orbit-ring-2" style={{ bottom: '10%', left: '10%', width: '60px', height: '60px', opacity: 0.03 }} />
      <div className="container-wide px-4 relative z-10">
        <div className="text-center circuit-border rounded-xl p-8 mb-12 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-pri-red" />
            <span className="text-xs uppercase tracking-widest text-pri-silver font-medium">
              Kegiatan & Acara
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Kalender <span className="text-gradient">Events</span>
          </h1>
          <p className="text-lg text-pri-silver">
            Kegiatan dan acara PRO RI — webinar, workshop, kompetisi, dan pameran robotika nasional
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
            <p className="text-pri-silver">Belum ada event tersedia</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <PublicEventsClient {...({ events, userId } as any)} />
          </div>
        )}
      </div>
    </section>
  );
}
