import { RealtimeDashboard } from "@/components/features/command-center/realtime-dashboard";
import { Map } from "lucide-react";

export default async function DashboardNationalMapPage() {
  return (
    <div className="space-y-6">
      {/* Header with circuit-border */}
      <div className="relative overflow-hidden rounded-xl p-6 circuit-border">
        <div className="absolute inset-0 circuit-pattern opacity-[0.05]" />
        <div className="hero-scan-line" style={{ animationDuration: "4s" }} />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full bg-pri-red/20 flex items-center justify-center">
                <Map className="h-6 w-6 text-pri-red" />
              </div>
              <div className="data-pulse-ring rounded-full" />
              <div className="data-pulse-ring rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Peta Nasional</h1>
                <span className="flex items-center gap-1.5 text-[10px] text-green-400/80 font-mono">
                  <span className="status-dot" />
                  LIVE
                </span>
              </div>
              <p className="text-sm text-pri-silver">
                Visualisasi interaktif sebaran anggota &amp; statistik nasional
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Realtime Dashboard */}
      <RealtimeDashboard />
    </div>
  );
}
