import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pri-carbon to-black p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="h-16 w-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Anggota Tidak Ditemukan</h1>
          <p className="text-sm text-pri-silver mt-2">
            Nomor anggota yang kamu cari tidak valid atau belum terverifikasi.
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" className="text-pri-silver">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </Link>
        <p className="text-xs text-pri-silver">
          Pusat Robotika Rakyat Indonesia (PRO RI) — Gerakan Robotika Nasional
        </p>
      </div>
    </div>
  );
}
