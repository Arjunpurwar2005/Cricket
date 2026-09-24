import type { ReactNode } from "react";
import type { ParsedProduct } from "@/lib/types";
import type { Settings } from "@/lib/settings";
import { ProductCard } from "@/components/ProductCard";

export function ProductGrid({
  products,
  settings,
  columns = "grid-cols-2 md:grid-cols-3",
  gap = "gap-3 md:gap-6",
  emptyState,
}: {
  products: ParsedProduct[];
  settings: Settings;
  columns?: string;
  gap?: string;
  emptyState?: ReactNode;
}) {
  if (products.length === 0) {
    return (
      emptyState ?? (
        <div className="py-24 text-center">
          <p className="text-sm uppercase tracking-widest text-text-secondary">No products found</p>
        </div>
      )
    );
  }

  return (
    <div className={`grid ${columns} ${gap} items-stretch`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} settings={settings} />
      ))}
    </div>
  );
}
