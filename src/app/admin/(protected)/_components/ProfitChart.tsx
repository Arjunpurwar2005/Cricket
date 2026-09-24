"use client";

import { useMemo } from "react";

interface Sale {
  date: string;
  profit: number;
}

interface ProfitChartProps {
  sales: Sale[];
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProfitChart({ sales }: ProfitChartProps) {
  const bars = useMemo(() => {
    if (sales.length === 0) return [];

    // collect all month-keys present in data + the last 6 months up to the latest sale date
    const now = new Date();
    // Use the most recent sale date as anchor; fall back to now
    let anchor = now;
    if (sales.length > 0) {
      const latest = new Date(sales[0].date);
      if (!isNaN(latest.getTime())) anchor = latest;
    }

    // Build a set of the last 6 calendar months ending at anchor's month
    const monthKeys: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(anchor.getFullYear(), anchor.getMonth() - i, 1);
      monthKeys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    // aggregate profit per month
    const profitByMonth: Record<string, number> = {};
    monthKeys.forEach((k) => (profitByMonth[k] = 0));
    for (const s of sales) {
      const d = new Date(s.date);
      if (isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (key in profitByMonth) {
        profitByMonth[key] = (profitByMonth[key] || 0) + s.profit;
      }
    }

    return monthKeys.map((key) => {
      const [year, month] = key.split("-");
      return {
        key,
        label: `${MONTHS[parseInt(month) - 1]} ${year.slice(2)}`,
        profit: profitByMonth[key],
      };
    });
  }, [sales]);

  if (bars.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded p-6 text-center text-sm text-gray-400">
        No sales data yet.
      </div>
    );
  }

  const maxAbs = Math.max(...bars.map((b) => Math.abs(b.profit)), 1);
  const BAR_AREA_H = 80; // px for positive area; same for negative
  const TOTAL_H = BAR_AREA_H * 2; // SVG viewport height
  const BASELINE_Y = BAR_AREA_H;
  const BAR_W = 28;
  const GAP = 14;
  const LABEL_H = 20;
  const SVG_W = bars.length * (BAR_W + GAP) - GAP + 10;

  return (
    <div className="bg-white border border-gray-200 rounded p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">
        Profit by Month
      </p>
      <div className="overflow-x-auto">
        <svg
          width={SVG_W}
          height={TOTAL_H + LABEL_H + 4}
          aria-label="Profit by month bar chart"
        >
          {/* Baseline */}
          <line
            x1={0}
            y1={BASELINE_Y}
            x2={SVG_W}
            y2={BASELINE_Y}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
          {bars.map((bar, i) => {
            const x = i * (BAR_W + GAP) + 5;
            const barH = Math.round((Math.abs(bar.profit) / maxAbs) * (BAR_AREA_H - 4));
            const positive = bar.profit >= 0;
            const barY = positive ? BASELINE_Y - barH : BASELINE_Y;
            const fill = positive ? "#16a34a" : "#dc2626";

            return (
              <g key={bar.key}>
                <title>
                  {bar.label}: {formatINR(bar.profit)}
                </title>
                <rect
                  x={x}
                  y={barY}
                  width={BAR_W}
                  height={barH || 2}
                  fill={fill}
                  rx={3}
                  opacity={0.85}
                />
                <text
                  x={x + BAR_W / 2}
                  y={TOTAL_H + LABEL_H - 2}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#6b7280"
                >
                  {bar.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-xs text-gray-400 mt-1">Green = profit · Red = loss. Hover bar for amount.</p>
    </div>
  );
}
