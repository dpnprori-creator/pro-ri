"use client";

/**
 * Generate and download a CSV file from tabular data.
 * Includes UTF-8 BOM for Excel compatibility.
 */
export function downloadCSV(
  rows: string[][],
  filename: string
) {
  // Escape CSV values
  const escapeCsv = (value: string): string => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvContent = rows
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  // Add BOM for Excel UTF-8 support
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `${filename}-${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format members data for CSV export
 */
export function formatMembersCSV(members: any[]) {
  const rows: string[][] = [];

  // Header
  rows.push([
    "No",
    "Nama Lengkap",
    "Email",
    "Member ID",
    "Telepon",
    "Role",
    "Status",
    "Provinsi",
    "Bergabung",
  ]);

  // Data
  members.forEach((m, i) => {
    const roleName = m.role_id?.name || m.role_name || "-";
    const provinceName = m.province_id?.name || m.province_name || "-";
    rows.push([
      String(i + 1),
      m.full_name || "-",
      m.email || "-",
      m.member_id || "-",
      m.phone || "-",
      roleName,
      m.status || "-",
      provinceName,
      m.created_at ? new Date(m.created_at).toLocaleDateString("id-ID") : "-",
    ]);
  });

  return rows;
}

/**
 * Format events data for CSV export
 */
export function formatEventsCSV(events: any[]) {
  const rows: string[][] = [];

  rows.push([
    "No",
    "Judul",
    "Kategori",
    "Tipe",
    "Lokasi",
    "Mulai",
    "Selesai",
    "Status",
    "Max Peserta",
  ]);

  events.forEach((e, i) => {
    rows.push([
      String(i + 1),
      e.title || "-",
      e.category || "-",
      e.type || "-",
      e.location || "-",
      e.start_date ? new Date(e.start_date).toLocaleDateString("id-ID") : "-",
      e.end_date ? new Date(e.end_date).toLocaleDateString("id-ID") : "-",
      e.status || "-",
      String(e.max_participants ?? "-"),
    ]);
  });

  return rows;
}

/**
 * Format programs data for CSV export
 */
export function formatProgramsCSV(programs: any[]) {
  const rows: string[][] = [];

  rows.push(["No", "Judul", "Label", "Status", "Target", "Max Peserta", "Urutan"]);

  programs.forEach((p, i) => {
    rows.push([
      String(i + 1),
      p.title || "-",
      p.label || "-",
      p.status || "-",
      p.target_audience || "-",
      String(p.max_participants ?? "-"),
      String(p.sort_order ?? "-"),
    ]);
  });

  return rows;
}
