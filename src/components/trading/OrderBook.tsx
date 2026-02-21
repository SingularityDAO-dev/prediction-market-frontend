"use client";

import { Orderbook } from "@/lib/api";
import { cn, formatNumber } from "@/lib/utils";

interface OrderBookProps {
  orderbook: Orderbook | null;
}

export function OrderBook({ orderbook }: OrderBookProps) {
  if (!orderbook) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No orderbook data available
      </div>
    );
  }

  const bids = orderbook.bids || [];
  const asks = orderbook.asks || [];

  const allSizes = [...bids, ...asks].map((o) => parseFloat(o.size));
  const maxSize = allSizes.length > 0 ? Math.max(...allSizes) : 1;

  const spread = asks.length > 0 && bids.length > 0
    ? (parseFloat(asks[0].price) - parseFloat(bids[0].price)).toFixed(3)
    : "0.000";

  return (
    <div>
      {/* Asks (Sells) */}
      <div className="space-y-1 mb-4">
        {[...asks].slice(0, 5).reverse().map((ask, index) => {
          const size = parseFloat(ask.size);
          const price = parseFloat(ask.price);
          return (
            <div key={index} className="relative flex items-center justify-between py-1 px-2 text-sm">
              <div
                className="absolute right-0 top-0 bottom-0 bg-red-500/10 rounded"
                style={{ width: `${(size / maxSize) * 100}%` }}
              />
              <span className="relative text-red-500 font-medium">
                {price.toFixed(3)}
              </span>
              <span className="relative text-muted-foreground">
                {formatNumber(size)}
              </span>
            </div>
          );
        })}
        {asks.length === 0 && (
          <div className="text-center py-2 text-muted-foreground text-sm">
            No asks
          </div>
        )}
      </div>

      {/* Spread */}
      <div className="py-2 border-y border-border text-center">
        <span className="text-sm text-muted-foreground">Spread: </span>
        <span className="text-sm font-medium">{spread}</span>
      </div>

      {/* Bids (Buys) */}
      <div className="space-y-1 mt-4">
        {bids.slice(0, 5).map((bid, index) => {
          const size = parseFloat(bid.size);
          const price = parseFloat(bid.price);
          return (
            <div key={index} className="relative flex items-center justify-between py-1 px-2 text-sm">
              <div
                className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 rounded"
                style={{ width: `${(size / maxSize) * 100}%` }}
              />
              <span className="relative text-emerald-500 font-medium">
                {price.toFixed(3)}
              </span>
              <span className="relative text-muted-foreground">
                {formatNumber(size)}
              </span>
            </div>
          );
        })}
        {bids.length === 0 && (
          <div className="text-center py-2 text-muted-foreground text-sm">
            No bids
          </div>
        )}
      </div>
    </div>
  );
}
