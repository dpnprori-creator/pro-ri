import Link from "next/link";
import { Home, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-md px-4">
        <div className="text-[80px] md:text-[100px] font-bold font-mono leading-none mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-pri-red to-red-900/40">
            404
          </span>
        </div>

        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
          <span className="h-2 w-2 rounded-full bg-pri-red animate-pulse" />
          <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
            Halaman Tidak Ditemukan
          </span>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-white mb-3">
          Halaman{" "}
          <span className="text-gradient">Tidak Ditemukan</span>
        </h1>

        <p className="text-sm text-pri-silver mb-8 leading-relaxed">
          Halaman dashboard yang Anda cari tidak tersedia. Silakan
          kembali ke dashboard utama.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button className="bg-pri-red hover:bg-red-700 text-white px-6">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-white/10 text-pri-silver hover:text-white px-6">
              <Home className="h-4 w-4 mr-2" />
              Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
