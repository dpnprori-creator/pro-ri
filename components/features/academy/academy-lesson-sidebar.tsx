"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronDown, CheckCircle, Play, Lock, Menu, X, GraduationCap } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  sort_order: number;
  duration_minutes: number;
  is_free: boolean;
}

interface Module {
  id: string;
  title: string;
  sort_order: number;
  course_lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

interface AcademyLessonSidebarProps {
  course: Course;
  modules: Module[];
  currentLessonId: string;
  completedIds: string[];
  enrollmentProgress: number;
}

export function AcademyLessonSidebar({
  course,
  modules,
  currentLessonId,
  completedIds,
  enrollmentProgress,
}: AcademyLessonSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState<string[]>(
    modules.map(m => m.id) // All expanded by default
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full bg-pri-red shadow-lg flex items-center justify-center text-white"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "w-72 lg:w-80 border-r border-white/10 bg-pri-carbon/50 overflow-y-auto shrink-0 transition-all duration-300",
        isOpen ? "block" : "hidden lg:block"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <Link href={`/academy/courses/${course.slug}`} className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-4 w-4 text-pri-red" />
            <span className="text-xs font-medium text-white truncate">{course.title}</span>
          </Link>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-pri-silver/40 font-mono">Progress</span>
            <span className="text-[10px] text-pri-silver/40 font-mono">{enrollmentProgress}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pri-red to-red-400 rounded-full transition-all duration-500"
              style={{ width: `${enrollmentProgress}%` }}
            />
          </div>
        </div>

        {/* Module list */}
        <div className="p-2 space-y-1">
          {modules.map((mod) => {
            const isExpanded = expandedModules.includes(mod.id);
            const lessonCount = mod.course_lessons?.length || 0;
            const completedInModule = mod.course_lessons?.filter(l => completedIds.includes(l.id)).length || 0;

            return (
              <div key={mod.id}>
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{mod.title}</p>
                    <p className="text-[9px] text-pri-silver/30 font-mono mt-0.5">
                      {completedInModule}/{lessonCount} pelajaran
                    </p>
                  </div>
                  <ChevronDown className={cn(
                    "h-3.5 w-3.5 text-pri-silver/30 transition-transform shrink-0",
                    isExpanded ? "rotate-0" : "-rotate-90"
                  )} />
                </button>

                {isExpanded && mod.course_lessons?.map((lesson) => {
                  const isCurrent = lesson.id === currentLessonId;
                  const isCompleted = completedIds.includes(lesson.id);

                  return (
                    <Link
                      key={lesson.id}
                      href={`/academy/learn/${course.id}/${lesson.id}`}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 ml-4 rounded-lg transition-colors",
                        isCurrent
                          ? "bg-pri-red/10 border-l-2 border-pri-red"
                          : "hover:bg-white/5 border-l-2 border-transparent"
                      )}
                    >
                      <div className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                        isCompleted ? "bg-green-500/20" :
                        isCurrent ? "bg-pri-red/20" : "bg-white/5"
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="h-3 w-3 text-green-400" />
                        ) : isCurrent ? (
                          <Play className="h-2.5 w-2.5 text-pri-red ml-0.5" />
                        ) : (
                          <Lock className="h-2.5 w-2.5 text-pri-silver/30" />
                        )}
                      </div>
                      <span className={cn(
                        "text-[11px] truncate flex-1",
                        isCompleted ? "text-green-400/60" :
                        isCurrent ? "text-pri-red font-medium" : "text-pri-silver/60"
                      )}>
                        {lesson.title}
                      </span>
                      {lesson.duration_minutes > 0 && (
                        <span className="text-[9px] text-pri-silver/20 font-mono shrink-0">
                          {lesson.duration_minutes}m
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
