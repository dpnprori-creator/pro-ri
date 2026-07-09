"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, RotateCcw } from "lucide-react";
import { completeLesson, uncompleteLesson } from "@/features/academy/actions";
import { toast } from "sonner";

interface AcademyLessonCompleteButtonProps {
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
}

export function AcademyLessonCompleteButton({
  lessonId,
  courseId,
  isCompleted: initialCompleted,
}: AcademyLessonCompleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);

    let result;
    if (isCompleted) {
      result = await uncompleteLesson(lessonId, courseId);
    } else {
      result = await completeLesson(lessonId, courseId);
    }

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setIsCompleted(!isCompleted);
      if ((result as { completed?: boolean }).completed) {
        toast.success("🎉 Selamat! Kursus selesai!");
      } else {
        toast.success(isCompleted ? "Tanda selesai dihapus" : "Pelajaran ditandai selesai");
      }
      router.refresh();
    }
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={loading}
      variant={isCompleted ? "outline" : "default"}
      className={
        isCompleted
          ? "border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs"
          : "bg-pri-red hover:bg-red-700 text-white text-xs"
      }
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Memproses...
        </>
      ) : isCompleted ? (
        <>
          <RotateCcw className="h-4 w-4 mr-2" />
          Tandai Belum Selesai
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Tandai Selesai
        </>
      )}
    </Button>
  );
}
