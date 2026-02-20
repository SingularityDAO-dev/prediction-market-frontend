import { mockMarkets } from "@/data/mock";
import { PriceChart } from "@/components/charts/PriceChart";
import { TradingPanel } from "@/components/trading/TradingPanel";
import { OrderBook } from "@/components/trading/OrderBook";
import { notFound } from "next/navigation";

interface MarketPageProps {
  params: {
    id: string;
  };
}

export default function MarketPage({ params }: MarketPageProps) {
  const market = mockMarkets.find((m) => m.conditionId === params.id);

  if (!market) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Market Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
              {market.category}
            </span>
            {market.status === "RESOLVED" && (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 text-xs font-medium rounded-full">
                Resolved
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold">{market.title}</h1>
          <p className="text-muted-foreground mt-2">{market.description}</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <span className="text-sm text-muted-foreground">Volume</span>
            <p className="text-xl font-semibold">
              ${(market.volume / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm text-muted-foreground">Liquidity</span>
            <p className="text-xl font-semibold">
              ${(market.liquidity / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart & Info */}
        <div className="lg:col-span-2 space-y-6">
          <PriceChart />
          
          {/* Market Details */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Market Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Condition ID</span>
                <p className="font-mono truncate">{market.conditionId}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Question ID</span>
                <p className="font-mono truncate">{market.questionId}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Collateral Token</span>
                <p className="font-mono truncate">{market.collateral}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Oracle</span>
                <p className="font-mono truncate">{market.oracle}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Created</span>
                <p>{new Date(market.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Expires</span>
                <p>
                  {market.expirationDate
                    ? new Date(market.expirationDate).toLocaleDateString()
                    : "No expiration"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Book */}
          <OrderBook />
        </div>

        {/* Right Column - Trading Panel */}
        <div>
          <TradingPanel />
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Discussion</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 bg-muted rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                U{i}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">User {i}</span>
                  <span className="text-xs text-muted-foreground">
                    {i}h ago
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This market looks interesting! I think the probability is
                  higher than current pricing suggests.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
