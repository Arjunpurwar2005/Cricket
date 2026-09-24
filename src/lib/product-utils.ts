import type { Product } from "@prisma/client";
import type { BadgeItem, BadgeKey, ParsedProduct, ProductOption, Specification } from "@/lib/types";
import type { Settings } from "@/lib/settings";
import { parseCustomPromotions } from "@/lib/promotions";

export function parseProduct<T extends Product & { brand: unknown; category: unknown }>(
  product: T
): ParsedProduct {
  return {
    ...product,
    images: safeParse<string[]>(product.images, []),
    specifications: safeParse<Specification[]>(product.specifications, []),
    options: safeParse<ProductOption[]>(product.options, []),
    customPromotions: parseCustomPromotions(product.customPromotions),
  } as unknown as ParsedProduct;
}

function safeParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function calculateDiscount(mrp: number, price: number): number {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function getBadges(product: ParsedProduct, settings: Settings): BadgeKey[] {
  const badges: BadgeKey[] = [];

  if (product.stock <= 0) {
    badges.push("OUT_OF_STOCK");
    if (product.bestSeller) badges.push("BEST_SELLER");
    if (product.featured) badges.push("FEATURED");
    return badges;
  }

  if (product.bestSeller) badges.push("BEST_SELLER");

  const discount = calculateDiscount(product.mrp, product.price);
  if (discount >= settings.heavyDiscountThreshold) badges.push("HEAVY_DISCOUNT");

  if (product.stock <= (product.lowStockThreshold || settings.lowStockThreshold)) {
    badges.push("FEW_STOCK_LEFT");
  }

  if (product.bestPrice) badges.push("BEST_PRICE");
  if (product.sale) badges.push("SALE");

  const ageDays = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays <= settings.newArrivalDays) badges.push("NEW_ARRIVAL");

  if (product.featured) badges.push("FEATURED");

  return badges;
}

const BADGE_PRIORITY: (BadgeKey | "CUSTOM")[] = [
  "OUT_OF_STOCK",
  "HEAVY_DISCOUNT",
  "SALE",
  "BEST_SELLER",
  "FEATURED",
  "CUSTOM",
  "NEW_ARRIVAL",
  "BEST_PRICE",
  "FEW_STOCK_LEFT",
];

/** Standard badges plus custom promotion labels, merged and ordered by priority. Custom promotions are suppressed out of stock, same as Sale/Best Price. */
export function getBadgeItems(product: ParsedProduct, settings: Settings): BadgeItem[] {
  const items: BadgeItem[] = getBadges(product, settings).map((key) => ({ kind: "standard", key }));

  if (product.stock > 0) {
    for (const promo of product.customPromotions) {
      items.push({ kind: "custom", label: promo.label, style: promo.style });
    }
  }

  return items.sort(
    (a, b) =>
      BADGE_PRIORITY.indexOf(a.kind === "standard" ? a.key : "CUSTOM") -
      BADGE_PRIORITY.indexOf(b.kind === "standard" ? b.key : "CUSTOM")
  );
}

export function isInStock(product: ParsedProduct): boolean {
  return product.stock > 0;
}

export function isLowStock(product: ParsedProduct, settings: Settings): boolean {
  return product.stock > 0 && product.stock <= (product.lowStockThreshold || settings.lowStockThreshold);
}
