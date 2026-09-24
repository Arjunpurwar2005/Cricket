"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <form onSubmit={submit} className="w-full sm:flex-1 sm:max-w-sm">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products, brands, SKU..."
        className="w-full border border-border bg-bg-page px-3 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-dark focus:border-accent-dark transition-colors duration-150"
        aria-label="Search products"
      />
    </form>
  );
}
