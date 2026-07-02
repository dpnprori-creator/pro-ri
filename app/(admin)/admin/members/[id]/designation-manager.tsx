"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setMemberDesignation } from "@/features/admin/actions";
import { toast } from "sonner";

interface DesignationManagerProps {
  memberId: string;
  isTrainer: boolean;
  isMentor: boolean;
}

export function DesignationManager({ memberId, isTrainer, isMentor }: DesignationManagerProps) {
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);

  const toggleDesignation = async (type: "trainer" | "mentor", active: boolean) => {
    setSaving(type);
    const result = await setMemberDesignation(memberId, type, active);
    setSaving(null);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(active ? `${type === "trainer" ? "Trainer" : "Mentor"} ditambahkan` : `${type === "trainer" ? "Trainer" : "Mentor"} dihapus`);
      router.refresh();
    }
  };

  return (
    <Card className="glass-card border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-pri-silver flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-blue-400" />
          Designation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-pri-silver/60">
          Tetapkan anggota sebagai Trainer atau Mentor untuk target nasional
        </p>

        {/* Trainer Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-pri-dark/50 border border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Trainer</p>
              <p className="text-[10px] text-pri-silver/50">Target nasional: 500</p>
            </div>
          </div>
          <Button
            size="sm"
            variant={isTrainer ? "default" : "outline"}
            disabled={saving !== null}
            onClick={() => toggleDesignation("trainer", !isTrainer)}
            className={isTrainer ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "border-white/10"}
          >
            {saving === "trainer" ? (
              "..."
            ) : isTrainer ? (
              <><X className="h-3 w-3 mr-1" /> Hapus</>
            ) : (
              <><Check className="h-3 w-3 mr-1" /> Tetapkan</>
            )}
          </Button>
        </div>

        {/* Mentor Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-pri-dark/50 border border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Mentor</p>
              <p className="text-[10px] text-pri-silver/50">Target nasional: 200</p>
            </div>
          </div>
          <Button
            size="sm"
            variant={isMentor ? "default" : "outline"}
            disabled={saving !== null}
            onClick={() => toggleDesignation("mentor", !isMentor)}
            className={isMentor ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "border-white/10"}
          >
            {saving === "mentor" ? (
              "..."
            ) : isMentor ? (
              <><X className="h-3 w-3 mr-1" /> Hapus</>
            ) : (
              <><Check className="h-3 w-3 mr-1" /> Tetapkan</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
