import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findOrCreateBrand, findOrCreateCategory } from "@/lib/taxonomy";
import {
  DEFAULT_BRAND_NAME,
  DEFAULT_CATEGORY_NAME,
  generateUniqueSku,
  generateUniqueSlug,
} from "@/lib/product-defaults";
import { sanitizeCustomPromotions } from "@/lib/promotions";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { brand: true, category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const price = Number(body.price);
  if (!(price > 0)) {
    return NextResponse.json({ error: "Price must be greater than 0" }, { status: 400 });
  }

  const [brand, category, slug, sku] = await Promise.all([
    body.brand?.trim() ? findOrCreateBrand(body.brand) : findOrCreateBrand(DEFAULT_BRAND_NAME),
    body.category?.trim() ? findOrCreateCategory(body.category) : findOrCreateCategory(DEFAULT_CATEGORY_NAME),
    body.slug?.trim() ? body.slug.trim() : generateUniqueSlug(body.name),
    body.sku?.trim() ? body.sku.trim() : generateUniqueSku(),
  ]);

  const mrp = body.mrp !== undefined ? Number(body.mrp) : price;

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug,
      sku,
      brandId: brand.id,
      categoryId: category.id,
      subcategory: body.subcategory || null,
      images: JSON.stringify(body.images || []),
      price,
      mrp: mrp >= price ? mrp : price,
      stock: body.stock !== undefined ? Number(body.stock) : 10,
      lowStockThreshold: body.lowStockThreshold !== undefined ? Number(body.lowStockThreshold) : 5,
      description: body.description || "",
      shortTagline: body.shortTagline || "",
      specifications: JSON.stringify(body.specifications || []),
      options: JSON.stringify(body.options || []),
      customPromotions: JSON.stringify(sanitizeCustomPromotions(body.customPromotions)),
      bestSeller: !!body.bestSeller,
      bestPrice: !!body.bestPrice,
      sale: !!body.sale,
      featured: !!body.featured,
      published: body.published !== false,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
