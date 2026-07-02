"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegionSelect } from "@/components/features/register/region-select";
import { TechInterestSelect } from "@/components/features/register/tech-interest-select";
import { updateProfile } from "@/features/members/profile-actions";
import { toast } from "sonner";

interface MemberProfile {
  id: string;
  full_name: string;
  phone: string | null;
  occupation: string | null;
  province_id: string | null;
  regency_id: string | null;
  district_id: string | null;
  village_id: string | null;
  technology_interest: string[] | null;
}

interface Region {
  id: string;
  name: string;
  province_id?: string;
  regency_id?: string;
  district_id?: string;
}

interface Regions {
  provinces: Region[];
  regencies: Region[];
  districts: Region[];
  villages: Region[];
}

export function ProfileForm({
  member,
  regions,
}: {
  member: MemberProfile;
  regions: Regions;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: member.full_name,
    phone: member.phone || "",
    occupation: member.occupation || "",
    provinceId: member.province_id || "",
    regencyId: member.regency_id || "",
    districtId: member.district_id || "",
    villageId: member.village_id || "",
    technologyInterest: member.technology_interest || [],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("fullName", formData.fullName);
    form.append("phone", formData.phone);
    form.append("occupation", formData.occupation);
    form.append("provinceId", formData.provinceId);
    form.append("regencyId", formData.regencyId);
    form.append("districtId", formData.districtId);
    form.append("villageId", formData.villageId);
    formData.technologyInterest.forEach((t) => form.append("technologyInterest", t));

    const result = await updateProfile(form);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profil berhasil diperbarui!");
      router.refresh();
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-pri-silver flex items-center gap-2">
          <Save className="h-4 w-4 text-pri-red" />
          Edit Profil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, fullName: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Pekerjaan</Label>
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) =>
                setFormData((p) => ({ ...p, occupation: e.target.value }))
              }
            />
          </div>

          <RegionSelect
            provinceId={formData.provinceId}
            regencyId={formData.regencyId}
            districtId={formData.districtId}
            villageId={formData.villageId}
            onChange={(field, value) =>
              setFormData((p) => ({ ...p, [field]: value }))
            }
          />

          <TechInterestSelect
            selectedValues={formData.technologyInterest}
            onChange={(values) =>
              setFormData((p) => ({ ...p, technologyInterest: values }))
            }
          />

          <Button
            type="submit"
            className="w-full bg-pri-red hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
