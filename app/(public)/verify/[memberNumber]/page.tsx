import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import Image from "next/image";
import {
  ShieldCheck,
  BadgeCheck,
  Cpu,
  CircuitBoard,
  Fingerprint,
  QrCode,
  MapPin,
  CalendarDays,
  User,
  Zap,
} from "lucide-react";

async function getVerifiedCard(memberNumber: string) {
  const supabase = createAdminClient();

  // Query member_cards by member_number (format: PRO-RI-YYYY-NNNNN)
  const { data: card } = await supabase
    .from("member_cards")
    .select("*")
    .eq("member_number", memberNumber)
    .eq("status", "approved")
    .maybeSingle();

  if (!card) return null;

  // Get member data from members table (for region info)
  const { data: member } = await supabase
    .from("members")
    .select("*, province_id!left(name), regency_id!left(name)")
    .eq("auth_id", card.user_id)
    .single();

  return { card, member };
}

export default async function VerifyMemberPage(props: { params: Promise<{ memberNumber: string }> }) {
  const { memberNumber } = await props.params;
  const data = await getVerifiedCard(memberNumber);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-amber-500/10 to-red-500/20 rounded-2xl blur-xl" />
            <div className="relative bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] rounded-2xl border border-red-500/20 p-8 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto">
                <Cpu className="h-8 w-8 text-red-400" />
              </div>
              <h1 className="text-xl font-bold text-white">Anggota Tidak Ditemukan</h1>
              <p className="text-sm text-pri-silver">
                Nomor anggota <span className="text-white font-mono font-semibold">{memberNumber}</span>{" "}
                tidak terdaftar atau belum diverifikasi di sistem PRO RI.
              </p>
              <div className="pt-2">
                <a
                  href="https://prori.id"
                  className="inline-flex items-center gap-2 text-xs text-pri-silver hover:text-pri-red transition-colors font-mono"
                >
                  <Zap className="h-3 w-3" />
                  prori.id
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { card, member } = data;
  const provinceName = (member as any)?.province_id?.name || null;
  const regencyName = (member as any)?.regency_id?.name || null;
  const createdAt = card.verified_at
    ? new Date(card.verified_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 rounded-3xl blur-xl opacity-60" />

          <div className="relative bg-gradient-to-b from-[#111827] to-[#0a0a1a] rounded-2xl border border-green-500/20 overflow-hidden">
            {/* Circuit pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: [
                    "linear-gradient(rgba(74,222,128,0.3) 1px, transparent 1px)",
                    "linear-gradient(90deg, rgba(74,222,128,0.3) 1px, transparent 1px)",
                  ].join(","),
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            {/* Tech corner brackets */}
            <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none z-10">
              <div className="absolute top-0 left-0 w-6 h-[1.5px] bg-gradient-to-r from-green-500/40 to-transparent" />
              <div className="absolute top-0 left-0 w-[1.5px] h-6 bg-gradient-to-b from-green-500/40 to-transparent" />
            </div>
            <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none z-10">
              <div className="absolute top-0 right-0 w-6 h-[1.5px] bg-gradient-to-l from-green-500/40 to-transparent" />
              <div className="absolute top-0 right-0 w-[1.5px] h-6 bg-gradient-to-b from-green-500/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 w-12 h-12 pointer-events-none z-10">
              <div className="absolute bottom-0 left-0 w-6 h-[1.5px] bg-gradient-to-r from-green-500/40 to-transparent" />
              <div className="absolute bottom-0 left-0 w-[1.5px] h-6 bg-gradient-to-t from-green-500/40 to-transparent" />
            </div>
            <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none z-10">
              <div className="absolute bottom-0 right-0 w-6 h-[1.5px] bg-gradient-to-l from-green-500/40 to-transparent" />
              <div className="absolute bottom-0 right-0 w-[1.5px] h-6 bg-gradient-to-t from-green-500/40 to-transparent" />
            </div>

            {/* Top scanline */}
            <div className="relative h-1 bg-gradient-to-r from-transparent via-green-500/40 to-transparent">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/60 to-transparent animate-pulse" />
            </div>

            {/* ===== HEADER ===== */}
            <div className="relative p-6 pb-4 text-center space-y-3">
              {/* Verification Badge */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-green-500/20 animate-ping opacity-20" />
                    <ShieldCheck className="h-10 w-10 text-green-400" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                    <BadgeCheck className="h-3.5 w-3.5 text-green-400" />
                  </div>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-green-300 uppercase tracking-wider">
                    Terverifikasi
                  </span>
                </div>
                <h1 className="text-xl font-bold text-white">Anggota Resmi PRO RI</h1>
                <p className="text-xs text-pri-silver font-mono mt-1">
                  ID: {card.member_number}
                </p>
              </div>
            </div>

            {/* ===== MEMBER INFO CARD ===== */}
            <div className="relative px-6 pb-6">
              <div className="bg-[#0f1729]/80 border border-white/10 rounded-xl p-5 space-y-5">
                {/* Photo & Name */}
                <div className="flex items-center gap-4">
                  {/* Photo */}
                  <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-green-500/30 bg-gray-900 flex-shrink-0">
                    {card.photo_url ? (
                      <img
                        src={card.photo_url}
                        alt={card.full_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-500/10 to-gray-900">
                        <span className="text-2xl font-bold text-green-400 font-mono">
                          {card.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name & Number */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <User className="h-3 w-3 text-green-400/60" />
                      <p className="text-[10px] text-pri-silver font-mono uppercase tracking-wider">
                        Nama Lengkap
                      </p>
                    </div>
                    <p className="text-base font-bold text-white truncate">{card.full_name}</p>
                    {card.nickname && (
                      <p className="text-xs text-pri-silver">({card.nickname})</p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-500/40" />
                </div>

                {/* Detail Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-pri-silver font-mono uppercase tracking-wider flex items-center gap-1">
                      <Fingerprint className="h-2.5 w-2.5 text-green-400/60" />
                      Nomor Anggota
                    </p>
                    <p className="text-sm font-mono text-white font-semibold mt-0.5">
                      {card.member_number}
                    </p>
                  </div>
                  {card.phone && (
                    <div>
                      <p className="text-[10px] text-pri-silver font-mono uppercase tracking-wider flex items-center gap-1">
                        <CircuitBoard className="h-2.5 w-2.5 text-green-400/60" />
                        Kontak
                      </p>
                      <p className="text-sm text-white font-medium mt-0.5">{card.phone}</p>
                    </div>
                  )}
                  {provinceName && (
                    <div>
                      <p className="text-[10px] text-pri-silver font-mono uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5 text-green-400/60" />
                        Daerah
                      </p>
                      <p className="text-sm text-white font-medium mt-0.5">
                        {regencyName ? `${regencyName}, ` : ""}{provinceName}
                      </p>
                    </div>
                  )}
                  {createdAt && (
                    <div>
                      <p className="text-[10px] text-pri-silver font-mono uppercase tracking-wider flex items-center gap-1">
                        <CalendarDays className="h-2.5 w-2.5 text-green-400/60" />
                        Terverifikasi
                      </p>
                      <p className="text-sm text-white font-medium mt-0.5">{createdAt}</p>
                    </div>
                  )}
                </div>

                {/* Interest tags */}
                {card.interests && card.interests.length > 0 && (
                  <div>
                    <p className="text-[10px] text-pri-silver font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Zap className="h-2.5 w-2.5 text-green-400/60" />
                      Bidang Minat
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {card.interests.slice(0, 5).map((i: string) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[10px] rounded bg-green-500/5 text-green-300 border border-green-500/15 font-medium"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech footer */}
                <div className="border-t border-white/5 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[8px] text-pri-silver/50 font-mono tracking-wider">
                      <Cpu className="h-2.5 w-2.5" />
                      <span>PRO-RI VERIFICATION SYSTEM v2.0</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[8px] text-green-400/60 font-mono">SECURE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== FOOTER ===== */}
            <div className="relative px-6 pb-4">
              <div className="flex items-center justify-center gap-2 text-[9px] text-pri-silver/40 font-mono">
                <span>Pusat Robotika Rakyat Indonesia</span>
                <span className="text-white/10">•</span>
                <span>prori.id</span>
              </div>
            </div>

            {/* Bottom scanline */}
            <div className="relative h-1 bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
          </div>
        </div>

        {/* Powered by */}
        <p className="text-center text-[10px] text-pri-silver/30 font-mono mt-4">
          Verifikasi digital • Kartu Anggota PRO RI
        </p>
      </div>
    </div>
  );
}
