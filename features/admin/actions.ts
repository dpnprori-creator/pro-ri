"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadToSupabaseStorage } from "./storage";

// ============================================
// MEMBERS
// ============================================

export async function getMembers() {
  const supabase = await createServerClient();
  // Pakai regular join (tanpa !inner) agar member tanpa role_id/province_id tetap muncul
  const { data } = await supabase
    .from("members")
    .select("*, role_id(name), province_id(name)")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getMemberById(id: string) {
  const supabase = await createServerClient();
  // Regular join agar member tanpa regency_id/province_id tetap muncul
  const { data } = await supabase
    .from("members")
    .select("*, role_id(name), province_id(name), regency_id(name)")
    .eq("id", id)
    .single();

  return data;
}

export async function createMember(formData: FormData) {
  const adminClient = createAdminClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  // Create auth user
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (authError) return { error: authError.message };

  // Create member profile
  const { error: memberError } = await adminClient.from("members").insert({
    auth_id: authData.user.id,
    email,
    full_name: fullName,
    member_id: `PRORI-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, "0")}`,
    phone: formData.get("phone") as string || null,
    province_id: formData.get("province_id") as string || null,
    regency_id: formData.get("regency_id") as string || null,
    district_id: formData.get("district_id") as string || null,
    village_id: formData.get("village_id") as string || null,
    occupation: formData.get("occupation") as string || null,
    role_id: formData.get("role_id") as string || null,
    status: "active",
  });

  if (memberError) return { error: memberError.message };

  revalidatePath("/admin/members");
  return { success: true };
}

export async function updateMember(id: string, formData: FormData) {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("members")
    .update({
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string || null,
      province_id: formData.get("province_id") as string || null,
      regency_id: formData.get("regency_id") as string || null,
      district_id: formData.get("district_id") as string || null,
      village_id: formData.get("village_id") as string || null,
      occupation: formData.get("occupation") as string || null,
      role_id: formData.get("role_id") as string || null,
      status: formData.get("status") as string || "active",
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/members");
  return { success: true };
}

export async function deleteMember(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/members");
  return { success: true };
}

// ============================================
// EVENTS
// ============================================

export async function getAdminEvents() {
  const supabase = await createServerClient();
  // Regular join agar event tanpa province_id tetap muncul
  const { data } = await supabase
    .from("events")
    .select("*, province_id(name)")
    .order("start_date", { ascending: false });

  return data ?? [];
}

export async function createEvent(formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  const { error } = await supabase.from("events").insert({
    title: formData.get("title") as string,
    slug: (formData.get("title") as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    description: formData.get("description") as string || null,
    category: formData.get("category") as string,
    type: formData.get("type") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    location: formData.get("location") as string || null,
    max_participants: parseInt(formData.get("max_participants") as string) || null,
    province_id: formData.get("province_id") as string || null,
    status: formData.get("status") as string || "draft",
    created_by: member?.id,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  return { success: true };
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("events")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string || null,
      category: formData.get("category") as string,
      type: formData.get("type") as string,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      location: formData.get("location") as string || null,
      max_participants: parseInt(formData.get("max_participants") as string) || null,
      status: formData.get("status") as string,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  return { success: true };
}

export async function deleteEvent(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  return { success: true };
}

// ============================================
// INNOVATIONS
// ============================================

export async function getAdminInnovations() {
  const supabase = await createServerClient();
  // Regular join agar inovasi tanpa creator_id/province_id tetap muncul
  const { data } = await supabase
    .from("innovations")
    .select("*, province_id(name), creator_id(full_name)")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function createInnovation(formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  const { error } = await supabase.from("innovations").insert({
    title: formData.get("title") as string,
    slug: (formData.get("title") as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    description: formData.get("description") as string || null,
    category: formData.get("category") as string,
    year: parseInt(formData.get("year") as string) || new Date().getFullYear(),
    province_id: formData.get("province_id") as string || null,
    status: formData.get("status") as string || "draft",
    creator_id: member?.id,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/innovations");
  return { success: true };
}

export async function updateInnovation(id: string, formData: FormData) {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("innovations")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string || null,
      category: formData.get("category") as string,
      year: parseInt(formData.get("year") as string) || null,
      status: formData.get("status") as string,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/innovations");
  return { success: true };
}

export async function deleteInnovation(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("innovations").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/innovations");
  return { success: true };
}

// ============================================
// CERTIFICATES
// ============================================

export async function getCertificates() {
  const supabase = await createServerClient();
  // Regular join agar certificate tanpa event_id tetap muncul
  const { data } = await supabase
    .from("certificates")
    .select("*, member_id!inner(full_name, member_id), event_id(title)")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function createCertificate(formData: FormData) {
  const supabase = await createServerClient();

  const { error } = await supabase.from("certificates").insert({
    certificate_number: formData.get("certificate_number") as string,
    member_id: formData.get("member_id") as string,
    event_id: formData.get("event_id") as string || null,
    type: formData.get("type") as string,
    title: formData.get("title") as string,
    verified: true,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/certificates");
  return { success: true };
}

export async function deleteCertificate(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("certificates").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/certificates");
  return { success: true };
}

// ============================================
// CONTACT MESSAGES
// ============================================

export async function createHeroGalleryItem(formData: FormData) {
  const supabase = await createServerClient();
  
  // Handle image upload or URL
  let imageUrl = formData.get("image_url") as string || formData.get("imageUrl") as string;
  const imageFile = formData.get("image") as File | null;
  
  if (!imageUrl && imageFile && imageFile.size > 0 && imageFile.name) {
    try {
      const ext = imageFile.name.split(".").pop() || "jpg";
      const path = `hero/${Date.now()}.${ext}`;
      imageUrl = await uploadToSupabaseStorage("hero-gallery", path, imageFile);
    } catch (err) {
      console.error("Image upload error:", err);
    }
  }

  if (!imageUrl) return { error: "Gambar hero wajib diisi. Upload gambar atau masukkan URL gambar." };

  const { error } = await supabase.from("hero_gallery").insert({
    title: formData.get("title") as string,
    description: formData.get("description") as string || null,
    image_url: imageUrl,
    link_url: formData.get("link_url") as string || formData.get("linkUrl") as string || null,
    link_label: formData.get("link_label") as string || formData.get("linkLabel") as string || "Selengkapnya",
    sort_order: parseInt(formData.get("sort_order") as string || formData.get("sortOrder") as string) || 0,
    is_active: formData.get("is_active") === "true" || formData.get("isActive") === "true",
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function updateHeroGalleryItem(id: string, formData: FormData) {
  const supabase = await createServerClient();
  
  // Handle image upload or URL
  let imageUrl = formData.get("image_url") as string || formData.get("imageUrl") as string;
  const imageFile = formData.get("image") as File | null;
  
  if (!imageUrl && imageFile && imageFile.size > 0 && imageFile.name) {
    try {
      const ext = imageFile.name.split(".").pop() || "jpg";
      const path = `hero/${Date.now()}.${ext}`;
      imageUrl = await uploadToSupabaseStorage("hero-gallery", path, imageFile);
    } catch (err) {
      console.error("Image upload error:", err);
    }
  }
  
  // Build update payload — ONLY include image_url if a new image was provided!
  const updates: Record<string, string | number | boolean | null | undefined> = {
    title: formData.get("title") as string,
    description: formData.get("description") as string || null,
    link_url: formData.get("link_url") as string || formData.get("linkUrl") as string || null,
    link_label: formData.get("link_label") as string || formData.get("linkLabel") as string || undefined,
    sort_order: parseInt(formData.get("sort_order") as string || formData.get("sortOrder") as string) || 0,
    is_active: formData.get("is_active") === "true" || formData.get("isActive") === "true",
  };
  
  // Only set image_url if a new image file or URL was provided
  if (imageUrl) {
    updates.image_url = imageUrl;
  }
  
  const { error } = await (supabase as any).from("hero_gallery").update(updates).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function createActivityGalleryItem(formData: FormData) {
  const supabase = await createServerClient();
  
  // Handle image upload
  let imageUrl = formData.get("image_url") as string || formData.get("imageUrl") as string;
  const imageFile = formData.get("image") as File | null;
  
  if (!imageUrl && imageFile && imageFile.size > 0 && imageFile.name) {
    try {
      const ext = imageFile.name.split(".").pop() || "jpg";
      const path = `activity/${Date.now()}.${ext}`;
      imageUrl = await uploadToSupabaseStorage("activity-gallery", path, imageFile);
    } catch (err) {
      console.error("Image upload error:", err);
    }
  }

  const { error } = await supabase.from("activity_gallery").insert({
    title: formData.get("title") as string,
    description: formData.get("description") as string || null,
    image_url: imageUrl,
    category: formData.get("category") as string || "general",
    sort_order: parseInt(formData.get("sort_order") as string || formData.get("sortOrder") as string) || 0,
    date_taken: formData.get("date_taken") as string || formData.get("dateTaken") as string || null,
    is_active: formData.get("is_active") === "true" || formData.get("isActive") === "true",
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/gallery-kegiatan");
  return { success: true };
}

export async function updateActivityGalleryItem(id: string, formData: FormData) {
  const supabase = await createServerClient();
  
  // Handle image upload
  let imageUrl = formData.get("image_url") as string || formData.get("imageUrl") as string;
  const imageFile = formData.get("image") as File | null;
  
  if (!imageUrl && imageFile && imageFile.size > 0 && imageFile.name) {
    try {
      const ext = imageFile.name.split(".").pop() || "jpg";
      const path = `activity/${Date.now()}.${ext}`;
      imageUrl = await uploadToSupabaseStorage("activity-gallery", path, imageFile);
    } catch (err) {
      console.error("Image upload error:", err);
    }
  }

  // Build update payload — ONLY include image_url if a new image was provided!
  const updates: Record<string, string | number | boolean | null | undefined> = {
    title: formData.get("title") as string,
    description: formData.get("description") as string || null,
    category: formData.get("category") as string,
    sort_order: parseInt(formData.get("sort_order") as string || formData.get("sortOrder") as string) || 0,
    date_taken: formData.get("date_taken") as string || formData.get("dateTaken") as string || null,
    is_active: formData.get("is_active") === "true" || formData.get("isActive") === "true",
  };
  
  // Only set image_url if a new image file or URL was provided
  if (imageUrl) {
    updates.image_url = imageUrl;
  }

  const { error } = await (supabase as any).from("activity_gallery").update(updates).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/gallery-kegiatan");
  return { success: true };
}

export async function deleteActivityGalleryItem(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("activity_gallery").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/gallery-kegiatan");
  return { success: true };
}

export async function deleteHeroGalleryItem(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("hero_gallery").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function setMemberDesignation(memberId: string, designation: string, active: boolean = true) {
  const supabase = await createServerClient();
  
  if (active) {
    const { error } = await supabase.from("member_designations").insert({
      member_id: memberId,
      designation,
    });
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("member_designations")
      .delete()
      .eq("member_id", memberId)
      .eq("designation", designation);
    if (error) return { error: error.message };
  }
  
  revalidatePath(`/admin/members/${memberId}`);
  return { success: true };
}

export async function updateMemberStatus(id: string, status: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("members").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/members");
  return { success: true };
}

export async function updateMemberRole(id: string, roleId: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("members").update({ role_id: roleId }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/members");
  return { success: true };
}

export async function searchMembers(query: string) {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("members")
    .select("id, full_name, email, member_id")
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,member_id.ilike.%${query}%`)
    .limit(20);
  return data ?? [];
}

export async function deleteContactMessage(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function getContactMessages() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function markMessageRead(id: string, isRead: boolean = true) {
  const supabase = await createServerClient();
  await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id);
}

// ============================================
// ACTIVITY LOGS
// ============================================

export async function getActivityLogs() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("activity_logs")
    .select("*, member_id(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return data ?? [];
}

export async function logActivity(
  action: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  await supabase.from("activity_logs").insert({
    member_id: member?.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
  });
}

// ============================================
// CONTACT MESSAGE (PUBLIC)
// ============================================

export async function createNews(formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: member } = await supabase
    .from("members")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  const { error } = await supabase.from("news").insert({
    title: formData.get("title") as string,
    slug: (formData.get("title") as string).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    content: formData.get("content") as string || null,
    excerpt: formData.get("excerpt") as string || null,
    category: (formData.get("category") as string) || "article",
    status: (formData.get("status") as string) || "draft",
    author_id: member?.id,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  return { success: true };
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("news").update({
    title: formData.get("title") as string,
    content: formData.get("content") as string || null,
    excerpt: formData.get("excerpt") as string || null,
    category: formData.get("category") as string,
    status: formData.get("status") as string,
  }).eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  return { success: true };
}

export async function deleteNews(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  return { success: true };
}

export async function updateCertificate(id: string, formData: FormData) {
  const supabase = await createServerClient();
  const { error } = await supabase.from("certificates").update({
    title: formData.get("title") as string,
    type: formData.get("type") as string,
    verified: formData.get("verified") === "true",
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/certificates");
  return { success: true };
}

export async function submitContactMessage(formData: FormData) {
  const supabase = await createServerClient();

  const { error } = await supabase.from("contact_messages").insert({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string || null,
    message: formData.get("message") as string,
  });

  if (error) return { error: "Gagal mengirim pesan" };
  return { success: "Pesan berhasil dikirim" };
}
