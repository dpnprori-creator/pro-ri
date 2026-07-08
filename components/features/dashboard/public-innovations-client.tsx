"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Lightbulb,
  Calendar,
  User,
  MapPin,
  Filter,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface InnovationItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: number | null;
  status: string;
  description: string | null;
  image_url?: string | null;
  members: { full_name: string } | null;
  provinces: { name: string } | null;
}

interface PublicInnovationsClientProps {
  innovations: InnovationItem[];
}

const categoryLabel: Record<string, string> = {
  robotics: "Robotika",
  ai: "AI",
  iot: "IoT",
  programming: "Programming",
  research: "Research",
};

const categoryColors: Record<string, string> = {
  robotics: "from-blue-600 to-blue-800",
  ai: "from-purple-600 to-purple-800",
  iot: "from-green-600 to-green-800",
  programming: "from-yellow-600 to-yellow-800",
  research: "from-red-600 to-red-800",
};

const allCategories = [
  { value: "", label: "Semua" },
  { value: "robotics", label: "Robotika" },
  { value: "ai", label: "AI" },
  { value: "iot", label: "IoT" },
  { value: "programming", label: "Programming" },
  { value: "research", label: "Research" },
];

export function PublicInnovationsClient({
  innovations,
}: PublicInnovationsClientProps) {
  const [activeCategory, setActiveCategory] = useState("");

  const filteredInnovations = useMemo(() => {
    if (!activeCategory) return innovations;
    return innovations.filter((i) => i.category === activeCategory);
  }, [innovations, activeCategory]);

  if (innovations.length === 0) {
    return (
      <div className="text-center py-20">
        <Lightbulb className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
        <p className="text-pri-silver">Belum ada inovasi dipublikasikan</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Filter className="h-4 w-4 text-pri-silver mr-1" />
        {allCategories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              activeCategory === cat.value
                ? "bg-pri-red text-white shadow-lg shadow-pri-red/20"
                : "bg-white/5 text-pri-silver hover:text-white hover:bg-white/10"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-center text-xs text-pri-silver/60 font-mono">
        Menampilkan {filteredInnovations.length} dari {innovations.length} inovasi
      </p>

      {/* Innovation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInnovations.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Link href={`/innovations/${item.slug}`} className="block h-full group">
              <div className="glass-tech rounded-xl border border-white/10 overflow-hidden h-full transition-all duration-300 hover:border-pri-red/30 hover:shadow-lg hover:shadow-pri-red/5 group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className={`h-full bg-gradient-to-br ${categoryColors[item.category] || "from-pri-red/20 to-pri-dark"} flex items-center justify-center`}>
                      <Lightbulb className="h-16 w-16 text-white/20" />
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon/80 via-transparent to-transparent" />

                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" className="bg-white/10 backdrop-blur-sm text-white border-white/20 text-[10px]">
                      {categoryLabel[item.category] || item.category}
                    </Badge>
                  </div>

                  {/* Status badge */}
                  {item.status === "featured" && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="success" className="text-[10px]">
                        Featured
                      </Badge>
                    </div>
                  )}

                  {/* Year */}
                  {item.year && (
                    <div className="absolute bottom-3 right-3">
                      <span className="text-[10px] font-mono text-white/60 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {item.year}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-white mb-3 line-clamp-2 group-hover:text-pri-red transition-colors">
                    {item.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    {item.members?.full_name && (
                      <div className="flex items-center gap-2 text-xs text-pri-silver/70">
                        <User className="h-3.5 w-3.5 text-pri-red/60" />
                        {item.members.full_name}
                      </div>
                    )}
                    {item.provinces?.name && (
                      <div className="flex items-center gap-2 text-xs text-pri-silver/70">
                        <MapPin className="h-3.5 w-3.5 text-pri-red/60" />
                        {item.provinces.name}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-xs text-pri-silver/50 line-clamp-2 leading-relaxed mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[10px] text-pri-silver/40 font-mono">
                      #{item.slug}
                    </span>
                    <span className="text-xs text-pri-red flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Detail <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Empty state for filtered results */}
      {filteredInnovations.length === 0 && (
        <div className="text-center py-16">
          <div className="h-16 w-16 rounded-full bg-pri-red/10 flex items-center justify-center mx-auto mb-4">
            <Filter className="h-8 w-8 text-pri-red/40" />
          </div>
          <p className="text-pri-silver text-sm">
            Tidak ada inovasi dengan kategori ini
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveCategory("")}
            className="mt-4 border-white/10 text-pri-silver hover:text-white"
          >
            Tampilkan Semua
          </Button>
        </div>
      )}
    </div>
  );
}
