"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MemberCardData {
  member_id: string;
  full_name: string;
  status: string;
  province_name?: string;
  role_name?: string;
}

export function DigitalMemberCard({ member }: { member: MemberCardData }) {
  const qrValue = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify/${member.member_id}`;

  return (
    <Card className="glass-card overflow-hidden">
      {/* Card Header - Red accent */}
      <div className="bg-gradient-to-r from-pri-red to-red-700 h-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-8 border-white/20" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full border-8 border-white/10" />
        </div>
        <div className="relative z-10 p-6">
          <p className="text-xs text-white/70 font-mono uppercase tracking-wider">
            PRO RI DIGITAL COMMAND CENTER
          </p>
          <p className="text-lg font-bold text-white mt-1">Digital Member Card</p>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* QR Code */}
          <div className="glass rounded-xl p-3 flex-shrink-0">
            <QRCodeCanvas
              value={qrValue}
              size={120}
              bgColor="transparent"
              fgColor="#E31E24"
              level="M"
            />
          </div>

          {/* Member Info */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <p className="text-xs text-pri-silver font-mono uppercase tracking-wider">
                Member ID
              </p>
              <p className="text-sm font-mono text-white font-bold mt-0.5">
                {member.member_id}
              </p>
            </div>

            <div>
              <p className="text-xs text-pri-silver font-mono uppercase tracking-wider">
                Nama
              </p>
              <p className="text-base font-semibold text-white mt-0.5">
                {member.full_name}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-pri-silver font-mono uppercase tracking-wider">
                  Status
                </p>
                <Badge
                  variant={member.status === "active" ? "success" : "warning"}
                  className="mt-1"
                >
                  {member.status === "active" ? "Aktif" : "Tidak Aktif"}
                </Badge>
              </div>
              {member.province_name && (
                <div>
                  <p className="text-xs text-pri-silver font-mono uppercase tracking-wider">
                    Provinsi
                  </p>
                  <p className="text-sm text-white mt-0.5">{member.province_name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-[10px] text-pri-silver/50 text-center font-mono">
            Kartu ini adalah identitas resmi anggota PRO RI •{/*  */}verifikasi di prori.id/verify/{member.member_id}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
