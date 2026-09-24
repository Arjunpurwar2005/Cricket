"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AnalyticsCards from "./AnalyticsCards";
import ProfitChart from "./ProfitChart";
import SaleForm from "./SaleForm";
import SalesTable from "./SalesTable";

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

type FilterPreset = "all" | "thisMonth" | "lastMonth" | "last7" | "custom";

function getISTDateStr(offsetDays = 0): string {
  const now = Date.now();
  const istOffset = 330 * 60000;
  const ist = new Date(now + new Date().getTimezoneOffset() * 60000 + istOffset);
  ist.setDate(ist.getDate() + offsetDays);
  const y = ist.getFullYear();
  const m = String(ist.getMonth() + 1).padStart(2, "0");
  const d = String(ist.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getPresetDates(preset: FilterPreset): { from?: string; to?: string } {
  const today = getISTDateStr(0);

  if (preset === "all") return {};

  if (preset === "last7") {
    return { from: getISTDateStr(-6), to: today };
  }

  const now = Date.now();
  const istOffset = 330 * 60000;
  const ist = new Date(now + new Date().getTimezoneOffset() * 60000 + istOffset);

  if (preset === "thisMonth") {
    const y = ist.getFullYear();
    const m = String(ist.getMonth() + 1).padStart(2, "0");
    const lastDay = new Date(ist.getFullYear(), ist.getMonth() + 1, 0).getDate();
    return {
      from: `${y}-${m}-01`,
      to: `${y}-${m}-${String(lastDay).padStart(2, "0")}`,
    };
  }

  if (preset === "lastMonth") {
    const y = ist.getMonth() === 0 ? ist.getFullYear() - 1 : ist.getFullYear();
    const m = ist.getMonth() === 0 ? 12 : ist.getMonth();
    const lastDay = new Date(y, m, 0).getDate();
    const mp = String(m).padStart(2, "0");
    return { from: `${y}-${mp}-01`, to: `${y}-${mp}-${String(lastDay).padStart(2, "0")}` };
  }

  return {};
}

export default function SalesDashboard() {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [preset, setPreset] = useState<FilterPreset>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [editSale, setEditSale] = useState<Sale | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    const dates =
      preset === "custom"
        ? { from: customFrom || undefined, to: customTo || undefined }
        : getPresetDates(preset);

    const params = new URLSearchParams();
    if (dates.from) params.set("from", dates.from);
    if (dates.to) params.set("to", dates.to);

    const url = `/api/admin/sales${params.size > 0 ? `?${params}` : ""}`;
    try {
      const res = await fetch(url);
      const data: Sale[] = await res.json();
      setSales(data);
    } finally {
      setLoading(false);
    }
  }, [preset, customFrom, customTo]);

  const fetchSuggestions = useCallback(async () => {
    const res = await fetch("/api/admin/sales/suggestions");
    const data = await res.json();
    setSuggestions(data.names ?? []);
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  function handleSuccess() {
    fetchSales();
    fetchSuggestions();
    router.refresh();
  }

  function handleDeleted() {
    fetchSales();
    fetchSuggestions();
    router.refresh();
  }

  function handleEdit(sale: Sale) {
    setEditSale(sale);
    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function handleCancelEdit() {
    setEditSale(null);
  }

  const presetOptions: { value: FilterPreset; label: string }[] = [
    { value: "all", label: "All Time" },
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "last7", label: "Last 7 Days" },
    { value: "custom", label: "Custom Range" },
  ];

  const inputCls =
    "border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400";

  return (
    <div className="space-y-6">
      {/* Date filter */}
      <div className="flex flex-wrap items-center gap-2">
        {presetOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPreset(opt.value)}
            className={`px-3 py-1.5 text-xs rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 ${
              preset === opt.value
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
        {preset === "custom" && (
          <div className="flex items-center gap-2 flex-wrap mt-1 sm:mt-0">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className={inputCls}
              aria-label="From date"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className={inputCls}
              aria-label="To date"
            />
          </div>
        )}
      </div>

      {/* Analytics cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <AnalyticsCards sales={sales} />
      )}

      {/* Chart */}
      {!loading && <ProfitChart sales={sales} />}

      {/* Add / Edit Sale form */}
      <div ref={formRef}>
        <SaleForm
          suggestions={suggestions}
          editSale={editSale}
          onSuccess={handleSuccess}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      {/* Sales table */}
      {!loading && (
        <SalesTable
          sales={sales}
          onEdit={handleEdit}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
