import { createClient } from "@/lib/supabase/server";
import { ActivityLogs } from "./activity-logs";

async function getActivityLogs() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("activity_logs")
    .select("*, member_id!inner(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return data ?? [];
}

export default async function AdminActivityPage() {
  const logs = await getActivityLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
        <p className="text-pri-silver mt-1">Aktivitas terkini</p>
      </div>

      <ActivityLogs logs={logs} />
    </div>
  );
}
