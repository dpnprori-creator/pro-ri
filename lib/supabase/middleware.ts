import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

// Admin client untuk maintenance mode check (bypass RLS)
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

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

  const pathname = request.nextUrl.pathname;

  // Path definitions
  const protectedPaths = [
    "/dashboard", "/membership", "/profile", "/academy", "/members",
  ];
  const authPaths = ["/login", "/register"];
  const adminPaths = ["/admin"];
  const publicPaths = ["/_next", "/images", "/favicon", "/maintenance"];

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));
  const isAdmin = adminPaths.some((p) => pathname.startsWith(p));
  const isPublicAsset = publicPaths.some((p) => pathname.startsWith(p));

  // ============= MAINTENANCE MODE CHECK =============
  if (!isPublicAsset && !isAdmin && !isProtected) {
    try {
      const { data: maintenanceSetting } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", "maintenance")
        .single();

      if (maintenanceSetting) {
        const maintenance = maintenanceSetting.value as {
          enabled?: boolean;
          message?: string;
          allowed_roles?: string[];
        };
        if (maintenance.enabled === true) {
          const allowedRoles = maintenance.allowed_roles || ["super_admin", "admin"];

          let isAllowed = false;
          if (user) {
            try {
              const { data: member } = await adminSupabase
                .from("members")
                .select("role_id(name)")
                .eq("auth_id", user.id)
                .maybeSingle();
              const roleObj = member?.role_id as { name: string } | null | undefined;
              const roleName = roleObj?.name;
              if (roleName && allowedRoles.includes(roleName)) {
                isAllowed = true;
              }
            } catch {}
          }

          if (!isAllowed) {
            const url = request.nextUrl.clone();
            url.pathname = "/maintenance";
            return NextResponse.redirect(url);
          }
        }
      }
    } catch {}
  }

  // ============= AUTH PROTECTION =============
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
