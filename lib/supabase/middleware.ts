import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Route protection config
  const protectedPaths = [
    "/dashboard",
    "/membership",
    "/profile",
    "/academy",
    "/members",
  ];
  const adminPaths = ["/admin"];
  const superAdminPaths = [
    "/admin/settings",
    "/admin/roles",
    "/admin/admins",
    "/admin/activity",
  ];
  const authPaths = ["/login", "/register"];
  const publicPaths = ["/_next", "/images", "/favicon", "/maintenance"];
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAdmin = adminPaths.some((p) => pathname.startsWith(p));
  const isSuperAdmin = superAdminPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));
  const isPublicAsset = publicPaths.some((p) => pathname.startsWith(p));

  // Skip maintenance check for static assets
  if (!isPublicAsset && !isAdmin && !isProtected) {
    // Check maintenance mode from system_settings
    try {
      const { data: maintenanceSetting } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "maintenance")
        .single();

      if (maintenanceSetting) {
        const maintenance = maintenanceSetting.value as { enabled?: boolean; message?: string; allowed_roles?: string[] };
        if (maintenance.enabled === true) {
          const allowedRoles = maintenance.allowed_roles || ["super_admin", "admin"];
          
          // Check if user has an allowed role
          let isAllowed = false;
          if (user) {
            const { data: member } = await supabase
              .from("members")
              .select("role_id!inner(name)")
              .eq("auth_id", user.id)
              .single();
            const roleData = member?.role_id as { name: string } | undefined;
            const roleName = roleData?.name;
            if (roleName && allowedRoles.includes(roleName)) {
              isAllowed = true;
            }
          }

          if (!isAllowed) {
            const url = request.nextUrl.clone();
            url.pathname = "/maintenance";
            return NextResponse.redirect(url);
          }
        }
      }
    } catch {
      // If system_settings table doesn't exist, skip maintenance check
    }
  }

  // Redirect to login if accessing protected route without auth
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    // Redirect admin/super_admin from /dashboard to /admin
    if (pathname.startsWith("/dashboard")) {
      const { data: member } = await supabase
        .from("members")
        .select("role_id!inner(name)")
        .eq("auth_id", user.id)
        .single();

      const roleData = member?.role_id as { name: string } | undefined;
      const roleName = roleData?.name;

      if (roleName === "admin" || roleName === "super_admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
    }

    // Redirect to dashboard if already logged in and on auth page
    if (isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Check admin role for /admin routes
  if (user && (isAdmin || isSuperAdmin)) {
    const { data: member } = await supabase
      .from("members")
      .select("role_id!inner(name)")
      .eq("auth_id", user.id)
      .single();

    const roleData = member?.role_id as { name: string } | undefined;
    const roleName = roleData?.name;

    if (isSuperAdmin && roleName !== "super_admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    if (roleName !== "admin" && roleName !== "super_admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
