import { getRecentPromotionLabels } from "@/lib/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const recentPromotions = await getRecentPromotionLabels();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">New Product</h1>
      <ProductForm recentPromotions={recentPromotions} />
    </div>
  );
}
