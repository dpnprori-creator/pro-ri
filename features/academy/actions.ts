"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/types/database";

type CourseInsert = Database["public"]["Tables"]["courses"]["Insert"];
type CourseUpdate = Database["public"]["Tables"]["courses"]["Update"];

// ============================================
// COURSES - Read
// ============================================

export async function getPublishedCourses() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
  return data;
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createServerClient();
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !course) return null;

  // Get modules with lessons
  const { data: modules } = await supabase
    .from("course_modules")
    .select(`
      *,
      course_lessons (*)
    `)
    .eq("course_id", course.id)
    .order("sort_order", { ascending: true });

  return { ...course, modules: modules || [] };
}

export async function getMyEnrollments(memberId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("course_enrollments")
    .select(`
      *,
      courses (*)
    `)
    .eq("member_id", memberId);

  if (error) return [];
  return data;
}

export async function getMyEnrollment(courseId: string, memberId: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("member_id", memberId)
    .maybeSingle();

  return data;
}

export async function getLessonCompletions(lessonIds: string[], memberId: string) {
  if (!lessonIds.length) return [];
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("lesson_completions")
    .select("lesson_id")
    .in("lesson_id", lessonIds)
    .eq("member_id", memberId);

  return data?.map(d => d.lesson_id) || [];
}

// ============================================
// COURSES - Enrollment
// ============================================

export async function enrollInCourse(courseId: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Silakan login terlebih dahulu" };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return { error: "Data anggota tidak ditemukan" };

  // Check if already enrolled
  const existing = await getMyEnrollment(courseId, member.id);
  if (existing) return { error: "Anda sudah terdaftar di kursus ini" };

  const { error } = await supabase
    .from("course_enrollments")
    .insert({
      course_id: courseId,
      member_id: member.id,
      status: "active",
      progress_percent: 0,
    });

  if (error) return { error: error.message };

  revalidatePath("/academy/courses");
  return { success: true };
}

// ============================================
// PROGRESS - Lesson Completion
// ============================================

export async function completeLesson(lessonId: string, courseId: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Silakan login terlebih dahulu" };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return { error: "Data anggota tidak ditemukan" };

  // Mark lesson as completed
  const { error: completeError } = await supabase
    .from("lesson_completions")
    .upsert({
      lesson_id: lessonId,
      member_id: member.id,
    }, { onConflict: "lesson_id, member_id" });

  if (completeError) return { error: completeError.message };

  // Progress recalculation is handled by SQL trigger: trg_lesson_completion_progress
  // Just fetch the updated enrollment to return progress
  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("progress_percent, status")
    .eq("course_id", courseId)
    .eq("member_id", member.id)
    .single();

  const progress = enrollment?.progress_percent ?? 0;
  const isCompleted = enrollment?.status === "completed";

  revalidatePath(`/academy/learn/${courseId}/${lessonId}`);
  return { success: true, progress, completed: isCompleted };
}

export async function uncompleteLesson(lessonId: string, courseId: string) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Silakan login terlebih dahulu" };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return { error: "Data anggota tidak ditemukan" };

  await supabase
    .from("lesson_completions")
    .delete()
    .eq("lesson_id", lessonId)
    .eq("member_id", member.id);

  // Progress recalculation is handled by SQL trigger: trg_lesson_completion_progress
  // Just fetch the updated enrollment to return progress
  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("progress_percent")
    .eq("course_id", courseId)
    .eq("member_id", member.id)
    .single();

  const progress = enrollment?.progress_percent ?? 0;

  revalidatePath(`/academy/learn/${courseId}/${lessonId}`);
  return { success: true, progress };
}

// ============================================
// COURSES - Admin/Trainer Read
// ============================================

export async function getAllCourses() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("courses")
    .select("*, created_by!inner(full_name)")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getMyCourses() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return [];

  const { data } = await supabase
    .from("courses")
    .select("*, created_by!inner(full_name)")
    .eq("created_by", member.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getCourseWithModules(courseId: string) {
  const supabase = await createServerClient();
  
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) return null;

  const { data: modules } = await supabase
    .from("course_modules")
    .select(`
      *,
      course_lessons (*)
    `)
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  return { ...course, modules: modules || [] };
}

export async function getCourseStats(courseId: string) {
  const supabase = await createServerClient();

  const { count: totalEnrollments } = await supabase
    .from("course_enrollments")
    .select("*", { count: "exact", head: true })
    .eq("course_id", courseId);

  const { count: completedEnrollments } = await supabase
    .from("course_enrollments")
    .select("*", { count: "exact", head: true })
    .eq("course_id", courseId)
    .eq("status", "completed");

  return {
    totalEnrollments: totalEnrollments ?? 0,
    completedEnrollments: completedEnrollments ?? 0,
  };
}

export async function isCurrentUserTrainer() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: member } = await supabase
    .from("members")
    .select("id, role_id(name)")
    .eq("auth_id", user.id)
    .single();

  if (!member) return false;
  const roleObj = member.role_id as { name: string } | null;
  
  // Check if admin or super_admin
  if (roleObj?.name === "admin" || roleObj?.name === "super_admin") return true;

  // Check if has trainer/mentor designation
  const { data: designations } = await supabase
    .from("member_designations")
    .select("designation")
    .eq("member_id", member.id)
    .in("designation", ["trainer", "mentor"]);

  return (designations?.length ?? 0) > 0;
}

// ============================================
// COURSES - Admin/Trainer CRUD
// ============================================

