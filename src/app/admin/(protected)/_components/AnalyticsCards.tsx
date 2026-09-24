"use client";

import { useMemo } from "react";

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

interface AnalyticsCardsProps {
  sales: Sale[];
}

function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function AnalyticsCards({ sales }: AnalyticsCardsProps) {
  const stats = useMemo(() => {
    const count = sales.length;
    const totalInvestment = sales.reduce((s, x) => s + x.costPrice, 0);
    const totalProfit = sales.reduce((s, x) => s + x.profit, 0);
    const totalRevenue = sales.reduce((s, x) => s + x.finalPrice, 0);
    const avgProfit = count > 0 ? totalProfit / count : 0;
    const profitMargin =
      totalInvestment !== 0 ? (totalProfit / totalInvestment) * 100 : null;

    return { count, totalInvestment, totalProfit, totalRevenue, avgProfit, profitMargin };
  }, [sales]);

  const cards = [
    {
      label: "Total Investment",
      value: formatINR(stats.totalInvestment),
      highlight: false,
    },
    {
      label: "Total Profit",
      value: formatINR(stats.totalProfit),
      highlight: true,
      negative: stats.totalProfit < 0,
    },
    {
      label: "Total Revenue",
      value: formatINR(stats.totalRevenue),
      highlight: false,
    },
    {
      label: "Number of Sales",
      value: String(stats.count),
      highlight: false,
    },
    {
      label: "Avg Profit / Sale",
      value: stats.count > 0 ? formatINR(stats.avgProfit) : "—",
      highlight: true,
      negative: stats.avgProfit < 0,
    },
    {
      label: "Profit Margin %",
      value:
        stats.profitMargin !== null
          ? `${stats.profitMargin.toFixed(1)}%`
          : "—",
      highlight: true,
      negative: stats.profitMargin !== null && stats.profitMargin < 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white border border-gray-200 rounded p-5"
        >
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {card.label}
          </p>
          <p
            className={`mt-2 text-2xl font-semibold truncate ${
              card.highlight
                ? card.negative
                  ? "text-red-600"
                  : "text-green-600"
                : ""
            }`}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
