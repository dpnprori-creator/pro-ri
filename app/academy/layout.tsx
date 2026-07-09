import type { Metadata } from "next";
import { AcademyNavbar } from "@/components/widgets/navbar/academy-navbar";
import { AcademyFooter } from "@/components/widgets/footer/academy-footer";

export const metadata: Metadata = {
  title: {
    template: "%s | PRO RI Academy",
    default: "PRO RI Academy — Learning Ecosystem",
  },
  description:
    "PRO RI Academy — platform pengembangan talenta teknologi Indonesia. Belajar robotika, AI, IoT, programming, dan teknologi masa depan.",
  keywords: [
    "PRO RI Academy",
    "belajar robotika",
    "belajar AI",
    "kursus online",
    "teknologi Indonesia",
    "learning path",
    "sertifikasi teknologi",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "PRO RI Academy",
    title: "PRO RI Academy — Learning Ecosystem",
    description:
      "Platform pengembangan talenta teknologi Indonesia. Belajar, berlatih, dan raih sertifikasi.",
  },
};

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AcademyNavbar />
      <main className="flex-1">
        {children}
      </main>
      <AcademyFooter />
    </div>
  );
}
