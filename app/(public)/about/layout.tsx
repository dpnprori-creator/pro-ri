import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang PRO RI",
  description:
    "Pelajari sejarah, visi, misi, tujuan, dan peta jalan Pusat Robotika Rakyat Indonesia (PRO RI) — gerakan robotika nasional untuk kedaulatan teknologi Indonesia.",
  openGraph: {
    title: "Tentang PRO RI — Pusat Robotika Rakyat Indonesia",
    description:
      "Sejarah, visi, misi, tujuan, dan peta jalan PRO RI — gerakan robotika nasional untuk kedaulatan teknologi Indonesia.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
