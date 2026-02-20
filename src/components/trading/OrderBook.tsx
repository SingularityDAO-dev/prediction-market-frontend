"use client";

import { orderBookData } from "@/data/mock";
import { cn, formatNumber } from "@/lib/utils";

export function OrderBook() {
  const maxSize = Math.max(
    ...orderBookData.bids.map((b) => b.size),
    ...orderBookData.asks.map((a) => a.size)
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Order Book</h3>

      {/* Asks (Sells) */}
      <div className="space-y-1 mb-4">
        {[...orderBookData.asks].reverse().map((ask, index) => (
          <div key={index} className="relative flex items-center justify-between py-1 px-2 text-sm">
            <div
              className="absolute right-0 top-0 bottom-0 bg-red-500/10 rounded"
              style={{ width: `${(ask.size / maxSize) * 100}%` }}
            />
            <span className="relative text-red-500 font-medium">
              {ask.price.toFixed(2)}
            </span>
            <span className="relative text-muted-foreground">
              {formatNumber(ask.size)}
            </span>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="py-2 border-y border-border text-center">
        <span className="text-sm text-muted-foreground">Spread: </span>
        <span className="text-sm font-medium">
          {(orderBookData.asks[0].price - orderBookData.bids[0].price).toFixed(2)}
        </span>
      </div>

      {/* Bids (Buys) */}
      <div className="space-y-1 mt-4">
        {orderBookData.bids.map((bid, index) => (
          <div key={index} className="relative flex items-center justify-between py-1 px-2 text-sm">
            <div
              className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 rounded"
              style={{ width: `${(bid.size / maxSize) * 100}%` }}
            />
            <span className="relative text-emerald-500 font-medium">
              {bid.price.toFixed(2)}
            </span>
            <span className="relative text-muted-foreground">
              {formatNumber(bid.size)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
