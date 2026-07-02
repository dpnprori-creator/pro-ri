import Link from "next/link";
import { Home, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center circuit-pattern bg-pri-carbon">
      <div className="text-center max-w-lg px-4">
        {/* Status Code */}
        <div className="relative mb-8">
          <div className="text-[120px] md:text-[160px] font-bold font-mono leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-pri-red to-red-900/50">
              404
            </span>
          </div>
          {/* Decorative lines */}
          <div className="absolute -inset-x-20 top-1/2 h-px bg-gradient-to-r from-transparent via-pri-red/30 to-transparent" />
          <div className="absolute -inset-x-20 top-1/2 -translate-y-4 h-px bg-gradient-to-r from-transparent via-pri-red/10 to-transparent" />
        </div>

        {/* Error Message */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
          <span className="h-2 w-2 rounded-full bg-pri-red animate-pulse" />
          <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
            Halaman Tidak Ditemukan
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Ups! Halaman Ini{" "}
          <span className="text-gradient">Hilang</span>
        </h1>

        <p className="text-sm text-pri-silver mb-8 leading-relaxed">
          Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau
          tidak pernah ada. Periksa kembali URL atau navigasi ke halaman
          utama.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-pri-red hover:bg-red-700 text-white px-6">
              <Home className="h-4 w-4 mr-2" />
              Beranda
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="outline" className="border-white/10 text-pri-silver hover:text-white px-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Jelajahi Events
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost" className="text-pri-silver hover:text-white px-6">
              <Shield className="h-4 w-4 mr-2" />
              Daftar Anggota
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-xs text-pri-silver/40 mt-12 font-mono">
          {APP_NAME} — Error 404
        </p>
      </div>
    </div>
  );
}
