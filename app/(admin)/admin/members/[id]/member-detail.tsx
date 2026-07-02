"use client";

import { User, Mail, Fingerprint, MapPin, Briefcase, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MemberData {
  id: string;
  full_name: string;
  email: string;
  member_id: string;
  phone: string | null;
  occupation: string | null;
  status: string;
  created_at: string;
  role_id: { name: string } | null;
  province_id: { name: string } | null;
  regency_id: { name: string } | null;
}

export function MemberDetail({ member }: { member: MemberData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="glass-card lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5 text-pri-red" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-pri-red/10 flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-pri-red">
                {member.full_name.charAt(0)}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-white">{member.full_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={member.status === "active" ? "success" : "secondary"}>
                {member.status === "active" ? "Aktif" : "Nonaktif"}
              </Badge>
              {member.role_id && (
                <Badge variant={member.role_id.name === "super_admin" ? "danger" : "warning"}>
                  {member.role_id.name}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-pri-silver">
              <Mail className="h-4 w-4" />
              {member.email}
            </div>
            <div className="flex items-center gap-2 text-pri-silver">
              <Fingerprint className="h-4 w-4" />
              {member.member_id}
            </div>
            {member.phone && (
              <div className="flex items-center gap-2 text-pri-silver">
                <BadgeCheck className="h-4 w-4" />
                {member.phone}
              </div>
            )}
            {member.occupation && (
              <div className="flex items-center gap-2 text-pri-silver">
                <Briefcase className="h-4 w-4" />
                {member.occupation}
              </div>
            )}
            {member.province_id && (
              <div className="flex items-center gap-2 text-pri-silver">
                <MapPin className="h-4 w-4" />
                {member.province_id.name}
                {member.regency_id && `, ${member.regency_id.name}`}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
