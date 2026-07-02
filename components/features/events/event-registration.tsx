"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, LogIn } from "lucide-react";
import { registerForEvent, cancelRegistration } from "@/features/events/actions";
import { toast } from "sonner";
import Link from "next/link";

interface EventRegistrationProps {
  eventId: string;
  registered: boolean;
  registrationStatus: string | null;
  isLoggedIn: boolean;
}

export const EventRegistration = EventRegistrationButton;

export function EventRegistrationButton({
  eventId,
  registered,
  registrationStatus,
  isLoggedIn,
}: EventRegistrationProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    const result = await registerForEvent(eventId);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Pendaftaran berhasil");
      router.refresh();
    }
  };

  const handleCancel = async () => {
    if (!confirm("Yakin ingin membatalkan pendaftaran?")) return;
    setLoading(true);
    const result = await cancelRegistration(eventId);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Pendaftaran dibatalkan");
      router.refresh();
    }
  };

  if (!isLoggedIn) {
    return (
      <Link href="/login">
        <Button className="bg-pri-red hover:bg-red-700 h-12 text-base w-full">
          <LogIn className="h-5 w-5 mr-2" />
          Login untuk Mendaftar
        </Button>
      </Link>
    );
  }

  if (registered) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-400">Terdaftar</p>
            <p className="text-xs text-pri-silver">
              Anda sudah terdaftar di event ini
            </p>
          </div>
          <Badge variant="success" className="ml-auto">Registered</Badge>
        </div>
        <Button
          onClick={handleCancel}
          disabled={loading}
          variant="outline"
          className="w-full border-white/10 text-pri-silver hover:text-red-400 hover:border-red-400/30 h-10"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4 mr-2" />
          )}
          Batalkan Pendaftaran
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleRegister}
      disabled={loading}
      className="bg-pri-red hover:bg-red-700 h-12 text-base w-full"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Mendaftarkan...
        </>
      ) : (
        <>
          <CheckCircle className="h-5 w-5 mr-2" />
          Daftar Event Ini
        </>
      )}
    </Button>
  );
}
