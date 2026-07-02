import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";

interface Breadcrumb {
  label: string;
  href: string;
}

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  title: string;
  description: string;
  icon?: React.ReactNode;
  color?: string;
}

export function SuperAdminLayout({
  children,
  breadcrumbs,
  title,
  description,
  icon,
  color = "bg-purple-500/20",
}: SuperAdminLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Super Admin Top Nav */}
      <div className="glass rounded-xl border border-white/10 p-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/super-admin"
            className="flex items-center gap-2 text-sm text-pri-silver hover:text-white transition-colors"
          >
            <Shield className="h-4 w-4 text-purple-400" />
            <span className="hidden sm:inline">Super Admin</span>
          </Link>

          {breadcrumbs && breadcrumbs.length > 0 && (
            <>
              {breadcrumbs.map((crumb, i) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-pri-silver/50" />
                  <Link
                    href={crumb.href}
                    className="text-sm text-pri-silver hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                </div>
              ))}
            </>
          )}

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs text-pri-silver hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
            >
              Admin Panel
            </Link>
            <Link
              href="/dashboard"
              className="text-xs text-pri-silver hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}
        >
          {icon || <Shield className="h-6 w-6 text-purple-400" />}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-pri-silver mt-0.5">{description}</p>
        </div>
      </div>

      {children}
    </div>
  );
}
