import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi PRO RI",
  description:
    "Hubungi Pusat Robotika Rakyat Indonesia (PRO RI). Kirim pesan, pertanyaan, atau ajakan kolaborasi melalui form kontak.",
  openGraph: {
    title: "Hubungi PRO RI — Pusat Robotika Rakyat Indonesia",
    description:
      "Hubungi PRO RI. Kirim pesan, pertanyaan, atau ajakan kolaborasi.",
  },
};

export default function KontakLayout({ children }: { children: React.ReactNode }) {
  return children;
}
