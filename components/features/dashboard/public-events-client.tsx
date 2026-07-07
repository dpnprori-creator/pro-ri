"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Filter,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RegistrationModal } from "@/components/features/registration-modal";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  start_date: string;
  end_date: string;
  location: string | null;
  description: string | null;
  banner_url: string | null;
  status: string;
  max_participants: number | null;
  provinces: { name: string } | null;
}

interface PublicEventsClientProps {
  events: EventItem[];
  registrations?: Record<string, string>;
  isLoggedIn?: boolean;
}

const categoryLabel: Record<string, string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  competition: "Kompetisi",
  exhibition: "Pameran",
};

const typeLabel: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  hybrid: "Hybrid",
};

const categoryColors: Record<string, string> = {
  webinar: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  workshop: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  competition: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  exhibition: "bg-green-500/20 text-green-400 border-green-500/30",
};

const allCategories = [
  { value: "", label: "Semua" },
  { value: "webinar", label: "Webinar" },
  { value: "workshop", label: "Workshop" },
  { value: "competition", label: "Kompetisi" },
  { value: "exhibition", label: "Pameran" },
];

const defaultImages = [
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
];

export function PublicEventsClient({
  events,
  registrations = {},
  isLoggedIn = false,
}: PublicEventsClientProps) {
  const [activeCategory, setActiveCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const filteredEvents = useMemo(() => {
    if (!activeCategory) return events;
    return events.filter((e) => e.category === activeCategory);
  }, [events, activeCategory]);

  const openModal = (event: EventItem) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <Calendar className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
        <p className="text-pri-silver">Belum ada event tersedia</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-pri-silver" />
          {allCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                activeCategory === cat.value
                  ? "bg-pri-red text-white"
                  : "bg-white/5 text-pri-silver hover:text-white hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-pri-silver">
          Menampilkan {filteredEvents.length} dari {events.length} event
        </p>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event, i) => {
            const isOpen = event.status === "published" || event.status === "ongoing";
            const isRegistered = registrations[event.id] === "registered" || registrations[event.id] === "approved";

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="glass-tech overflow-hidden group h-full flex flex-col">
                  <div className="corner-bracket corner-bracket-tl" />
                  <div className="corner-bracket corner-bracket-tr" />
                  <div className="corner-bracket corner-bracket-bl" />
                  <div className="corner-bracket corner-bracket-br" />

                  {/* Banner Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.banner_url || defaultImages[i % defaultImages.length]}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon via-pri-carbon/60 to-transparent" />
                    
                    {/* Category & Type Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className={`${categoryColors[event.category] || "bg-white/10 text-white"} border text-[10px]`}>
                        {categoryLabel[event.category] || event.category}
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-pri-silver text-[10px] bg-black/30">
                        {typeLabel[event.type] || event.type}
                      </Badge>
                    </div>

                    {/* Registration Status */}
                    {isRegistered && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="success" className="text-[10px] flex items-center gap-1">
                          <CheckCircle className="h-2.5 w-2.5" />
                          Terdaftar
                        </Badge>
                      </div>
                    )}

                    {/* Date on banner */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-white/80 bg-black/40 px-2 py-1 rounded-full">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.start_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-pri-red transition-colors">
                      {event.title}
                    </h3>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center gap-2 text-xs text-pri-silver">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {new Date(event.start_date).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          WIB —{" "}
                          {new Date(event.end_date).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          WIB
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-xs text-pri-silver">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.max_participants && (
                        <div className="flex items-center gap-2 text-xs text-pri-silver">
                          <Users className="h-3.5 w-3.5 shrink-0" />
                          <span>Kapasitas: {event.max_participants} peserta</span>
                        </div>
                      )}
                    </div>

                    {/* Description (truncated) */}
                    {event.description && (
                      <p className="text-xs text-pri-silver/70 line-clamp-2 mb-4 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto pt-3 border-t border-white/5">
                      {isOpen && (
                        <Button
                          onClick={() => openModal(event)}
                          size="sm"
                          className={`flex-1 h-9 text-xs ${
                            isRegistered
                              ? "bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/20"
                              : "bg-pri-red hover:bg-red-700"
                          }`}
                        >
                          {isRegistered ? (
                            <>
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Terdaftar
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Daftar
                            </>
                          )}
                        </Button>
                      )}
                      <a href={`/events/${event.slug}`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/10 text-pri-silver hover:text-white w-full h-9 text-xs"
                        >
                          <ArrowRight className="h-3.5 w-3.5 mr-1" />
                          Detail
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Registration Modal */}
      {selectedEvent && (
        <RegistrationModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          type="event"
          id={selectedEvent.id}
          title={selectedEvent.title}
          isRegistered={registrations[selectedEvent.id] === "registered" || registrations[selectedEvent.id] === "approved"}
        />
      )}
    </>
  );
}
