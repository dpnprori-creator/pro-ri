import { createClient } from "@/lib/supabase/server";
import { GalleryKegiatanManager } from "./gallery-manager";

async function getGallery() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("activity_gallery")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export default async function AdminGalleryKegiatanPage() {
  const gallery = await getGallery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Galeri Kegiatan</h1>
        <p className="text-pri-silver mt-1">Total {gallery.length} item</p>
      </div>

      <GalleryKegiatanManager items={gallery} />
    </div>
  );
}
