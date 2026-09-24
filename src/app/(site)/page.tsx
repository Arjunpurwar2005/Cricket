import { getSettings } from "@/lib/settings";
import { getBestSellers, getFeaturedProducts, getNewArrivals } from "@/lib/products";
import { Hero } from "@/components/Hero";
import { ProductSection } from "@/components/ProductSection";
import { TrustSection } from "@/components/TrustSection";
import { HomeWhatsAppCta } from "@/components/HomeWhatsAppCta";

export default async function HomePage() {
  const [settings, newArrivals, bestSellers, featured] = await Promise.all([
    getSettings(),
    getNewArrivals(8),
    getBestSellers(8),
    getFeaturedProducts(8),
  ]);

  const heroProducts = (featured.length > 0 ? featured : newArrivals).slice(0, 6);

  return (
    <>
      <Hero products={heroProducts} settings={settings} />
      <ProductSection title="New Arrivals" products={newArrivals} settings={settings} viewAllHref="/shop?sort=latest" />
      <ProductSection title="Best Sellers" products={bestSellers} settings={settings} viewAllHref="/shop" />
      <ProductSection title="Featured Products" products={featured} settings={settings} viewAllHref="/shop" />
      <TrustSection />
      <HomeWhatsAppCta settings={settings} />
    </>
  );
}
