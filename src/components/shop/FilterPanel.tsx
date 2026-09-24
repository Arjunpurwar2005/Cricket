"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inStock = searchParams.get("inStock") === "1";

  const toggle = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) params.set("inStock", "1");
    else params.delete("inStock");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <label className="inline-flex items-center gap-2.5 text-sm cursor-pointer select-none -ml-1 py-1.5 pl-1 pr-3 rounded-sm hover:bg-bg-card transition-colors duration-150">
      <input
        type="checkbox"
        checked={inStock}
        onChange={(e) => toggle(e.target.checked)}
        className="w-4 h-4 accent-accent-dark cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-dark focus-visible:ring-offset-2"
      />
      <span className="uppercase tracking-wide text-[12px] text-text-primary">In Stock Only</span>
    </label>
  );
}
