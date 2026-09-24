import { prisma } from "@/lib/prisma";
import type { Brand, Category } from "@prisma/client";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueSlug(base: string, taken: Set<string>): string {
  const root = base || "item";
  if (!taken.has(root)) return root;
  let i = 2;
  while (taken.has(`${root}-${i}`)) i += 1;
  return `${root}-${i}`;
}

export async function findOrCreateBrand(name: string): Promise<Brand> {
  const trimmed = name.trim();
  const brands = await prisma.brand.findMany();
  const existing = brands.find((b) => b.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) return existing;

  const slug = uniqueSlug(
    slugify(trimmed),
    new Set(brands.map((b) => b.slug))
  );

  return prisma.brand.create({ data: { name: trimmed, slug, order: brands.length } });
}

export async function findOrCreateCategory(name: string): Promise<Category> {
  const trimmed = name.trim();
  const categories = await prisma.category.findMany();
  const existing = categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase());
  if (existing) return existing;

  const slug = uniqueSlug(
    slugify(trimmed),
    new Set(categories.map((c) => c.slug))
  );

  return prisma.category.create({ data: { name: trimmed, slug, order: categories.length } });
}
