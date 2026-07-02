"use client";

import { useState, useMemo } from "react";
import { Search, Users, MapPin, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MemberRow {
  id: string;
  member_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  occupation: string | null;
  status: string;
  province_id: string | null;
  province_name: string | null;
}

export function MemberDirectoryClient({ members }: { members: MemberRow[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filtered = useMemo(() => {
    let result = members;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.full_name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.member_id.toLowerCase().includes(q) ||
          m.occupation?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((m) => m.status === statusFilter);
    }

    return result;
  }, [members, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pri-silver" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari anggota (nama, email, ID)..."
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Semua status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Tidak Aktif</SelectItem>
            <SelectItem value="suspended">Diblokir</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-pri-silver">
        Menampilkan {filtered.length} anggota
        {search && ` (pencarian: "${search}")`}
      </p>

      {/* Member Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {paged.map((member) => (
          <div
            key={member.id}
            className="glass-card-hover p-4 flex items-start gap-4"
          >
            <div className="h-12 w-12 rounded-full bg-pri-red/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-pri-red">
                {member.full_name.charAt(0)}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-white truncate">
                  {member.full_name}
                </h3>
                <Badge
                  variant={
                    member.status === "active"
                      ? "success"
                      : member.status === "inactive"
                      ? "warning"
                      : "danger"
                  }
                  className="text-[10px] px-1.5 py-0"
                >
                  {member.status === "active"
                    ? "Aktif"
                    : member.status === "inactive"
                    ? "Nonaktif"
                    : "Blokir"}
                </Badge>
              </div>

              <p className="text-xs text-pri-silver font-mono mb-1">
                {member.member_id}
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-pri-silver">
                {member.province_name && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {member.province_name}
                  </span>
                )}
                {member.occupation && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {member.occupation}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {paged.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-pri-silver mx-auto mb-3" />
          <p className="text-sm text-pri-silver">Tidak ada anggota ditemukan</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-pri-silver">
          Halaman {safePage} dari {totalPages}
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={safePage <= 1}
            onClick={() => setPage(safePage - 1)}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={safePage >= totalPages}
            onClick={() => setPage(safePage + 1)}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
