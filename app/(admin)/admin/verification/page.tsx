import { createClient } from "@/lib/supabase/server";
import { VerificationManager } from "./verification-manager";

async function getVerificationData() {
  const supabase = await createClient();

  const { data: members } = await supabase
    .from("members")
    .select("id, full_name, email, member_id, status, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: certificates } = await supabase
    .from("certificates")
    .select("id, certificate_number, title, member_id!inner(full_name), issued_at, verified")
    .order("issued_at", { ascending: false })
    .limit(50);

  return {
    members: members ?? [],
    certificates: certificates ?? [],
  };
}

export default async function AdminVerificationPage() {
  const data = await getVerificationData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Verification</h1>
        <p className="text-pri-silver mt-1">Verifikasi data</p>
      </div>

      <VerificationManager {...({ data } as any)} />
    </div>
  );
}
