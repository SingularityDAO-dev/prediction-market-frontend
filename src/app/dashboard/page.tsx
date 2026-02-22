import { portfolioData, leaderboardData } from "@/data/mock";
import { formatCurrency, formatPercentage, cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

export default function DashboardPage() {
  const totalPnl = portfolioData.reduce((sum, item) => sum + item.pnl, 0);
  const totalValue = portfolioData.reduce((sum, item) => sum + item.amount, 0);
  const winRate = 65;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">@johndoe</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-sm font-medium rounded-full">
                Level 12 Trader
              </span>
              <span className="text-sm text-muted-foreground">
                Member since Feb 2024
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
            </div>
            <div className="text-center">
              <p
                className={cn(
                  "text-2xl font-bold",
                  totalPnl >= 0 ? "text-emerald-500" : "text-red-500"
                )}
              >
                {totalPnl >= 0 ? "+" : ""}
                {formatCurrency(totalPnl)}
              </p>
              <p className="text-sm text-muted-foreground">Total P&L</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{winRate}%</p>
              <p className="text-sm text-muted-foreground">Win Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">Trades</p>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">XP Progress</span>
            <span className="font-medium">2,450 / 3,000</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              style={{ width: "82%" }}
            />
          </div>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Your Positions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Market
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Position
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  P&L
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                  Return
                </th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500" />
                      <span className="font-medium">{item.market}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded",
                        item.position === "YES"
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-red-500/20 text-red-500"
                      )}
                    >
                      {item.position}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {formatCurrency(item.amount)}
                  </td>
                  <td
                    className={cn(
                      "py-4 px-4 text-right font-medium",
                      item.pnl >= 0 ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {item.pnl >= 0 ? "+" : ""}
                    {formatCurrency(item.pnl)}
                  </td>
                  <td
                    className={cn(
                      "py-4 px-4 text-right font-medium",
                      item.pnlPercent >= 0 ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {formatPercentage(item.pnlPercent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold">Top Traders</h2>
        </div>
        <div className="space-y-3">
          {leaderboardData.map((trader) => (
            <div
              key={trader.rank}
              className="flex items-center gap-4 p-4 bg-muted rounded-xl"
            >
              {/* Rank */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                  trader.rank === 1 && "bg-yellow-500 text-yellow-950",
                  trader.rank === 2 && "bg-gray-300 text-gray-800",
                  trader.rank === 3 && "bg-amber-600 text-white",
                  trader.rank > 3 && "bg-muted-foreground/20 text-muted-foreground"
                )}
              >
                {trader.rank}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {trader.name[0]}
              </div>

              {/* Name */}
              <div className="flex-1">
                <p className="font-semibold">{trader.name}</p>
                <p className="text-sm text-muted-foreground">
                  Win Rate: {trader.winRate}%
                </p>
              </div>

              {/* Profit */}
              <div className="text-right">
                <p className="font-semibold text-emerald-500">
                  +{formatCurrency(trader.profit)}
                </p>
                <p className="text-xs text-muted-foreground">All time profit</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
