import { GraduationCap } from "lucide-react";

export default function AcademyLoading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pri-red to-red-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pri-red/20">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden mx-auto">
          <div className="h-full w-1/2 bg-gradient-to-r from-pri-red to-red-400 rounded-full animate-loading-bar" />
        </div>
        <p className="text-sm text-pri-silver/50 font-mono mt-3">Memuat Academy...</p>
      </div>
    </div>
  );
}
