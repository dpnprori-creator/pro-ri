import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Susunan Pengurus PRO RI",
  description:
    "Struktur kepemimpinan Pusat Robotika Rakyat Indonesia (PRO RI): Dewan Pimpinan Nasional, Dewan Pimpinan Daerah, Dewan Pimpinan Cabang.",
  openGraph: {
    title: "Susunan Pengurus PRO RI — Dewan Pimpinan Nasional",
    description:
      "Struktur kepemimpinan PRO RI — DPN, DPD, DPC. Ketua: Adityo Handoko, Sekretaris: Muhamad Ied.",
  },
};

export default function PengurusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
