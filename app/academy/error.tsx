"use client";

import { GraduationCap } from "lucide-react";

export default function AcademyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-xl bg-pri-red/10 flex items-center justify-center mx-auto mb-4 border border-pri-red/20">
          <span className="text-2xl font-bold text-pri-red">!</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pri-red/10 border border-pri-red/20 text-xs text-pri-red mb-4 font-mono">
          ACADEMY — ERROR
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Terjadi Kesalahan</h1>
        <p className="text-sm text-pri-silver/60 mb-6 leading-relaxed">
          Maaf, terjadi kesalahan saat memuat halaman Academy. Silakan coba lagi.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-pri-red hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
