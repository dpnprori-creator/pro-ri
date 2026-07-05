import { createClient } from "@/lib/supabase/server";
import { MemberVerificationManager } from "./member-verification-manager";

async function getPendingCards() {
  const supabase = await createClient();
  // user_id di member_cards REFERENCES auth.users(id) — data full_name, email, dll
  // sudah ada langsung di tabel member_cards, jadi tidak perlu join
  const { data } = await supabase
    .from("member_cards")
    .select("*")
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
