"use client";

import { tickerData } from "@/data/mock";
import { formatCurrency, formatPercentage, cn } from "@/lib/utils";

export function Ticker() {
  const items = [...tickerData, ...tickerData]; // Duplicate for infinite scroll

  return (
    <div className="h-10 bg-card border-y border-border overflow-hidden flex items-center">
      <div className="animate-ticker flex items-center gap-8 whitespace-nowrap">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="font-semibold text-sm">{item.symbol}</span>
            <span className="text-sm">{formatCurrency(item.price)}</span>
            <span
              className={cn(
                "text-sm font-medium",
                item.change >= 0 ? "text-emerald-500" : "text-red-500"
              )}
            >
              {formatPercentage(item.change)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
