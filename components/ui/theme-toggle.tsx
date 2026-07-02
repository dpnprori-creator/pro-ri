"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "full";
}

export function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("h-9 w-9 rounded-lg bg-white/5 animate-pulse", className)} />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "full") {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200",
          "text-pri-silver hover:text-white hover:bg-white/5",
          className
        )}
        aria-label={isDark ? "Mode Terang" : "Mode Gelap"}
      >
        {isDark ? (
          <>
            <Sun className="h-4 w-4" />
            <span>Mode Terang</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4" />
            <span>Mode Gelap</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200",
        "text-pri-silver hover:text-white hover:bg-white/5",
        className
      )}
      aria-label={isDark ? "Mode Terang" : "Mode Gelap"}
      title={isDark ? "Mode Terang" : "Mode Gelap"}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}
