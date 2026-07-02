import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Anggota PRO RI",
  description:
    "Daftar menjadi anggota Pusat Robotika Rakyat Indonesia (PRO RI). Nikmati akses pelatihan robotika, kompetisi nasional, dan jaringan 38 provinsi.",
  openGraph: {
    title: "Daftar Anggota PRO RI — Bergabung dengan Gerakan Robotika Nasional",
    description:
      "Daftar menjadi anggota PRO RI. Akses pelatihan robotika, kompetisi nasional, dan jaringan 38 provinsi.",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
