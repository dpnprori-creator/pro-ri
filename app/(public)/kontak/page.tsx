"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, MessageSquare, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { submitContactMessage } from "@/features/admin/actions";
import { toast } from "sonner";

const contactInfo = [
  { icon: Mail, label: "Email", value: "dpn.prori@gmail.com" },
  { icon: Globe, label: "Website", value: "pro-ri.online" },
  { icon: MapPin, label: "Alamat", value: "Jl. Sultan Agung No.9, Guntur, Kec. Setiabudi, Jakarta Selatan 12980" },
];

const faqs = [
  { q: "Bagaimana cara mendaftar anggota?", a: "Kunjungi halaman Daftar Anggota, isi formulir, dan tim kami akan menghubungi Anda." },
  { q: "Apakah ada biaya pendaftaran?", a: "Informasi biaya akan diumumkan kemudian. Pantau terus informasi terbaru." },
  { q: "Apa saja program PRO RI?", a: "PRO RI memiliki 6 program unggulan — lihat detail di halaman Program." },
  { q: "Bagaimana cara menjadi mitra/kolaborator?", a: "Silakan hubungi kami melalui formulir kontak ini." },
  { q: "Apakah PRO RI ada di provinsi saya?", a: "PRO RI menargetkan pembentukan DPD (tingkat provinsi) di seluruh Indonesia." },
];

export default function KontakPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const result = await submitContactMessage(form);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setSent(true);
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
            alt="Kontak"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-pri-carbon via-pri-carbon/95 to-pri-carbon" />
        </div>
        <div className="absolute inset-0 circuit-pattern opacity-30" />
        <div className="hero-scan-line" />
        <div className="tech-particles">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="tech-particle"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: '100%',
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${12 + Math.random() * 12}s`,
              }}
            />
          ))}
        </div>
        <div className="orbit-ring orbit-ring-2" style={{ top: '30%', right: '5%', width: '100px', height: '100px', opacity: 0.04 }} />

        <div className="container-wide px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
              <MessageSquare className="h-4 w-4 text-pri-red" />
              <span className="text-xs text-pri-silver tracking-wider uppercase font-mono">
                Hubungi Kami
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Hubungi <span className="text-gradient">PRO RI</span>
            </h1>
            <p className="text-lg text-pri-silver leading-relaxed">
              Punya pertanyaan, saran, atau ingin berkolaborasi? Kami siap mendengar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="section-padding bg-pri-carbon relative">
        <div className="absolute inset-0 circuit-pattern opacity-10" />
        <div className="container-wide px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-4xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              {contactInfo.map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="glass-card-hover p-4">
                    <CardContent className="p-0 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-pri-red/10 flex items-center justify-center shrink-0">
                        <item.icon className="h-5 w-5 text-pri-red" />
                      </div>
                      <div>
                        <p className="text-xs text-pri-silver">{item.label}</p>
                        <p className="text-sm text-white">{item.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="glass-card-hover p-6">
                  <CardContent className="p-0">
                    {sent ? (
                      <div className="text-center py-12">
                        <Send className="h-12 w-12 text-pri-red mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Pesan Terkirim!</h3>
                        <p className="text-sm text-pri-silver">Tim kami akan merespon pesan Anda dalam 1x24 jam.</p>
                        <Button variant="outline" className="mt-6 border-white/10" onClick={() => { setSent(false); setFormData({ name: "", email: "", phone: "", message: "" }); }}>
                          Kirim Pesan Lain
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap <span className="text-pri-red">*</span></Label>
                            <Input id="name" name="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Nama Anda" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email <span className="text-pri-red">*</span></Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="nama@email.com" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">No. Telepon / WA</Label>
                          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="081234567890" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Pesan <span className="text-pri-red">*</span></Label>
                          <Textarea id="message" name="message" value={formData.message} onChange={(e) => handleChange("message", e.target.value)} placeholder="Tulis pesan Anda..." rows={5} required />
                        </div>
                        <p className="text-xs text-pri-silver">Kami akan merespon pesan Anda dalam 1x24 jam.</p>
                        <Button type="submit" className="w-full bg-pri-red hover:bg-red-700 h-12">
                          <Send className="mr-2 h-4 w-4" /> Kirim Pesan
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-pri-dark/50 relative">
        <div className="container-wide px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pertanyaan <span className="text-gradient">Umum</span>
            </h2>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4"
              >
                <h3 className="text-sm font-semibold text-white mb-1">{faq.q}</h3>
                <p className="text-sm text-pri-silver">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
