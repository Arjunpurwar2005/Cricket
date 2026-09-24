"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ParsedProduct } from "@/lib/types";
import type { Settings } from "@/lib/settings";
import { calculateDiscount } from "@/lib/product-utils";
import { buildProductEnquiryUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function Hero({ products, settings }: { products: ParsedProduct[]; settings: Settings }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateScales = () => {
      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.abs(itemCenter - center);
        const ratio = Math.max(0, 1 - distance / (trackRect.width / 2));
        const scale = 0.6 + 0.4 * ratio;
        const opacity = 0.45 + 0.55 * ratio;
        el.style.transform = `scale(${scale})`;
        el.style.opacity = String(opacity);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      setActive(closestIndex);
    };

    updateScales();
    track.addEventListener("scroll", updateScales, { passive: true });
    window.addEventListener("resize", updateScales);
    return () => {
      track.removeEventListener("scroll", updateScales);
      window.removeEventListener("resize", updateScales);
    };
  }, [products.length]);

  const scrollToIndex = (index: number) => {
    const el = itemRefs.current[index];
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  if (products.length === 0) return null;
  const activeProduct = products[active];
  const discount = calculateDiscount(activeProduct.mrp, activeProduct.price);
  const whatsappUrl = buildProductEnquiryUrl(activeProduct, settings);

  return (
    <section className="pt-8 md:pt-14">
      <div className="relative">
        <div
          ref={trackRef}
          className="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory px-[35vw] md:px-[30vw]"
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="snap-center shrink-0 w-[55vw] md:w-[26vw] aspect-square transition-transform duration-300 ease-out"
            >
              <Link href={`/product/${product.slug}`} className="block w-full h-full bg-bg-image-tile border border-border relative overflow-hidden">
                {product.images[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="60vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                )}
              </Link>
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollToIndex(Math.max(0, active - 1))}
          aria-label="Previous product"
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center border border-border bg-bg-page hover:bg-bg-section-alt"
        >
          ←
        </button>
        <button
          onClick={() => scrollToIndex(Math.min(products.length - 1, active + 1))}
          aria-label="Next product"
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center border border-border bg-bg-page hover:bg-bg-section-alt"
        >
          →
        </button>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 mt-8 md:mt-10 text-center">
        <p className="text-[11px] uppercase tracking-widest text-text-secondary">{activeProduct.brand.name}</p>
        <h1 className="font-display text-3xl md:text-5xl uppercase tracking-wide mt-2">{activeProduct.name}</h1>

        <div className="mt-3 flex items-baseline justify-center gap-3 font-price">
          <span className="text-xl md:text-2xl">₹{activeProduct.price.toLocaleString("en-IN")}</span>
          {discount > 0 && (
            <>
              <span className="text-base text-text-secondary line-through">
                MRP ₹{activeProduct.mrp.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-accent-dark font-body">{discount}% OFF</span>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href={`/product/${activeProduct.slug}`}
            className="border border-accent-dark text-accent-dark px-6 py-3.5 text-[13px] uppercase tracking-wide hover:bg-accent-dark hover:text-white transition-colors duration-150"
          >
            Explore Product
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-whatsapp text-white px-6 py-3.5 text-[13px] uppercase tracking-wide hover:bg-whatsapp-dark transition-colors duration-150"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Enquire on WhatsApp
          </a>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => scrollToIndex(i)}
              aria-label={`Show ${p.name}`}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-150 ${
                i === active ? "bg-accent-dark" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
