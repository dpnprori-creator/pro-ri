"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { ProvinceStats, RegencyStats } from "@/features/command-center/data";

// Fix Leaflet icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapViewProps {
  provinces: ProvinceStats[];
  regencies?: RegencyStats[];
  onProvinceSelect?: (province: ProvinceStats | null) => void;
  onRegencySelect?: (regency: RegencyStats | null) => void;
  selectedProvinceId?: string | null;
  selectedRegencyId?: string | null;
}

// Province name mapping: GeoJSON property names → database names
// Different GeoJSON sources use different naming
const PROVINCE_NAME_ALIASES: Record<string, string> = {
  // Common GeoJSON sources use these variations
  "aceh": "Aceh",
  "sumatera utara": "Sumatera Utara",
  "sumatera barat": "Sumatera Barat",
  "riau": "Riau",
  "kepulauan riau": "Kepulauan Riau",
  "kepri": "Kepulauan Riau",
  "jambi": "Jambi",
  "sumatera selatan": "Sumatera Selatan",
  "bengkulu": "Bengkulu",
  "lampung": "Lampung",
  "kepulauan bangka belitung": "Kepulauan Bangka Belitung",
  "bangka belitung": "Kepulauan Bangka Belitung",
  "dki jakarta": "Daerah Khusus Ibukota Jakarta",
  "daerah khusus ibukota jakarta": "Daerah Khusus Ibukota Jakarta",
  "jakarta": "Daerah Khusus Ibukota Jakarta",
  "banten": "Banten",
  "jawa barat": "Jawa Barat",
  "jawa tengah": "Jawa Tengah",
  "di yogyakarta": "Daerah Istimewa Yogyakarta",
  "daerah istimewa yogyakarta": "Daerah Istimewa Yogyakarta",
  "yogyakarta": "Daerah Istimewa Yogyakarta",
  "jawa timur": "Jawa Timur",
  "bali": "Bali",
  "nusa tenggara barat": "Nusa Tenggara Barat",
  "ntb": "Nusa Tenggara Barat",
  "nusa tenggara timur": "Nusa Tenggara Timur",
  "ntt": "Nusa Tenggara Timur",
  "kalimantan barat": "Kalimantan Barat",
  "kalbar": "Kalimantan Barat",
  "kalimantan tengah": "Kalimantan Tengah",
  "kalteng": "Kalimantan Tengah",
  "kalimantan selatan": "Kalimantan Selatan",
  "kalsel": "Kalimantan Selatan",
  "kalimantan timur": "Kalimantan Timur",
  "kaltim": "Kalimantan Timur",
  "kalimantan utara": "Kalimantan Utara",
  "kaltara": "Kalimantan Utara",
  "sulawesi utara": "Sulawesi Utara",
  "sulut": "Sulawesi Utara",
  "gorontalo": "Gorontalo",
  "sulawesi tengah": "Sulawesi Tengah",
  "sulteng": "Sulawesi Tengah",
  "sulawesi barat": "Sulawesi Barat",
  "sulbar": "Sulawesi Barat",
  "sulawesi selatan": "Sulawesi Selatan",
  "sulsel": "Sulawesi Selatan",
  "sulawesi tenggara": "Sulawesi Tenggara",
  "sultra": "Sulawesi Tenggara",
  "maluku": "Maluku",
  "maluku utara": "Maluku Utara",
  "malut": "Maluku Utara",
  "papua": "Papua",
  "papua barat": "Papua Barat",
  "pabar": "Papua Barat",
  "papua tengah": "Papua Tengah",
  "papua pegunungan": "Papua Pegunungan",
  "papua selatan": "Papua Selatan",
  "papua barat daya": "Papua Barat Daya",
};

function getColor(value: number, max: number): string {
  if (max === 0) return "#1a1a2e";
  const intensity = value / max;
  if (intensity > 0.8) return "#E31E24";
  if (intensity > 0.6) return "#d93036";
  if (intensity > 0.4) return "#c9444a";
  if (intensity > 0.2) return "#a0565a";
  if (intensity > 0.1) return "#7a686a";
  return "#3d3d4a";
}

