import { BADGE_LABELS, type BadgeItem, type BadgeKey } from "@/lib/types";
import type { CustomPromotionStyle } from "@/lib/promotions";
import { cn } from "@/lib/cn";

const DEFAULT_STYLE = "bg-black text-white";

const STANDARD_STYLES: Partial<Record<BadgeKey, string>> = {
  OUT_OF_STOCK: "bg-neutral-800 text-white",
  HEAVY_DISCOUNT: "bg-black text-white",
  SALE: "bg-black text-white",
  BEST_PRICE: "bg-black text-white",
};

const CUSTOM_STYLES: Record<CustomPromotionStyle, string> = {
  DARK: "bg-black text-white",
  ACCENT: "bg-black text-white",
  GRAY: "bg-neutral-800 text-white",
};

export function ProductBadge({ item, className }: { item: BadgeItem; className?: string }) {
  const label = item.kind === "standard" ? BADGE_LABELS[item.key] : item.label;
  const style = item.kind === "standard" ? STANDARD_STYLES[item.key] ?? DEFAULT_STYLE : CUSTOM_STYLES[item.style];

  return (
    <span
      className={cn(
        "inline-block px-2.5 py-1 text-[10px] md:text-[11px] font-bold leading-none tracking-widest uppercase font-display bg-black text-white rounded-none shadow-md border-0",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
