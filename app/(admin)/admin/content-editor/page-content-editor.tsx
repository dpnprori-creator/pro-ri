"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Save, RotateCcw } from "lucide-react";
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
  // Trust Bar
  trust_provinsi_label?: string;
  trust_program_label?: string;
  trust_tahun_label?: string;
  // Programs Section
  programs_section_title?: string;
  programs_section_subtitle?: string;
  programs_button_text?: string;
  // Dampak Nasional Section
  impact_section_title?: string;
  impact_section_subtitle?: string;
  // Video Section
  video_section_title?: string;
  video_section_highlight?: string;
  video_section_suffix?: string;
  video_section_subtitle?: string;
  video_button_text?: string;
  // Events Section
  events_section_title?: string;
  events_section_subtitle?: string;
  events_link_text?: string;
  // Innovations Section
  innovations_section_title?: string;
  innovations_section_subtitle?: string;
  innovations_link_text?: string;
  // News Section
  news_section_title?: string;
  news_section_subtitle?: string;
  news_link_text?: string;
  // Featured News
  featured_news_label?: string;
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
  trust_provinsi_label: "Provinsi Tersebar",
  trust_program_label: "Program Strategis",
  trust_tahun_label: "Tahun Berdiri",
  programs_section_title: "Program Unggulan PRO RI",
  programs_section_subtitle: "Program strategis membangun SDM Indonesia unggul di bidang robotika dan AI",
  programs_button_text: "Lihat Detail Program",
  impact_section_title: "Dampak Nasional PRO RI",
  impact_section_subtitle: "Ekosistem teknologi yang tersebar di seluruh Indonesia",
  video_section_title: "Robotika & ",
  video_section_highlight: "AI",
  video_section_suffix: " dalam Aksi",
  video_section_subtitle: "Saksikan bagaimana teknologi robotika dan AI mengubah masa depan Indonesia",
  video_button_text: "Lihat Galeri Kegiatan",
  events_section_title: "Kegiatan Terbaru",
  events_section_subtitle: "Event dan kegiatan PRO RI terbaru",
  events_link_text: "Lihat Semua",
  innovations_link_text: "Lihat Semua",
  innovations_section_title: "Inovasi Terkini",
  innovations_section_subtitle: "Karya inovasi teknologi dari talenta Indonesia",
  news_section_title: "Informasi Terkini",
  news_section_subtitle: "Berita terbaru tentang PRO RI",
  news_link_text: "Lihat Semua",
  featured_news_label: "Featured News",
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
  // Trust Bar
  { key: "trust_provinsi_label", label: "Label Provinsi Tersebar", section: "Trust Bar", type: "text", placeholder: "Provinsi Tersebar" },
  { key: "trust_program_label", label: "Label Program", section: "Trust Bar", type: "text", placeholder: "Program Strategis" },
  { key: "trust_tahun_label", label: "Label Tahun Berdiri", section: "Trust Bar", type: "text", placeholder: "Tahun Berdiri" },
  // Programs
  { key: "programs_section_title", label: "Section Title", section: "Program Unggulan", type: "text", placeholder: "Program Unggulan PRO RI" },
  { key: "programs_section_subtitle", label: "Section Subtitle", section: "Program Unggulan", type: "textarea", placeholder: "Program strategis..." },
  { key: "programs_button_text", label: "Tombol CTA", section: "Program Unggulan", type: "text", placeholder: "Lihat Detail Program" },
  // Dampak Nasional
  { key: "impact_section_title", label: "Section Title", section: "Dampak Nasional", type: "text", placeholder: "Dampak Nasional PRO RI" },
  { key: "impact_section_subtitle", label: "Section Subtitle", section: "Dampak Nasional", type: "textarea", placeholder: "Ekosistem teknologi..." },
  // Video
  { key: "video_section_title", label: "Title — before highlight", section: "Video Galeri", type: "text", placeholder: "Robotika & " },
  { key: "video_section_highlight", label: "Title — highlight (gradien merah)", section: "Video Galeri", type: "text", placeholder: "AI" },
  { key: "video_section_suffix", label: "Title — after highlight", section: "Video Galeri", type: "text", placeholder: " dalam Aksi" },
  { key: "video_section_subtitle", label: "Section Subtitle", section: "Video Galeri", type: "textarea", placeholder: "Saksikan bagaimana..." },
  { key: "video_button_text", label: "Tombol CTA", section: "Video Galeri", type: "text", placeholder: "Lihat Galeri Kegiatan" },
  // Events
  { key: "events_section_title", label: "Section Title", section: "Kegiatan / Events", type: "text", placeholder: "Kegiatan Terbaru" },
  { key: "events_section_subtitle", label: "Section Subtitle", section: "Kegiatan / Events", type: "textarea", placeholder: "Event dan kegiatan PRO RI..." },
  { key: "events_link_text", label: "Text Link 'Lihat Semua'", section: "Kegiatan / Events", type: "text", placeholder: "Lihat Semua" },
  // Innovations
  { key: "innovations_section_title", label: "Section Title", section: "Inovasi", type: "text", placeholder: "Inovasi Terkini" },
  { key: "innovations_section_subtitle", label: "Section Subtitle", section: "Inovasi", type: "textarea", placeholder: "Karya inovasi teknologi..." },
  { key: "innovations_link_text", label: "Text Link 'Lihat Semua'", section: "Inovasi", type: "text", placeholder: "Lihat Semua" },
  // News
  { key: "news_section_title", label: "Section Title", section: "Berita / News", type: "text", placeholder: "Informasi Terkini" },
  { key: "news_section_subtitle", label: "Section Subtitle", section: "Berita / News", type: "textarea", placeholder: "Berita terbaru tentang PRO RI" },
  { key: "news_link_text", label: "Text Link 'Lihat Semua'", section: "Berita / News", type: "text", placeholder: "Lihat Semua" },
  // Featured News
  { key: "featured_news_label", label: "Label Featured News", section: "Featured News", type: "text", placeholder: "Featured News" },
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
