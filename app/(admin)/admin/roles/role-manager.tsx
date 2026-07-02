"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Search, UserCheck, Mail, Fingerprint, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { updateMemberRole, searchMembers } from "@/features/admin/actions";
import { toast } from "sonner";

interface Role {
  id: string;
  name: string;
  description: string | null;
}

interface RoleManagerProps {
  roles: Role[];
}

export function RoleManager({ roles }: RoleManagerProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string; email: string; member_id: string } | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!memberSearch.trim()) return;
    setSearching(true);
    setSelectedMember(null);

    const results = await searchMembers(memberSearch);
    setSearchResults(results);
    setSearching(false);
  };

  const handleRoleChange = async (memberId: string, roleId: string) => {
    setSaving(true);
    const result = await updateMemberRole(memberId, roleId);
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Role berhasil diubah");
      setDialogOpen(false);
      setSelectedMember(null);
      setSearchResults([]);
      setMemberSearch("");
      router.refresh();
    }
  };

  const roleBadge = (roleId: string | null) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return <Badge variant="outline" className="text-[10px]">No Role</Badge>;
    const variants: Record<string, "default" | "secondary" | "success" | "warning" | "danger"> = {
      super_admin: "danger",
      admin: "warning",
      member: "default",
      guest: "secondary",
    };
    return (
      <Badge variant={variants[role.name] || "default"} className="text-[10px]">
        {role.name === "super_admin" ? "Super Admin" : role.name.charAt(0).toUpperCase() + role.name.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-pri-red" />
          Assign Role ke Member
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-pri-silver">
          Cari member dan ubah rolenya. Hanya Super Admin yang memiliki akses ini.
        </p>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Shield className="h-4 w-4 mr-2" />
          Assign Role
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Assign Role</DialogTitle>
              <DialogDescription>
                Cari member berdasarkan nama, email, atau ID member
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <Label>Cari Member</Label>
                <div className="flex gap-2">
                  <Input
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Nama, email, atau member ID..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleSearch}
                    disabled={searching || !memberSearch.trim()}
                    size="sm"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-48 overflow-y-auto space-y-1.5">
                {searchResults.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setSelectedMember({ id: member.id, name: member.full_name, email: member.email, member_id: member.member_id })}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                      selectedMember?.id === member.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{member.full_name}</span>
                      {roleBadge(member.role_id)}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-pri-silver flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </span>
                      <span className="text-xs text-pri-silver flex items-center gap-1">
                        <Fingerprint className="h-3 w-3" />
                        {member.member_id}
                      </span>
                    </div>
                  </button>
                ))}
                {searchResults.length === 0 && memberSearch && !searching && (
                  <p className="text-sm text-pri-silver text-center py-4">
                    Tidak ada member ditemukan
                  </p>
                )}
                {searching && (
                  <p className="text-sm text-pri-silver text-center py-4">
                    Mencari...
                  </p>
                )}
              </div>

              {/* Role Selection */}
              {selectedMember && (
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <Label className="text-sm">
                    Pilih Role untuk <span className="text-white font-semibold">{selectedMember.name}</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((role) => {
                      const icons: Record<string, React.ReactNode> = {
                        super_admin: <Shield className="h-4 w-4 text-red-400" />,
                        admin: <Shield className="h-4 w-4 text-yellow-400" />,
                        member: <UserCheck className="h-4 w-4 text-blue-400" />,
                      };
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => handleRoleChange(selectedMember.id, role.id)}
                          disabled={saving}
                          className="p-3 rounded-lg border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors text-left flex items-start gap-3"
                        >
                          <div className="mt-0.5">{icons[role.name] || <Shield className="h-4 w-4 text-pri-silver" />}</div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {role.name === "super_admin" ? "Super Admin" : role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                            </p>
                            {role.description && (
                              <p className="text-xs text-pri-silver mt-0.5">{role.description}</p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex items-center justify-between">
              <p className="text-[10px] text-pri-silver">
                {saving ? "Menyimpan..." : "Perubahan akan langsung diterapkan"}
              </p>
              <Button type="button" variant="outline" onClick={() => {
                setDialogOpen(false);
                setSelectedMember(null);
                setSearchResults([]);
                setMemberSearch("");
              }}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
