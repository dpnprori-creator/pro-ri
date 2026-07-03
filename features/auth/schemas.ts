import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  occupation: z.string().min(1, "Pekerjaan harus diisi"),
  provinceId: z.string().min(1, "Pilih provinsi"),
  regencyId: z.string().min(1, "Pilih kabupaten/kota"),
  districtId: z.string().min(1, "Pilih kecamatan"),
  villageId: z.string().min(1, "Pilih desa/kelurahan"),
  technologyInterest: z.array(z.string()).min(1, "Pilih minimal 1 minat teknologi"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
