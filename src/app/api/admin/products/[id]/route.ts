import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findOrCreateBrand, findOrCreateCategory } from "@/lib/taxonomy";
import { sanitizeCustomPromotions } from "@/lib/promotions";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, include: { brand: true, category: true } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const [brand, category, existing] = await Promise.all([
    body.brand?.trim() ? findOrCreateBrand(body.brand) : Promise.resolve(null),
    body.category?.trim() ? findOrCreateCategory(body.category) : Promise.resolve(null),
    body.price !== undefined && body.mrp === undefined
      ? prisma.product.findUnique({ where: { id }, select: { mrp: true } })
      : Promise.resolve(null),
  ]);

  // If the price goes above the current MRP, bump the MRP to match so no fake discount shows.
  const autoMrp =
    existing && Number(body.price) > existing.mrp ? Number(body.price) : undefined;

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.sku !== undefined && { sku: body.sku }),
      ...(brand && { brandId: brand.id }),
      ...(category && { categoryId: category.id }),
      ...(body.subcategory !== undefined && { subcategory: body.subcategory || null }),
      ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
      ...(body.price !== undefined && { price: Number(body.price) }),
      ...(body.mrp !== undefined && { mrp: Number(body.mrp) }),
      ...(autoMrp !== undefined && { mrp: autoMrp }),
      ...(body.stock !== undefined && { stock: Number(body.stock) }),
      ...(body.lowStockThreshold !== undefined && { lowStockThreshold: Number(body.lowStockThreshold) }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.shortTagline !== undefined && { shortTagline: body.shortTagline }),
      ...(body.specifications !== undefined && { specifications: JSON.stringify(body.specifications) }),
      ...(body.options !== undefined && { options: JSON.stringify(body.options) }),
      ...(body.customPromotions !== undefined && {
        customPromotions: JSON.stringify(sanitizeCustomPromotions(body.customPromotions)),
      }),
      ...(body.bestSeller !== undefined && { bestSeller: !!body.bestSeller }),
      ...(body.bestPrice !== undefined && { bestPrice: !!body.bestPrice }),
      ...(body.sale !== undefined && { sale: !!body.sale }),
      ...(body.featured !== undefined && { featured: !!body.featured }),
      ...(body.published !== undefined && { published: !!body.published }),
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
