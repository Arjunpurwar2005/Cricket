"use client";

import { useState } from "react";
import type { ParsedProduct } from "@/lib/types";
import type { Settings } from "@/lib/settings";
import { calculateDiscount, getBadgeItems, isInStock, isLowStock } from "@/lib/product-utils";
import { buildProductEnquiryUrl, buildQuestionUrl } from "@/lib/whatsapp";
import { ProductBadge } from "@/components/ProductBadge";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function ProductInfo({ product, settings }: { product: ParsedProduct; settings: Settings }) {
  const [selected, setSelected] = useState<Record<string, string>>({});

  const discount = calculateDiscount(product.mrp, product.price);
  const badges = getBadgeItems(product, settings).filter((b) => !(b.kind === "standard" && b.key === "OUT_OF_STOCK"));
  const inStock = isInStock(product);
  const lowStock = isLowStock(product, settings);

  const variantLabel = product.options.length
    ? product.options
        .map((opt) => (selected[opt.name] ? `${opt.name}: ${selected[opt.name]}` : null))
        .filter(Boolean)
        .join(", ")
    : undefined;

  const enquiryUrl = buildProductEnquiryUrl(product, settings, variantLabel);
  const questionUrl = buildQuestionUrl(product, settings);

  return (
    <div>
      <p className="text-[12px] uppercase tracking-widest text-text-secondary">{product.brand.name}</p>
      <h1 className="font-display text-2xl md:text-4xl uppercase tracking-wide mt-3">{product.name}</h1>
      {product.shortTagline && <p className="mt-2 text-sm text-text-secondary">{product.shortTagline}</p>}

      <div className="mt-5 flex items-baseline gap-3 font-price">
        <span className="text-xl md:text-2xl">₹{product.price.toLocaleString("en-IN")}</span>
        {discount > 0 && (
          <>
            <span className="text-base text-text-secondary line-through">
              MRP ₹{product.mrp.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-accent-dark font-body">{discount}% OFF</span>
          </>
        )}
      </div>



      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <a
          href={enquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white px-6 py-3.5 text-[13px] uppercase tracking-wide hover:bg-whatsapp-dark transition-colors duration-150"
        >
          <WhatsAppIcon className="w-4 h-4" />
          Enquire on WhatsApp
        </a>
        <a
          href={questionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 border border-accent-dark text-accent-dark px-6 py-3.5 text-[13px] uppercase tracking-wide hover:bg-accent-dark hover:text-white transition-colors duration-150"
        >
          Ask a Question
        </a>
      </div>

      {product.description && (
        <div className="mt-8 pt-6 border-t border-border">
          <h2 className="text-xs uppercase tracking-widest text-text-secondary font-medium mb-3">Description</h2>
          <div className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
            {product.description}
          </div>
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-bg-page border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <a
          href={enquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-whatsapp text-white py-3 text-[13px] uppercase tracking-wide w-full"
        >
          <WhatsAppIcon className="w-4 h-4" />
          Enquire on WhatsApp
        </a>
      </div>
    </div>
  );
}
