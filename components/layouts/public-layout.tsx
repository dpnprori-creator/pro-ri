import { PublicNavbar } from "@/components/widgets/navbar/public-navbar";
import { PublicFooter } from "@/components/widgets/footer/public-footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-pri-carbon circuit-pattern">
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
