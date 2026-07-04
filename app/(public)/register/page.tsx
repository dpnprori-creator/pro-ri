"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, GraduationCap, Trophy, Users, Globe, Award, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RegionSelect } from "@/components/features/register/region-select";
import { TechInterestSelect } from "@/components/features/register/tech-interest-select";
import { register } from "@/features/auth/actions";
import { toast } from "sonner";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  occupation: string;
  provinceId: string;
  regencyId: string;
  districtId: string;
  villageId: string;
  technologyInterest: string[];
}

interface FormErrors {
  [key: string]: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    occupation: "",
    provinceId: "",
    regencyId: "",
    districtId: "",
    villageId: "",
    technologyInterest: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field changes
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = "Nama lengkap minimal 3 karakter";
    }
    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "Email tidak valid";
    }
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = "Nomor telepon minimal 10 digit";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }
    if (!formData.occupation) {
      newErrors.occupation = "Pilih pekerjaan";
    }
    if (!formData.provinceId) {
      newErrors.provinceId = "Pilih provinsi";
    }
    if (!formData.regencyId) {
      newErrors.regencyId = "Pilih kabupaten/kota";
    }
    if (!formData.districtId) {
      newErrors.districtId = "Pilih kecamatan";
    }
    if (!formData.villageId) {
      newErrors.villageId = "Pilih desa/kelurahan";
    }
    if (formData.technologyInterest.length === 0) {
      newErrors.technologyInterest = "Pilih minimal 1 minat teknologi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon lengkapi data dengan benar");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for the server action
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("password", formData.password);
      form.append("confirmPassword", formData.confirmPassword);
      form.append("provinceId", formData.provinceId);
      form.append("regencyId", formData.regencyId);
      form.append("districtId", formData.districtId);
      form.append("villageId", formData.villageId);
      form.append("occupation", formData.occupation);
      formData.technologyInterest.forEach((t) =>
        form.append("technologyInterest", t)
      );

      const result = await register(form);

      if (result.error) {
        toast.error(String(result.error));
      } else {
        toast.success("Pendaftaran berhasil! Selamat bergabung dengan PRO RI.");
        router.push("/login");
      }
    } catch (err) {
      console.error("Register client error:", err);
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-20 pb-10 px-4 circuit-pattern">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-10 pt-10">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
          <UserPlus className="h-4 w-4 text-pri-red" />
          <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">Pendaftaran</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Daftar Anggota <span className="text-gradient">PRO RI</span>
        </h1>
        <p className="text-lg text-pri-silver max-w-2xl mx-auto">
          Bergabunglah dengan gerakan robotika nasional. Nikmati akses ke program pelatihan, kompetisi, dan jaringan nasional di 38 provinsi.
        </p>
      </div>

      {/* Benefit Section */}
      <div className="max-w-4xl mx-auto mb-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-3"
        >
          {[
            { icon: GraduationCap, label: "Pelatihan Robotika", desc: "Akses gratis/terdiskon" },
            { icon: Trophy, label: "Kompetisi Nasional", desc: "Hak mengikuti lomba" },
            { icon: Globe, label: "Jaringan 38 Provinsi", desc: "Terhubung nasional" },
            { icon: Award, label: "Sertifikat Anggota", desc: "Resmi PRO RI" },
            { icon: Users, label: "Info Eksklusif", desc: "Update program & event" },
          ].map((benefit, i) => (
            <div key={i} className="glass rounded-xl p-4 text-center">
              <benefit.icon className="h-6 w-6 text-pri-red mx-auto mb-2" />
              <h3 className="text-xs font-semibold text-white mb-0.5">{benefit.label}</h3>
              <p className="text-[10px] text-pri-silver">{benefit.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Membership Tiers */}
      <div className="max-w-4xl mx-auto mb-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { tier: "Pelajar", desc: "SD, SMP, SMA" },
            { tier: "Mahasiswa", desc: "D3/D4/S1" },
            { tier: "Umum", desc: "Masyarakat umum" },
            { tier: "Asosiasi/Corporate", desc: "Instansi/Perusahaan" },
          ].map((item, i) => (
            <div key={i} className="glass rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-pri-red shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-white">{item.tier}</h3>
                <p className="text-[10px] text-pri-silver">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-2xl mx-auto px-4"
      >
        <Card className="border-white/10">
          <CardHeader className="text-center">
            <div className="h-12 w-12 rounded-full bg-pri-red mx-auto mb-4 flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Formulir Pendaftaran</CardTitle>
            <CardDescription>
              Isi data diri Anda untuk menjadi anggota PRO RI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal Info - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Nama Lengkap <span className="text-pri-red">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Nama lengkap"
                    required
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-400">{errors.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-pri-red">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="nama@email.com"
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Contact & Occupation - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Nomor Telepon <span className="text-pri-red">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="081234567890"
                    required
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400">{errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">
                    Pekerjaan <span className="text-pri-red">*</span>
                  </Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={(e) => updateField("occupation", e.target.value)}
                    placeholder="Mahasiswa / Profesional"
                    required
                  />
                  {errors.occupation && (
                    <p className="text-xs text-red-400">{errors.occupation}</p>
                  )}
                </div>
              </div>

              {/* Password - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-pri-red">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    placeholder="Min. 6 karakter"
                    required
                  />
                  {errors.password && (
                    <p className="text-xs text-red-400">{errors.password}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Konfirmasi Password <span className="text-pri-red">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    placeholder="Ulangi password"
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Region - Cascade Dropdown */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-sm font-semibold text-white mb-4">
                  Wilayah Domisili
                </h3>
                <RegionSelect
                  provinceId={formData.provinceId}
                  regencyId={formData.regencyId}
                  districtId={formData.districtId}
                  villageId={formData.villageId}
                  onChange={updateField}
                  errors={errors}
                />
              </div>

              {/* Technology Interest - Multi-select */}
              <div className="border-t border-white/10 pt-4">
                <TechInterestSelect
                  selectedValues={formData.technologyInterest}
                  onChange={(values) => {
                    setFormData((prev) => ({
                      ...prev,
                      technologyInterest: values,
                    }));
                    if (errors.technologyInterest) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.technologyInterest;
                        return newErrors;
                      });
                    }
                  }}
                />
                {errors.technologyInterest && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.technologyInterest}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-pri-red hover:bg-red-700 h-12 text-base mt-6"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Memproses...
                  </span>
                ) : (
                  "Daftar Sekarang"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-pri-silver mt-6">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-pri-red hover:underline">
                Masuk
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
