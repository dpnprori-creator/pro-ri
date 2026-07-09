import Link from "next/link";
import { GraduationCap, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyNotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 circuit-pattern">
      <div className="text-center max-w-lg">
        {/* 404 */}
        <div className="relative mb-8">
          <div className="text-[80px] md:text-[120px] font-bold font-mono leading-none select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-pri-red to-red-900/40">
              404
            </span>
          </div>
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-pri-red/20 to-transparent" />
        </div>

        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
          <GraduationCap className="h-3.5 w-3.5 text-pri-red" />
          <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
            Academy — Halaman Tidak Ditemukan
          </span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Halaman{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pri-red to-red-400">Tidak Tersedia</span>
        </h1>

        <p className="text-sm text-pri-silver/60 mb-8 leading-relaxed">
          Halaman Academy yang Anda cari tidak dapat ditemukan. 
          Silakan kembali ke beranda Academy atau jelajahi kursus yang tersedia.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/academy">
            <Button className="bg-pri-red hover:bg-red-700 text-white px-6">
              <GraduationCap className="h-4 w-4 mr-2" />
              Beranda Academy
            </Button>
          </Link>
          <Link href="/academy/courses">
            <Button variant="outline" className="border-white/10 text-pri-silver hover:text-white px-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Jelajahi Kursus
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
