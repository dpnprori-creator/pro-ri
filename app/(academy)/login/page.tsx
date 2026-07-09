"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, GraduationCap, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { login } from "@/features/auth/actions";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function AcademyLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/academy/courses");
      }
      setChecking(false);
    };
    checkSession();
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Berhasil masuk!");
      router.push("/academy/courses");
    }
  }

  if (checking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-pri-red/10 animate-pulse flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-pri-red" />
          </div>
          <p className="text-sm text-pri-silver">Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Tech background */}
      <div className="fixed inset-0 grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="fixed inset-0 circuit-pattern opacity-[0.03] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Academy */}
        <Link
          href="/academy"
          className="inline-flex items-center gap-1.5 text-xs text-pri-silver hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Academy
        </Link>

        <Card className="border-white/10">
          <CardHeader className="text-center">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-pri-red to-red-700 mx-auto mb-4 flex items-center justify-center shadow-lg shadow-pri-red/20">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-xl text-white">
              Masuk ke <span className="text-pri-red">Academy</span>
            </CardTitle>
            <CardDescription>
              Gunakan akun PRO RI yang sudah terdaftar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  autoComplete="email"
                  className="bg-pri-carbon/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="bg-pri-carbon/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-pri-silver hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-pri-red hover:bg-red-700" disabled={loading}>
                {loading ? "Memproses..." : "Masuk ke Academy"}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <p className="text-center text-sm text-pri-silver">
                Belum punya akun?{" "}
                <Link href="/register" className="text-pri-red hover:underline font-medium">
                  Daftar Anggota PRO RI
                </Link>
              </p>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-pri-dark px-2 text-pri-silver/50">atau</span>
                </div>
              </div>
              <Link href="/login">
                <Button variant="outline" className="w-full border-white/10 text-pri-silver hover:text-white">
                  <LogIn className="h-4 w-4 mr-2" />
                  Masuk ke Portal PRO RI
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
