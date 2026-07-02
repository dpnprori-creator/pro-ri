import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

async function getCertificate(id: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("certificates")
    .select("*, member_id!inner(full_name, member_id), event_id!inner(title, start_date)")
    .eq("id", id)
    .single();

  return data;
}

export default async function VerifyCertificatePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const certificate = await getCertificate(id);

  if (!certificate) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Verifikasi Sertifikat</h1>
        <p className="text-pri-silver mt-1">{certificate.certificate_number}</p>
      </div>

      <div className="bg-pri-navy border border-pri-gold/20 rounded-lg p-6">
        <div className="space-y-3">
          <div>
            <p className="text-pri-silver text-sm">Nama</p>
            <p className="text-white font-medium">{certificate.member_id?.full_name}</p>
          </div>
          <div>
            <p className="text-pri-silver text-sm">Nomor Anggota</p>
            <p className="text-white font-medium">{certificate.member_id?.member_id}</p>
          </div>
          <div>
            <p className="text-pri-silver text-sm">Sertifikat</p>
            <p className="text-white font-medium">{certificate.title}</p>
          </div>
          <div>
            <p className="text-pri-silver text-sm">Tipe</p>
            <p className="text-white font-medium">{certificate.type}</p>
          </div>
          <div>
            <p className="text-pri-silver text-sm">Diterbitkan</p>
            <p className="text-white font-medium">{new Date(certificate.issued_at).toLocaleDateString("id-ID")}</p>
          </div>
          <div>
            <p className="text-pri-silver text-sm">Status</p>
            <span className={certificate.verified ? "text-green-400" : "text-yellow-400"}>
              {certificate.verified ? "Terverifikasi" : "Belum Verifikasi"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
