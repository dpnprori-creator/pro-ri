import type { Metadata } from "next";
import { PublicLayout } from "@/components/layouts/public-layout";

export const metadata: Metadata = {
  title: {
    template: "%s | Pusat Robotika Rakyat Indonesia",
    default: "Pusat Robotika Rakyat Indonesia — PRO RI",
  },
  description:
    "Pusat Robotika Rakyat Indonesia (PRO RI) — gerakan nasional robotika untuk kedaulatan teknologi Indonesia.",
};

export default function PublicRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayout>{children}</PublicLayout>;
}
