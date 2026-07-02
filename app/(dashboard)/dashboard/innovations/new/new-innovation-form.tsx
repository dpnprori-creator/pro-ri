"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createInnovation } from "@/features/admin/actions";
import { toast } from "sonner";

export function NewInnovationForm({ provinces }: { provinces: { id: string; name: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await createInnovation(form);

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Inovasi berhasil dibuat!");
      router.push("/dashboard/innovations");
      router.refresh();
    }
  };

  return (
    <Card className="glass-card max-w-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-pri-red" />
          Form Inovasi Baru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Inovasi</Label>
            <Input id="title" name="title" required placeholder="Masukkan judul inovasi" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Jelaskan inovasi Anda..."
              className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                name="category"
                required
                className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
              >
                <option value="">Pilih kategori</option>
                <option value="robotics">Robotics</option>
                <option value="ai">AI</option>
                <option value="iot">IoT</option>
                <option value="programming">Programming</option>
                <option value="research">Research</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Tahun</Label>
              <Input
                id="year"
                name="year"
                type="number"
                defaultValue={new Date().getFullYear()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="province_id">Provinsi</Label>
            <select
              id="province_id"
              name="province_id"
              className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
            >
              <option value="">Pilih provinsi</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            className="w-full bg-pri-red hover:bg-red-700"
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Menyimpan..." : "Buat Inovasi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
