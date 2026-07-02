import { createClient } from "@/lib/supabase/server";
import { GalleryView } from "./gallery-view";

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Galeri</h1>
        <p className="text-pri-silver mt-1">Dokumentasi kegiatan PRO RI</p>
      </div>

      <GalleryView {...({ hero, activities } as any)} />
    </div>
  );
}
