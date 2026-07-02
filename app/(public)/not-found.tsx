import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center circuit-pattern bg-pri-carbon">
      <div className="text-center max-w-lg px-4">
        {/* 404 Glitch Effect */}
        <div className="relative mb-8">
          <div className="text-[100px] md:text-[140px] font-bold font-mono leading-none select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-pri-red to-red-900/40">
              404
            </span>
          </div>
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-pri-red/20 to-transparent" />
        </div>

        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
          <span className="h-2 w-2 rounded-full bg-pri-red animate-pulse" />
          <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
            Halaman Tidak Ditemukan
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Halaman{" "}
          <span className="text-gradient">Tidak Ada</span>
        </h1>

        <p className="text-sm text-pri-silver mb-8 leading-relaxed">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. Silakan
          kembali ke beranda atau gunakan navigasi di atas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-pri-red hover:bg-red-700 text-white px-6">
              <Home className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-white/10 text-pri-silver hover:text-white px-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Masuk
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
