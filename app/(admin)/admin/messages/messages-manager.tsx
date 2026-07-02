"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Trash2, CheckCheck, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { markMessageRead, deleteContactMessage } from "@/features/admin/actions";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function MessagesManager({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const unreadCount = messages.filter((m) => !m.is_read).length;

  const handleMarkRead = async (messageId: string, isRead: boolean) => {
    await markMessageRead(messageId, isRead);
    toast.success(isRead ? "Ditandai sudah dibaca" : "Ditandai belum dibaca");
    router.refresh();
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm("Yakin ingin menghapus pesan ini?")) return;
    const result = await deleteContactMessage(messageId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Pesan dihapus");
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-pri-red" />
            <div>
              <p className="text-2xl font-bold text-white font-mono">{messages.length}</p>
              <p className="text-xs text-pri-silver">Total Pesan</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <Mail className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white font-mono">{unreadCount}</p>
              <p className="text-xs text-pri-silver">Belum Dibaca</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCheck className="h-8 w-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white font-mono">{messages.length - unreadCount}</p>
              <p className="text-xs text-pri-silver">Sudah Dibaca</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="h-16 w-16 text-pri-silver/30 mx-auto mb-4" />
          <p className="text-pri-silver">Belum ada pesan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className={`glass-card-hover transition-all duration-200 ${
                !msg.is_read ? "border-l-2 border-l-pri-red" : ""
              }`}
            >
              <CardContent className="p-0">
                {/* Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-3 w-3 rounded-full shrink-0 ${
                        !msg.is_read ? "bg-pri-red" : "bg-transparent border border-white/20"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${!msg.is_read ? "font-semibold text-white" : "text-pri-silver"}`}>
                        {msg.name}
                      </p>
                      <p className="text-xs text-pri-silver/60 truncate">{msg.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-pri-silver/50 hidden sm:block">
                      {new Date(msg.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {expandedId === msg.id ? (
                      <ChevronUp className="h-4 w-4 text-pri-silver" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-pri-silver" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === msg.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-white/5">
                    <div className="mt-3 space-y-3">
                      {/* Contact Info */}
                      <div className="flex flex-wrap gap-4 text-xs text-pri-silver">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {msg.email}
                        </span>
                        {msg.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {msg.phone}
                          </span>
                        )}
                        <span className="text-pri-silver/50">
                          {new Date(msg.created_at).toLocaleString("id-ID")}
                        </span>
                      </div>

                      {/* Message Body */}
                      <div className="glass rounded-lg p-4">
                        <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
                          {msg.message}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-pri-silver hover:text-green-400"
                          onClick={() => handleMarkRead(msg.id, !msg.is_read)}
                        >
                          <CheckCheck className="h-4 w-4 mr-1" />
                          {msg.is_read ? "Tandai Belum Dibaca" : "Tandai Dibaca"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(msg.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
