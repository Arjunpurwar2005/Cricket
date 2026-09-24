export type CustomPromotionStyle = "DARK" | "ACCENT" | "GRAY";
export type CustomPromotion = { label: string; style: CustomPromotionStyle };

export const CUSTOM_PROMOTION_MAX_LABEL_LENGTH = 20;
export const CUSTOM_PROMOTION_MAX_COUNT = 3;
export const CUSTOM_PROMOTION_STYLES: CustomPromotionStyle[] = ["DARK", "ACCENT", "GRAY"];

function isValidStyle(style: unknown): style is CustomPromotionStyle {
  return CUSTOM_PROMOTION_STYLES.includes(style as CustomPromotionStyle);
}

/** Trims, length-caps, de-duplicates (case-insensitive) and caps the count. Used on both the client and the server so the rules never drift apart. */
export function sanitizeCustomPromotions(input: unknown): CustomPromotion[] {
  if (!Array.isArray(input)) return [];

  const result: CustomPromotion[] = [];
  const seen = new Set<string>();

  for (const raw of input) {
    if (result.length >= CUSTOM_PROMOTION_MAX_COUNT) break;
    const rawLabel = raw && typeof raw === "object" ? (raw as { label?: unknown }).label : undefined;
    const label = typeof rawLabel === "string" ? rawLabel.trim().slice(0, CUSTOM_PROMOTION_MAX_LABEL_LENGTH) : "";
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const rawStyle = raw && typeof raw === "object" ? (raw as { style?: unknown }).style : undefined;
    result.push({ label, style: isValidStyle(rawStyle) ? rawStyle : "DARK" });
  }

  return result;
}

export function parseCustomPromotions(value: string | null | undefined): CustomPromotion[] {
  if (!value) return [];
  try {
    return sanitizeCustomPromotions(JSON.parse(value));
  } catch {
    return [];
  }
}