export async function createCourse(formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const adminSupabase = createAdminClient();

  const { data: member } = await adminSupabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!member) return { error: "Member not found" };

  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const level = formData.get("level") as string;
  const learningPath = formData.get("learningPath") as string;

  const insertData: CourseInsert = {
    title,
    slug,
    description,
    category: category || "programming",
    level: level || "beginner",
    learning_path: learningPath || null,
    created_by: member.id,
    status: "draft",
  };

  const { data, error } = await adminSupabase
    .from("courses")
    .insert(insertData)
    .select()
    .single();

  if (error) return { error: error.message };

  // Handle image upload after course is created (so we have course ID for path)
  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0 && imageFile.name) {
    try {
      const ext = imageFile.name.split(".").pop() || "jpg";
      const path = `courses/${data.id}/${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadError } = await adminSupabase.storage
        .from("academy")
        .upload(path, imageFile, {
          cacheControl: "3600",
          upsert: true,
        });
      if (!uploadError && uploadData) {
        const { data: urlData } = adminSupabase.storage
          .from("academy")
          .getPublicUrl(uploadData.path);
        await adminSupabase.from("courses").update({ image_url: urlData.publicUrl }).eq("id", data.id);
      }
    } catch (err) {
      console.error("Course image upload error on create:", err);
    }
  }

  revalidatePath("/academy/courses");
  revalidatePath("/admin/academy");
  return { success: true, course: data };
}

export async function updateCourse(id: string, formData: FormData) {
  const supabase = await createServerClient();
  const adminSupabase = createAdminClient();

  // Handle image upload
  let imageUrl = formData.get("image_url") as string || null;
  const imageFile = formData.get("image") as File | null;

  if (!imageUrl && imageFile && imageFile.size > 0 && imageFile.name) {
    try {
      const ext = imageFile.name.split(".").pop() || "jpg";
      const path = `courses/${id}/${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadError } = await adminSupabase.storage
        .from("academy")
        .upload(path, imageFile, {
          cacheControl: "3600",
          upsert: true,
        });
      if (!uploadError && uploadData) {
        const { data: urlData } = adminSupabase.storage
          .from("academy")
          .getPublicUrl(uploadData.path);
        imageUrl = urlData.publicUrl;
      }
    } catch (err) {
      console.error("Course image upload error:", err);
      return { error: "Gagal mengupload gambar: " + (err instanceof Error ? err.message : "Unknown error") };
    }
  }

  const updateData: CourseUpdate = {
    title: formData.get("title") as string,
    short_description: formData.get("short_description") as string || null,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    level: formData.get("level") as string,
    status: formData.get("status") as string,
    learning_path: formData.get("learningPath") as string || null,
    image_url: imageUrl,
    duration_hours: parseInt(formData.get("duration_hours") as string) || 0,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  };

  const { error } = await supabase
    .from("courses")
    .update(updateData)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/academy/courses");
  revalidatePath("/admin/academy");
  revalidatePath(`/admin/academy/${id}`);
  return { success: true };
}

export async function deleteCourse(id: string) {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/academy/courses");
  revalidatePath("/admin/academy");
  return { success: true };
}

// ============================================
// MODULES & LESSONS - Admin/Trainer CRUD
// ============================================

export async function updateModule(formData: FormData) {
  const supabase = await createServerClient();
  const moduleId = formData.get("moduleId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string || null;

  const { data, error } = await supabase
    .from("course_modules")
    .update({ title, description })
    .eq("id", moduleId)
    .select()
    .single();

  if (error) return { error: error.message };

  return { success: true, module: data };
}

export async function deleteModule(moduleId: string, courseId: string) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("course_modules")
    .delete()
    .eq("id", moduleId);

  if (error) return { error: error.message };

  revalidatePath(`/admin/academy/${courseId}`);
  revalidatePath(`/academy/trainer/${courseId}`);
  return { success: true };
}

export async function updateLesson(formData: FormData) {
  const supabase = await createServerClient();
  const lessonId = formData.get("lessonId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const description = formData.get("description") as string;
  const durationMinutes = parseInt(formData.get("durationMinutes") as string) || 0;
  const isFree = formData.get("isFree") === "true";

  const { data, error } = await supabase
    .from("course_lessons")
    .update({
      title,
      content,
      video_url: videoUrl,
      description,
      duration_minutes: durationMinutes,
      is_free: isFree,
    })
    .eq("id", lessonId)
    .select()
    .single();

  if (error) return { error: error.message };

  return { success: true, lesson: data };
}

export async function deleteLesson(lessonId: string, courseId: string) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("course_lessons")
    .delete()
    .eq("id", lessonId);

  if (error) return { error: error.message };

  revalidatePath(`/admin/academy/${courseId}`);
  revalidatePath(`/academy/trainer/${courseId}`);
  return { success: true };
}

// Original createModule and createLesson remain below

export async function createModule(formData: FormData) {
  const adminSupabase = createAdminClient();
  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;

  const { data, error } = await adminSupabase
    .from("course_modules")
    .insert({ course_id: courseId, title })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/admin/academy/courses/${courseId}`);
  return { success: true, module: data };
}

export async function createLesson(formData: FormData) {
  const adminSupabase = createAdminClient();
  const moduleId = formData.get("moduleId") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const isFree = formData.get("isFree") === "true";

  const { data, error } = await adminSupabase
    .from("course_lessons")
    .insert({ module_id: moduleId, title, content, video_url: videoUrl, is_free: isFree })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/academy");
  return { success: true, lesson: data };
}
