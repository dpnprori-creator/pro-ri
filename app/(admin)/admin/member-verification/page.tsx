import { createClient } from "@/lib/supabase/server";
import { MemberVerificationManager } from "./member-verification-manager";

async function getPendingCards() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("member_cards")
    .select("*, user_id!inner(full_name, email, member_id)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminMemberVerificationPage() {
  const cards = await getPendingCards();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Verifikasi Anggota</h1>
        <p className="text-pri-silver mt-1">{cards.length} menunggu verifikasi</p>
      </div>

      <MemberVerificationManager initialData={cards} />
    </div>
  );
}
