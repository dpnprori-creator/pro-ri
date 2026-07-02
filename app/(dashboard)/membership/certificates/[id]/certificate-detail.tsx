"use client";

interface CertificateData {
  id: string;
  certificate_number: string;
  title: string;
  type: string;
  issued_at: string;
  verified: boolean;
  member_id: { full_name: string; member_id: string };
  event_id: { title: string; start_date: string };
}

export function CertificateDetail({ certificate }: { certificate: CertificateData }) {
  return (
    <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-pri-silver font-mono uppercase tracking-wider">Nomor Sertifikat</p>
          <p className="text-sm text-white font-mono mt-1">{certificate.certificate_number}</p>
        </div>
        <div>
          <p className="text-xs text-pri-silver font-mono uppercase tracking-wider">Nama Anggota</p>
          <p className="text-sm text-white mt-1">{certificate.member_id?.full_name}</p>
        </div>
        <div>
          <p className="text-xs text-pri-silver font-mono uppercase tracking-wider">Event</p>
          <p className="text-sm text-white mt-1">{certificate.event_id?.title}</p>
        </div>
        <div>
          <p className="text-xs text-pri-silver font-mono uppercase tracking-wider">Tipe</p>
          <p className="text-sm text-white mt-1">{certificate.type}</p>
        </div>
        <div>
          <p className="text-xs text-pri-silver font-mono uppercase tracking-wider">Tanggal Terbit</p>
          <p className="text-sm text-white mt-1">{new Date(certificate.issued_at).toLocaleDateString("id-ID")}</p>
        </div>
        <div>
          <p className="text-xs text-pri-silver font-mono uppercase tracking-wider">Status</p>
          <p className="text-sm text-green-400 mt-1">{certificate.verified ? "Terverifikasi" : "Pending"}</p>
        </div>
      </div>
    </div>
  );
}
