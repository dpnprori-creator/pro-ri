import { createClient } from "@/lib/supabase/server";
import { GalleryView } from "./gallery-view";
import type { GalleryItem } from "./gallery-shared";

async function getGallery() {
  const supabase = await createClient();

  const [{ data: hero }, { data: activities }] = await Promise.all([
    supabase.from("hero_gallery").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
    supabase.from("activity_gallery").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
  ]);

  return {
    hero: hero ?? [],
    activities: activities ?? [],
  };
}

export default async function GalleryPage() {
  const { hero, activities } = await getGallery();

  // Merge hero gallery + activity gallery into a single items array.
  // hero_gallery tidak punya field category/date_taken, jadi di-map dulu.
  const items: GalleryItem[] = [
    ...hero.map((h) => ({
      id: h.id,
      image_url: h.image_url,
      title: h.title,
      description: h.description,
      category: "hero",
      date_taken: null,
      created_at: h.created_at,
      sort_order: h.sort_order,
      is_active: h.is_active,
    })),
    ...activities.map((a) => ({
      id: a.id,
      image_url: a.image_url,
      title: a.title,
      description: a.description,
      category: a.category,
      date_taken: a.date_taken,
      created_at: a.created_at,
      sort_order: a.sort_order,
      is_active: a.is_active,
    })),
  ];

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Galeri <span className="text-gradient">PRO RI</span>
        </h1>
        <p className="text-pri-silver">Dokumentasi kegiatan dan momen PRO RI</p>
      </div>

      <GalleryView items={items} />
    </div>
  );
}
