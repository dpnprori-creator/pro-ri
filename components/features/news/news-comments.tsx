"use client";

import { useState } from "react";
import { MessageSquare, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitComment } from "@/features/news/news-actions";
import { toast } from "sonner";

interface Comment {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

interface NewsCommentsProps {
  newsId: string;
  initialComments: Comment[];
}

export function NewsComments({ newsId, initialComments }: NewsCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    form.append("newsId", newsId);

    const result = await submitComment(form);

    setSaving(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Komentar berhasil ditambahkan");
      (e.target as HTMLFormElement).reset();
      // Refresh comments
      const { getNewsComments } = await import("@/features/news/news-actions");
      const updated = await getNewsComments(newsId);
      setComments(updated);
    }
  };

  return (
    <div className="mt-10 space-y-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-pri-red" />
        Komentar ({comments.length})
      </h3>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-pri-silver/60 py-4 text-center">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="glass rounded-lg p-4 border border-white/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-pri-red/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-pri-red" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{comment.name}</p>
                  <p className="text-[10px] text-pri-silver/50">
                    {new Date(comment.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-pri-silver leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="glass rounded-lg p-5 border border-white/5 space-y-4">
        <h4 className="text-sm font-semibold text-white">Tinggalkan Komentar</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="comment-name" className="text-xs text-pri-silver">
              Nama <span className="text-pri-red">*</span>
            </Label>
            <Input
              id="comment-name"
              name="name"
              required
              placeholder="Nama Anda"
              className="bg-pri-dark/50 border-white/10 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="comment-email" className="text-xs text-pri-silver">
              Email <span className="text-pri-silver/40">(opsional)</span>
            </Label>
            <Input
              id="comment-email"
              name="email"
              type="email"
              placeholder="email@contoh.com"
              className="bg-pri-dark/50 border-white/10 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="comment-content" className="text-xs text-pri-silver">
            Komentar <span className="text-pri-red">*</span>
          </Label>
          <textarea
            id="comment-content"
            name="content"
            required
            rows={3}
            placeholder="Tulis komentar Anda..."
            className="flex w-full rounded-md border border-white/10 bg-pri-dark/50 px-3 py-2 text-sm text-white placeholder:text-pri-silver/50 focus:outline-none focus:ring-1 focus:ring-pri-red/50"
          />
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="bg-pri-red hover:bg-red-700 text-white text-sm"
        >
          <Send className="h-3.5 w-3.5 mr-1.5" />
          {saving ? "Mengirim..." : "Kirim Komentar"}
        </Button>
      </form>
    </div>
  );
}