// Deterministic hash from string (stable between renders)
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Generate schematic lat/lng for regencies within a province area
// Uses deterministic positions (no Math.random) so markers don't jump on re-render
function generateRegencyPositions(
  regencies: RegencyStats[],
  centerLat: number,
  centerLng: number
): (RegencyStats & { estLat: number; estLng: number })[] {
  if (regencies.length === 0) return [];
  
  // Calculate grid dimensions
  const cols = Math.ceil(Math.sqrt(regencies.length));
  const rows = Math.ceil(regencies.length / cols);
  
  // Spread factor: ~0.5 degrees = ~55km spacing
  const spread = Math.min(1.0, Math.max(0.3, cols * 0.15));
  
  return regencies.map((reg, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    // Position in grid relative to center
    const xOffset = (col - (cols - 1) / 2) * (spread / cols);
    const yOffset = (row - (rows - 1) / 2) * (spread / rows);
    
    // Deterministic jitter based on regency ID hash (stable between renders)
    const jitterSeed = hashString(reg.id);
    const jitterLat = ((jitterSeed % 97) / 97 - 0.5) * 0.04;
    const jitterLng = ((jitterSeed % 101) / 101 - 0.5) * 0.04;
    
    return {
      ...reg,
      estLat: centerLat + yOffset + jitterLat,
      estLng: centerLng + xOffset + jitterLng,
    };
  });
}

// Abbreviate long province names for map labels
function abbreviateName(name: string): string {
  if (name === "Daerah Khusus Ibukota Jakarta") return "DKI Jakarta";
  if (name === "Daerah Istimewa Yogyakarta") return "DI Yogyakarta";
  if (name === "Kepulauan Bangka Belitung") return "Kep. Bangka Belitung";
  if (name === "Kepulauan Riau") return "Kep. Riau";
  if (name === "Nusa Tenggara Barat") return "NTB";
  if (name === "Nusa Tenggara Timur") return "NTT";
  if (name === "Kalimantan Barat") return "Kalbar";
  if (name === "Kalimantan Tengah") return "Kalteng";
  if (name === "Kalimantan Selatan") return "Kalsel";
  if (name === "Kalimantan Timur") return "Kaltim";
  if (name === "Kalimantan Utara") return "Kaltara";
  if (name === "Sumatera Utara") return "Sumut";
  if (name === "Sumatera Barat") return "Sumbar";
  if (name === "Sumatera Selatan") return "Sumsel";
  if (name === "Sulawesi Utara") return "Sulut";
  if (name === "Sulawesi Tengah") return "Sulteng";
  if (name === "Sulawesi Selatan") return "Sulsel";
  if (name === "Sulawesi Tenggara") return "Sultra";
  if (name === "Sulawesi Barat") return "Sulbar";
  if (name === "Papua Barat Daya") return "P. Barat Daya";
  if (name === "Papua Pegunungan") return "P. Pegunungan";
  return name;
}

// Component to add map labels for provinces
function ProvinceLabels({ provinces, provinceMap }: { provinces: ProvinceStats[]; provinceMap: Map<string, ProvinceStats> }) {
  const map = useMap();

  useEffect(() => {
    if (provinces.length === 0) return;

    const labels: L.Marker[] = [];

    for (const prov of provinces) {
      if (!prov.latitude || !prov.longitude) continue;

      const shortName = abbreviateName(prov.name);
      const hasData = prov.total_members > 0;

      // Create a custom divIcon for the label
      const icon = L.divIcon({
        className: "custom-province-label",
        html: `<div style="
          background: ${hasData ? 'rgba(227,30,36,0.85)' : 'rgba(0,0,0,0.5)'};
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: ${hasData ? '600' : '400'};
          font-family: system-ui, sans-serif;
          white-space: nowrap;
          border: 1px solid ${hasData ? 'rgba(227,30,36,0.5)' : 'rgba(255,255,255,0.1)'};
          backdrop-filter: blur(4px);
          pointer-events: none;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        ">${shortName}</div>`,
        iconSize: [0, 0],                  iconAnchor: [0, 16],
      });

      const marker = L.marker([prov.latitude, prov.longitude], { icon });
      marker.addTo(map);
      labels.push(marker);
    }

    return () => {
      labels.forEach((l) => l.remove());
    };
  }, [provinces, map]);

  return null;
}

// GeoJSON sources to try in order
const GEOJSON_SOURCES = [
  "https://raw.githubusercontent.com/superpikar/indonesia-geojson/refs/heads/master/indonesia.geojson",
  "https://raw.githubusercontent.com/ismailarrazak/indonesia-geojson/refs/heads/main/indonesia-province-simple.json",
  "https://raw.githubusercontent.com/ans-4175/indonesia-geojson/refs/heads/master/indonesia.geojson",
];

// Dark tile layer
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const DARK_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

