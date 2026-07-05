import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Pusat Robotika Rakyat Indonesia",
    default: "Pusat Robotika Rakyat Indonesia — PRO RI",
  },
  description:
    "Pusat Robotika Rakyat Indonesia (PRO RI) — gerakan nasional robotika untuk kedaulatan teknologi Indonesia. Daftar anggota, ikuti program unggulan, jaringan 38 provinsi.",
  keywords: [
    "robotika",
    "AI",
    "IoT",
    "Indonesia",
    "teknologi",
    "inovasi",
    "PRO RI",
    "pusat robotika rakyat indonesia",
    "robotika indonesia",
    "indonesia emas 2045",
  ],
  icons: {
    icon: [
      { url: "/images/logo-persegi.jpeg", type: "image/jpeg" },
    ],
    apple: [
      { url: "/images/logo-persegi.jpeg" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Pusat Robotika Rakyat Indonesia",
    title: "Pusat Robotika Rakyat Indonesia — PRO RI",
    description:
      "Gerakan nasional robotika untuk kedaulatan teknologi Indonesia. Daftar anggota, ikuti program unggulan, jaringan 38 provinsi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
