"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2, XCircle, Clock, Eye,
  User, Mail, BookOpen,
  Heart, AlertCircle, Camera, Pen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DataTable,
  type Column,
} from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { approveMemberCard, rejectMemberCard } from "@/features/admin/member-card-actions";
import { toast } from "sonner";

interface MemberCardItem {
  id: string;
  user_id: string;
  member_number: string | null;
  status: string;
  rejection_reason: string | null;
  full_name: string;
  nickname: string | null;
  phone: string;
  email: string | null;
  birth_place: string | null;
  birth_date: string | null;
  gender: string | null;
  religion: string | null;
  nik: string | null;
  education: string | null;
  occupation: string | null;
  address: string | null;
  interests: string[] | null;
  skills: string[] | null;
  experience: string | null;
  motivation: string | null;
  photo_url: string | null;
  signature_url: string | null;
  created_at: string;
}

const columns: Column<MemberCardItem>[] = [
  {
    key: "status",
    label: "Status",
    render: (item) => (
      item.status === "approved" ? (
        <Badge variant="success">Disetujui</Badge>
      ) : item.status === "rejected" ? (
        <Badge variant="danger">Ditolak</Badge>
      ) : (
        <Badge variant="warning">Pending</Badge>
      )
    ),
  },
  {
    key: "full_name",
    label: "Nama",
    render: (item) => (
      <div>
        <p className="text-sm text-white">{item.full_name}</p>
        {item.member_number && (
          <p className="text-xs font-mono text-pri-silver">{item.member_number}</p>
        )}
      </div>
    ),
  },
  {
    key: "phone",
    label: "Kontak",
    render: (item) => (
      <div className="text-xs text-pri-silver">
        <p>{item.email || "-"}</p>
        <p>{item.phone}</p>
      </div>
    ),
  },
  {
    key: "created_at",
    label: "Tanggal Daftar",
    sortable: true,
    render: (item) => (
      <span className="text-xs text-pri-silver">
        {new Date(item.created_at).toLocaleDateString("id-ID", {
          day: "numeric", month: "short", year: "numeric",
        })}
      </span>
    ),
  },
];