// Zoom controller: flies to selected province center
function MapZoomToProvince({ province }: { province: ProvinceStats | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (province?.latitude && province?.longitude) {
      map.flyTo([province.latitude, province.longitude], province.total_members > 0 ? 8 : 7, {
        duration: 1.2,
      });
    } else {
      map.flyTo([-2.5, 118], 5, { duration: 1.2 });
    }
  }, [province?.id]);
  
  return null;
}

export default function MapView({
  provinces = [],
  regencies = [],
  onProvinceSelect,
  onRegencySelect,
  selectedProvinceId,
  selectedRegencyId,
}: MapViewProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [geoLoading, setGeoLoading] = useState(true);
  const [geoError, setGeoError] = useState(false);
  const geoIndexRef = useRef(0);

  const safeProvinces = provinces ?? [];
  const maxMembers = Math.max(...safeProvinces.map((p) => p.total_members), 1);

  // Build province lookup by name (lowercase)
  const provinceMap = useMemo(() => {
    const map = new Map<string, ProvinceStats>();
    for (const p of safeProvinces) {
      map.set(p.name.toLowerCase(), p);
    }
    return map;
  }, [safeProvinces]);

  // Try loading GeoJSON from multiple sources
  useEffect(() => {
    let cancelled = false;
    let currentIndex = geoIndexRef.current;

    function trySource(index: number) {
      if (cancelled || index >= GEOJSON_SOURCES.length) {
        if (!cancelled) {
          setGeoError(true);
          setGeoLoading(false);
        }
        return;
      }

      fetch(GEOJSON_SOURCES[index])
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (!cancelled) {
            setGeoData(data);
            setGeoLoading(false);
            setGeoError(false);
            geoIndexRef.current = index;
          }
        })
        .catch(() => {
          if (!cancelled) {
            // Try next source
            trySource(index + 1);
          }
        });
    }

    trySource(0);

    return () => {
      cancelled = true;
    };
  }, []);

  // GeoJSON feature styling
  function getFeatureStyle(feature: any) {
    const rawName =
      feature.properties?.STATE ||
      feature.properties?.name ||
      feature.properties?.Propinsi ||
      "";
    const normalizedName = rawName.toLowerCase().trim();
    const alias = PROVINCE_NAME_ALIASES[normalizedName];
    const dbName = alias?.toLowerCase();
    const stats = dbName ? provinceMap.get(dbName) : undefined;
    const color = stats ? getColor(stats.total_members, maxMembers) : "#2a2a3e";

    return {
      fillColor: color,
      fillOpacity: 0.6,
      weight: 1,
      color: "rgba(255,255,255,0.2)",
    };
  }

  function onEachFeature(feature: any, layer: L.Layer) {
    const rawName =
      feature.properties?.STATE ||
      feature.properties?.name ||
      feature.properties?.Propinsi ||
      "";
    const normalizedName = rawName.toLowerCase().trim();
    const alias = PROVINCE_NAME_ALIASES[normalizedName];
    const dbName = alias?.toLowerCase();
    const stats = dbName ? provinceMap.get(dbName) : undefined;
    const isSelected = stats ? selectedProvinceId === stats.id : false;

    if (isSelected) {
      (layer as L.Path).setStyle({
        fillOpacity: 0.85,
        weight: 3,
        color: "#E31E24",
      });
    }

    // Rich HTML tooltip with dark background class
    layer.bindTooltip(
      `<div style="min-width:160px">
        <div style="font-size:13px;font-weight:700;margin-bottom:6px;color:#fff">
          ${rawName}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 8px;font-size:11px">
          <span style="color:#93c5fd">Anggota:</span>
          <span style="color:#fff;font-family:monospace;font-weight:600;text-align:right">
            ${stats?.total_members ?? 0}
          </span>
          <span style="color:#fde68a">Trainer:</span>
          <span style="color:#fff;font-family:monospace;text-align:right">
            ${stats?.total_trainers ?? 0}
          </span>
          <span style="color:#86efac">Events:</span>
          <span style="color:#fff;font-family:monospace;text-align:right">
            ${stats?.total_events ?? 0}
          </span>
          <span style="color:#fdba74">Inovasi:</span>
          <span style="color:#fff;font-family:monospace;text-align:right">
            ${stats?.total_innovations ?? 0}
          </span>
        </div>
      </div>`,
      { direction: "top", offset: [0, -10], className: "custom-map-tooltip" }
    );

    if (onProvinceSelect && stats) {
      layer.on({
        click: () => onProvinceSelect(stats),
      });
    }
  }

  // Selected province for zoom
  const selectedProvince = selectedProvinceId
    ? safeProvinces.find(p => p.id === selectedProvinceId) || null
    : null;
  
  // Province with lat/lng for CircleMarkers
  const hasCoords = safeProvinces.filter((p) => p.latitude && p.longitude);
  
  // Regency data for the selected province (with schematic positions)
  const selectedProvinceRegencies = selectedProvince
    ? generateRegencyPositions(
        regencies.filter(r => r.province_id === selectedProvince.id),
        selectedProvince.latitude || -2.5,
        selectedProvince.longitude || 118
      )
    : [];
  
  const maxRegencyMembers = Math.max(...selectedProvinceRegencies.map(r => r.total_members), 1);

  return (
    <div className="relative h-[500px] w-full rounded-xl overflow-hidden">
      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        minZoom={4}
        maxBounds={
          [
            [-11, 95],
            [6, 142],
          ] as L.LatLngBoundsExpression
        }
        style={{ height: "100%", width: "100%", background: "#0F1117" }}
        zoomControl={false}
      >
        {/* Dark tile layer */}
        <TileLayer attribution={DARK_ATTR} url={DARK_TILES} />

        {/* GeoJSON overlay (polygon boundaries) — if loaded */}
        {geoData && !geoError && (
          <GeoJSON
            key={selectedProvinceId || "all"}
            data={geoData}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Zoom controller — fly to selected province */}
        <MapZoomToProvince province={selectedProvince} />

        {/* Regency CircleMarkers — shown when province selected */}
        {selectedProvince && selectedProvinceRegencies.length > 0 && selectedProvinceRegencies.map((reg) => {
          const radius = Math.max(8, (reg.total_members / maxRegencyMembers) * 25);
          const color = getColor(reg.total_members, maxRegencyMembers);
          const isSelected = selectedRegencyId === reg.id;

          return (
            <CircleMarker
              key={reg.id}
              center={[reg.estLat, reg.estLng]}
              radius={Math.max(radius, 6)}
              pathOptions={{
                fillColor: color,
                fillOpacity: isSelected ? 0.95 : 0.7,
                weight: isSelected ? 3 : 1,
                color: isSelected
                  ? "#22c55e"
                  : reg.total_members > 0
                  ? "rgba(34,197,94,0.6)"
                  : "rgba(255,255,255,0.15)",
              }}
              eventHandlers={{
                click: () => onRegencySelect?.(reg),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} className="custom-map-tooltip">
                <div style={{ minWidth: "160px" }}>
                  <div style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "4px",
                    color: "#fff",
                    borderBottom: "1px solid rgba(255,255,255,0.15)",
                    paddingBottom: "4px",
                  }}>
                    🏛 {reg.name}
                  </div>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "2px 8px",
                    fontSize: "11px",
                  }}>
                    <span style={{ color: "#93c5fd" }}>Anggota:</span>
                    <span style={{ color: "#fff", fontFamily: "monospace", fontWeight: 600, textAlign: "right" }}>
                      {reg.total_members.toLocaleString()}
                    </span>
                    <span style={{ color: "#fde68a" }}>Trainer:</span>
                    <span style={{ color: "#fff", fontFamily: "monospace", textAlign: "right" }}>
                      {reg.total_trainers}
                    </span>
                  </div>
                  <div style={{
                    marginTop: "4px",
                    fontSize: "9px",
                    color: "rgba(255,255,255,0.4)",
                    textAlign: "center",
                  }}>
                    Klik untuk lihat kecamatan
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* Province CircleMarkers — hidden when zoomed into a province */}
        {!selectedProvince && hasCoords.map((prov) => {
          const radius = Math.max(10, (prov.total_members / maxMembers) * 35);
          const color = getColor(prov.total_members, maxMembers);

          return (
            <CircleMarker
              key={prov.id}
              center={[prov.latitude!, prov.longitude!]}
              radius={Math.max(radius, 8)}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.75,
                weight: 1.5,
                color: prov.total_members > 0
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,0.2)",
              }}
              eventHandlers={{
                click: () => onProvinceSelect?.(prov),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} className="custom-map-tooltip">
                <div style={{ minWidth: "160px" }}>
                  <div style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    marginBottom: "6px",
                    color: "#fff",
                    borderBottom: "1px solid rgba(255,255,255,0.15)",
                    paddingBottom: "4px",
                  }}>
                    {prov.name}
                  </div>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "2px 8px",
                    fontSize: "11px",
                  }}>
                    <span style={{ color: "#93c5fd" }}>Anggota:</span>
                    <span style={{ color: "#fff", fontFamily: "monospace", fontWeight: 600, textAlign: "right" }}>
                      {prov.total_members.toLocaleString()}
                    </span>
                    <span style={{ color: "#fde68a" }}>Trainer:</span>
                    <span style={{ color: "#fff", fontFamily: "monospace", textAlign: "right" }}>
                      {prov.total_trainers}
                    </span>
                    <span style={{ color: "#86efac" }}>Events:</span>
                    <span style={{ color: "#fff", fontFamily: "monospace", textAlign: "right" }}>
                      {prov.total_events}
                    </span>
                    <span style={{ color: "#fdba74" }}>Inovasi:</span>
                    <span style={{ color: "#fff", fontFamily: "monospace", textAlign: "right" }}>
                      {prov.total_innovations}
                    </span>
                  </div>
                  {prov.total_members > 0 && (
                    <div style={{
                      marginTop: "6px",
                      paddingTop: "4px",
                      borderTop: "1px solid rgba(255,255,255,0.15)",
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "monospace",
                      textAlign: "center",
                    }}>
                      Klik untuk lihat kab/kota
                    </div>
                  )}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* Province name labels — hidden when zoomed into province */}
        {!selectedProvince && <ProvinceLabels provinces={safeProvinces} provinceMap={provinceMap} />}
      </MapContainer>

      {/* Back button when in regency view */}
      {selectedProvince && (
        <div className="absolute top-3 right-3 z-[1000] flex items-center gap-2">
          <button
            onClick={() => onProvinceSelect?.(null)}
            className="bg-black/70 backdrop-blur-md hover:bg-black/85 text-xs text-pri-silver hover:text-white px-3 py-1.5 rounded-lg border border-white/10 transition-all"
          >
            ← Kembali ke semua provinsi
          </button>
        </div>
      )}

      {/* Loading indicator for GeoJSON */}
      {geoLoading && !selectedProvince && (
        <div className="absolute top-3 right-3 z-[1000] bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-pri-silver border border-white/10">
          Memuat batas provinsi...
        </div>
      )}

      {/* Legend — updated with actual member counts */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-black/80 backdrop-blur-md rounded-lg px-3 py-2.5 border border-white/10">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-pri-silver font-semibold font-mono">
            {selectedProvince ? 'KABUPATEN/KOTA' : 'PETA SEBARAN'}
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { color: "#1a1a2e", label: "0" },
              { color: "#7a686a", label: `${Math.ceil(selectedProvince ? maxRegencyMembers * 0.05 : maxMembers * 0.05)}` },
              { color: "#a0565a", label: `${Math.ceil(selectedProvince ? maxRegencyMembers * 0.2 : maxMembers * 0.2)}` },
              { color: "#d93036", label: `${Math.ceil(selectedProvince ? maxRegencyMembers * 0.5 : maxMembers * 0.5)}` },
              { color: "#E31E24", label: `${selectedProvince ? maxRegencyMembers : maxMembers}` },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ background: item.color, border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <span className="text-[9px] text-pri-silver/80 font-mono">{item.label}</span>
              </div>
            ))}
          </div>
          <span className="text-[9px] text-pri-silver/40 font-mono">anggota</span>
          {!geoError && geoData && !selectedProvince && (
            <>
              <span className="text-pri-silver/20 mx-0.5">|</span>
              <span className="text-[8px] text-green-400/70 font-mono">Batas Provinsi</span>
            </>
          )}
        </div>
      </div>

      {/* Status info — with total member count */}
      <div className="absolute top-3 left-3 z-[1000] bg-black/70 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs border border-white/10 flex items-center gap-2">
        <span className="status-dot" style={{ width: 6, height: 6 }} />
        {selectedProvince ? (
          <>
            <span className="text-green-400 font-semibold">{selectedProvince.name}</span>
            <span className="text-pri-silver/30">•</span>
            <span className="text-pri-silver">
              {selectedProvinceRegencies.length} kab/kota
            </span>
            <span className="text-pri-silver/30">•</span>
            <span className="text-pri-red font-mono">
              {selectedProvinceRegencies.reduce((s, r) => s + r.total_members, 0)} anggota
            </span>
          </>
        ) : (
          <>
            <span className="text-pri-silver">
              {safeProvinces.filter(p => p.total_members > 0).length}/{hasCoords.length} provinsi
            </span>
            <span className="text-pri-silver/30">•</span>
            <span className="text-pri-red font-mono font-semibold">
              {safeProvinces.reduce((s, p) => s + p.total_members, 0).toLocaleString()} anggota
            </span>
          </>
        )}
      </div>
    </div>
  );
}
