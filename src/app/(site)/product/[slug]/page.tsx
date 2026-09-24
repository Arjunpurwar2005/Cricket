import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSettings } from "@/lib/settings";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { RelatedProducts } from "@/components/product/RelatedProducts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortTagline || product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.shortTagline,
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.published) notFound();

  const [settings, related] = await Promise.all([getSettings(), getRelatedProducts(product)]);

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} settings={settings} />
      </div>

      <RelatedProducts products={related} settings={settings} />
    </div>
  );
}
