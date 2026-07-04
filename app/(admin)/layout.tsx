import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/layouts/admin-layout";

export default async function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side role check: hanya admin & super_admin yang bisa akses /admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member } = await supabase
    .from("members")
    .select("role_id(name)")
    .eq("auth_id", user.id)
    .maybeSingle();

  const roleObj = member?.role_id as { name: string } | null | undefined;
  const roleName = roleObj?.name;

  if (roleName !== "admin" && roleName !== "super_admin") {
    redirect("/dashboard");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
