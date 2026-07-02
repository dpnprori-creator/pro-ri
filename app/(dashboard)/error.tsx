"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <h1 className="text-xl font-bold text-white mb-2">Terjadi Kesalahan</h1>
        <p className="text-sm text-pri-silver mb-6">
          Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.
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
