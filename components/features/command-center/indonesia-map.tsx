"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { ProvinceStats } from "@/features/command-center/data";

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
  onProvinceSelect?: (province: ProvinceStats | null) => void;
  selectedProvinceId?: string | null;
}

export function IndonesiaMap({ provinces, onProvinceSelect, selectedProvinceId }: IndonesiaMapProps) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden glass-card">
      <MapView
        provinces={provinces}
        onProvinceSelect={onProvinceSelect}
        selectedProvinceId={selectedProvinceId}
      />
    </div>
  );
}
