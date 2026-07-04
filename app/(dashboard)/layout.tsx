import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

export default async function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Proteksi role: admin/super_admin tidak boleh akses halaman member
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: member } = await supabase
      .from("members")
      .select("role_id(name)")
      .eq("auth_id", user.id)
      .maybeSingle();

    const roleObj = member?.role_id as { name: string } | null | undefined;
    const roleName = roleObj?.name;

    if (roleName === "admin" || roleName === "super_admin") {
      redirect("/admin");
    }
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
