"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-pri-dark group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-pri-silver",
          actionButton:
            "group-[.toast]:bg-pri-red group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-pri-dark group-[.toast]:text-pri-silver",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
