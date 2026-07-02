"use client";

import { Award, Calendar, BadgeCheck, Fingerprint, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CertificateData {
  id: string;
  certificate_number: string;
  title: string;
  type: string;
  issued_at: string;
  verified: boolean;
  member_id: {
    full_name: string;
    member_id: string;
  } | null;
  event_id: {
    title: string;
    start_date: string;
  } | null;
}

export function CertificateDetail({ certificate }: { certificate: CertificateData }) {
  return (
    <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Award className="h-8 w-8 text-pri-gold" />
        <div>
          <h2 className="text-lg font-semibold text-white">{certificate.title}</h2>
          <p className="text-sm text-pri-silver">{certificate.certificate_number}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between border-b border-pri-gold/10 pb-2">
          <span className="text-pri-silver flex items-center gap-2">
            <Fingerprint className="h-4 w-4" /> Nama
          </span>
          <span className="text-white">{certificate.member_id?.full_name || "-"}</span>
        </div>
        <div className="flex justify-between border-b border-pri-gold/10 pb-2">
          <span className="text-pri-silver flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" /> Tipe
          </span>
          <span className="text-white">{certificate.type}</span>
        </div>
        {certificate.event_id && (
          <>
            <div className="flex justify-between border-b border-pri-gold/10 pb-2">
              <span className="text-pri-silver flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Event
              </span>
              <span className="text-white">{certificate.event_id.title}</span>
            </div>
            <div className="flex justify-between border-b border-pri-gold/10 pb-2">
              <span className="text-pri-silver flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Tanggal Event
              </span>
              <span className="text-white">
                {new Date(certificate.event_id.start_date).toLocaleDateString("id-ID")}
              </span>
            </div>
          </>
        )}
        <div className="flex justify-between border-b border-pri-gold/10 pb-2">
          <span className="text-pri-silver flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Diterbitkan
          </span>
          <span className="text-white">
            {new Date(certificate.issued_at).toLocaleDateString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-pri-silver">Status</span>
          <Badge variant={certificate.verified ? "success" : "warning"}>
            {certificate.verified ? "Terverifikasi" : "Belum Verifikasi"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
