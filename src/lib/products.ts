import { prisma } from "@/lib/prisma";
import { parseProduct } from "@/lib/product-utils";
import { parseCustomPromotions } from "@/lib/promotions";
import type { ParsedProduct } from "@/lib/types";

const include = { brand: true, category: true } as const;

export type SortOption = "latest" | "price-asc" | "price-desc" | "name-asc" | "featured";

export type ShopFilters = {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  inStockOnly?: boolean;
  sort?: SortOption;
};

export async function getPublishedProducts(filters: ShopFilters = {}): Promise<ParsedProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      published: true,
      ...(filters.category ? { category: { slug: filters.category } } : {}),
      ...(filters.brand ? { brand: { slug: filters.brand } } : {}),
      ...(filters.inStockOnly ? { stock: { gt: 0 } } : {}),
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search } },
              { sku: { contains: filters.search } },
              { shortTagline: { contains: filters.search } },
              { brand: { name: { contains: filters.search } } },
              { category: { name: { contains: filters.search } } },
            ],
          }
        : {}),
    },
    include,
  });

  let parsed = products.map(parseProduct);

  if (filters.minPrice != null) parsed = parsed.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice != null) parsed = parsed.filter((p) => p.price <= filters.maxPrice!);
  if (filters.minDiscount != null) {
    parsed = parsed.filter((p) => {
      const discount = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
      return discount >= filters.minDiscount!;
    });
  }

  switch (filters.sort) {
    case "price-asc":
      parsed.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      parsed.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      parsed.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "featured":
      parsed.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
    default:
      parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return parsed;
}

export async function getProductBySlug(slug: string): Promise<ParsedProduct | null> {
  const product = await prisma.product.findUnique({ where: { slug }, include });
  return product ? parseProduct(product) : null;
}

export async function getFeaturedProducts(limit = 8): Promise<ParsedProduct[]> {
  const products = await prisma.product.findMany({
    where: { published: true, featured: true },
    include,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(parseProduct);
}

export async function getBestSellers(limit = 8): Promise<ParsedProduct[]> {
  const products = await prisma.product.findMany({
    where: { published: true, bestSeller: true },
    include,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(parseProduct);
}

export async function getNewArrivals(limit = 8): Promise<ParsedProduct[]> {
  const products = await prisma.product.findMany({
    where: { published: true },
    include,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(parseProduct);
}

export async function getRelatedProducts(product: ParsedProduct, limit = 8): Promise<ParsedProduct[]> {
  let products = await prisma.product.findMany({
    where: {
      published: true,
      id: { not: product.id },
      OR: [{ categoryId: product.categoryId }, { brandId: product.brandId }],
    },
    include,
    take: limit,
  });

  if (products.length === 0) {
    products = await prisma.product.findMany({
      where: {
        published: true,
        id: { not: product.id },
      },
      include,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  return products.map(parseProduct);
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getBrands() {
  return prisma.brand.findMany({ orderBy: { order: "asc" } });
}

export async function getBrandsInUse() {
  const brands = await prisma.brand.findMany({
    where: { products: { some: { published: true } } },
    orderBy: { order: "asc" },
  });
  return brands;
}

export async function getRecentPromotionLabels(limit = 8): Promise<string[]> {
  const recent = await prisma.product.findMany({
    select: { customPromotions: true },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  const labels = new Set<string>();
  for (const product of recent) {
    for (const promo of parseCustomPromotions(product.customPromotions)) {
      labels.add(promo.label);
      if (labels.size >= limit) return Array.from(labels);
    }
  }
  return Array.from(labels);
}
