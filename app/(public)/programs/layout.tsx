import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "6 Program Unggulan PRO RI",
  description:
    "Program unggulan PRO RI: Sekolah Robotika Rakyat, Robotika Masuk Sekolah, Akademi AI, Kompetisi Robotika Nasional, Inkubator Inovasi Teknologi, dan Robotika untuk UMKM.",
  openGraph: {
    title: "Program Unggulan PRO RI — Robotika untuk Indonesia",
    description:
      "6 program unggulan PRO RI: Sekolah Robotika Rakyat, Robotika Masuk Sekolah, Akademi AI, Kompetisi Robotika Nasional, Inkubator Inovasi, Robotika UMKM.",
  },
};

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
