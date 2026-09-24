import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseProduct } from "@/lib/product-utils";
import { getRecentPromotionLabels } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, recentPromotions] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { brand: true, category: true } }),
    getRecentPromotionLabels(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
      <ProductForm recentPromotions={recentPromotions} initialProduct={parseProduct(product)} />
    </div>
  );
}
