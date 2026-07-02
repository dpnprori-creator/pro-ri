"use client";

import { useRouter } from "next/navigation";
import { Award, Eye, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CertificateItem {
  id: string;
  certificate_number: string;
  title: string;
  type: string;
  issued_at: string;
  verified: boolean;
  event_id: {
    title: string;
  } | null;
}

export function CertificatesList({ certificates }: { certificates: CertificateItem[] }) {
  const router = useRouter();

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12 bg-pri-navy border border-pri-gold/20 rounded-lg">
        <Award className="h-12 w-12 text-pri-silver mx-auto mb-3" />
        <p className="text-pri-silver text-sm">Belum ada sertifikat</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {certificates.map((cert) => (
        <div
          key={cert.id}
          className="bg-pri-navy border border-pri-gold/20 rounded-lg p-4 flex items-center justify-between"
        >
          <div>
            <h3 className="text-white font-medium">{cert.title}</h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-pri-silver">
              <span>{cert.certificate_number}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(cert.issued_at).toLocaleDateString("id-ID")}
              </span>
              <Badge variant={cert.verified ? "success" : "warning"} className="text-[10px]">
                {cert.verified ? "Terverifikasi" : "Pending"}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/membership/certificates/${cert.id}`)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Detail
          </Button>
        </div>
      ))}
    </div>
  );
}
