"use client";

import { useState } from "react";
import type { Specification } from "@/lib/types";

export function ProductTabs({
  description,
  specifications,
  brand,
  category,
  sku,
}: {
  description: string;
  specifications: Specification[];
  brand: string;
  category: string;
  sku: string;
}) {
  const tabs = ["Details", "Specifications", "Shipping"] as const;
  const [active, setActive] = useState<(typeof tabs)[number]>("Details");

  const rows: Specification[] = [
    { name: "Brand", value: brand },
    { name: "Category", value: category },
    ...specifications,
  ];

  return (
    <div className="mt-14">
      <div className="flex gap-8 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-3 text-[12px] uppercase tracking-widest border-b-2 -mb-px ${
              active === tab ? "border-accent-dark text-accent-dark" : "border-transparent text-text-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pt-6 max-w-2xl">
        {active === "Details" && (
          <p className="text-sm leading-relaxed text-text-primary whitespace-pre-line">
            {description || "No additional details available for this product."}
          </p>
        )}

        {active === "Specifications" && (
          <dl className="divide-y divide-border">
            {rows.map((row) => (
              <div key={row.name} className="flex justify-between py-3 text-sm">
                <dt className="text-text-secondary">{row.name}</dt>
                <dd className="text-text-primary">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {active === "Shipping" && (
          <p className="text-sm leading-relaxed text-text-secondary">
            Delivery timelines and shipping charges are confirmed over WhatsApp based on your location and order
            size.
          </p>
        )}
      </div>
    </div>
  );
}
