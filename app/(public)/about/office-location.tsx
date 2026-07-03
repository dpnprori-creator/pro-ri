"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, MapPin, Building, Phone, Mail, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const OfficeMap = dynamic(() => import("./office-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-xl bg-pri-dark flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-pri-red" />
    </div>
  ),
});

const officeInfo = {
  name: "DPN PRO RI",
  address: "Jl. Sultan Agung No.9, RT.1/RW.1, Guntur",
  district: "Kecamatan Setiabudi",
  city: "Kota Jakarta Selatan",
  province: "Daerah Khusus Ibukota Jakarta 12980",
  phone: "(021) 1234-5678",
  email: "dpn.prori@gmail.com",
};

export function OfficeLocation() {
  return (
    <section className="py-16 bg-pri-dark/30 relative">
      <div className="absolute inset-0 circuit-pattern opacity-10" />
      <div className="container-wide px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <MapPin className="h-4 w-4 text-pri-red" />
            <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
              Kantor Pusat
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Lokasi <span className="text-gradient">Kantor</span>
          </h2>
          <p className="text-pri-silver">
            Kantor Dewan Pimpinan Nasional (DPN) PRO RI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {/* Map */}
          <div className="lg:col-span-3 rounded-xl overflow-hidden border border-white/10 glass-card">
            <OfficeMap />
          </div>

          {/* Info */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="glass-card-hover">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-pri-red/20 flex items-center justify-center">
                    <Building className="h-5 w-5 text-pri-red" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{officeInfo.name}</h3>
                    <p className="text-xs text-pri-silver">DPN PRO RI</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-pri-red mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-white">{officeInfo.address}</p>
                      <p className="text-xs text-pri-silver">{officeInfo.district}</p>
                      <p className="text-xs text-pri-silver">{officeInfo.city}</p>
                      <p className="text-xs text-pri-silver">{officeInfo.province}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-pri-red shrink-0" />
                    <span className="text-sm text-pri-silver">{officeInfo.phone}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-pri-red shrink-0" />
                    <span className="text-sm text-pri-silver">{officeInfo.email}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-pri-red shrink-0" />
                    <span className="text-sm text-pri-silver">pro-ri.online</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card-hover">
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-white mb-2">Jam Operasional</h3>
                <div className="space-y-1 text-sm text-pri-silver">
                  <p>Senin – Jumat: 08.00 – 17.00 WIB</p>
                  <p>Sabtu: 08.00 – 14.00 WIB</p>
                  <p className="text-xs text-pri-silver/60 mt-2">*Kunjungan dengan janji terlebih dahulu</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
