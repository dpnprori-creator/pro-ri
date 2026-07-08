"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Loader2,
  IdCard,
  User,
  Search,
  UserCheck,
  GraduationCap,
  BookOpen,
  Bot,
  Trophy,
  Rocket,
  Store,
  Globe,
  Cpu,
} from "lucide-react";
import {
  registerProgramByMemberId,
  registerEventByMemberId,
  lookupMemberByMemberId,
} from "@/features/registration-actions";
import { toast } from "sonner";

type Step = "form" | "verifying" | "confirm" | "done";

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "program" | "event";
  id: string;
  title: string;
  icon?: string;
  label?: string;
  isRegistered: boolean;
}

const iconMap: Record<string, any> = {
  GraduationCap, BookOpen, Bot, Trophy, Rocket, Store, Globe, Cpu,
};

const labelColors: Record<string, string> = {
  dibuka: "bg-green-500/20 text-green-400 border-green-500/30",
  "akan datang": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ditutup: "bg-red-500/20 text-red-400 border-red-500/30",
  selesai: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const labelLabels: Record<string, string> = {
  dibuka: "Dibuka",
  "akan datang": "Akan Datang",
  ditutup: "Ditutup",
  selesai: "Selesai",
};

export function RegistrationModal({
  open,
  onOpenChange,
  type,
  id,
  title,
  icon,
  label,
  isRegistered,
}: RegistrationModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [memberId, setMemberId] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifiedName, setVerifiedName] = useState("");

  const labelType = type === "program" ? "Program" : "Event";
  const labelTypeLower = type === "program" ? "program" : "event";

  const Icon = icon ? iconMap[icon] || GraduationCap : null;

  const handleReset = () => {
    setMemberId("");
    setFullName("");
    setVerifiedName("");
    setStep("form");
    setLoading(false);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId.trim() || !fullName.trim()) {
      toast.error("Isi Member ID dan Nama Lengkap");
      return;
    }

    setLoading(true);
    setStep("verifying");
    await new Promise((r) => setTimeout(r, 800));

    try {
      const result = await lookupMemberByMemberId(memberId.trim());

      if (result.error) {
        toast.error(result.error);
        setStep("form");
        setLoading(false);
        return;
      }

      if (result.member?.full_name.toLowerCase() !== fullName.trim().toLowerCase()) {
        toast.error("Nama lengkap tidak sesuai dengan data anggota");
        setStep("form");
        setLoading(false);
        return;
      }

      // Check if already registered
      if (isRegistered) {
        toast.error(`Anda sudah terdaftar di ${labelTypeLower} ini`);
        setStep("form");
        setLoading(false);
        return;
      }

      setVerifiedName(result.member.full_name);
      setStep("confirm");
      setLoading(false);
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
      setStep("form");
      setLoading(false);
    }
  };

  const handleMemberIdRegister = async () => {
    setLoading(true);
    let result;
    if (type === "program") {
      result = await registerProgramByMemberId(id, memberId.trim(), fullName.trim());
    } else {
      result = await registerEventByMemberId(id, memberId.trim(), fullName.trim());
    }
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      setStep("form");
    } else {
      toast.success(result.message || `Pendaftaran ${labelTypeLower} berhasil!`);
      setStep("done");
      router.refresh();
    }
  };

  const isOpen = label === "dibuka" || !label;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="h-10 w-10 rounded-xl bg-pri-red/20 flex items-center justify-center">
                <Icon className="h-5 w-5 text-pri-red" />
              </div>
            )}
            <div className="min-w-0">
              <DialogTitle className="text-white text-base truncate">
                Daftar {labelType}
              </DialogTitle>
              <DialogDescription className="text-xs truncate">
                {title}
              </DialogDescription>
            </div>
            {label && (
              <Badge className={`${labelColors[label] || labelColors.dibuka} border shrink-0 ml-auto text-[10px]`}>
                {labelLabels[label] || label}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Info: semua user harus daftar via Member ID */}
        <div className="px-2">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-pri-red/10 border border-pri-red/20">
            <IdCard className="h-4 w-4 text-pri-red shrink-0" />
            <p className="text-[11px] text-pri-silver">
              Daftar menggunakan <span className="text-white font-medium">Member ID</span> dan <span className="text-white font-medium">Nama Lengkap</span> — menunggu verifikasi admin
            </p>
          </div>
        </div>

        {/* Step: Done */}
        {step === "done" && (
          <div className="text-center py-4">
            <div className="h-14 w-14 rounded-full bg-green-500/20 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Pendaftaran Dikirim!
            </h3>
            <p className="text-sm text-pri-silver mb-4">
              Data Anda telah terdaftar di {labelTypeLower} ini.
              <br />
              Menunggu verifikasi admin.
            </p>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-left text-sm space-y-1 mb-4">
              <div className="flex justify-between">
                <span className="text-pri-silver">Nama</span>
                <span className="text-white">{verifiedName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pri-silver">Member ID</span>
                <span className="text-white font-mono">{memberId}</span>
              </div>
            </div>
            <Button onClick={handleClose} variant="outline" className="border-white/10 text-pri-silver hover:text-white">
              Tutup
            </Button>
          </div>
        )}

        {/* Step: Form / Verifying / Confirm */}
        {(step === "form" || step === "verifying" || step === "confirm") && (
          <div className="space-y-4 py-2">
            {/* Form Step */}
            {step === "form" && (
              <form onSubmit={handleLookup} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="modal-member-id" className="text-xs text-pri-silver flex items-center gap-1.5">
                    <IdCard className="h-3 w-3" />
                    Member ID
                  </Label>
                  <Input
                    id="modal-member-id"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="PRO-RI-2026-XXXXX"
                    required
                    className="h-9 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="modal-full-name" className="text-xs text-pri-silver flex items-center gap-1.5">
                    <User className="h-3 w-3" />
                    Nama Lengkap
                  </Label>
                  <Input
                    id="modal-full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sesuai data pendaftaran"
                    required
                    className="h-9 text-sm"
                  />
                </div>
                {isRegistered && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
                    <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                    <p className="text-xs text-green-300">Anda sudah terdaftar di {labelTypeLower} ini</p>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={loading || !isOpen || isRegistered}
                  className="w-full bg-pri-red hover:bg-red-700 h-10 text-sm"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Verifikasi & Daftar
                </Button>
              </form>
            )}

            {/* Verifying Step */}
            {step === "verifying" && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-pri-red mx-auto mb-3" />
                <p className="text-sm text-pri-silver">Memverifikasi data anggota...</p>
              </div>
            )}

            {/* Confirm Step */}
            {step === "confirm" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <UserCheck className="h-5 w-5 text-yellow-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Data Ditemukan</p>
                    <p className="text-xs text-pri-silver">Nama cocok dengan data anggota</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-pri-silver">Member ID</span>
                    <span className="text-white font-mono font-medium">{memberId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-pri-silver">Nama Lengkap</span>
                    <span className="text-white font-medium">{verifiedName}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleMemberIdRegister}
                    disabled={loading}
                    className="flex-1 bg-pri-red hover:bg-red-700"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Konfirmasi & Daftar
                  </Button>
                  <Button
                    onClick={handleReset}
                    disabled={loading}
                    variant="outline"
                    className="border-white/10 text-pri-silver hover:text-white"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
