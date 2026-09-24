"use client";

import { useEffect, useRef, useState } from "react";

interface Sale {
  id: string;
  date: string;
  productName: string;
  costPrice: number;
  profit: number;
  finalPrice: number;
  customerName: string | null;
  customerPhone: string | null;
}

interface SaleFormProps {
  suggestions: string[];
  editSale?: Sale | null;
  onSuccess: () => void;
  onCancelEdit?: () => void;
}

function todayIST(): string {
  // Return YYYY-MM-DD in IST
  const now = new Date();
  // Offset IST: +5:30 = 330 min
  const istOffset = 330;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istDate = new Date(utc + istOffset * 60000);
  const y = istDate.getFullYear();
  const m = String(istDate.getMonth() + 1).padStart(2, "0");
  const d = String(istDate.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const EMPTY_FORM = {
  date: todayIST(),
  productName: "",
  costPrice: "",
  profit: "",
  customerName: "",
  customerPhone: "",
};

export default function SaleForm({
  suggestions,
  editSale,
  onSuccess,
  onCancelEdit,
}: SaleFormProps) {
  const [form, setForm] = useState(() =>
    editSale
      ? {
          date: editSale.date.slice(0, 10),
          productName: editSale.productName,
          costPrice: String(editSale.costPrice),
          profit: String(editSale.profit),
          customerName: editSale.customerName ?? "",
          customerPhone: editSale.customerPhone ?? "",
        }
      : { ...EMPTY_FORM, date: todayIST() }
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const productRef = useRef<HTMLInputElement>(null);

  // Sync form when editSale changes
  useEffect(() => {
    if (editSale) {
      setForm({
        date: editSale.date.slice(0, 10),
        productName: editSale.productName,
        costPrice: String(editSale.costPrice),
        profit: String(editSale.profit),
        customerName: editSale.customerName ?? "",
        customerPhone: editSale.customerPhone ?? "",
      });
      setErrors({});
      setSuccess(false);
    }
  }, [editSale]);

  const finalPrice =
    parseFloat(form.costPrice) + parseFloat(form.profit);
  const finalPriceDisplay = isNaN(finalPrice) ? "" : finalPrice.toFixed(2);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((err) => ({ ...err, [e.target.name]: "" }));
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccess(false);

    const method = editSale ? "PATCH" : "POST";
    const url = editSale
      ? `/api/admin/sales/${editSale.id}`
      : "/api/admin/sales";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: form.date,
          productName: form.productName,
          costPrice: parseFloat(form.costPrice),
          profit: parseFloat(form.profit),
          customerName: form.customerName || null,
          customerPhone: form.customerPhone || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ _form: data.error || "Something went wrong." });
        }
        return;
      }

      setSuccess(true);
      if (!editSale) {
        const saved = form.date;
        setForm({ ...EMPTY_FORM, date: saved });
        setTimeout(() => productRef.current?.focus(), 50);
      }
      onSuccess();
    } catch {
      setErrors({ _form: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  const isEdit = !!editSale;

  const inputCls =
    "w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";
  const errorCls = "text-xs text-red-600 mt-1";

  return (
    <div className="bg-white border border-gray-200 rounded p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        {isEdit ? "Edit Sale" : "Add Sale"}
      </h3>

      {errors._form && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
          {errors._form}
        </p>
      )}
      {success && !isEdit && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 mb-4">
          Sale added successfully.
        </p>
      )}
      {success && isEdit && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 mb-4">
          Sale updated.
        </p>
      )}

      <datalist id="product-suggestions">
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>

      <form onSubmit={handleSubmit} noValidate>
        {/* Grid: 2-3 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
          {/* Date */}
          <div>
            <label className={labelCls} htmlFor="sf-date">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              id="sf-date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputCls}
              required
            />
            {errors.date && <p className={errorCls}>{errors.date}</p>}
          </div>

          {/* Product Name */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className={labelCls} htmlFor="sf-productName">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="sf-productName"
              ref={productRef}
              type="text"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              list="product-suggestions"
              placeholder="e.g. SG Batting Gloves"
              maxLength={120}
              className={inputCls}
              required
              autoComplete="off"
            />
            {errors.productName && (
              <p className={errorCls}>{errors.productName}</p>
            )}
          </div>

          {/* Cost Price */}
          <div>
            <label className={labelCls} htmlFor="sf-costPrice">
              Cost Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              id="sf-costPrice"
              type="number"
              name="costPrice"
              value={form.costPrice}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.01"
              className={inputCls}
              required
            />
            {errors.costPrice && (
              <p className={errorCls}>{errors.costPrice}</p>
            )}
          </div>

          {/* Profit */}
          <div>
            <label className={labelCls} htmlFor="sf-profit">
              Profit (₹) <span className="text-red-500">*</span>
            </label>
            <input
              id="sf-profit"
              type="number"
              name="profit"
              value={form.profit}
              onChange={handleChange}
              placeholder="0"
              step="0.01"
              className={inputCls}
              required
            />
            {errors.profit && <p className={errorCls}>{errors.profit}</p>}
          </div>

          {/* Final Price (read-only) */}
          <div>
            <label className={labelCls} htmlFor="sf-finalPrice">
              Final Price (₹)
            </label>
            <input
              id="sf-finalPrice"
              type="text"
              value={finalPriceDisplay}
              readOnly
              tabIndex={-1}
              className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`}
              placeholder="auto"
            />
            {errors.finalPrice && (
              <p className={errorCls}>{errors.finalPrice}</p>
            )}
          </div>

          {/* Customer Name */}
          <div>
            <label className={labelCls} htmlFor="sf-customerName">
              Customer Name
            </label>
            <input
              id="sf-customerName"
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Optional"
              className={inputCls}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelCls} htmlFor="sf-customerPhone">
              Phone Number
            </label>
            <input
              id="sf-customerPhone"
              type="tel"
              name="customerPhone"
              value={form.customerPhone}
              onChange={handleChange}
              placeholder="10 digits (optional)"
              className={inputCls}
            />
            {errors.customerPhone && (
              <p className={errorCls}>{errors.customerPhone}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 disabled:opacity-60 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {saving ? "Saving…" : isEdit ? "Update Sale" : "Add Sale"}
          </button>
          {isEdit && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2 border border-gray-200 text-sm rounded hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
