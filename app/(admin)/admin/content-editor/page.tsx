import { getSystemSettings } from "@/features/admin/system-actions";
import { PageContentEditor } from "./page-content-editor";

export default async function ContentEditorPage() {
  const settings = await getSystemSettings();
  const pageContent = (settings as any[]).find((s: any) => s.key === "page_content");
  const current = (pageContent?.value || {}) as Record<string, string>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Content Editor</h1>
        <p className="text-pri-silver mt-1">
          Edit konten halaman beranda PRO RI. Perubahan akan langsung terlihat di halaman publik.
        </p>
      </div>

      <PageContentEditor current={current} />
    </div>
  );
}
