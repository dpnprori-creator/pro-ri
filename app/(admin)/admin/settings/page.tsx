import { createClient } from "@/lib/supabase/server";
import { getSystemSettings } from "@/features/admin/system-actions";
import { AdminSettings } from "./admin-settings";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch system settings from database
  const settings = await getSystemSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-pri-silver mt-1">Pengaturan sistem dan konfigurasi website</p>
      </div>

      <AdminSettings user={user} settings={settings} />
    </div>
  );
}
