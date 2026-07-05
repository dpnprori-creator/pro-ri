import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang PRO RI — Pusat Robotika Rakyat Indonesia",
  description:
    "PRO RI (Pusat Robotika Rakyat Indonesia) — organisasi nasional pengembangan robotika, AI, coding, IoT, dan otomasi. Visi, misi, program strategis, peta jalan menuju Indonesia Emas 2045.",
  openGraph: {
    title: "Tentang PRO RI — Pusat Robotika Rakyat Indonesia | Robotika Milik Rakyat",
    description:
      "PRO RI: organisasi nasional robotika rakyat. Visi, Misi, 6 Program Strategis, 5 Nilai Utama, Roadmap 2045, Enam Pilar Teknologi Nasional. Bersatu. Berkarya. Berdampak.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
