"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
  status: string;
  max_participants: number | null;
  description: string | null;
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

const allCategories = [
  { value: "", label: "Semua" },
  { value: "webinar", label: "Webinar" },
  { value: "workshop", label: "Workshop" },
  { value: "competition", label: "Kompetisi" },
  { value: "exhibition", label: "Pameran" },
];

export function PublicEventsClient({
  events,
  registrations = {},
  isLoggedIn = false,
}: PublicEventsClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const filteredEvents = useMemo(() => {
    if (!activeCategory) return events;
    return events.filter((e) => e.category === activeCategory);
  }, [events, activeCategory]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

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

  const isEventOpen = (event: EventItem) =>
    event.status === "published" || event.status === "ongoing";

  return (
    <>
      <div className="space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-pri-silver" />
          {allCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setActiveCategory(cat.value);
                setExpandedId(null);
              }}
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

        {/* Results count */}
        <p className="text-xs text-pri-silver">
          Menampilkan {filteredEvents.length} dari {events.length} event
        </p>

        {/* Event Cards */}
        <div className="space-y-3">
          {filteredEvents.map((event) => {
            const isExpanded = expandedId === event.id;
            const isRegistered = registrations[event.id] === "registered" || registrations[event.id] === "approved";
            const isOpen = isEventOpen(event);

            return (
              <motion.div
                key={event.id}
                layout
                className="glass-tech rounded-xl border border-white/10 overflow-hidden"
              >
                {/* Card Header — always visible */}
                <button
                  onClick={() => toggleExpand(event.id)}
                  className="w-full text-left p-5 flex items-start gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="w-1 self-stretch rounded-full bg-pri-red shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="text-[10px]">
                        {categoryLabel[event.category] || event.category}
                      </Badge>
                      <Badge
                        variant={
                          event.status === "published" || event.status === "ongoing"
                            ? "success"
                            : event.status === "completed"
                            ? "secondary"
                            : "default"
                        }
                        className="text-[10px]"
                      >
                        {event.status === "published"
                          ? "Terbuka"
                          : event.status === "ongoing"
                          ? "Berlangsung"
                          : event.status === "completed"
                          ? "Selesai"
                          : event.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] border-white/10 text-pri-silver"
                      >
                        {typeLabel[event.type] || event.type}
                      </Badge>
                      {isRegistered && (
                        <Badge variant="success" className="text-[10px] flex items-center gap-1">
                          <CheckCircle className="h-2.5 w-2.5" />
                          Terdaftar
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-white mb-2 line-clamp-1">
                      {event.title}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-pri-silver">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.start_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.start_date).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        WIB
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-pri-silver/50 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, maxHeight: 0 }}
                      animate={{ opacity: 1, maxHeight: 1000 }}
                      exit={{ opacity: 0, maxHeight: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 border-t border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <Calendar className="h-4 w-4 text-pri-red shrink-0" />
                              <div>
                                <p className="text-pri-silver text-xs">
                                  Tanggal Mulai
                                </p>
                                <p className="text-white">
                                  {new Date(event.start_date).toLocaleDateString(
                                    "id-ID",
                                    {
                                      weekday: "long",
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <Clock className="h-4 w-4 text-pri-red shrink-0" />
                              <div>
                                <p className="text-pri-silver text-xs">Waktu</p>
                                <p className="text-white">
                                  {new Date(
                                    event.start_date
                                  ).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  WIB —{" "}
                                  {new Date(event.end_date).toLocaleTimeString(
                                    "id-ID",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}{" "}
                                  WIB
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {event.location && (
                              <div className="flex items-center gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-pri-red shrink-0" />
                                <div>
                                  <p className="text-pri-silver text-xs">Lokasi</p>
                                  <p className="text-white">{event.location}</p>
                                </div>
                              </div>
                            )}
                            {event.max_participants && (
                              <div className="flex items-center gap-3 text-sm">
                                <Users className="h-4 w-4 text-pri-red shrink-0" />
                                <div>
                                  <p className="text-pri-silver text-xs">
                                    Max Peserta
                                  </p>
                                  <p className="text-white font-mono">
                                    {event.max_participants}
                                  </p>
                                </div>
                              </div>
                            )}
                            {event.provinces?.name && (
                              <div className="flex items-center gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-pri-red shrink-0" />
                                <div>
                                  <p className="text-pri-silver text-xs">
                                    Provinsi
                                  </p>
                                  <p className="text-white">
                                    {event.provinces.name}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {event.description && (
                          <div className="border-t border-white/10 pt-4 mb-4">
                            <p className="text-xs text-pri-silver font-medium mb-2">
                              Tentang Event
                            </p>
                            <p className="text-sm text-pri-silver leading-relaxed">
                              {event.description}
                            </p>
                          </div>
                        )}

                        <div className="border-t border-white/10 pt-4 flex gap-2">
                          {isOpen && (
                            <Button
                              onClick={() => openModal(event)}
                              size="sm"
                              className={`flex-1 ${
                                isRegistered
                                  ? "bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/20"
                                  : "bg-pri-red hover:bg-red-700"
                              }`}
                            >
                              {isRegistered ? (
                                <>
                                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                  Terdaftar
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                  Daftar
                                </>
                              )}
                            </Button>
                          )}
                          <Link href={`/events/${event.slug}`} className="flex-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/10 text-pri-silver hover:text-white w-full"
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-2" />
                              Detail
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
