"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Save, Eye, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateSystemSetting } from "@/features/admin/system-actions";

interface PageContent {
  hero_title_line1?: string;
  hero_title_highlight?: string;
  hero_title_line2?: string;
  hero_description?: string;
  about_title?: string;
  about_description?: string;
  cta_title?: string;
  cta_description?: string;
}

interface ContentEditorProps {
  current: PageContent;
}

const defaults: PageContent = {
  hero_title_line1: "Gerakan Robotika untuk",
  hero_title_highlight: "Kedaulatan Teknologi",
  hero_title_line2: "Indonesia",
  hero_description:
    "PRO RI — Pusat Robotika Rakyat Indonesia — hadir untuk membangun generasi muda yang unggul dalam penguasaan robotika dan kecerdasan buatan, demi mewujudkan Indonesia Emas 2045.",
  about_title: "Sekilas PRO RI",
  about_description:
    "PRO RI (Pusat Robotika Rakyat Indonesia) adalah organisasi di bawah naungan PRI yang bergerak di bidang pengembangan sumber daya manusia Indonesia dalam bidang robotika, kecerdasan buatan, dan teknologi tepat guna. Didirikan pada 6 Juni 2026, PRO RI berkomitmen untuk mempercepat penguasaan teknologi dari tingkat akar rumput hingga nasional.",
  cta_title: "Indonesia Emas 2045 Dimulai dari Sekarang",
  cta_description:
    "Jadilah bagian dari gerakan robotika nasional. Bersama PRO RI, kita wujudkan kedaulatan teknologi Indonesia.",
};

const fields: {
  key: keyof PageContent;
  label: string;
  section: string;
  type: "text" | "textarea";
  placeholder: string;
}[] = [
  { key: "hero_title_line1", label: "Hero — Baris 1", section: "Hero Section", type: "text", placeholder: "Gerakan Robotika untuk" },
  { key: "hero_title_highlight", label: "Hero — Highlight (gradien merah)", section: "Hero Section", type: "text", placeholder: "Kedaulatan Teknologi" },
  { key: "hero_title_line2", label: "Hero — Baris 2", section: "Hero Section", type: "text", placeholder: "Indonesia" },
  { key: "hero_description", label: "Hero — Deskripsi", section: "Hero Section", type: "textarea", placeholder: "Deskripsi hero..." },
  { key: "about_title", label: "About — Judul", section: "About Section", type: "text", placeholder: "Sekilas PRO RI" },
  { key: "about_description", label: "About — Deskripsi", section: "About Section", type: "textarea", placeholder: "Deskripsi tentang PRO RI..." },
  { key: "cta_title", label: "CTA — Judul", section: "CTA Section", type: "text", placeholder: "Indonesia Emas 2045 Dimulai dari Sekarang" },
  { key: "cta_description", label: "CTA — Deskripsi", section: "CTA Section", type: "textarea", placeholder: "Deskripsi CTA..." },
];

export function PageContentEditor({ current }: ContentEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<PageContent>({ ...defaults, ...current });

  const handleChange = (key: keyof PageContent, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    if (!confirm("Reset semua konten ke default?")) return;
    setValues({ ...defaults });
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateSystemSetting("page_content", values as Record<string, unknown>);
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Konten halaman beranda diperbarui!");
      router.refresh();
    }
  };

  const sections = [...new Set(fields.map((f) => f.section))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-pri-red" />
          <h2 className="text-lg font-semibold text-white">Konten Beranda</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="border-white/10 text-pri-silver">
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset Default
          </Button>
          <Button size="sm" className="bg-pri-red hover:bg-red-700" onClick={handleSave} disabled={saving}>
            <Save className="h-3.5 w-3.5 mr-1" />
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>

      {sections.map((section) => (
        <Card key={section} className="glass-card">
          <CardHeader>
            <CardTitle className="text-white text-sm">{section}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields
              .filter((f) => f.section === section)
              .map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.key}
                      rows={3}
                      value={values[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
                    />
                  ) : (
                    <Input
                      id={field.key}
                      value={values[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button className="bg-pri-red hover:bg-red-700" onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </Button>
      </div>
    </div>
  );
}
