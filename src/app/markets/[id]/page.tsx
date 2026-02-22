"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useWallet } from "@/lib/wallet";
import { fetchMarket, fetchOrderbook, fetchTrades, Market, Orderbook, Trade } from "@/lib/api";
import { PriceChart } from "@/components/charts/PriceChart";
import { TradingPanel } from "@/components/trading/TradingPanel";
import { OrderBook } from "@/components/trading/OrderBook";
import { formatCurrency } from "@/lib/utils";

export default function MarketPage() {
  const params = useParams();
  const [market, setMarket] = useState<Market | null>(null);
  const [orderbook, setOrderbook] = useState<Orderbook | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const marketId = params.id as string;

  useEffect(() => {
    async function loadMarket() {
      try {
        setLoading(true);
        const [marketData, orderbookData, tradesData] = await Promise.all([
          fetchMarket(marketId),
          fetchOrderbook(marketId).catch(() => null),
          fetchTrades(marketId).catch(() => []),
        ]);
        setMarket(marketData);
        setOrderbook(orderbookData);
        setTrades(tradesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load market");
      } finally {
        setLoading(false);
      }
    }
    loadMarket();
  }, [marketId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-500">{error || "Market not found"}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  const yesPercent = (market.yesPrice || 0.5) * 100;
  const noPercent = (market.noPrice || 0.5) * 100;
  const title = market.title || "Untitled Market";
  const category = market.category || "General";

  return (
    <div className="space-y-6">
      {/* Market Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
              {category}
            </span>
            {market.status === "RESOLVED" && (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 text-xs font-medium rounded-full">
                Resolved
              </span>
            )}
            {market.status === "ACTIVE" && (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 text-xs font-medium rounded-full">
                Active
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">{market.description || "No description"}</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <span className="text-sm text-muted-foreground">Volume</span>
            <p className="text-xl font-semibold">{formatCurrency(market.volume)}</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-muted-foreground">Liquidity</span>
            <p className="text-xl font-semibold">{formatCurrency(market.liquidity)}</p>
          </div>
        </div>
      </div>

      {/* Probability Bar */}
      <div className="glass rounded-xl p-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-emerald-500 font-medium">Yes {yesPercent.toFixed(0)}%</span>
          <span className="text-red-500 font-medium">No {noPercent.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden flex">
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart & Orderbook */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Price History</h2>
            <PriceChart marketId={marketId} />
          </div>
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Order Book</h2>
            <OrderBook orderbook={orderbook} />
          </div>
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Trades</h2>
            {trades.length === 0 ? (
              <p className="text-muted-foreground">No trades yet</p>
            ) : (
              <div className="space-y-2">
                {trades.map((trade, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{trade.side}</span>
                    <span>{trade.price}</span>
                    <span>{trade.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trading Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <TradingPanel 
              market={market} 
              yesPrice={market.yesPrice}
              noPrice={market.noPrice}
            />
          </div>
        </div>
      </div>

      {/* Market Details */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Market Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Condition ID</span>
            <p className="font-mono">{market.conditionId.slice(0, 30)}...</p>
          </div>
          <div>
            <span className="text-muted-foreground">Collateral Token</span>
            <p className="font-mono">{market.collateral}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Oracle</span>
            <p className="font-mono">{market.oracle.slice(0, 30)}...</p>
          </div>
          <div>
            <span className="text-muted-foreground">YES Token ID</span>
            <p>{market.yesTokenId}</p>
          </div>
          <div>
            <span className="text-muted-foreground">NO Token ID</span>
            <p>{market.noTokenId}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Created</span>
            <p>{new Date(market.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
