"use client";

import { leaderboardData } from "@/data/mock";
import { formatCurrency, cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold">Leaderboard</h1>
        </div>
        <p className="text-muted-foreground">
          Top traders ranked by all-time profit
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="space-y-3">
          {leaderboardData.map((trader) => (
            <div
              key={trader.rank}
              className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
            >
              {/* Rank */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                  trader.rank === 1 && "bg-yellow-500 text-yellow-950",
                  trader.rank === 2 && "bg-gray-300 text-gray-800",
                  trader.rank === 3 && "bg-amber-600 text-white",
                  trader.rank > 3 && "bg-muted-foreground/20 text-muted-foreground"
                )}
              >
                {trader.rank}
              </div>

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                {trader.name[0]}
              </div>

              {/* Name */}
              <div className="flex-1">
                <p className="font-semibold text-lg">{trader.name}</p>
                <p className="text-sm text-muted-foreground">
                  Win Rate: {trader.winRate}%
                </p>
              </div>

              {/* Profit */}
              <div className="text-right">
                <p className="font-semibold text-lg text-emerald-500">
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
