"use client";

import { useMemo, useState } from "react";

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

interface SalesTableProps {
  sales: Sale[];
  onEdit: (sale: Sale) => void;
  onDeleted: () => void;
}

const PAGE_SIZE = 20;

function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ProfitCell({ value }: { value: number }) {
  return (
    <span className={value < 0 ? "text-red-600 font-medium" : "text-green-700 font-medium"}>
      {formatINR(value)}
    </span>
  );
}

export default function SalesTable({ sales, onEdit, onDeleted }: SalesTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sales;
    return sales.filter(
      (s) =>
        s.productName.toLowerCase().includes(q) ||
        (s.customerName && s.customerName.toLowerCase().includes(q)) ||
        (s.customerPhone && s.customerPhone.includes(q))
    );
  }, [sales, search]);

  const totals = useMemo(
    () => ({
      costPrice: filtered.reduce((a, s) => a + s.costPrice, 0),
      profit: filtered.reduce((a, s) => a + s.profit, 0),
      finalPrice: filtered.reduce((a, s) => a + s.finalPrice, 0),
    }),
    [filtered]
  );

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  async function handleDelete(id: string) {
    if (!confirm("Delete this sale? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/sales/${id}`, { method: "DELETE" });
      onDeleted();
    } finally {
      setDeleting(null);
    }
  }

  const thCls = "px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500 whitespace-nowrap";
  const tdCls = "px-3 py-2 text-sm text-gray-800 whitespace-nowrap";

  return (
    <div className="bg-white border border-gray-200 rounded">
      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <input
          type="search"
          placeholder="Search by product, customer or phone…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full max-w-sm border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">
            {sales.length === 0
              ? "No sales yet. Add your first sale above."
              : "No results match your search."}
          </p>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className={thCls}>Date</th>
                <th className={thCls}>Product</th>
                <th className={thCls}>Cost Price</th>
                <th className={thCls}>Profit</th>
                <th className={thCls}>Final Price</th>
                <th className={thCls}>Customer</th>
                <th className={thCls}>Phone</th>
                <th className={thCls}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visible.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className={tdCls}>{formatDate(sale.date)}</td>
                  <td className={`${tdCls} max-w-[180px] truncate`} title={sale.productName}>
                    {sale.productName}
                  </td>
                  <td className={tdCls}>{formatINR(sale.costPrice)}</td>
                  <td className={tdCls}>
                    <ProfitCell value={sale.profit} />
                  </td>
                  <td className={tdCls}>{formatINR(sale.finalPrice)}</td>
                  <td className={tdCls}>{sale.customerName || "—"}</td>
                  <td className={tdCls}>{sale.customerPhone || "—"}</td>
                  <td className={`${tdCls} space-x-2`}>
                    <button
                      onClick={() => onEdit(sale)}
                      className="text-xs text-blue-600 hover:underline focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      disabled={deleting === sale.id}
                      className="text-xs text-red-500 hover:underline focus:outline-none disabled:opacity-50"
                    >
                      {deleting === sale.id ? "…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Totals row */}
            <tfoot className="bg-gray-50 border-t-2 border-gray-200">
              <tr>
                <td className="px-3 py-2 text-xs font-semibold text-gray-700" colSpan={2}>
                  Totals ({filtered.length} {filtered.length === 1 ? "sale" : "sales"})
                </td>
                <td className="px-3 py-2 text-xs font-semibold text-gray-700">
                  {formatINR(totals.costPrice)}
                </td>
                <td className="px-3 py-2 text-xs font-semibold">
                  <ProfitCell value={totals.profit} />
                </td>
                <td className="px-3 py-2 text-xs font-semibold text-gray-700">
                  {formatINR(totals.finalPrice)}
                </td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="p-4 text-center border-t border-gray-100">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="text-sm text-gray-600 border border-gray-200 rounded px-4 py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Load more ({filtered.length - visible.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
