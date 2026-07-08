"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CheckCircle,
  Loader2,
  Search,
  UserCheck,
  ArrowRight,
  IdCard,
  User,
} from "lucide-react";
import {
  lookupMemberByMemberId,
  registerProgramByMemberId,
  registerEventByMemberId,
} from "@/features/registration-actions";
import { toast } from "sonner";

interface DirectRegistrationFormProps {
  type: "program" | "event";
  id: string;
  title: string;
}

type Step = "form" | "verifying" | "confirm" | "done" | "error";

export function DirectRegistrationForm({
  type,
  id,
  title,
}: DirectRegistrationFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [memberId, setMemberId] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifiedName, setVerifiedName] = useState("");

  const labelType = type === "program" ? "Program" : "Event";
  const labelTypeLower = type === "program" ? "program" : "event";

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId.trim() || !fullName.trim()) {
      toast.error("Isi Member ID dan Nama Lengkap");
      return;
    }

    setLoading(true);
    setStep("verifying");

    // Brief delay for visual feedback
    await new Promise((r) => setTimeout(r, 800));

    try {
      const result = await lookupMemberByMemberId(memberId.trim());

      if (result.error) {
        toast.error(result.error);
        setStep("form");
        setLoading(false);
        return;
      }

      if (
        result.member?.full_name.toLowerCase() !== fullName.trim().toLowerCase()
      ) {
        toast.error("Nama lengkap tidak sesuai dengan data anggota");
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

  const handleRegister = async () => {
    setLoading(true);

    let result;
    if (type === "program") {
      result = await registerProgramByMemberId(
        id,
        memberId.trim(),
        fullName.trim()
      );
    } else {
      result = await registerEventByMemberId(
        id,
        memberId.trim(),
        fullName.trim()
      );
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

  const handleReset = () => {
    setMemberId("");
    setFullName("");
    setVerifiedName("");
    setStep("form");
  };

  // Step: Done
  if (step === "done") {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="p-6 text-center">
          <div className="h-14 w-14 rounded-full bg-green-500/20 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-7 w-7 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Pendaftaran Berhasil!
          </h3>
          <p className="text-sm text-pri-silver mb-4">
            Anda telah terdaftar di {labelTypeLower}
            <br />
            <span className="text-white font-medium">{title}</span>
          </p>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-left text-sm space-y-1 mb-4">
            <div className="flex justify-between">
              <span className="text-pri-silver">Member ID</span>
              <span className="text-white font-mono">{memberId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pri-silver">Nama</span>
              <span className="text-white">{verifiedName}</span>
            </div>
          </div>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-white/10 text-pri-silver hover:text-white"
          >
            Daftar {labelTypeLower} lain
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Step: Confirm
  if (step === "confirm") {
    return (
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Data Anggota Ditemukan
              </h3>
              <p className="text-xs text-pri-silver">
                Verifikasi nama sebelum mendaftar
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-sm space-y-2 mb-4">
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
              onClick={handleRegister}
              disabled={loading}
              className="flex-1 bg-pri-red hover:bg-red-700 h-10 text-sm"
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
              className="border-white/10 text-pri-silver hover:text-white h-10"
            >
              Batal
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step: Form (default)
  return (
    <Card className="border-pri-red/20 bg-white/[0.02]">
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-pri-red/20 flex items-center justify-center">
            <IdCard className="h-4 w-4 text-pri-red" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-white">
              Daftar via Member ID
            </CardTitle>
            <CardDescription className="text-xs text-pri-silver">
              Sudah punya akun? Masukkan data anggota Anda
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-3">
        <form onSubmit={handleLookup} className="space-y-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="reg-member-id"
              className="text-xs text-pri-silver flex items-center gap-1.5"
            >
              <IdCard className="h-3 w-3" />
              Member ID
            </Label>
            <Input
              id="reg-member-id"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="PRO-RI-2026-XXXXX"
              required
              className="h-9 text-sm font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="reg-full-name"
              className="text-xs text-pri-silver flex items-center gap-1.5"
            >
              <User className="h-3 w-3" />
              Nama Lengkap
            </Label>
            <Input
              id="reg-full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Sesuai data pendaftaran"
              required
              className="h-9 text-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || step === "verifying"}
            className="w-full bg-pri-red hover:bg-red-700 h-10 text-sm"
          >
            {loading || step === "verifying" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Verifikasi & Daftar
              </>
            )}
          </Button>
        </form>

        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="text-center">
            <Button
              variant="link"
              className="text-xs text-pri-silver hover:text-white h-auto p-0"
              onClick={() => router.push("/login")}
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              Login dengan email & password
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


