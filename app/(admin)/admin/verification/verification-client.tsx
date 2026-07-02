"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  BookOpen,
  Calendar,
  Clock,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateProgramRegistrationStatus } from "@/features/admin/programs-actions";
import { updateEventRegistrationStatus } from "@/features/events/actions";
import { toast } from "sonner";

interface Registration {
  id: string;
  type: "program" | "event";
  status: string;
  date: string;
  program: { id: string; title: string } | { id: string; title: string }[] | null;
  member: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    member_id: string;
  } | { id: string; full_name: string; email: string; phone: string | null; member_id: string }[];
}

interface VerificationClientProps {
  registrations: Registration[];
}

function extractMember(member: any): { id: string; full_name: string; email: string; phone: string | null; member_id: string } | null {
  if (!member) return null;
  if (Array.isArray(member)) return member[0] || null;
  return member;
}

function extractProgram(prog: any): { id: string; title: string } | null {
  if (!prog) return null;
  if (Array.isArray(prog)) return prog[0] || null;
  return prog;
}

export function VerificationClient({ registrations }: VerificationClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "program" | "event">("all");
  const [processing, setProcessing] = useState<string | null>(null);

  const filtered = filter === "all"
    ? registrations
    : registrations.filter((r) => r.type === filter);

  const handleAction = async (reg: Registration, newStatus: "approved" | "rejected") => {
    setProcessing(reg.id);
    try {
      let result;
      if (reg.type === "program") {
        result = await updateProgramRegistrationStatus(reg.id, newStatus);
      } else {
        result = await updateEventRegistrationStatus(reg.id, newStatus);
      }

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          `${reg.type === "program" ? "Pendaftar program" : "Pendaftar event"} ${
            newStatus === "approved" ? "disetujui" : "ditolak"
          }`
        );
        router.refresh();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal memproses";
      toast.error(message);
    } finally {
      setProcessing(null);
    }
  };

  if (registrations.length === 0) {
    return (
      <div className="text-center py-16">
        <CheckCircle className="h-16 w-16 text-green-500/30 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-1">Tidak Ada Verifikasi Tertunda</h3>
        <p className="text-sm text-pri-silver">Semua pendaftar sudah diproses</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-pri-silver" />
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            filter === "all" ? "bg-pri-red text-white" : "bg-white/5 text-pri-silver hover:text-white"
          }`}
        >
          Semua ({registrations.length})
        </button>
        <button
          onClick={() => setFilter("program")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            filter === "program" ? "bg-blue-600 text-white" : "bg-white/5 text-pri-silver hover:text-white"
          }`}
        >
          Program (
          {registrations.filter((r) => r.type === "program").length})
        </button>
        <button
          onClick={() => setFilter("event")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            filter === "event" ? "bg-purple-600 text-white" : "bg-white/5 text-pri-silver hover:text-white"
          }`}
        >
          Event (
          {registrations.filter((r) => r.type === "event").length})
        </button>
      </div>

      {/* Registration Cards */}
      <div className="space-y-3">
        {filtered.map((reg) => {
          const member = extractMember(reg.member);
          const prog = extractProgram(reg.program);
          const isLoading = processing === reg.id;

          return (
            <div
              key={reg.id}
              className="flex items-start justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors"
            >
              <div className="min-w-0 flex-1">
                {/* Type + Status */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    className={
                      reg.type === "program"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                    }
                  >
                    {reg.type === "program" ? (
                      <BookOpen className="h-3 w-3 mr-1" />
                    ) : (
                      <Calendar className="h-3 w-3 mr-1" />
                    )}
                    {reg.type === "program" ? "Program" : "Event"}
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Menunggu
                  </Badge>
                </div>

                {/* Member Info */}
                {member && (
                  <div className="mb-1.5">
                    <p className="text-sm font-medium text-white">{member.full_name}</p>
                    <p className="text-xs text-pri-silver">{member.email}</p>
                    <p className="text-[10px] text-pri-silver/50 font-mono mt-0.5">
                      ID: {member.member_id}
                      {member.phone && ` • ${member.phone}`}
                    </p>
                  </div>
                )}

                {/* Program/Event Title */}
                {prog && (
                  <div className="flex items-center gap-1.5 text-xs text-pri-silver mt-2">
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="truncate">{prog.title}</span>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-1 mt-1 text-[10px] text-pri-silver/50">
                  <Clock className="h-3 w-3" />
                  Mendaftar: {new Date(reg.date).toLocaleDateString("id-ID", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button
                  onClick={() => handleAction(reg, "approved")}
                  disabled={isLoading}
                  className="h-8 px-3 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50 text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Setujui
                </button>
                <button
                  onClick={() => handleAction(reg, "rejected")}
                  disabled={isLoading}
                  className="h-8 px-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Tolak
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-pri-silver text-sm">
          Tidak ada {filter === "program" ? "program" : "event"} yang menunggu verifikasi
        </div>
      )}
    </div>
  );
}
