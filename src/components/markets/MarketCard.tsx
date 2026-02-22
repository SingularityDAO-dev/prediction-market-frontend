"use client";

import Link from "next/link";
import { Market } from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface MarketCardProps {
  market: Market;
  featured?: boolean;
}

export function MarketCard({ market, featured }: MarketCardProps) {
  const yesPercent = (market.yesPrice || 0.5) * 100;
  const noPercent = (market.noPrice || 0.5) * 100;
  const title = market.title || "Untitled Market";
  const category = market.category || "General";

  return (
    <Link
      href={`/markets/${market.conditionId}`}
      className={cn(
        "group relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
        featured && "lg:col-span-2 lg:row-span-2"
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative overflow-hidden",
          featured ? "h-48 lg:h-64" : "h-32"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full border border-primary/30">
            {category}
          </span>
        </div>
        {market.status === "RESOLVED" && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 text-xs font-medium rounded-full border border-emerald-500/30">
              Resolved
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className={cn(
            "font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors",
            featured ? "text-xl lg:text-2xl" : "text-base"
          )}
        >
          {title}
        </h3>

        {/* Probability Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-emerald-500 font-medium">Yes {yesPercent.toFixed(0)}%</span>
            <span className="text-red-500 font-medium">No {noPercent.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${yesPercent}%` }}
            />
            <div
              className="h-full bg-red-500 transition-all"
              style={{ width: `${noPercent}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Volume</span>
            <p className="font-semibold">{formatCurrency(market.volume)}</p>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">Liquidity</span>
            <p className="font-semibold">{formatCurrency(market.liquidity)}</p>
          </div>
        </div>

        {/* Sparkline */}
        <div className="mt-4 h-12">
          <svg className="w-full h-full" viewBox="0 0 100 40">
            <defs>
              <linearGradient id={`gradient-${market.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={market.yesPrice > 0.5 ? "#22c55e" : "#ef4444"} stopOpacity="0.3" />
                <stop offset="100%" stopColor={market.yesPrice > 0.5 ? "#22c55e" : "#ef4444"} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M 0,${40 - market.yesPrice * 40} Q 25,${40 - market.yesPrice * 35} 50,${40 - market.yesPrice * 30} T 100,${40 - market.yesPrice * 20}`}
              fill={`url(#gradient-${market.id})`}
              stroke={market.yesPrice > 0.5 ? "#22c55e" : "#ef4444"}
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </Link>
  );
}
