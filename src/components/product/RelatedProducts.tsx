import type { ParsedProduct } from "@/lib/types";
import type { Settings } from "@/lib/settings";
import { ProductCard } from "@/components/ProductCard";

export function RelatedProducts({ products, settings }: { products: ParsedProduct[]; settings: Settings }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 mb-24 md:mb-0">
      <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wide mb-6">You May Also Like</h2>
      <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto no-scrollbar">
        {products.map((product) => (
          <div key={product.id} className="w-[60vw] md:w-auto shrink-0">
            <ProductCard product={product} settings={settings} />
          </div>
        ))}
      </div>
    </section>
  );
}
