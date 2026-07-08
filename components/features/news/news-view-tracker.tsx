"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function NewsViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const trackView = async () => {
      try {
        const supabase = createClient();
        await (supabase.rpc as any)("increment_view_count", {
          slug_param: slug,
        });
      } catch (err) {
        // Silently fail — view tracking is non-critical
        console.debug("View tracking skipped:", err);
      }
    };

    trackView();
  }, [slug]);

  return null;
}
