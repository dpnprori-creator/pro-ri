"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { ProvinceStats, RegencyStats } from "@/features/command-center/data";

// Dynamic import with no SSR for Leaflet
const MapView = dynamic(() => import("./map-view"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-xl bg-pri-dark flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-pri-red" />
    </div>
  ),
});

interface IndonesiaMapProps {
  provinces: ProvinceStats[];
  regencies?: RegencyStats[];
  onProvinceSelect?: (province: ProvinceStats | null) => void;
  onRegencySelect?: (regency: RegencyStats | null) => void;
  selectedProvinceId?: string | null;
}

export function IndonesiaMap({ provinces, regencies, onProvinceSelect, onRegencySelect, selectedProvinceId }: IndonesiaMapProps) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden glass-card">
      <MapView
        provinces={provinces}
        regencies={regencies}
        onProvinceSelect={onProvinceSelect}
        onRegencySelect={onRegencySelect}
        selectedProvinceId={selectedProvinceId}
      />
    </div>
  );
}
