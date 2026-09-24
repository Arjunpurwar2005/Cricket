import { prisma } from "@/lib/prisma";

const DEFAULT_BRAND_NAME = "Wicket & Willow";
const DEFAULT_CATEGORY_NAME = "General";

export { DEFAULT_BRAND_NAME, DEFAULT_CATEGORY_NAME };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || "product";
  let slug = base;
  let i = 2;
  while (await prisma.product.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}

export async function generateUniqueSku(): Promise<string> {
  let sku = "";
  do {
    sku = `WW-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  } while (await prisma.product.findUnique({ where: { sku }, select: { id: true } }));
  return sku;
}
