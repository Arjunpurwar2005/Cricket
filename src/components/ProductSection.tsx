import Link from "next/link";
import type { ParsedProduct } from "@/lib/types";
import type { Settings } from "@/lib/settings";
import { ProductGrid } from "@/components/ProductGrid";

export function ProductSection({
  title,
  products,
  settings,
  viewAllHref,
}: {
  title: string;
  products: ParsedProduct[];
  settings: Settings;
  viewAllHref?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-6 md:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl md:text-4xl uppercase tracking-wide">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-[12px] uppercase tracking-wide text-accent-dark hover:underline">
            View All →
          </Link>
        )}
      </div>
      <ProductGrid products={products} settings={settings} columns="grid-cols-2 md:grid-cols-4" />
    </section>
  );
}