export function MemberVerificationManager({ initialData }: { initialData: MemberCardItem[] }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [selected, setSelected] = useState<MemberCardItem | null>(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState<{
    type: "approved" | "rejected";
    item: MemberCardItem;
  } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const openView = (item: MemberCardItem) => {
    setSelected(item);
    setViewDialog(true);
  };

  const handleAction = async () => {
    if (!actionDialog) return;
    setProcessing(true);

    let result;
    if (actionDialog.type === "approved") {
      result = await approveMemberCard(actionDialog.item.id);
    } else {
      result = await rejectMemberCard(actionDialog.item.id, rejectionReason);
    }

    setProcessing(false);
    setActionDialog(null);
    setRejectionReason("");

    if (result?.error) {
      toast.error(result.error);
    } else {
      // Update local state immediately so UI reflects the change without waiting for server refresh
      setData((prev) =>
        prev.map((item) =>
          item.id === actionDialog.item.id
            ? {
                ...item,
                status: actionDialog.type === "approved" ? "approved" : "rejected",
                member_number:
                  actionDialog.type === "approved" && result && "memberNumber" in result
                    ? ((result as { memberNumber?: string }).memberNumber ?? item.member_number)
                    : item.member_number,
              }
            : item
        )
      );

      const memberNumber = result && "memberNumber" in result ? (result as { memberNumber?: string }).memberNumber : undefined;
      toast.success(
        actionDialog.type === "approved"
          ? `Kartu diterbitkan! Nomor: ${memberNumber || "-"}`
          : "Data ditolak"
      );
      router.refresh();
    }
  };

  const pendingCount = data.filter(d => d.status === "pending").length;
  const approvedCount = data.filter(d => d.status === "approved").length;
  const rejectedCount = data.filter(d => d.status === "rejected").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card-hover text-center p-4">
          <CardContent className="p-0">
            <Clock className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white font-mono">{pendingCount}</div>
            <div className="text-xs text-pri-silver">Menunggu</div>
          </CardContent>
        </Card>
        <Card className="glass-card-hover text-center p-4">
          <CardContent className="p-0">
            <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white font-mono">{approvedCount}</div>
            <div className="text-xs text-pri-silver">Disetujui</div>
          </CardContent>
        </Card>
        <Card className="glass-card-hover text-center p-4">
          <CardContent className="p-0">
            <XCircle className="h-5 w-5 text-red-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-white font-mono">{rejectedCount}</div>
            <div className="text-xs text-pri-silver">Ditolak</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        searchKeys={["full_name", "email", "phone", "member_number"]}
        searchPlaceholder="Cari anggota..."
        pageSize={10}
        emptyMessage="Belum ada data anggota yang didaftarkan"
        actions={(item) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => openView(item)}>
              <Eye className="h-3.5 w-3.5 mr-1" />
              Detail
            </Button>
            {item.status === "pending" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-400 hover:text-green-300"
                  onClick={() => setActionDialog({ type: "approved", item })}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Setujui
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                  onClick={() => setActionDialog({ type: "rejected", item })}
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Tolak
                </Button>
              </>
            )}
          </div>
        )}
      />

      {/* View Detail Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <User className="h-5 w-5 text-pri-red" />
              Detail Data Anggota
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-2">
                {selected.status === "approved" ? (
                  <Badge variant="success">Disetujui</Badge>
                ) : selected.status === "rejected" ? (
                  <Badge variant="danger">Ditolak</Badge>
                ) : (
                  <Badge variant="warning">Menunggu Verifikasi</Badge>
                )}
                <span className="text-xs text-pri-silver">
                  Daftar: {new Date(selected.created_at).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </span>
              </div>

              {/* Rejection reason */}
              {selected.status === "rejected" && selected.rejection_reason && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-red-300">Alasan Ditolak:</p>
                    <p className="text-xs text-pri-silver">{selected.rejection_reason}</p>
                  </div>
                </div>
              )}

              {/* Photo + Signature */}
              <div className="grid grid-cols-2 gap-4">
                {selected.photo_url && (
                  <div className="space-y-1">
                    <p className="text-xs font-mono uppercase tracking-wider text-pri-red flex items-center gap-1">
                      <Camera className="h-3 w-3" />
                      Foto
                    </p>
                    <img
                      src={selected.photo_url}
                      alt="Photo"
                      className="w-full h-40 object-cover rounded-lg border border-white/10"
                    />
                  </div>
                )}
                {selected.signature_url && (
                  <div className="space-y-1">
                    <p className="text-xs font-mono uppercase tracking-wider text-pri-red flex items-center gap-1">
                      <Pen className="h-3 w-3" />
                      Tanda Tangan
                    </p>
                    <div className="h-40 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-4">
                      <img
                        src={selected.signature_url}
                        alt="Signature"
                        className="max-h-full max-w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              <DataSection title="Data Pribadi" icon={<User className="h-4 w-4" />}>
                <DataRow label="Nama Lengkap" value={selected.full_name} />
                <DataRow label="Nama Panggilan" value={selected.nickname} />
                <DataRow label="Jenis Kelamin" value={selected.gender} />
                <DataRow label="Tempat Lahir" value={selected.birth_place} />
                <DataRow label="Tanggal Lahir" value={selected.birth_date ? new Date(selected.birth_date).toLocaleDateString("id-ID") : null} />
                <DataRow label="Agama" value={selected.religion} />
                <DataRow label="NIK" value={selected.nik} />
              </DataSection>

              <DataSection title="Kontak" icon={<Mail className="h-4 w-4" />}>
                <DataRow label="Email" value={selected.email} />
                <DataRow label="Telepon" value={selected.phone} />
                <DataRow label="Alamat" value={selected.address} />
              </DataSection>

              <DataSection title="Pendidikan & Pekerjaan" icon={<BookOpen className="h-4 w-4" />}>
                <DataRow label="Pendidikan" value={selected.education} />
                <DataRow label="Pekerjaan" value={selected.occupation} />
              </DataSection>

              <DataSection title="Minat & Keahlian" icon={<Heart className="h-4 w-4" />}>
                <div className="space-y-1">
                  <p className="text-xs text-pri-silver">Bidang Minat</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.interests?.map(i => (
                      <span key={i} className="px-2 py-0.5 text-[10px] rounded bg-pri-red/10 text-pri-red">{i}</span>
                    )) || <span className="text-xs text-pri-silver">-</span>}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-pri-silver">Keahlian</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.skills?.map(s => (
                      <span key={s} className="px-2 py-0.5 text-[10px] rounded bg-white/5 text-pri-silver">{s}</span>
                    )) || <span className="text-xs text-pri-silver">-</span>}
                  </div>
                </div>
                <DataRow label="Pengalaman" value={selected.experience} />
                <DataRow label="Motivasi" value={selected.motivation} />
              </DataSection>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setViewDialog(false)}>
              Tutup
            </Button>
            {selected?.status === "pending" && (
              <>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setViewDialog(false);
                    setActionDialog({ type: "approved", item: selected });
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Terbitkan Kartu
                </Button>
                <Button
                  variant="outline"
                  className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                  onClick={() => {
                    setViewDialog(false);
                    setActionDialog({ type: "rejected", item: selected });
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Tolak
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirm Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {actionDialog?.type === "approved" ? "Terbitkan Member Card" : "Tolak Data Anggota"}
            </DialogTitle>
          </DialogHeader>

          {actionDialog?.type === "approved" ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-300">Konfirmasi Verifikasi</p>
                  <p className="text-xs text-pri-silver mt-1">
                    Data <strong>{actionDialog.item.full_name}</strong> akan diverifikasi dan
                    Member Card akan diterbitkan secara otomatis dengan nomor anggota baru.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <XCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-300">Alasan Penolakan</p>
                  <p className="text-xs text-pri-silver mt-1">
                    Berikan alasan agar anggota dapat memperbaiki datanya.
                  </p>
                </div>
              </div>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Cth: Data NIK tidak sesuai, foto tidak jelas, tanda tangan perlu diperbaiki..."
                className="flex w-full rounded-md border border-white/20 bg-pri-dark px-3 py-2 text-sm text-white placeholder:text-pri-silver"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Batal
            </Button>
            <Button
              className={
                actionDialog?.type === "approved"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
              disabled={processing || (actionDialog?.type === "rejected" && !rejectionReason.trim())}
              onClick={handleAction}
            >
              {processing ? "Memproses..." : actionDialog?.type === "approved" ? "Ya, Terbitkan Kartu" : "Tolak Data"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DataSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-mono uppercase tracking-wider text-pri-red flex items-center gap-1.5">
        {icon}
        {title}
      </h4>
      <div className="bg-white/3 rounded-lg p-3 space-y-2">
        {children}
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between">
      <span className="text-xs text-pri-silver">{label}</span>
      <span className="text-xs text-white text-right max-w-[60%] truncate">{value || "-"}</span>
    </div>
  );
}
