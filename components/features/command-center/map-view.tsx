"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { ProvinceStats } from "@/features/command-center/data";

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
  onProvinceSelect?: (province: ProvinceStats | null) => void;
  selectedProvinceId?: string | null;
}

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

export default function MapView({
  provinces = [],
  onProvinceSelect,
  selectedProvinceId,
}: MapViewProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const safeProvinces = provinces ?? [];
  const maxMembers = Math.max(...safeProvinces.map((p) => p.total_members), 1);

  useEffect(() => {
    // Try to load Indonesia GeoJSON from CDN
    fetch(
      "https://raw.githubusercontent.com/superpikar/indonesia-geojson/refs/heads/master/indonesia.geojson"
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback: try alternative source
        fetch(
          "https://raw.githubusercontent.com/ismailarrazak/indonesia-geojson/refs/heads/main/indonesia-province-simple.json"
        )
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then((data) => {
            setGeoData(data);
            setLoading(false);
          })
          .catch((err) => {
            setError("Gagal memuat peta Indonesia");
            setLoading(false);
          });
      });
  }, []);

  const provinceMap = new Map(safeProvinces.map((p) => [p.name.toLowerCase(), p]));

  function onEachFeature(feature: any, layer: L.Layer) {
    const provinceName =
      feature.properties?.STATE ||
      feature.properties?.name ||
      feature.properties?.Propinsi ||
      "";
    const stats = provinceMap.get(provinceName.toLowerCase().trim());

    const color = stats
      ? getColor(stats.total_members, maxMembers)
      : "#2a2a3e";
    const isSelected = selectedProvinceId === stats?.id;

    (layer as L.Path).setStyle({
      fillColor: color,
      fillOpacity: isSelected ? 0.9 : 0.7,
      weight: isSelected ? 2.5 : 1,
      color: isSelected
        ? "#E31E24"
        : "rgba(255,255,255,0.3)",
    });

    layer.bindTooltip(
      `<div class="text-sm">
        <strong>${
          feature.properties?.STATE ||
          feature.properties?.name ||
          feature.properties?.Propinsi ||
          "Unknown"
        }</strong><br/>
        Members: ${stats?.total_members ?? 0}<br/>
        Trainer: ${stats?.total_trainers ?? 0}<br/>
        Events: ${stats?.total_events ?? 0}<br/>
        Inovasi: ${stats?.total_innovations ?? 0}
      </div>`,
      { direction: "top", offset: [0, -10] }
    );

    if (onProvinceSelect && stats) {
      layer.on({
        click: () => onProvinceSelect(stats),
      });
    }
  }

  if (loading) {
    return (
      <div className="h-[500px] flex items-center justify-center text-pri-silver text-sm">
        Memuat peta Indonesia...
      </div>
    );
  }

  if (error || !geoData) {
    return (
      <CircleMarkerFallback
        provinces={provinces}
        onProvinceSelect={onProvinceSelect}
        selectedProvinceId={selectedProvinceId}
      />
    );
  }

  return (
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
      style={{ height: "500px", width: "100%", background: "#0F1117" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        key={selectedProvinceId || "all"}
        data={geoData}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
}

// Fallback with circle markers when GeoJSON can't be loaded
function CircleMarkerFallback({
  provinces = [],
  onProvinceSelect,
  selectedProvinceId,
}: {
  provinces: ProvinceStats[];
  onProvinceSelect?: (province: ProvinceStats | null) => void;
  selectedProvinceId?: string | null;
}) {
  const safeProvinces = provinces ?? [];
  const hasCoords = safeProvinces.filter((p) => p.latitude && p.longitude);
  const maxMembers = Math.max(...safeProvinces.map((p) => p.total_members), 1);

  if (hasCoords.length === 0) {
    return (
      <div className="h-[500px] flex flex-col items-center justify-center text-pri-silver text-sm gap-2">
        <span>Data koordinat provinsi tidak tersedia</span>
        <span className="text-xs text-pri-silver/50">
          {provinces.length} provinsi terdaftar
        </span>
      </div>
    );
  }

  return (
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
      style={{ height: "500px", width: "100%", background: "#0F1117" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hasCoords.map((prov) => {
        const radius = Math.max(8, (prov.total_members / maxMembers) * 40);
        const color = getColor(prov.total_members, maxMembers);
        const isSelected = selectedProvinceId === prov.id;

        return (
          <CircleMarker
            key={prov.id}
            center={[prov.latitude!, prov.longitude!]}
            radius={radius}
            pathOptions={{
              fillColor: color,
              fillOpacity: isSelected ? 0.9 : 0.6,
              weight: isSelected ? 3 : 1,
              color: isSelected ? "#E31E24" : "rgba(255,255,255,0.4)",
            }}
            eventHandlers={{
              click: () => onProvinceSelect?.(prov),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]}>
              <div className="text-sm">
                <strong>{prov.name}</strong>
                <br />
                Members: {prov.total_members}
                <br />
                Trainer: {prov.total_trainers}
                <br />
                Events: {prov.total_events}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
