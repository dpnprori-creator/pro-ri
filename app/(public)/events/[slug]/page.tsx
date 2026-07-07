import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { EventRegistration } from "@/components/features/events/event-registration";
import { getPublishedEvents } from "@/features/public/data";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Sparkles,
  Globe,
  Monitor,
  ChevronRight,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventShareButton } from "@/components/features/events/event-share-button";

const categoryLabel: Record<string, string> = {
  webinar: "Webinar", workshop: "Workshop", competition: "Kompetisi", exhibition: "Pameran",
};

const typeLabel: Record<string, string> = {
  online: "Online", offline: "Offline", hybrid: "Hybrid",
};

const typeIcon: Record<string, any> = {
  online: Monitor, offline: Globe, hybrid: Globe,
};

const categoryColors: Record<string, string> = {
  webinar: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  workshop: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  competition: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  exhibition: "bg-green-500/20 text-green-400 border-green-500/30",
};

async function getEvent(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: event } = await supabase
    .from("events")
    .select("*, province_id(name)")
    .eq("slug", slug)
    .eq("status", "published")
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

  const relatedEvents = await getPublishedEvents({ category: event.category, limit: 3 });
  const related = (relatedEvents.data ?? []).filter((e: any) => e.slug !== slug).slice(0, 3);

  const shareUrl = `https://prori.id/events/${slug}`;
  const shareText = encodeURIComponent(event.title);

  const TypeIcon = typeIcon[event.type] || Globe;

  return (
    <section className="pt-28 pb-16 circuit-pattern min-h-screen relative overflow-hidden">
      <div className="hero-scan-line" />
      <div className="tech-particles">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="tech-particle" style={{ left: `${10 + Math.random() * 80}%`, top: '100%', animationDelay: `${Math.random() * 15}s`, animationDuration: `${12 + Math.random() * 12}s` }} />
        ))}
      </div>
      <div className="orbit-ring" style={{ top: '10%', right: '5%', width: '80px', height: '80px', opacity: 0.04 }} />

      <div className="container-wide px-4 relative z-10">
        {/* Back Link */}
        <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-pri-silver hover:text-white mb-6 transition-colors group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Kembali ke Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Banner */}
            {event.banner_url ? (
              <div className="rounded-xl overflow-hidden border border-white/10 relative h-64 md:h-80">
                <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon via-transparent to-transparent" />
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden border border-white/10 h-48 md:h-64 bg-gradient-to-br from-pri-red/20 via-pri-dark to-pri-carbon flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-20 w-40 h-40 rounded-full border-8 border-white" />
                  <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full border-8 border-white" />
                </div>
                <div className="text-center relative z-10">
                  <Sparkles className="h-12 w-12 text-pri-red/40 mx-auto mb-2" />
                  <p className="text-pri-silver/40 text-sm">{categoryLabel[event.category] || event.category}</p>
                </div>
              </div>
            )}

            {/* Header Info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className={`${categoryColors[event.category] || "bg-white/10 text-white"} border text-xs`}>
                  {categoryLabel[event.category] || event.category}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-pri-silver text-xs flex items-center gap-1">
                  <TypeIcon className="h-3 w-3" />
                  {typeLabel[event.type] || event.type}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{event.title}</h1>
              
              {/* Quick Info Bar */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-pri-silver">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-pri-red" />
                  {new Date(event.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-pri-red" />
                  {new Date(event.start_date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                </span>
                {event.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-pri-red" />
                    {event.location}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <Card className="glass-card border-white/10 overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-pri-red" />
                  Tentang Event
                </h2>
                {event.description ? (
                  <div className="text-sm text-pri-silver leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </div>
                ) : (
                  <p className="text-sm text-pri-silver/50 italic">Tidak ada deskripsi</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card className="glass-card border-white/10 overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-pri-red" />
                  Pendaftaran
                </h3>
                <EventRegistration
                  eventId={event.id}
                  registered={isRegistered}
                  registrationStatus={isRegistered ? "registered" : null}
                  isLoggedIn={!!userId}
                />
              </CardContent>
            </Card>

            {/* Event Info Card */}
            <Card className="glass-card border-white/10 overflow-hidden">
              <CardContent className="p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-pri-red" />
                  Informasi Event
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-pri-silver/40 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-pri-silver/50 uppercase">Mulai</p>
                      <p className="text-sm text-white">{new Date(event.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-pri-silver/40 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-pri-silver/50 uppercase">Selesai</p>
                      <p className="text-sm text-white">{new Date(event.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>
                  {event.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-pri-silver/40 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-pri-silver/50 uppercase">Lokasi</p>
                        <p className="text-sm text-white">{event.location}</p>
                      </div>
                    </div>
                  )}
                  {event.max_participants && (
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-pri-silver/40 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-pri-silver/50 uppercase">Kapasitas</p>
                        <p className="text-sm text-white">{event.max_participants} peserta</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Share Card */}
            <Card className="glass-card border-white/10 overflow-hidden">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-pri-red" />
                  Bagikan
                </h3>
                <div className="flex items-center gap-2">
                  <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-pri-silver hover:bg-blue-500/20 hover:text-blue-400 transition-all" title="Twitter">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-pri-silver hover:bg-blue-500/20 hover:text-blue-400 transition-all" title="Facebook">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${shareText}`} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-pri-silver hover:bg-blue-500/20 hover:text-blue-400 transition-all" title="LinkedIn">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  </a>
                  <EventShareButton url={shareUrl} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Events */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-pri-red" />
                Event Lainnya
              </h2>
              <Link href="/events" className="text-sm text-pri-red hover:text-red-400 transition-colors flex items-center gap-1">
                Lihat Semua
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((item: any) => (
                <Link key={item.id} href={`/events/${item.slug}`}>
                  <Card className="glass-tech p-0 overflow-hidden h-full group">
                    <div className="relative h-36 overflow-hidden">
                      {item.banner_url ? (
                        <Image src={item.banner_url} alt={item.title} fill className="object-cover transition-transform duration-300 group-hover:scale-110" sizes="(max-width: 640px) 100vw, 33vw" />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-pri-red/10 to-pri-dark flex items-center justify-center">
                          <Calendar className="h-8 w-8 text-pri-red/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <Badge className={`${categoryColors[item.category] || "bg-white/10 text-white"} border text-[10px]`}>
                          {categoryLabel[item.category] || item.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-pri-red transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-pri-silver/60 mt-1">
                        {new Date(item.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

