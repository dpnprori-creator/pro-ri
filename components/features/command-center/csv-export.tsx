"use client";

import { useState } from "react";
import { Download, Loader2, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProvinceStats } from "@/features/command-center/data";

interface CsvExportProps {
  provinces: ProvinceStats[];
  filename?: string;
}

export function ProvinceCsvExport({ provinces, filename = "data-provinsi" }: CsvExportProps) {
  const [loading, setLoading] = useState(false);

  function escapeCsv(value: string | number): string {
    const str = String(value);
    // Escape quotes by doubling them, wrap in quotes if contains comma, quote, or newline
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  function handleExport() {
    setLoading(true);

    try {
      const sorted = [...provinces].sort((a, b) => b.total_members - a.total_members);
      const totalMembers = sorted.reduce((s, p) => s + p.total_members, 0);
      const totalTrainers = sorted.reduce((s, p) => s + p.total_trainers, 0);
      const totalMentors = sorted.reduce((s, p) => s + p.total_mentors, 0);
      const totalEvents = sorted.reduce((s, p) => s + p.total_events, 0);
      const totalInnovations = sorted.reduce((s, p) => s + p.total_innovations, 0);

      // Build rows
      const rows: string[][] = [];
      
      // Header row
      rows.push([
        "No",
        "Provinsi",
        "Kode",
        "Total Anggota",
        "Trainer",
        "Mentor",
        "Events",
        "Inovasi",
      ]);

      // Empty separator
      rows.push([]);

      // Data rows with numbering
      sorted.forEach((p, i) => {
        rows.push([
          String(i + 1),
          p.name,
          p.code,
          String(p.total_members),
          String(p.total_trainers),
          String(p.total_mentors),
          String(p.total_events),
          String(p.total_innovations),
        ]);
      });

      // Empty separator
      rows.push([]);

      // Summary row
      rows.push([
        "",
        "TOTAL NASIONAL",
        "",
        String(totalMembers),
        String(totalTrainers),
        String(totalMentors),
        String(totalEvents),
        String(totalInnovations),
      ]);

      // Build CSV content
      const csvContent = rows
        .map((row) => row.map((cell) => escapeCsv(cell)).join(","))
        .join("\n");

      // Add BOM for Excel compatibility + UTF-8
      const bom = "\uFEFF";
      const blob = new Blob([bom + csvContent], { 
        type: "text/csv;charset=utf-8;" 
      });

      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `${filename}-${dateStr}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV Export failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      variant="outline"
      size="sm"
      className="border-white/10 text-pri-silver hover:text-white hover:border-pri-red/30 text-xs h-8 gap-1.5"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <FileSpreadsheet className="h-3.5 w-3.5 text-green-400" />
      )}
      {loading ? "Mengekspor..." : "Export CSV"}
    </Button>
  );
}
