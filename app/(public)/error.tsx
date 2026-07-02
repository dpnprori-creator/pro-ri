"use client";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center circuit-pattern">
      <div className="text-center max-w-md px-4">
        <div className="h-16 w-16 rounded-full bg-pri-red/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">!</span>
        </div>
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
