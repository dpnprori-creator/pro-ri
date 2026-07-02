"use client";

import { User, Shield, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminSettings({ user }: { user: { id: string; email?: string } | null }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5 text-pri-red" />
            Admin Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-pri-silver">User ID</span>
            <span className="text-white font-mono">{user?.id || "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-pri-silver">Email</span>
            <span className="text-white">{user?.email || "-"}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-pri-red" />
            Role Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-pri-silver">
            Anda memiliki akses Super Admin. Anda dapat mengelola semua aspek sistem.
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-pri-red" />
            Pengaturan Sistem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-pri-silver">
            Pengaturan sistem akan dikembangkan lebih lanjut.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
