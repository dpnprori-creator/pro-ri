"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function EventShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button
      onClick={handleCopy}
      className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-pri-silver hover:bg-white/20 transition-all"
      title={copied ? "Tersalin!" : "Salin Tautan"}
    >
      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}
