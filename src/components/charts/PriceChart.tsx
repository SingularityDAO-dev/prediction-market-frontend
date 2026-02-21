"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchPriceHistory } from "@/lib/api";
import { cn } from "@/lib/utils";

type TimeRange = "1h" | "1d" | "1w";

interface PriceChartProps {
  marketId: string;
}

export function PriceChart({ marketId }: PriceChartProps) {
  const [activeRange, setActiveRange] = useState<TimeRange>("1d");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0.5);

  useEffect(() => {
    async function loadPriceHistory() {
      try {
        setLoading(true);
        const history = await fetchPriceHistory(marketId, activeRange);
        
        if (history.data && history.data.length > 0) {
          // Transform OHLC data for chart
          const chartData = history.data.map((d) => ({
            time: new Date(d.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              month: activeRange === "1w" ? 'short' : undefined,
              day: activeRange === "1w" ? 'numeric' : undefined,
            }),
            price: d.close,
            open: d.open,
            high: d.high,
            low: d.low,
          }));
          setData(chartData);
          setCurrentPrice(chartData[chartData.length - 1]?.price || 0.5);
        } else {
          // Generate mock data if no history
          setData(generateMockData(activeRange));
          setCurrentPrice(0.5);
        }
      } catch (error) {
        console.error("Failed to load price history:", error);
        setData(generateMockData(activeRange));
      } finally {
        setLoading(false);
      }
    }
    loadPriceHistory();
  }, [marketId, activeRange]);

  function generateMockData(range: TimeRange) {
    const points = range === "1h" ? 12 : range === "1d" ? 24 : 7;
    const data = [];
    let price = 0.5;
    
    for (let i = 0; i < points; i++) {
      price += (Math.random() - 0.5) * 0.05;
      price = Math.max(0.01, Math.min(0.99, price));
      
      const time = range === "1w" 
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]
        : `${String(i).padStart(2, "0")}:00`;
        
      data.push({ time, price });
    }
    return data;
  }

  const priceChange = data.length > 1 
    ? ((data[data.length - 1].price - data[0].price) / data[0].price) * 100 
    : 0;

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-sm text-muted-foreground">Current Price</span>
          <div className="text-2xl font-bold">{currentPrice.toFixed(2)} USDC</div>
          <div className={cn(
            "text-sm",
            priceChange >= 0 ? "text-emerald-500" : "text-red-500"
          )}>
            {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}% ({activeRange})
          </div>
        </div>
        <div className="flex gap-1">
          {(["1h", "1d", "1w"] as TimeRange[]).map((range) => (
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
              {range.toUpperCase()}
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
              domain={["auto", "auto"]}
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
              formatter={(value: number) => [value.toFixed(2), "Price"]}
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
