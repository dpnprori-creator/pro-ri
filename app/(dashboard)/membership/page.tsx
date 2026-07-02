import { createClient } from "@/lib/supabase/server";
import { DigitalMemberCard } from "@/components/features/membership/digital-member-card";
import { MemberCardView } from "@/components/features/membership/member-card-view";
import { redirect } from "next/navigation";

async function getMembershipData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { member: null, card: null, certificates: [] };

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (!member) return { member: null, card: null, certificates: [] };

  const [{ data: card }, { data: certificates }] = await Promise.all([
    supabase.from("member_cards").select("*").eq("user_id", member.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("certificates").select("*").eq("member_id", member.id).order("issued_at", { ascending: false }),
  ]);

  return { member, card, certificates: certificates ?? [] };
}

export default async function MembershipPage() {
  const { member, card, certificates } = await getMembershipData();

  if (!member) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Membership</h1>
        <p className="text-pri-silver mt-1">Kelola keanggotaan PRO RI Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Kartu Anggota</h2>
          <MemberCardView card={card as any ?? undefined} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Sertifikat</h2>
          {certificates.length > 0 ? (
            <div className="space-y-2">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-pri-navy border border-pri-gold/20 rounded-lg p-3">
                  <p className="text-white font-medium">{cert.title}</p>
                  <p className="text-pri-silver text-sm">{cert.type}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-pri-silver text-sm">Belum ada sertifikat</p>
          )}
        </div>
      </div>
    </div>
  );
}
