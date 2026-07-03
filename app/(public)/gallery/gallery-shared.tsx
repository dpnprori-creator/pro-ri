export interface GalleryItem {
  id: string;
  image_url: string;
  title: string;
  description: string | null;
  category: string;
  date_taken: string | null;
  created_at: string;
  sort_order: number;
  is_active: boolean;
}

export const categoryLabel: Record<string, string> = {
  workshop: "Workshop",
  event: "Event",
  competition: "Kompetisi",
  exhibition: "Pameran",
  training: "Pelatihan",
  social: "Kegiatan Sosial",
  meeting: "Rapat",
  hero: "Banner",
  other: "Lainnya",
};

export const categoryColors: Record<string, string> = {
  workshop: "bg-blue-500/20 text-blue-400",
  event: "bg-green-500/20 text-green-400",
  competition: "bg-purple-500/20 text-purple-400",
  exhibition: "bg-yellow-500/20 text-yellow-400",
  training: "bg-cyan-500/20 text-cyan-400",
  social: "bg-pink-500/20 text-pink-400",
  meeting: "bg-orange-500/20 text-orange-400",
  hero: "bg-red-500/20 text-red-400",
  other: "bg-gray-500/20 text-gray-400",
};
