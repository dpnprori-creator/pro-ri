import { createClient } from "@/lib/supabase/server";
import { VerificationManager } from "./verification-manager";

async function getVerificationData() {
  const supabase = await createClient();

  // Fetch program registrations with pending/registered status
  const { data: programRegs } = await supabase
    .from("program_registrations")
    .select("id, status, created_at, program_id(id, title), member_id(id, full_name, email, phone, member_id)")
    .in("status", ["registered", "pending"])
    .order("created_at", { ascending: false })
    .limit(50);

  // Fetch event registrations with pending/registered status  
  const { data: eventRegs } = await supabase
    .from("event_registrations")
    .select("id, status, created_at, event_id!inner(id, title), member_id(id, full_name, email, phone, member_id)")
    .in("status", ["registered", "pending"])
    .order("created_at", { ascending: false })
    .limit(50);

  // Transform program registrations
  const programRegistrations = (programRegs ?? []).map((r: any) => ({
    id: r.id,
    type: "program" as const,
    status: r.status,
    date: r.created_at,
    program: r.program_id ? { id: r.program_id.id, title: r.program_id.title } : null,
    member: r.member_id ? {
      id: r.member_id.id,
      full_name: r.member_id.full_name,
      email: r.member_id.email,
      phone: r.member_id.phone,
      member_id: r.member_id.member_id,
    } : null,
  }));

  // Transform event registrations
  const eventRegistrations = (eventRegs ?? []).map((r: any) => ({
    id: r.id,
    type: "event" as const,
    status: r.status,
    date: r.created_at,
    program: r.event_id ? { id: r.event_id.id, title: r.event_id.title } : null,
    member: r.member_id ? {
      id: r.member_id.id,
      full_name: r.member_id.full_name,
      email: r.member_id.email,
      phone: r.member_id.phone,
      member_id: r.member_id.member_id,
    } : null,
  }));

  // Combine all registrations, sorted by date descending
  const allRegistrations = [...programRegistrations, ...eventRegistrations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return allRegistrations;
}

export default async function AdminVerificationPage() {
  const registrations = await getVerificationData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Verification</h1>
        <p className="text-pri-silver mt-1">Verifikasi pendaftar program & event</p>
      </div>

      <VerificationManager registrations={registrations as any} />
    </div>
  );
}
