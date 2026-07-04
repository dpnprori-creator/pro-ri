"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, Shield, Globe, Database,
  CheckCircle, XCircle, ToggleRight,
  Server, AlertTriangle, Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  updateSystemSetting,
  toggleFeature,
  toggleMaintenanceMode,
} from "@/features/admin/system-actions";

interface SystemSetting {
  id: number;
  key: string;
  value: Record<string, unknown>;
  label: string | null;
  description: string | null;
  category: string;
}

interface AdminSettingsProps {
  user: { id: string; email?: string } | null;
  settings: SystemSetting[];
}

export function AdminSettings({ user, settings }: AdminSettingsProps) {
  const router = useRouter();
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Find settings by key
  const siteInfo = settings.find(s => s.key === "site_info");
  const features = settings.find(s => s.key === "features");
  const maintenance = settings.find(s => s.key === "maintenance");
  const memberCardConfig = settings.find(s => s.key === "member_card_config");
  const registrationConfig = settings.find(s => s.key === "registration_config");

  const siteInfoValue = (siteInfo?.value || {}) as Record<string, string>;
  const featuresValue = (features?.value || {}) as Record<string, boolean>;
  const maintenanceValue = (maintenance?.value || {}) as Record<string, unknown>;
  const memberCardValue = (memberCardConfig?.value || {}) as Record<string, unknown>;
  const registrationValue = (registrationConfig?.value || {}) as Record<string, unknown>;

  const featureLabels: Record<string, string> = {
    public_registration: "Pendaftaran Publik",
    member_card: "Kartu Anggota",
    event_registration: "Pendaftaran Event",
    program_registration: "Pendaftaran Program",
    innovation_submission: "Pengajuan Inovasi",
    news_comments: "Komentar Berita",
  };

  const handleFeatureToggle = async (featureKey: string, enabled: boolean) => {
    const result = await toggleFeature(featureKey, enabled);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`${featureLabels[featureKey] || featureKey} ${enabled ? "diaktifkan" : "dinonaktifkan"}`);
      router.refresh();
    }
  };

  const handleMaintenanceToggle = async () => {
    const isEnabled = maintenanceValue.enabled === true;
    const result = await toggleMaintenanceMode(!isEnabled, maintenanceValue.message as string);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Maintenance mode ${result.enabled ? "diaktifkan" : "dinonaktifkan"}`);
      router.refresh();
    }
  };

  const handleSaveSiteInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingKey("site_info");
    const form = new FormData(e.currentTarget);
    const value = {
      name: form.get("site_name") as string,
      description: form.get("site_description") as string,
      logo_url: form.get("logo_url") as string,
      favicon_url: form.get("favicon_url") as string || "/favicon.ico",
    };
    const result = await updateSystemSetting("site_info", value);
    setSavingKey(null);
    if (result.error) toast.error(result.error);
    else { toast.success("Informasi situs disimpan"); router.refresh(); }
  };

  const handleSaveMaintenance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingKey("maintenance");
    const form = new FormData(e.currentTarget);
    const value = {
      enabled: maintenanceValue.enabled,
      message: form.get("maintenance_message") as string,
      allowed_roles: ["super_admin", "admin"],
    };
    const result = await updateSystemSetting("maintenance", value);
    setSavingKey(null);
    if (result.error) toast.error(result.error);
    else { toast.success("Pesan maintenance disimpan"); router.refresh(); }
  };

  return (
    <div className="space-y-6">
      {/* Admin Info */}
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
          <div className="flex justify-between">
            <span className="text-pri-silver">Role</span>
            <Badge variant="danger" className="text-[10px]">
              <Shield className="h-3 w-3 mr-1" />
              Super Admin
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Site Info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-pri-red" />
            Informasi Situs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveSiteInfo} className="space-y-4">              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Nama Website</Label>
                  <Input id="site_name" name="site_name" defaultValue={siteInfoValue.name || "PRO RI"} placeholder="PRO RI" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo_url">URL Logo</Label>
                  <Input id="logo_url" name="logo_url" defaultValue={siteInfoValue.logo_url || ""} placeholder="/images/logo.svg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon_url">URL Favicon</Label>
                  <Input id="favicon_url" name="favicon_url" defaultValue={(siteInfoValue.favicon_url as string) || "/favicon.ico"} placeholder="/favicon.ico" />
                </div>
              </div>
            <div className="space-y-2">
              <Label htmlFor="site_description">Deskripsi</Label>
              <textarea
                id="site_description"
                name="site_description"
                rows={2}
                defaultValue={siteInfoValue.description || ""}
                placeholder="Deskripsi singkat website..."
                className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
              />
            </div>
            <Button type="submit" className="bg-pri-red hover:bg-red-700" disabled={savingKey === "site_info"}>
              <Save className="h-4 w-4 mr-2" />
              {savingKey === "site_info" ? "Menyimpan..." : "Simpan Informasi Situs"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ToggleRight className="h-5 w-5 text-pri-red" />
            Feature Toggles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(featureLabels).map(([key, label]) => {
              const enabled = featuresValue[key] === true;
              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${enabled ? 'bg-green-400' : 'bg-pri-silver/30'}`} />
                    <div>
                      <p className="text-sm text-white">{label}</p>
                      <p className="text-[10px] text-pri-silver font-mono">
                        {key.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFeatureToggle(key, !enabled)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      enabled ? 'bg-pri-red' : 'bg-white/10'
                    }`}
                  >
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Server className="h-5 w-5 text-pri-red" />
            Maintenance Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {maintenanceValue.enabled === true ? (
                <AlertTriangle className="h-8 w-8 text-orange-400" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-400" />
              )}
              <div>
                <p className="text-sm text-white font-medium">
                  Status: {maintenanceValue.enabled === true ? "Aktif" : "Nonaktif"}
                </p>
                <p className="text-[10px] text-pri-silver font-mono">
                  {maintenanceValue.enabled === true
                    ? "Website hanya bisa diakses oleh Admin & Super Admin"
                    : "Website dapat diakses oleh semua pengguna"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleMaintenanceToggle}
              variant={maintenanceValue.enabled === true ? "destructive" : "outline"}
              size="sm"
              className={maintenanceValue.enabled === true ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              {maintenanceValue.enabled === true ? "Nonaktifkan" : "Aktifkan"}
            </Button>
          </div>

          <form onSubmit={handleSaveMaintenance} className="space-y-2">
            <Label htmlFor="maintenance_message">Pesan Maintenance</Label>
            <textarea
              id="maintenance_message"
              name="maintenance_message"
              rows={2}
              defaultValue={maintenanceValue.message as string || ""}
              placeholder="Pesan yang ditampilkan saat maintenance..."
              className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
            />
            <Button type="submit" variant="outline" size="sm" disabled={savingKey === "maintenance"}>
              <Save className="h-3.5 w-3.5 mr-2" />
              {savingKey === "maintenance" ? "Menyimpan..." : "Simpan Pesan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5 text-pri-red" />
            System Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-pri-silver">Database Settings</span>
              <span className="text-white font-mono">{settings.length} entries</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pri-silver">Categories</span>
              <span className="text-white font-mono">
                {[...new Set(settings.map(s => s.category))].join(", ")}
              </span>
            </div>
            <p className="text-xs text-pri-silver mt-3 italic">
              Pengaturan sistem disimpan di database dan dapat diubah kapan saja oleh Super Admin.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
