"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { GalleryItem } from "./gallery-shared";
import { categoryLabel, categoryColors } from "./gallery-shared";

interface GalleryClientProps {
  items: GalleryItem[];
}

export function GalleryClient({ items }: GalleryClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [...new Set(items.map((i) => i.category))];

  const filtered = activeCategory
    ? items.filter((i) => i.category === activeCategory)
    : items;

  return (
    <>
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs text-pri-silver/50 font-mono uppercase tracking-wider mr-1">
            Filter:
          </span>
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "text-xs px-3 py-1 rounded-full font-mono cursor-pointer transition-opacity hover:opacity-80",
              activeCategory === null
                ? "bg-pri-red/20 text-pri-red"
                : "text-pri-silver/60 hover:text-pri-silver"
            )}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={cn(
                "text-xs px-3 py-1 rounded-full font-mono cursor-pointer transition-opacity hover:opacity-80",
                activeCategory === cat
                  ? "ring-2 ring-pri-red/50"
                  : categoryColors[cat] || categoryColors.other
              )}
            >
              {categoryLabel[cat] || cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <a
            key={item.id}
            href={item.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-[4/3] rounded-xl overflow-hidden glass-card-hover cursor-pointer"
          >
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pri-carbon/90 via-pri-carbon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-sm font-semibold text-white line-clamp-2">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-white/70 mt-1 line-clamp-1">{item.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-mono", categoryColors[item.category] || categoryColors.other)}>
                  {categoryLabel[item.category] || item.category}
                </span>
                {item.date_taken && (
                  <span className="text-[10px] text-pri-silver/50">
                    {new Date(item.date_taken).toLocaleDateString("id-ID")}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-pri-silver/60 py-12">
          Tidak ada galeri dengan kategori ini
        </p>
      )}

      <p className="text-center text-xs text-pri-silver/40 mt-8">
        Total {filtered.length} dari {items.length} foto — Klik gambar untuk melihat ukuran penuh
      </p>
    </>
  );
}
