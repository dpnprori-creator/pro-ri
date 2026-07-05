"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Cpu,
  Shield,
  ShieldCheck,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MemberCardPendingProps {
  fullName: string;
  submittedAt?: string;
}

export function MemberCardPending({ fullName, submittedAt }: MemberCardPendingProps) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [dots, setDots] = useState("");

  // Animated dots for the scanning effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 2000);
  };

  const formattedDate = submittedAt
    ? new Date(submittedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Main Card */}
      <div className="relative w-full max-w-lg">
        {/* Glow effects */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-yellow-500/20 rounded-3xl blur-xl opacity-60 animate-pulse" />

        <div className="relative bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] rounded-2xl border border-yellow-500/20 overflow-hidden">
          {/* Circuit pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: [
                  "linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px)",
                  "linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)",
                ].join(","),
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          {/* Top scanline bar */}
          <div className="relative h-1 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent animate-pulse" />
          </div>

          <div className="relative p-8 space-y-6">
            {/* Status icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-yellow-500/20 animate-ping opacity-20" />
                  <div className="absolute inset-2 rounded-full border border-yellow-500/20 animate-spin [animation-duration:3s]" />
                  <Shield className="h-10 w-10 text-yellow-400" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
                  <Clock className="h-3 w-3 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-white">
                Menunggu Verifikasi{dots}
              </h2>
              <p className="text-sm text-yellow-300/80 font-mono">
                SCANNING SYSTEM
              </p>
              <p className="text-sm text-pri-silver max-w-sm mx-auto">
                Data kartu anggota <span className="text-white font-semibold">{fullName}</span>{" "}
                sedang dalam proses review oleh tim admin PRO RI.
              </p>
            </div>

            {/* Progress steps */}
            <div className="space-y-3 max-w-sm mx-auto">
              {[
                { label: "Data diterima sistem", done: true },
                { label: "Verifikasi admin PRO RI", done: false, active: true },
                { label: "Penerbitan kartu anggota", done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`relative h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.done
                        ? "bg-green-500/20 border border-green-500/30"
                        : step.active
                          ? "bg-yellow-500/20 border border-yellow-500/30"
                          : "bg-white/5 border border-white/10"
                    }`}
                  >
                    {step.done ? (
                      <ShieldCheck className="h-4 w-4 text-green-400" />
                    ) : step.active ? (
                      <Loader2 className="h-4 w-4 text-yellow-400 animate-spin" />
                    ) : (
                      <Cpu className="h-4 w-4 text-pri-silver/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        step.done
                          ? "text-green-300"
                          : step.active
                            ? "text-yellow-300"
                            : "text-pri-silver/50"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                  {step.done && (
                    <ShieldCheck className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                  )}
                  {step.active && (
                    <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Scanline animation */}
            <div className="relative h-px bg-yellow-500/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent animate-scanline" />
            </div>

            {/* Info footer */}
            <div className="text-center space-y-1">
              {formattedDate && (
                <p className="text-[10px] text-pri-silver/60 font-mono">
                  Dikirim: {formattedDate}
                </p>
              )}
              <p className="text-[10px] text-pri-silver/40 font-mono">
                Proses verifikasi biasanya memakan waktu 1×24 jam
              </p>
            </div>
          </div>

          {/* Bottom scanline bar */}
          <div className="relative h-1 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="border-yellow-500/30 text-yellow-400 hover:text-yellow-300 hover:border-yellow-500/60 transition-all"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Memuat ulang..." : "Periksa Status"}
        </Button>
      </div>
    </div>
  );
}
