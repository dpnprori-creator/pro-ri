import { createClient } from "@/lib/supabase/server";
import { GalleryView } from "./gallery-view";
import { VideoGallerySection } from "@/components/features/video/video-gallery-section";
import type { GalleryItem } from "./gallery-shared";

async function getGallery() {
  const supabase = await createClient();

  const [{ data: hero }, { data: activities }, { data: videos }] = await Promise.all([
    supabase.from("hero_gallery").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
    supabase.from("activity_gallery").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
    supabase.from("videos").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
  ]);

  return {
    hero: hero ?? [],
    activities: activities ?? [],
    videos: videos ?? [],
  };
}

export default async function GalleryPage() {
  const { hero, activities, videos } = await getGallery();

  // Merge hero gallery + activity gallery into a single items array.
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

      {/* Image Gallery */}
      <GalleryView items={items} />

      {/* Video Gallery Section */}
      {videos.length > 0 && (
        <>
          <div className="my-12">
            <div className="h-px bg-gradient-to-r from-transparent via-pri-red/30 to-transparent" />
          </div>
          <VideoGallerySection videos={videos} />
        </>
      )}
    </div>
  );
}
