import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Susunan Pengurus PRO RI",
  description:
    "Susunan Pengurus Dewan Pimpinan Nasional Pusat Robotika Rakyat Indonesia Masa Bakti 2026–2030: Dewan Pembina, Dewan Pakar, Ketua & Wakil Ketua, Sekretariat, Bendahara, dan 9 Departemen Strategis.",
  openGraph: {
    title: "Susunan Pengurus PRO RI — Dewan Pimpinan Nasional Masa Bakti 2026–2030",
    description:
      "Struktur kepemimpinan DPN PRO RI: Dewan Pembina (Ir. H. Muhammad Arfan), Dewan Pakar (Dr. H. Hery Erdi Andrat), Ketua (H. Adityo Handoko), Sekretaris (Dr. (H.C.) H. Muhamad Ied), Bendahara (Helmi Wahyulianto), dan 9 departemen strategis.",
  },
};

export default function PengurusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
