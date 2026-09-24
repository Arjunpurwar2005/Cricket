"use client";

import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { cn } from "@/lib/cn";

type Props = {
  url: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "icon";
  className?: string;
};

export function WhatsAppButton({ url, children, variant = "solid", className }: Props) {
  const base = "inline-flex items-center justify-center gap-2 uppercase tracking-wide text-[13px] font-body transition-colors duration-150";

  const styles = {
    solid: "bg-whatsapp text-white px-6 py-3.5 hover:bg-whatsapp-dark",
    outline: "border border-accent-dark text-accent-dark px-6 py-3.5 hover:bg-accent-dark hover:text-white",
    icon: "w-9 h-9 rounded-full bg-whatsapp text-white",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, styles[variant], className)}
      aria-label={variant === "icon" ? "Enquire on WhatsApp" : undefined}
    >
      {variant !== "icon" && <WhatsAppIcon className="w-4 h-4" />}
      {variant === "icon" ? <WhatsAppIcon className="w-4 h-4 mx-auto" /> : children}
    </a>
  );
}
