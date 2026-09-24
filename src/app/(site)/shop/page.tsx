import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { getPublishedProducts, type SortOption } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { SortDropdown } from "@/components/shop/SortDropdown";
import { SearchBar } from "@/components/shop/SearchBar";

export const metadata: Metadata = {
  title: "Shop All Cricket Equipment",
  description: "Browse bats, balls, gloves, helmets, shoes, bags and kits.",
};

type SearchParams = {
  search?: string;
  inStock?: string;
  sort?: string;
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [settings, products] = await Promise.all([
    getSettings(),
    getPublishedProducts({
      search: params.search,
      inStockOnly: params.inStock === "1",
      sort: (params.sort as SortOption) || "latest",
    }),
  ]);

  const hasActiveFilters = Boolean(params.search || params.inStock === "1");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 pb-24">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wide">Shop</h1>
            <p className="mt-1 text-sm text-text-secondary">{products.length} products</p>
          </div>
          <SearchBar />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-b border-border pb-4">
          <SortDropdown />
        </div>

        <ProductGrid
          products={products}
          settings={settings}
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          gap="gap-6"
          emptyState={
            <div className="py-24 flex flex-col items-center justify-center text-center gap-4">
              <p className="text-sm uppercase tracking-widest text-text-secondary">
                {hasActiveFilters ? "No products match your filters" : "No products found"}
              </p>
              {hasActiveFilters && (
                <Link
                  href="/shop"
                  className="inline-block border border-accent-dark text-accent-dark px-5 py-2.5 text-[12px] uppercase tracking-wide hover:bg-accent-dark hover:text-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-dark focus-visible:ring-offset-2"
                >
                  Clear Filters
                </Link>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}
