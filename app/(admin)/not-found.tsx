import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
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
            Halaman Admin Tidak Ditemukan
          </span>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-white mb-3">
          Halaman{" "}
          <span className="text-gradient">Tidak Ditemukan</span>
        </h1>

        <p className="text-sm text-pri-silver mb-8 leading-relaxed">
          Halaman admin yang Anda cari tidak tersedia. Silakan
          kembali ke dashboard admin.
        </p>

        <div className="flex items-center justify-center">
          <Link href="/admin">
            <Button className="bg-pri-red hover:bg-red-700 text-white px-6">
              <Shield className="h-4 w-4 mr-2" />
              Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
