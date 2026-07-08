import { createClient } from "@/lib/supabase/server";
import { CertificatesList } from "./certificates-list";

async function getCertificates() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return [];

  const { data } = await supabase
    .from("certificates")
    .select("*, event_id(title)")
    .eq("member_id", member.id)
    .order("issued_at", { ascending: false });

  return data ?? [];
}

export default async function CertificatesPage() {
  const certificates = await getCertificates();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sertifikat Saya</h1>
        <p className="text-pri-silver mt-1">Total {certificates.length} sertifikat</p>
      </div>

      <CertificatesList certificates={certificates} />
    </div>
  );
}
