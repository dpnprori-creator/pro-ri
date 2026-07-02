"use client";

import { Calendar, BookOpen, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RegistrationItem {
  id: string;
  status: string;
  created_at: string;
  program_id: {
    id: string;
    title: string;
    slug: string;
    icon: string;
    label: string;
    status: string;
  };
}

export function ProgramsList({ registrations }: { registrations: RegistrationItem[] }) {
  if (registrations.length === 0) {
    return (
      <div className="text-center py-12 bg-pri-navy border border-pri-gold/20 rounded-lg">
        <BookOpen className="h-12 w-12 text-pri-silver mx-auto mb-3" />
        <p className="text-pri-silver text-sm">Belum ada pendaftaran program</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {registrations.map((reg) => (
        <div
          key={reg.id}
          className="bg-pri-navy border border-pri-gold/20 rounded-lg p-4 flex items-center justify-between"
        >
          <div>
            <h3 className="text-white font-medium">{reg.program_id.title}</h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-pri-silver">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(reg.created_at).toLocaleDateString("id-ID")}
              </span>
              <Badge variant={reg.status === "registered" ? "success" : "secondary"}>
                {reg.status}
              </Badge>
            </div>
          </div>
          <BadgeCheck className="h-5 w-5 text-green-400" />
        </div>
      ))}
    </div>
  );
}
