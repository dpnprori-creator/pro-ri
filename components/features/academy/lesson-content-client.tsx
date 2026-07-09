"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, CheckCircle, Lock, Play,
  GraduationCap, Clock, BookOpen, Medal, Trophy, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoTracker } from "./video-tracker";
import { completeLesson, uncompleteLesson } from "@/features/academy/actions";
import { toast } from "sonner";

interface LessonData {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  video_url: string | null;
  duration_minutes: number;
  is_free: boolean;
}

interface CourseData {
  id: string;
  title: string;
  slug: string;
}

interface NavLesson {
  id: string;
  title: string;
  sort_order: number;
}

interface LessonContentClientProps {
  lesson: LessonData;
  course: CourseData;
  courseId: string;
  currentLessonId: string;
  isCompleted: boolean;
  isLocked: boolean;
  prevLesson: NavLesson | null;
  nextLesson: NavLesson | null;
  completedIds: string[];
  allLessons: NavLesson[];
  enrollmentProgress: number;
}

export function LessonContentClient({
  lesson,
  course,
  courseId,
  currentLessonId,
  isCompleted: initialCompleted,
  isLocked,
  prevLesson,
  nextLesson,
  completedIds,
  allLessons,
  enrollmentProgress,
}: LessonContentClientProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [completing, setCompleting] = useState(false);

  // Check if course is fully completed
  const allCompleted = allLessons.length > 0 && allLessons.every(l => completedIds.includes(l.id) || l.id === currentLessonId);

  const handleVideoComplete = useCallback(async () => {
    if (isCompleted || completing) return;
    setCompleting(true);
    const result = await completeLesson(currentLessonId, courseId);
    setCompleting(false);
    if (result.success) {
      setIsCompleted(true);
      if (result.completed) {
        toast.success("🎉 Selamat! Kursus selesai!");
      } else {
        toast.success("Video tersimak! Pelajaran selesai");
      }
      router.refresh();
    }
  }, [currentLessonId, courseId, isCompleted, completing, router]);

  const handleToggleComplete = async () => {
    setCompleting(true);
    let result;
    if (isCompleted) {
      result = await uncompleteLesson(currentLessonId, courseId);
    } else {
      result = await completeLesson(currentLessonId, courseId);
    }
    setCompleting(false);
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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-white/10 bg-pri-carbon/80">
        <div className="flex items-center gap-3">
          <Link
            href={`/academy/courses/${course.slug}`}
            className="text-pri-silver hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-white truncate max-w-[300px]">
              {course.title}
            </p>
            <p className="text-[10px] text-pri-silver/40 font-mono">
              {lesson.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pri-red to-red-400 rounded-full transition-all"
                style={{ width: `${enrollmentProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-pri-silver/40 font-mono">
              {enrollmentProgress}%
            </span>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          {/* LOCK OVERLAY — sequential learning */}
          {isLocked && !isCompleted && (
            <div className="glass-card border-white/10 rounded-xl p-8 mb-8 text-center">
              <div className="h-16 w-16 rounded-full bg-pri-silver/5 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-pri-silver/30" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Materi Terkunci</h2>
              <p className="text-sm text-pri-silver/50 max-w-md mx-auto mb-6">
                Selesaikan materi sebelumnya terlebih dahulu untuk membuka materi ini.
              </p>
              {prevLesson && (
                <Link href={`/academy/learn/${courseId}/${prevLesson.id}`}>
                  <Button className="bg-pri-red hover:bg-red-700 text-white text-xs">
                    <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Kembali ke materi sebelumnya
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* COMPLETION SCREEN — all lessons done */}
          {allLessons.length > 0 && allLessons.every(l => completedIds.includes(l.id)) && (
            <div className="glass-card border-green-500/20 rounded-xl p-8 mb-8 text-center bg-gradient-to-b from-green-500/5 to-transparent">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Kursus Selesai! 🎉</h2>
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="text-sm text-pri-silver/60 max-w-md mx-auto mb-2">
                Selamat! Anda telah menyelesaikan semua materi dalam kursus ini.
              </p>
              <p className="text-xs text-green-400/60 mb-6">
                {allLessons.length} pelajaran selesai &middot; {enrollmentProgress}% progress
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <GraduationCap className="h-4 w-4 text-pri-red mx-auto mb-1" />
                  <p className="text-lg font-bold text-white font-mono">{allLessons.length}</p>
                  <p className="text-[9px] text-pri-silver/30">Pelajaran</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <Medal className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white font-mono">100%</p>
                  <p className="text-[9px] text-pri-silver/30">Selesai</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <CheckCircle className="h-4 w-4 text-green-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white font-mono">✓</p>
                  <p className="text-[9px] text-pri-silver/30">Sertifikat</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Link href={`/academy/courses/${course.slug}`}>
                  <Button variant="outline" className="border-white/10 text-pri-silver hover:text-white text-xs">
                    <BookOpen className="h-3.5 w-3.5 mr-1" /> Lihat Detail Kursus
                  </Button>
                </Link>
                <Link href="/academy/courses">
                  <Button className="bg-pri-red hover:bg-red-700 text-white text-xs">
                    <GraduationCap className="h-3.5 w-3.5 mr-1" /> Kursus Lainnya
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Video — only show if not locked */}
          {!isLocked && lesson.video_url && (
            <VideoTracker
              videoUrl={lesson.video_url}
              lessonId={currentLessonId}
              courseId={courseId}
              isCompleted={isCompleted}
              onComplete={handleVideoComplete}
            />
          )}

          {/* Title & Status */}
          {!isLocked && (
            <>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {lesson.title}
                  </h1>
                  {lesson.description && (
                    <p className="text-sm text-pri-silver/60">{lesson.description}</p>
                  )}
                </div>
                {isCompleted && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 shrink-0">
                    <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-[10px] text-green-400 font-medium">Selesai</span>
                  </div>
                )}
              </div>

              {/* Content */}
              {lesson.content && (
                <div className="prose prose-invert prose-sm max-w-none mb-8">
                  <div className="text-sm text-pri-silver/80 leading-relaxed whitespace-pre-wrap">
                    {lesson.content}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
            <Button
              onClick={handleToggleComplete}
              disabled={completing || isLocked}
              variant={isCompleted ? "outline" : "default"}
              className={
                isCompleted
                  ? "border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs"
                  : "bg-pri-red hover:bg-red-700 text-white text-xs"
              }
            >
              {completing ? (
                <span className="animate-pulse">Memproses...</span>
              ) : isCompleted ? (
                "Tandai Belum Selesai"
              ) : (
                "Tandai Selesai"
              )}
            </Button>

            <div className="flex items-center gap-2">
              {prevLesson && (
                <Link href={`/academy/learn/${courseId}/${prevLesson.id}`}>
                  <Button variant="outline" size="sm" className="border-white/10 text-pri-silver hover:text-white text-xs">
                    <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Sebelumnya
                  </Button>
                </Link>
              )}
              {nextLesson && (
                <Link
                  href={
                    isCompleted || completedIds.includes(currentLessonId)
                      ? `/academy/learn/${courseId}/${nextLesson.id}`
                      : "#"
                  }
                >
                  <Button
                    size="sm"
                    className={
                      isCompleted || completedIds.includes(currentLessonId)
                        ? "bg-pri-red hover:bg-red-700 text-white text-xs"
                        : "bg-pri-silver/20 text-pri-silver/40 cursor-not-allowed text-xs"
                    }
                    disabled={!isCompleted && !completedIds.includes(currentLessonId)}
                  >
                    Selanjutnya <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
