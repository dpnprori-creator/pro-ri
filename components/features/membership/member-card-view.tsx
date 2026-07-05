"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Download, Printer, Share2, CheckCircle2,
  Cpu, CircuitBoard, Hexagon, Zap,
} from "lucide-react";
import { toast } from "sonner";

interface MemberCardViewData {
  id: string;
  member_number: string;
  full_name: string;
  nickname?: string | null;
  phone: string;
  photo_url?: string | null;
  signature_url?: string | null;
  address?: string | null;
  interests?: string[];
  created_at: string;
}

export function MemberCardView({ card }: { card: MemberCardViewData }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [originUrl, setOriginUrl] = useState("");

  // Use window.location.origin for QR code to work on any device
  useEffect(() => {
    setOriginUrl(window.location.origin);
  }, []);

  const verifyUrl = `${originUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify/${card.member_number}`;

  // ============================================
  // Helper: render card to canvas using html2canvas
  // ============================================
  const renderToCanvas = useCallback(async () => {
    if (!cardRef.current) return null;
    const html2canvasMod = await import("html2canvas");
    const html2canvas = html2canvasMod.default || html2canvasMod;
    return html2canvas(cardRef.current, {
      backgroundColor: "#ffffff",
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
  }, []);

  // ============================================
  // DOWNLOAD PNG — render card to canvas → PNG blob
  // ============================================
  const handleDownloadPNG = useCallback(async () => {
    const canvas = await renderToCanvas();
    if (!canvas) return;
    try {
      const link = document.createElement("a");
      link.download = `member-card-${card.member_number || "unknown"}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Kartu anggota berhasil diunduh (PNG)!");
    } catch (err) {
      console.error("PNG download error:", err);
      toast.error("Gagal mengunduh PNG. Silakan coba screenshot manual.");
    }
  }, [renderToCanvas, card.member_number]);

  // ============================================
  // DOWNLOAD JPG — render card to canvas → JPG blob
  // ============================================
  const handleDownloadJPG = useCallback(async () => {
    const canvas = await renderToCanvas();
    if (!canvas) return;
    try {
      const link = document.createElement("a");
      link.download = `member-card-${card.member_number || "unknown"}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Kartu anggota berhasil diunduh (JPG)!");
    } catch (err) {
      console.error("JPG download error:", err);
      toast.error("Gagal mengunduh JPG. Silakan coba screenshot manual.");
    }
  }, [renderToCanvas, card.member_number]);

  // ============================================
  // DOWNLOAD PDF - jspdf render
  // ============================================
  const handleDownloadPDF = useCallback(async () => {
    const canvas = await renderToCanvas();
    if (!canvas) return;

    try {
      const jsPDFMod = await import("jspdf");
      const { default: jsPDF } = jsPDFMod;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [100, 160],
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`member-card-${card.member_number}.pdf`);
      toast.success("Kartu anggota berhasil diunduh (PDF)!");
    } catch (err) {
      console.error("PDF download error:", err);
      toast.error("Gagal mengunduh PDF. Silakan coba screenshot manual.");
    }
  }, [renderToCanvas, card.member_number]);

  // ============================================
  // CETAK / PRINT — clone DOM + inject styles
  // ============================================
  const handlePrint = useCallback(() => {
    if (!cardRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup diblokir. Izinkan popup untuk mencetak.");
      return;
    }

    // Clone the actual rendered card node
    const cardClone = cardRef.current.cloneNode(true) as HTMLElement;

    // Collect all stylesheets from the current document
    const styles: string[] = [];
    for (const sheet of document.styleSheets) {
      try {
        if (sheet.cssRules) {
          let cssText = "";
          for (const rule of sheet.cssRules) {
            cssText += rule.cssText;
          }
          styles.push(cssText);
        }
      } catch {
        // Cross-origin stylesheet, skip
      }
    }

    // Also collect all <style> tags in <head>
    const inlineStyles: string[] = [];
    document.querySelectorAll("style").forEach((el) => {
      inlineStyles.push(el.textContent || "");
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Member Card - ${card.full_name}</title>
        <style>
          @page { size: landscape; margin: 0; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #ffffff;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          /* Injected styles from app */
          ${styles.join("\n")}
          ${inlineStyles.join("\n")}
        </style>
      </head>
      <body>
        <div id="print-root" style="width:600px;padding:20px">
          ${cardClone.outerHTML}
        </div>
        <script>
          window.onload = function() {
            // Ensure all images are loaded before printing
            const imgs = document.querySelectorAll("img");
            let loaded = 0;
            if (imgs.length === 0) {
              window.print();
              window.close();
              return;
            }
            imgs.forEach(function(img) {
              img.crossOrigin = "anonymous";
              if (img.complete) {
                loaded++;
                if (loaded >= imgs.length) {
                  setTimeout(function() { window.print(); window.close(); }, 500);
                }
              } else {
                img.onload = function() {
                  loaded++;
                  if (loaded >= imgs.length) {
                    setTimeout(function() { window.print(); window.close(); }, 500);
                  }
                };
                img.onerror = function() {
                  loaded++;
                  if (loaded >= imgs.length) {
                    setTimeout(function() { window.print(); window.close(); }, 500);
                  }
                };
              }
            });
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
    toast.success("Membuka dialog cetak...");
  }, [card]);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* Member Card - White Background, Landscape/Horizontal dengan tema robotik */}
      <div ref={cardRef} className="w-full max-w-[600px]">
        <div
          id="member-card"
          className="relative bg-white rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-200"
        >
          {/* ===== DECORATIVE ROBOTIC ELEMENTS ===== */}
          {/* Circuit grid pattern — more visible */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: [
                  "linear-gradient(rgba(227,30,36,0.4) 1px, transparent 1px)",
                  "linear-gradient(90deg, rgba(227,30,36,0.4) 1px, transparent 1px)",
                ].join(","),
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          {/* Diagonal circuit trace lines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.12] overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 600 300" preserveAspectRatio="none" className="absolute inset-0">
              <line x1="50" y1="0" x2="100" y2="50" stroke="#E31E24" strokeWidth="0.5" opacity="0.4" />
              <line x1="100" y1="50" x2="100" y2="100" stroke="#E31E24" strokeWidth="0.5" opacity="0.4" />
              <line x1="100" y1="100" x2="150" y2="150" stroke="#E31E24" strokeWidth="0.5" opacity="0.4" />
              <line x1="450" y1="0" x2="500" y2="50" stroke="#E31E24" strokeWidth="0.5" opacity="0.4" />
              <line x1="500" y1="50" x2="500" y2="100" stroke="#E31E24" strokeWidth="0.5" opacity="0.4" />
              <line x1="500" y1="100" x2="550" y2="150" stroke="#E31E24" strokeWidth="0.5" opacity="0.4" />
              {/* Circuit nodes */}
              <circle cx="100" cy="50" r="2" fill="#E31E24" opacity="0.6" />
              <circle cx="150" cy="150" r="1.5" fill="#E31E24" opacity="0.6" />
              <circle cx="500" cy="50" r="2" fill="#E31E24" opacity="0.6" />
              <circle cx="550" cy="150" r="1.5" fill="#E31E24" opacity="0.6" />
              <circle cx="50" cy="0" r="1.5" fill="#E31E24" opacity="0.6" />
              <circle cx="450" cy="0" r="1.5" fill="#E31E24" opacity="0.6" />
            </svg>
          </div>

          {/* Corner tech brackets — more visible */}
          <div className="absolute top-0 left-0 w-10 h-10 pointer-events-none z-10">
            <div className="absolute top-0 left-0 w-5 h-[1.5px] bg-gradient-to-r from-[#E31E24]/40 to-transparent" />
            <div className="absolute top-0 left-0 w-[1.5px] h-5 bg-gradient-to-b from-[#E31E24]/40 to-transparent" />
          </div>
          <div className="absolute top-0 right-0 w-10 h-10 pointer-events-none z-10">
            <div className="absolute top-0 right-0 w-5 h-[1.5px] bg-gradient-to-l from-[#E31E24]/40 to-transparent" />
            <div className="absolute top-0 right-0 w-[1.5px] h-5 bg-gradient-to-b from-[#E31E24]/40 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 w-10 h-10 pointer-events-none z-10">
            <div className="absolute bottom-0 left-0 w-5 h-[1.5px] bg-gradient-to-r from-[#E31E24]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 w-[1.5px] h-5 bg-gradient-to-t from-[#E31E24]/40 to-transparent" />
          </div>
          <div className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none z-10">
            <div className="absolute bottom-0 right-0 w-5 h-[1.5px] bg-gradient-to-l from-[#E31E24]/40 to-transparent" />
            <div className="absolute bottom-0 right-0 w-[1.5px] h-5 bg-gradient-to-t from-[#E31E24]/40 to-transparent" />
          </div>

          {/* SVG circuit nodes with connecting lines — top right */}
          <div className="absolute top-10 right-6 pointer-events-none opacity-[0.18] z-10">
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
              <circle cx="35" cy="35" r="3" fill="#E31E24" />
              <circle cx="58" cy="12" r="2" fill="#E31E24" />
              <circle cx="12" cy="58" r="2" fill="#E31E24" />
              <circle cx="35" cy="10" r="1.5" fill="#E31E24" />
              <path d="M35 35 L58 12" stroke="#E31E24" strokeWidth="0.8" strokeDasharray="2 2" />
              <path d="M35 35 L12 58" stroke="#E31E24" strokeWidth="0.8" strokeDasharray="2 2" />
              <path d="M35 10 L58 12" stroke="#E31E24" strokeWidth="0.5" opacity="0.5" />
            </svg>
          </div>

          {/* Hex dot tech pattern — right side column */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.12] z-10">
            <div className="flex flex-col gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="flex gap-1.5">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="w-1 h-1 rounded-full bg-[#E31E24]" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Left side vertical circuit track */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none z-10">
            <div className="h-full bg-gradient-to-b from-transparent via-[#E31E24]/10 to-transparent" />
            <div className="absolute top-1/4 left-0 w-full h-px bg-[#E31E24]/5" />
            <div className="absolute top-3/4 left-0 w-full h-px bg-[#E31E24]/5" />
            <div className="absolute top-1/2 left-0 w-1 h-1 rounded-full bg-[#E31E24]/20 -translate-y-1/2" />
            <div className="absolute top-1/4 left-0 w-1 h-1 rounded-full bg-[#E31E24]/15 -translate-y-1/2" />
            <div className="absolute top-3/4 left-0 w-1 h-1 rounded-full bg-[#E31E24]/15 -translate-y-1/2" />
          </div>

          {/* Bottom scanline glow */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E31E24]/20 to-transparent pointer-events-none z-10" />

          {/* ===== TOP RED BAR ===== */}
          <div className="relative bg-gradient-to-r from-[#E31E24] to-[#b0151a] px-5 py-3 flex items-center gap-3 overflow-hidden">
            {/* Tech line overlay on red bar */}
            <div className="absolute inset-0 opacity-[0.10]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.5) 8px, rgba(255,255,255,0.5) 9px)",
                  backgroundSize: "9px 100%",
                }}
              />
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-white/15" />
            <div className="absolute -right-3 -bottom-3 w-20 h-20 rounded-full border border-white/8" />

            {/* Logo */}
            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white/50 flex-shrink-0 bg-white/20 flex items-center justify-center relative z-10">
              <Image
                src="/images/logo-putih.jpeg"
                alt="PRO RI"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 relative z-10">
              <p className="text-[8px] text-white/70 font-mono uppercase tracking-[0.2em] leading-tight">
                Pusat Robotika Rakyat Indonesia
              </p>
              <h3 className="text-xs font-bold text-white tracking-wider mt-0.5">
                KARTU ANGGOTA PRO-RI
              </h3>
            </div>

            {/* Member number badge */}
            <div className="relative z-10 flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded border border-white/20">
              <Cpu className="h-2.5 w-2.5 text-white/60" />
              <span className="text-[9px] font-mono text-white/80 font-semibold tracking-wider">
                {card.member_number}
              </span>
            </div>
          </div>

          {/* ===== MAIN CONTENT - LANDSCAPE ===== */}
          <div className="flex flex-row p-5 gap-5 relative z-10">
            {/* LEFT SIDE - Photo + QR + Signature */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              {/* Photo */}
              <div className="h-24 w-24 rounded-xl overflow-hidden border-2 border-[#E31E24]/30 bg-gray-50 shadow-sm relative group">
                <div className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#E31E24]/40 rounded-tl pointer-events-none z-10" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#E31E24]/40 rounded-br pointer-events-none z-10" />
                {card.photo_url ? (
                  <img
                    src={card.photo_url}
                    alt={card.full_name}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#E31E24]/5 to-gray-100">
                    <span className="text-3xl font-bold text-[#E31E24] font-mono">
                      {card.full_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-lg border border-gray-200 p-1.5 shadow-sm relative">
                <div className="absolute -top-[2px] -left-[2px] w-2.5 h-2.5 border-t-[1.5px] border-l-[1.5px] border-[#E31E24]/30 rounded-tl pointer-events-none z-10" />
                <div className="absolute -bottom-[2px] -right-[2px] w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-[#E31E24]/30 rounded-br pointer-events-none z-10" />
                {originUrl ? (
                  <QRCodeCanvas
                    value={verifyUrl}
                    size={80}
                    bgColor="#ffffff"
                    fgColor="#E31E24"
                    level="M"
                  />
                ) : (
                  <div className="h-20 w-20 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-gray-300 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Signature */}
              {card.signature_url && (
                <div className="text-center w-full">
                  <p className="text-[7px] text-gray-400 font-mono uppercase tracking-wider mb-1">
                    Tanda Tangan
                  </p>
                  <div className="bg-gray-100 rounded-md p-2 border border-gray-200 flex items-center justify-center min-h-[36px]">
                    <img
                      src={card.signature_url}
                      alt="Signature"
                      className="h-7 max-w-[80px] object-contain"
                      style={{ filter: "brightness(0.3) contrast(1.5)" }}
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDE - Member Details */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Name */}
              <div>
                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <CircuitBoard className="h-2.5 w-2.5 text-[#E31E24]/60" />
                  Nama Lengkap
                </p>
                <p className="text-base font-bold text-gray-900 leading-tight">{card.full_name}</p>
                {card.nickname && <p className="text-xs text-gray-400">({card.nickname})</p>}
              </div>

              {/* Divider with tech accent */}
              <div className="relative">
                <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#E31E24]/40" />
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {card.address && (
                  <div className="col-span-2">
                    <p className="text-[9px] text-gray-400 font-mono uppercase tracking-wider flex items-center gap-1">
                      <Hexagon className="h-2 w-2 text-[#E31E24]/60" />
                      Alamat / Daerah
                    </p>
                    <p className="text-xs font-medium text-gray-800 line-clamp-2">{card.address}</p>
                  </div>
                )}
                <div>
                  <p className="text-[9px] text-gray-400 font-mono uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="h-2 w-2 text-green-600" />
                    Status
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-green-700">Aktif / Terverifikasi</span>
                  </div>
                </div>
              </div>

              {/* Interest Tags */}
              {card.interests && card.interests.length > 0 && (
                <div>
                  <p className="text-[9px] text-gray-400 font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Zap className="h-2 w-2 text-[#E31E24]/60" />
                    Bidang Minat
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {card.interests.slice(0, 4).map((i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 text-[9px] rounded bg-[#E31E24]/5 text-[#E31E24] border border-[#E31E24]/15 font-medium inline-flex items-center gap-0.5"
                      >
                        <span className="text-[6px] opacity-40">&lt;</span>
                        {i}
                        <span className="text-[6px] opacity-40">/&gt;</span>
                      </span>
                    ))}
                    {card.interests.length > 4 && (
                      <span className="px-1.5 py-0.5 text-[9px] rounded bg-gray-100 text-gray-400 font-mono">
                        +{card.interests.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Tech specs bar */}
              <div className="pt-1">
                <div className="flex items-center gap-2 text-[7px] text-gray-300 font-mono tracking-wider">
                  <Cpu className="h-2.5 w-2.5" />
                  <span>ID: {card.member_number.slice(-6)}</span>
                  <span className="text-gray-200">|</span>
                  <span>v2.0</span>
                  <span className="text-gray-200">|</span>
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== BOTTOM FOOTER ===== */}
          <div className="border-t border-gray-100 px-5 py-2 flex items-center justify-between bg-gray-50/50">
            <p className="text-[7px] text-gray-400 font-mono tracking-wider truncate max-w-[60%]">
              {verifyUrl}
            </p>
            <p className="text-[7px] text-gray-400 font-mono tracking-wider flex-shrink-0">
              PRO-RI * Pusat Robotika Rakyat Indonesia
            </p>
          </div>

          {/* Bottom scanline effect */}
          <div className="h-[3px] bg-gradient-to-r from-transparent via-[#E31E24]/25 to-transparent" />
        </div>
      </div>

      {/* ===== ACTIONS ===== */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadPNG}
          className="border-emerald-500/30 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/60 transition-all"
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Download PNG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadJPG}
          className="border-sky-500/30 text-sky-400 hover:text-sky-300 hover:border-sky-500/60 transition-all"
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Download JPG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadPDF}
          className="border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 transition-all dark:border-gray-600 dark:text-gray-300 dark:hover:text-white"
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Download PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 transition-all dark:border-gray-600 dark:text-gray-300 dark:hover:text-white"
        >
          <Printer className="h-3.5 w-3.5 mr-1.5" />
          Cetak
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(verifyUrl);
            toast.success("Link verifikasi disalin");
          }}
          className="border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 transition-all dark:border-gray-600 dark:text-gray-300 dark:hover:text-white"
        >
          <Share2 className="h-3.5 w-3.5 mr-1.5" />
          Salin Link
        </Button>
      </div>
    </div>
  );
}
