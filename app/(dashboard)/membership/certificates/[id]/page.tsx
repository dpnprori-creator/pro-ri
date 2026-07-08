import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CertificateDetail } from "./certificate-detail";

async function getCertificate(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("certificates")
    .select("*, member_id(full_name, member_id), event_id(title, start_date)")
    .eq("id", id)
    .single();

  return data;
}

export default async function CertificateDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const certificate = await getCertificate(id);

  if (!certificate) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Detail Sertifikat</h1>
        <p className="text-pri-silver mt-1">{certificate.title}</p>
      </div>

      <CertificateDetail certificate={certificate} />
    </div>
  );
}
