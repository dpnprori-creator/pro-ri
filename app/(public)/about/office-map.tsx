"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Office coordinates: Jl. Sultan Agung No.9, Guntur, Setiabudi, Jakarta Selatan
const OFFICE_LAT = -6.2088;
const OFFICE_LNG = 106.8299;

export default function OfficeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const map = L.map(mapRef.current, {
        center: [OFFICE_LAT, OFFICE_LNG],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom red marker icon
      const redIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const marker = L.marker([OFFICE_LAT, OFFICE_LNG], { icon: redIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="color: #E31E24;">DPN PRO RI</strong><br/>
            <span style="font-size: 12px; color: #555;">
              Jl. Sultan Agung No.9, Guntur<br/>
              Kec. Setiabudi, Jakarta Selatan<br/>
              DKI Jakarta 12980
            </span>
          </div>
        `)
        .openPopup();

      // Add a circle around the marker
      L.circle([OFFICE_LAT, OFFICE_LNG], {
        radius: 50,
        color: "#E31E24",
        fillColor: "#E31E24",
        fillOpacity: 0.1,
        weight: 2,
      }).addTo(map);

      mapInstance.current = map;
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "400px", borderRadius: "12px" }} />;
}
