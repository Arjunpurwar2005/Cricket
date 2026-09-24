"use client";

import { useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A-Z" },
  { value: "featured", label: "Featured" },
];

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const value = searchParams.get("sort") ?? "latest";

  const onChange = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", next);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-border bg-bg-page px-3 py-2.5 text-[12px] uppercase tracking-wide cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-dark"
      aria-label="Sort products"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
