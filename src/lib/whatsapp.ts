import type { Settings } from "@/lib/settings";
import type { ParsedProduct } from "@/lib/types";

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}

function buildUrl(number: string, message: string): string {
  const digits = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function productUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  return `${base}/product/${slug}`.trim();
}

export function buildProductEnquiryUrl(
  product: ParsedProduct,
  settings: Settings,
  selectedVariant?: string
): string {
  const variantLine = selectedVariant ? `Size/Option: ${selectedVariant}\n` : "";
  const message = fillTemplate(settings.productEnquiryTemplate, {
    name: product.name,
    brand: product.brand.name,
    price: product.price.toLocaleString("en-IN"),
    mrp: product.mrp.toLocaleString("en-IN"),
    variant: variantLine,
    sku: product.sku,
    url: productUrl(product.slug),
  });
  return buildUrl(settings.whatsappNumber, message);
}

export function buildQuestionUrl(product: ParsedProduct, settings: Settings): string {
  const message = fillTemplate(settings.questionTemplate, {
    name: product.name,
    brand: product.brand.name,
    url: productUrl(product.slug),
  });
  return buildUrl(settings.whatsappNumber, message);
}

export function buildCardEnquiryUrl(product: ParsedProduct, settings: Settings): string {
  const message = fillTemplate(settings.cardEnquiryTemplate, {
    name: product.name,
    brand: product.brand.name,
    price: product.price.toLocaleString("en-IN"),
  });
  return buildUrl(settings.whatsappNumber, message);
}

export function buildGeneralEnquiryUrl(settings: Settings): string {
  return buildUrl(settings.whatsappNumber, settings.generalMessage);
}
