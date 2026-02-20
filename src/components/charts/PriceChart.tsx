"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { chartData } from "@/data/mock";
import { cn } from "@/lib/utils";

type TimeRange = "1H" | "1D" | "1W";

export function PriceChart() {
  const [activeRange, setActiveRange] = useState<TimeRange>("1D");
  const data = chartData[activeRange];

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-sm text-muted-foreground">Current Price</span>
          <div className="text-2xl font-bold">0.65 USDC</div>
          <div className="text-sm text-emerald-500">+5.2% (24h)</div>
        </div>
        <div className="flex gap-1">
          {(["1H", "1D", "1W"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-all",
                activeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              domain={[0.5, 0.7]}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => value.toFixed(2)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [value.toFixed(2), "Price"]
              }
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
