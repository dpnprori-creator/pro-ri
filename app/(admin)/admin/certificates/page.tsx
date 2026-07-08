import { createClient } from "@/lib/supabase/server";
import { CertificatesManager } from "./certificates-manager";

async function getCertificates() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("certificates")
    .select("id, certificate_number, title, type, issued_at, verified, member_id(full_name, member_id), event_id(title)")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminCertificatesPage() {
  const certificates = await getCertificates();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sertifikat</h1>
        <p className="text-pri-silver mt-1">Total {certificates.length} sertifikat</p>
      </div>

      <CertificatesManager certificates={certificates as any} />
    </div>
  );
}
