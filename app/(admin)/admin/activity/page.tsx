import { getActivityLogs } from "@/features/admin/actions";
import { ActivityLogs } from "./activity-logs";

export default async function AdminActivityPage() {
  const logs = await getActivityLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
        <p className="text-pri-silver mt-1">Aktivitas terkini</p>
      </div>

      <ActivityLogs logs={logs as any} />
    </div>
  );
}
