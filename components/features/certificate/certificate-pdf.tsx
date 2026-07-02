"use client";

import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

interface CertificateData {
  certificate_number: string;
  member_name: string;
  member_id: string;
  title: string;
  type: string;
  issued_at: string;
  verified: boolean;
}

const typeLabel: Record<string, string> = {
  participant: "Partisipasi",
  trainer: "Trainer",
  mentor: "Mentor",
  winner: "Pemenang",
};

export function CertificatePDF({ data }: { data: CertificateData }) {
  const certRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setLoading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        backgroundColor: "#0F1117",
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width / 3, canvas.height / 3],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 3, canvas.height / 3);
      pdf.save(`sertifikat-${data.certificate_number}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden certificate for PDF capture */}
      <div ref={certRef} style={{ position: "fixed", left: "-9999px", top: 0 }}>
        <CertificatePrintView data={data} />
      </div>

      <Button
        onClick={handleDownload}
        disabled={loading}
        className="w-full bg-pri-red hover:bg-red-700 h-12 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Membuat PDF...
          </>
        ) : (
          <>
            <Download className="h-5 w-5 mr-2" />
            Download Sertifikat (PDF)
          </>
        )}
      </Button>
    </div>
  );
}

function CertificatePrintView({ data }: { data: CertificateData }) {
  return (
    <div
      style={{
        width: "900px",
        height: "636px",
        background: "linear-gradient(135deg, #0F1117 0%, #1B1F2A 100%)",
        border: "2px solid rgba(227, 30, 36, 0.4)",
        borderRadius: "16px",
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          border: "40px solid rgba(227, 30, 36, 0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "-40px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          border: "30px solid rgba(227, 30, 36, 0.06)",
        }}
      />

      {/* Top border accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: "linear-gradient(90deg, #E31E24, #ff6b6b, #E31E24)",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        {/* Logo area */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#E31E24",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 0 30px rgba(227, 30, 36, 0.3)",
            overflow: "hidden",
          }}
        >
          <img
            src="/images/logo-putih.jpeg"
            alt="PRO RI"
            crossOrigin="anonymous"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* Organization name */}
        <p
          style={{
            color: "rgba(227, 30, 36, 0.8)",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          {APP_NAME}
        </p>

        {/* Title */}
        <h1
          style={{
            color: "white",
            fontSize: "36px",
            fontWeight: 700,
            marginBottom: "24px",
            lineHeight: 1.2,
          }}
        >
          Sertifikat {typeLabel[data.type] || data.type}
        </h1>

        {/* Divider */}
        <div
          style={{
            width: "120px",
            height: "3px",
            background: "linear-gradient(90deg, transparent, #E31E24, transparent)",
            margin: "0 auto 24px",
          }}
        />

        {/* Recipient */}
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
            marginBottom: "8px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Diberikan kepada
        </p>
        <p
          style={{
            color: "white",
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          {data.member_name}
        </p>

        {/* Description */}
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "14px",
            marginBottom: "4px",
          }}
        >
          Atas partisipasinya sebagai
        </p>
        <p
          style={{
            color: "#E31E24",
            fontSize: "20px",
            fontWeight: 600,
            marginBottom: "24px",
          }}
        >
          {data.title}
        </p>

        {/* Divider */}
        <div
          style={{
            width: "80px",
            height: "2px",
            background: "rgba(255,255,255,0.1)",
            margin: "0 auto 24px",
          }}
        />

        {/* Details */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <div>
            <p style={{ marginBottom: "4px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
              Nomor Sertifikat
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "monospace" }}>
              {data.certificate_number}
            </p>
          </div>
          <div>
            <p style={{ marginBottom: "4px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
              Member ID
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "monospace" }}>
              {data.member_id}
            </p>
          </div>
          <div>
            <p style={{ marginBottom: "4px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
              Diterbitkan
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)" }}>
              {new Date(data.issued_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Verification badge */}
        <div
          style={{
            marginTop: "24px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 16px",
            borderRadius: "20px",
            background: data.verified
              ? "rgba(34, 197, 94, 0.15)"
              : "rgba(234, 179, 8, 0.15)",
            border: `1px solid ${
              data.verified ? "rgba(34, 197, 94, 0.3)" : "rgba(234, 179, 8, 0.3)"
            }`,
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: data.verified ? "#22c55e" : "#eab308",
            }}
          />
          <span
            style={{
              color: data.verified ? "#22c55e" : "#eab308",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {data.verified ? "TERVERIFIKASI" : "BELUM DIVERIFIKASI"}
          </span>
        </div>
      </div>
    </div>
  );
}
