"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { ParsedProduct } from "@/lib/types";
import { CUSTOM_PROMOTION_MAX_COUNT, CUSTOM_PROMOTION_MAX_LABEL_LENGTH, type CustomPromotion } from "@/lib/promotions";
import { ImageUploader } from "@/components/admin/ImageUploader";

type FormState = {
  name: string;
  images: string[];
  price: string;
  description: string;
  sizes: string;
  bestSeller: boolean;
  bestPrice: boolean;
  sale: boolean;
  featured: boolean;
  customPromotions: CustomPromotion[];
  published: boolean;
};

export function ProductForm({
  recentPromotions = [],
  initialProduct,
}: {
  recentPromotions?: string[];
  initialProduct?: ParsedProduct;
}) {
  const router = useRouter();
  const isEdit = !!initialProduct;

  const [form, setForm] = useState<FormState>({
    name: initialProduct?.name || "",
    images: initialProduct?.images || [],
    price: initialProduct ? String(initialProduct.price) : "",
    description: initialProduct?.description || "",
    sizes: initialProduct?.options?.[0]?.values?.join(", ") || "",
    bestSeller: initialProduct?.bestSeller || false,
    bestPrice: initialProduct?.bestPrice || false,
    sale: initialProduct?.sale || false,
    featured: initialProduct?.featured || false,
    customPromotions: initialProduct?.customPromotions || [],
    published: initialProduct?.published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [addingPromo, setAddingPromo] = useState(false);
  const [promoLabel, setPromoLabel] = useState("");
  const [promoError, setPromoError] = useState("");
  const promoInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addCustomPromotion = (rawLabel: string) => {
    const label = rawLabel.trim().slice(0, CUSTOM_PROMOTION_MAX_LABEL_LENGTH);
    if (!label) {
      setPromoError("Enter a label to add.");
      return;
    }
    if (form.customPromotions.length >= CUSTOM_PROMOTION_MAX_COUNT) {
      setPromoError(`You can add up to ${CUSTOM_PROMOTION_MAX_COUNT} custom promotions.`);
      return;
    }
    if (form.customPromotions.some((p) => p.label.toLowerCase() === label.toLowerCase())) {
      setPromoError("That label is already added.");
      return;
    }
    setPromoError("");
    set("customPromotions", [...form.customPromotions, { label, style: "DARK" }]);
    setPromoLabel("");
    promoInputRef.current?.focus();
  };

  const openPromoInput = () => {
    setPromoError("");
    setAddingPromo(true);
    requestAnimationFrame(() => promoInputRef.current?.focus());
  };

  const closePromoInput = () => {
    setAddingPromo(false);
    setPromoLabel("");
    setPromoError("");
  };

  const removeCustomPromotion = (label: string) => {
    set(
      "customPromotions",
      form.customPromotions.filter((p) => p.label !== label)
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Title is required.");
      return;
    }
    if (!(Number(form.price) > 0)) {
      setError("Price must be greater than 0.");
      return;
    }

    setSaving(true);

    const sizeValues = form.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const options = sizeValues.length ? [{ name: "SIZE", values: sizeValues }] : [];

    const payload = { ...form, name: form.name.trim(), options };

    const res = await fetch(isEdit ? `/api/admin/products/${initialProduct!.id}` : "/api/admin/products", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Could not save product. Please try again.");
      return;
    }

    router.push("/admin/products");
  };

  const availableRecentPromotions = recentPromotions.filter(
    (label) => !form.customPromotions.some((p) => p.label.toLowerCase() === label.toLowerCase())
  );

  return (
    <form onSubmit={submit} className="max-w-3xl">
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2">{error}</p>}

      <div className="max-w-2xl mx-auto">
        <Section title="Product Details">
          <Field label="Title">
            <input
              required
              maxLength={120}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Price">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500">₹</span>
              <input
                required
                type="number"
                min={0.01}
                step="0.01"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                className="input pl-7"
              />
            </div>
          </Field>
          <Field label="Available Sizes (Comma Separated)">
            <input
              type="text"
              value={form.sizes}
              onChange={(e) => set("sizes", e.target.value)}
              placeholder="e.g. Mens Size, Full Size  OR  UK 6, UK 7, UK 8  OR  Academy, Harrow"
              className="input"
            />
            <p className="mt-1 text-[11px] text-gray-500">
              Multiple sizes comma se divide karke likhein. Cards par yeh badges ki tarah dikhenge.
            </p>
          </Field>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="input min-h-[100px]"
            />
          </Field>
          <Field label="Images">
            <ImageUploader images={form.images} onChange={(images) => set("images", images)} />
          </Field>
        </Section>
      </div>

      <Section title="Promotions">
        <div className="grid grid-cols-2 gap-3">
          <Checkbox label="Best Seller" checked={form.bestSeller} onChange={(v) => set("bestSeller", v)} />
          <Checkbox label="Best Price" checked={form.bestPrice} onChange={(v) => set("bestPrice", v)} />
          <Checkbox label="Sale" checked={form.sale} onChange={(v) => set("sale", v)} />
          <Checkbox label="Featured" checked={form.featured} onChange={(v) => set("featured", v)} />
        </div>
        <p className="mt-3 text-xs text-gray-500">
          &quot;Few Stock Left&quot; and &quot;New Arrival&quot; are applied automatically based on stock and settings.
        </p>

        <div className="mt-5 pt-5 border-t border-gray-200">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Custom Promotion</p>

          {addingPromo ? (
            <div className="flex gap-2">
              <input
                ref={promoInputRef}
                type="text"
                value={promoLabel}
                onChange={(e) => {
                  setPromoLabel(e.target.value);
                  setPromoError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomPromotion(promoLabel);
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    closePromoInput();
                  }
                }}
                maxLength={CUSTOM_PROMOTION_MAX_LABEL_LENGTH}
                placeholder="e.g. Limited Offer, Free Grip, Festival Deal"
                className="input flex-1"
              />
              <button
                type="button"
                onClick={() => addCustomPromotion(promoLabel)}
                className="px-4 text-sm bg-gray-900 text-white uppercase tracking-wide"
              >
                Add
              </button>
              <button
                type="button"
                onClick={closePromoInput}
                aria-label="Cancel"
                className="px-3 text-sm border border-gray-300 text-gray-600"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openPromoInput}
              disabled={form.customPromotions.length >= CUSTOM_PROMOTION_MAX_COUNT}
              className="inline-flex items-center gap-1.5 text-sm border border-gray-300 rounded-full px-3.5 py-1.5 text-gray-700 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-base leading-none">+</span> Add Promotion
            </button>
          )}
          {promoError && <p className="mt-2 text-xs text-red-600">{promoError}</p>}

          {form.customPromotions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.customPromotions.map((promo) => (
                <span
                  key={promo.label}
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-900 text-white"
                >
                  {promo.label}
                  <button
                    type="button"
                    onClick={() => removeCustomPromotion(promo.label)}
                    aria-label={`Remove ${promo.label}`}
                    className="text-white/70 hover:text-white leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {availableRecentPromotions.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] uppercase tracking-wide text-gray-400 mb-1.5">Recently Used</p>
              <div className="flex flex-wrap gap-1.5">
                {availableRecentPromotions.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => addCustomPromotion(label)}
                    className="text-xs border border-gray-300 rounded-full px-3 py-1 text-gray-600 hover:border-gray-500"
                  >
                    + {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section title="Publishing">
        <Checkbox label="Published" checked={form.published} onChange={(v) => set("published", v)} />
      </Section>

      <div className="flex gap-3 mt-8">
        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 text-white px-6 py-2.5 text-sm uppercase tracking-wide disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="border border-gray-300 px-6 py-2.5 text-sm uppercase tracking-wide"
        >
          Cancel
        </button>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          background: white;
        }
        .input:focus {
          outline: none;
          border-color: #111827;
        }
      `}</style>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 bg-white border border-gray-200 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-4">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-gray-500">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
