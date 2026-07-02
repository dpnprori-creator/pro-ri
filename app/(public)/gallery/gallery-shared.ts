export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  date_taken: string | null;
  sort_order: number;
}

export const categoryLabel: Record<string, string> = {
  workshop: "Workshop",
  competition: "Kompetisi",
  exhibition: "Pameran",
  training: "Pelatihan",
  social: "Sosial",
  meeting: "Rapat",
  other: "Lainnya",
};

export const categoryColors: Record<string, string> = {
  workshop: "bg-blue-500/20 text-blue-400",
  competition: "bg-orange-500/20 text-orange-400",
  exhibition: "bg-purple-500/20 text-purple-400",
  training: "bg-green-500/20 text-green-400",
  social: "bg-pink-500/20 text-pink-400",
  meeting: "bg-yellow-500/20 text-yellow-400",
  other: "bg-pri-silver/20 text-pri-silver",
};
