"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GraduationCap, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { enrollInCourse } from "@/features/academy/actions";
import { toast } from "sonner";

interface AcademyEnrollButtonProps {
  courseId: string;
  courseSlug: string;
  isEnrolled: boolean;
  progress: number;
}

export function AcademyEnrollButton({ courseId, courseSlug, isEnrolled, progress }: AcademyEnrollButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (isEnrolled) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span className="text-xs text-green-400 font-medium">Terdaftar</span>
        </div>

        {/* Progress bar */}
        <div className="flex-1 max-w-[200px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-pri-silver/50 font-mono">Progress</span>
            <span className="text-[10px] text-pri-silver/50 font-mono">{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pri-red to-red-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {progress > 0 && progress < 100 && (
          <Button
            size="sm"
            variant="outline"
            className="border-white/10 text-pri-silver hover:text-white text-xs"
            onClick={() => router.push(`/academy/courses/${courseSlug}`)}
          >
            Lanjutkan <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  const handleEnroll = async () => {
    setLoading(true);
    const result = await enrollInCourse(courseId);
    setLoading(false);

    if (result.error) {
      if (result.error.includes("login")) {
        toast.error("Silakan login terlebih dahulu");
        router.push("/academy/login");
      } else {
        toast.error(result.error);
      }
    } else {
      toast.success("Berhasil mendaftar kursus!");
      router.refresh();
    }
  };

  return (
    <Button
      onClick={handleEnroll}
      disabled={loading}
      size="lg"
      className="bg-pri-red hover:bg-red-700 text-white"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Mendaftarkan...
        </>
      ) : (
        <>
          <GraduationCap className="h-4 w-4 mr-2" />
          Daftar Kursus
        </>
      )}
    </Button>
  );
}
