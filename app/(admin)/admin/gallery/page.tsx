import { createClient } from "@/lib/supabase/server";
import { GalleryManager } from "./gallery-manager";

async function getGallery() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hero_gallery")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export default async function AdminGalleryPage() {
  const gallery = await getGallery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Hero Gallery</h1>
        <p className="text-pri-silver mt-1">Total {gallery.length} item</p>
      </div>

      <GalleryManager items={gallery} />
    </div>
  );
}
