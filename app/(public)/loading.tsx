export default function PublicLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center circuit-pattern">
      <div className="text-center">
        <div className="h-10 w-10 rounded-full border-2 border-pri-red border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm text-pri-silver font-mono">Memuat...</p>
      </div>
    </div>
  );
}
