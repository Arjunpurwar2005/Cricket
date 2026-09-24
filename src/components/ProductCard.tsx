"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ParsedProduct } from "@/lib/types";
import type { Settings } from "@/lib/settings";
import { calculateDiscount, getBadgeItems } from "@/lib/product-utils";
import { buildCardEnquiryUrl } from "@/lib/whatsapp";
import { ProductBadge } from "@/components/ProductBadge";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function ProductCard({ product, settings }: { product: ParsedProduct; settings: Settings }) {
  const [imageError, setImageError] = useState(false);
  const discount = calculateDiscount(product.mrp, product.price);
  const badges = getBadgeItems(product, settings).slice(0, 3);
  const image = product.images[0];
  const whatsappUrl = buildCardEnquiryUrl(product, settings);
  const outOfStock = product.stock <= 0;

  return (
    <div className="group h-full flex flex-col bg-bg-card border border-border transition-transform duration-200 hover:-translate-y-0.5">
      <Link href={`/product/${product.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-dark focus-visible:ring-offset-2">
        <div className="relative aspect-square overflow-hidden bg-bg-image-tile">
          {image && !imageError ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className={`object-cover transition-transform duration-400 ease-out group-hover:scale-[1.05] ${
                outOfStock ? "grayscale opacity-60" : ""
              }`}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center px-4 text-center text-text-secondary text-xs uppercase tracking-widest">
              {product.brand?.name || "Wicket & Willow"}
            </div>
          )}
          {badges.length > 0 && (
            <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1 z-10">
              {badges.map((item) => (
                <ProductBadge key={item.kind === "standard" ? item.key : `custom-${item.label}`} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="p-3.5 md:p-4 flex flex-col gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-secondary font-medium">{product.brand.name}</p>
            <h3 className="mt-0.5 text-base md:text-lg font-display uppercase tracking-wide text-text-primary line-clamp-1 font-bold">
              {product.name}
            </h3>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-2 font-price">
            <span className="text-lg md:text-xl text-text-primary font-bold">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <span className="text-xs text-text-secondary line-through">
                MRP ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {product.options && product.options.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {product.options[0].values.slice(0, 6).map((val) => (
                <span key={val} className="bg-[#ECE9E2] text-[10px] text-text-primary px-2 py-0.5 font-mono border border-border/40 uppercase">
                  {val}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between border-t border-border px-3.5 md:px-4 py-2.5">
        <Link
          href={`/product/${product.slug}`}
          className="text-[11px] uppercase tracking-wide font-medium text-text-primary hover:text-accent-dark transition-colors"
        >
          View Details →
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Enquire on WhatsApp"
          className="w-7 h-7 flex items-center justify-center rounded-full bg-whatsapp text-white hover:bg-whatsapp-dark transition-colors duration-150"
        >
          <WhatsAppIcon className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
