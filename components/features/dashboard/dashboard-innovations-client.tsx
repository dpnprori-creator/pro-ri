"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Calendar,
  User,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface InnovationItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: number | null;
  status: string;
  description: string | null;
  members: { full_name: string } | null;
  provinces: { name: string } | null;
}

interface DashboardInnovationsClientProps {
  innovations: InnovationItem[];
}

const categoryLabel: Record<string, string> = {
  robotics: "Robotika",
  ai: "AI",
  iot: "IoT",
  programming: "Programming",
  research: "Research",
};

export function DashboardInnovationsClient({
  innovations,
}: DashboardInnovationsClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (innovations.length === 0) {
    return (
      <div className="text-center py-20">
        <Lightbulb className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
        <p className="text-pri-silver">Belum ada inovasi dipublikasikan</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {innovations.map((item) => {
        const isExpanded = expandedId === item.id;
        return (
          <motion.div
            key={item.id}
            layout
            className="glass-card-hover rounded-xl border border-white/10 overflow-hidden"
          >
            {/* Card Header — always visible */}
            <button
              onClick={() => toggleExpand(item.id)}
              className="w-full text-left p-5 flex items-start gap-4 hover:bg-white/5 transition-colors"
            >
              {/* Left: Color accent */}
              <div className="w-1 self-stretch rounded-full bg-yellow-500 shrink-0" />

              {/* Middle: Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="default" className="text-[10px]">
                    {categoryLabel[item.category] || item.category}
                  </Badge>
                  <Badge
                    variant={
                      item.status === "featured" ? "success" : "secondary"
                    }
                    className="text-[10px]"
                  >
                    {item.status === "featured" ? "Featured" : "Published"}
                  </Badge>
                  {item.year && (
                    <span className="text-[10px] text-pri-silver font-mono">
                      {item.year}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-white mb-2 line-clamp-1">
                  {item.title}
                </h3>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-pri-silver">
                  {item.members?.full_name && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {item.members.full_name}
                    </span>
                  )}
                  {item.provinces?.name && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.provinces.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Expand indicator */}
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
                    {/* Detail Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
                      {item.members?.full_name && (
                        <div className="flex items-center gap-3 text-sm">
                          <User className="h-4 w-4 text-pri-red shrink-0" />
                          <div>
                            <p className="text-pri-silver text-xs">Kreator</p>
                            <p className="text-white">
                              {item.members.full_name}
                            </p>
                          </div>
                        </div>
                      )}
                      {item.year && (
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-4 w-4 text-pri-red shrink-0" />
                          <div>
                            <p className="text-pri-silver text-xs">Tahun</p>
                            <p className="text-white">{item.year}</p>
                          </div>
                        </div>
                      )}
                      {item.provinces?.name && (
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-4 w-4 text-pri-red shrink-0" />
                          <div>
                            <p className="text-pri-silver text-xs">Provinsi</p>
                            <p className="text-white">
                              {item.provinces.name}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm">
                        <Lightbulb className="h-4 w-4 text-pri-red shrink-0" />
                        <div>
                          <p className="text-pri-silver text-xs">Kategori</p>
                          <p className="text-white">
                            {categoryLabel[item.category] || item.category}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <div className="border-t border-white/10 pt-4 mb-4">
                        <p className="text-xs text-pri-silver font-medium mb-2">
                          Deskripsi
                        </p>
                        <p className="text-sm text-pri-silver leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    )}

                    {/* Link */}
                    <div className="border-t border-white/10 pt-4">
                      <Link href={`/innovations/${item.slug}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/10 text-pri-silver hover:text-white w-full"
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-2" />
                          Lihat Detail Lengkap
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
  );
}
