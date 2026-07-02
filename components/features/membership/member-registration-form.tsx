"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import SignaturePad from "signature_pad";
import {
  Save, AlertCircle, CheckCircle2, Upload, Pen,
  RotateCcw, Camera, User, Mail, Phone, MapPin,
  BookOpen, Heart, Briefcase, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { submitMemberCard } from "@/features/admin/member-card-actions";
import { toast } from "sonner";

const interestOptions = [
  "Robotika", "AI / Machine Learning", "IoT", "Programming",
  "Computer Vision", "Embedded Systems", "Mechatronics",
  "3D Printing", "Drone / UAV", "Otomotif",
];

const skillOptions = [
  "Programming", "Electronics", "Mechanical Design", "3D Modeling",
  "Circuit Design", "Microcontroller", "PCB Design",
  "Soldering", "UI/UX Design", "Project Management",
  "Teaching / Training", "Public Speaking", "Research",
];

interface MemberRegistrationFormProps {
  userEmail?: string;
  existingCard?: {
    id: string;
    status: string;
    rejection_reason?: string | null;
    full_name: string;
    nickname?: string | null;
    family_count?: number;
    gender?: string | null;
    birth_place?: string | null;
    birth_date?: string | null;
    religion?: string | null;
    nik?: string | null;
    npwp?: string | null;
    email?: string | null;
    phone: string;
    address?: string | null;
    postal_code?: string | null;
    education?: string | null;
    occupation?: string | null;
    interests?: string[];
    skills?: string[];
    experience?: string | null;
    motivation?: string | null;
    photo_url?: string | null;
    signature_url?: string | null;
  } | null;
}

export function MemberRegistrationForm({ existingCard, userEmail }: MemberRegistrationFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    existingCard?.interests || []
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    existingCard?.skills || []
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    existingCard?.photo_url || null
  );
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signatureEmpty, setSignatureEmpty] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Init signature pad
  useEffect(() => {
    if (canvasRef.current && !signaturePadRef.current) {
      const canvas = canvasRef.current;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(ratio, ratio);

      const pad = new SignaturePad(canvas, {
        backgroundColor: "transparent",
        penColor: "#FFFFFF",
        throttle: 0,
      });
      signaturePadRef.current = pad;
      setSignatureEmpty(pad.isEmpty());
    }

    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
        signaturePadRef.current = null;
      }
    };
  }, []);

  const clearSignature = () => {
    signaturePadRef.current?.clear();
    setSignatureEmpty(true);
    setSignatureData(null);
  };

  const saveSignature = () => {
    if (signaturePadRef.current?.isEmpty()) {
      toast.error("Tanda tangan masih kosong");
      return;
    }
    const dataUrl = signaturePadRef.current?.toDataURL("image/png");
    if (dataUrl) {
      setSignatureData(dataUrl);
      setSignatureEmpty(false);
      toast.success("Tanda tangan disimpan");
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Foto maksimal 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const toggleInterest = (item: string) => {
    setSelectedInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleSkill = (item: string) => {
    setSelectedSkills(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);

    // Append arrays as JSON strings
    form.set("interests", JSON.stringify(selectedInterests));
    form.set("skills", JSON.stringify(selectedSkills));

    // Append signature data URL
    if (signatureData) {
      form.set("signature", signatureData);
    }

    const result = await submitMemberCard(form);

    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Data berhasil dikirim untuk verifikasi admin");
      router.refresh();
    }
  }

  const isEditable = !existingCard || existingCard.status !== "approved";
  const isRejected = existingCard?.status === "rejected";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Kartu Anggota PRO RI</h1>
        <p className="text-pri-silver mt-1">
          Lengkapi data diri untuk mendapatkan kartu anggota resmi Pusat Robotika Rakyat Indonesia
        </p>
      </div>

      {isRejected && existingCard?.rejection_reason && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-300">Data Ditolak</p>
            <p className="text-xs text-pri-silver mt-1">{existingCard.rejection_reason}</p>
            <p className="text-xs text-pri-silver mt-1">
              Silakan perbaiki data di bawah dan kirim ulang.
            </p>
          </div>
        </div>
      )}

      {existingCard?.status === "pending" && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-300">Menunggu Verifikasi</p>
            <p className="text-xs text-pri-silver mt-1">
              Data kamu sedang direview oleh admin PRO RI. Kamu akan mendapat notifikasi setelah diverifikasi.
            </p>
          </div>
        </div>
      )}

      {existingCard?.status === "approved" && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-300">Kartu Anggota Aktif</p>
            <p className="text-xs text-pri-silver mt-1">
              Selamat! Kartu anggota kamu sudah aktif. Kamu bisa melihat dan mengunduhnya di halaman Membership.
            </p>
          </div>
        </div>
      )}

      {!isEditable ? (
        <div className="text-center py-12">
          <CheckCircle2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Kartu Anggota Aktif</h2>
          <p className="text-pri-silver mb-6">Kartu anggota kamu sudah terverifikasi dan aktif.</p>
          <Button onClick={() => router.push("/membership")} className="bg-pri-red hover:bg-red-700">
            Lihat Kartu Anggota
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ===== DATA PRIBADI ===== */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-pri-silver flex items-center gap-2">
                <User className="h-4 w-4 text-pri-red" />
                Data Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fullName">Nama Lengkap <span className="text-pri-red">*</span></Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    defaultValue={existingCard?.full_name || ""}
                    required
                    placeholder="Nama sesuai KTP"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nama Panggilan</Label>
                  <Input
                    id="nickname"
                    name="nickname"
                    defaultValue={existingCard?.nickname || ""}
                    placeholder="Cth: Raka"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="familyCount">Jumlah Keluarga</Label>
                  <Input
                    id="familyCount"
                    name="familyCount"
                    type="number"
                    min={1}
                    defaultValue={existingCard?.family_count ?? 1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <select
                    id="gender"
                    name="gender"
                    defaultValue={existingCard?.gender || ""}
                    className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
                  >
                    <option value="">Pilih...</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthPlace">Tempat Lahir</Label>
                  <Input
                    id="birthPlace"
                    name="birthPlace"
                    defaultValue={existingCard?.birth_place || ""}
                    placeholder="Cth: Jakarta"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Tanggal Lahir</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    defaultValue={existingCard?.birth_date?.split("T")[0] || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="religion">Agama</Label>
                  <select
                    id="religion"
                    name="religion"
                    defaultValue={existingCard?.religion || ""}
                    className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
                  >
                    <option value="">Pilih...</option>
                    <option value="Islam">Islam</option>
                    <option value="Kristen Protestan">Kristen Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK (Nomor Induk Kependudukan)</Label>
                  <Input
                    id="nik"
                    name="nik"
                    defaultValue={existingCard?.nik || ""}
                    placeholder="16 digit NIK"
                    maxLength={16}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="npwp">NPWP (Opsional)</Label>
                  <Input
                    id="npwp"
                    name="npwp"
                    defaultValue={existingCard?.npwp || ""}
                    placeholder="Nomor NPWP"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== KONTAK & ALAMAT ===== */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-pri-silver flex items-center gap-2">
                <MapPin className="h-4 w-4 text-pri-red" />
                Kontak & Alamat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon <span className="text-pri-red">*</span></Label>
                  <Input
                    id="phone"
                    name="phone"
                    defaultValue={existingCard?.phone || ""}
                    required
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={existingCard?.email || userEmail || ""}
                    readOnly
                    className="opacity-60 bg-white/5"
                    placeholder="Email dari akun login"
                  />
                  <p className="text-[10px] text-pri-silver">Email otomatis dari akun login</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    defaultValue={existingCard?.address || ""}
                    placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kabupaten/Kota, Provinsi"
                    className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Kode Pos</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    defaultValue={existingCard?.postal_code || ""}
                    placeholder="5 digit kode pos"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== PENDIDIKAN & PEKERJAAN ===== */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-pri-silver flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-pri-red" />
                Pendidikan & Pekerjaan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="education">Pendidikan Terakhir</Label>
                  <select
                    id="education"
                    name="education"
                    defaultValue={existingCard?.education || ""}
                    className="flex h-10 w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white"
                  >
                    <option value="">Pilih...</option>
                    <option value="SD/Sederajat">SD/Sederajat</option>
                    <option value="SMP/Sederajat">SMP/Sederajat</option>
                    <option value="SMA/SMK/Sederajat">SMA/SMK/Sederajat</option>
                    <option value="D1-D3">D1-D3</option>
                    <option value="D4/S1">D4/S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">Pekerjaan</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    defaultValue={existingCard?.occupation || ""}
                    placeholder="Cth: Mahasiswa, Engineer, Guru"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== MINAT & KEAHLIAN ===== */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-pri-silver flex items-center gap-2">
                <Heart className="h-4 w-4 text-pri-red" />
                Minat & Keahlian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Bidang Ketertarikan Teknologi</Label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((item) => {
                    const selected = selectedInterests.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selected
                            ? "bg-pri-red text-white border border-pri-red"
                            : "bg-white/5 text-pri-silver border border-white/10 hover:border-pri-red/50"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Keahlian / Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((item) => {
                    const selected = selectedSkills.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleSkill(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selected
                            ? "bg-pri-red text-white border border-pri-red"
                            : "bg-white/5 text-pri-silver border border-white/10 hover:border-pri-red/50"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== PENGALAMAN & MOTIVASI ===== */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-pri-silver flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-pri-red" />
                Pengalaman & Motivasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Pengalaman</Label>
                <textarea
                  id="experience"
                  name="experience"
                  rows={3}
                  defaultValue={existingCard?.experience || ""}
                  placeholder="Ceritakan pengalaman kamu di bidang robotika, AI, teknologi, atau organisasi..."
                  className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivation">Motivasi Bergabung</Label>
                <textarea
                  id="motivation"
                  name="motivation"
                  rows={3}
                  defaultValue={existingCard?.motivation || ""}
                  placeholder="Mengapa kamu ingin bergabung dengan PRO RI?"
                  className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
                />
              </div>
            </CardContent>
          </Card>

          {/* ===== FOTO PROFIL ===== */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-pri-silver flex items-center gap-2">
                <Camera className="h-4 w-4 text-pri-red" />
                Foto Profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {photoPreview ? (
                    <div className="relative h-32 w-32 rounded-xl overflow-hidden border-2 border-white/20">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-32 w-32 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center bg-white/5">
                      <User className="h-10 w-10 text-pri-silver" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo">Upload Foto <span className="text-pri-red">*</span></Label>
                  <div>
                    <input
                      ref={fileInputRef}
                      id="photo"
                      name="photo"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-pri-silver"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Pilih Foto
                    </Button>
                  </div>
                  <p className="text-[10px] text-pri-silver">
                    Format: JPG, PNG. Maks 5 MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== TANDA TANGAN DIGITAL ===== */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-pri-silver flex items-center gap-2">
                <Pen className="h-4 w-4 text-pri-red" />
                Tanda Tangan Digital
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-40 rounded-lg border border-white/20 bg-pri-dark/50 cursor-crosshair"
                    style={{ touchAction: "none" }}
                  />
                  <input type="hidden" name="signature" value={signatureData || ""} />
                </div>
                <p className="text-[10px] text-pri-silver">
                  Tanda tangan di atas akan digunakan pada kartu anggota resmi kamu.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={saveSignature}
                    className="text-green-400 border-green-500/30"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Simpan Tanda Tangan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                    className="text-pri-silver"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Bersihkan
                  </Button>
                  {!signatureEmpty && (
                    <Badge variant="success" className="text-[10px]">Tersimpan</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== SUBMIT ===== */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              className="bg-pri-red hover:bg-red-700 px-8"
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Menyimpan..." : existingCard ? "Perbarui & Kirim Ulang" : "Kirim Data untuk Verifikasi"}
            </Button>
            <p className="text-xs text-pri-silver">
              Data akan diverifikasi oleh admin PRO RI sebelum kartu diterbitkan
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
