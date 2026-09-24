import type { Brand, Category, Product } from "@prisma/client";
import type { CustomPromotion, CustomPromotionStyle } from "@/lib/promotions";

export type Specification = { name: string; value: string };
export type ProductOption = { name: string; values: string[] };

export type ParsedProduct = Omit<Product, "images" | "specifications" | "options" | "customPromotions"> & {
  images: string[];
  specifications: Specification[];
  options: ProductOption[];
  customPromotions: CustomPromotion[];
  brand: Brand;
  category: Category;
};

export type BadgeKey =
  | "BEST_SELLER"
  | "FEW_STOCK_LEFT"
  | "HEAVY_DISCOUNT"
  | "BEST_PRICE"
  | "NEW_ARRIVAL"
  | "FEATURED"
  | "SALE"
  | "OUT_OF_STOCK";

export const BADGE_LABELS: Record<BadgeKey, string> = {
  BEST_SELLER: "Best Seller",
  FEW_STOCK_LEFT: "Few Stock Left",
  HEAVY_DISCOUNT: "Heavy Discount",
  BEST_PRICE: "Best Price",
  NEW_ARRIVAL: "New Arrival",
  FEATURED: "Featured",
  SALE: "Sale",
  OUT_OF_STOCK: "Out of Stock",
};

export type BadgeItem =
  | { kind: "standard"; key: BadgeKey }
  | { kind: "custom"; label: string; style: CustomPromotionStyle };
