"use client";

import { useState } from "react";
import { formatCurrency, cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

export function TradingPanel() {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [leverage, setLeverage] = useState(1);
  const [amount, setAmount] = useState("");
  const [outcome, setOutcome] = useState<"yes" | "no">("yes");

  const maxLeverage = 10;
  const estimatedShares = amount ? parseFloat(amount) * leverage : 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      {/* Tabs */}
      <div className="flex rounded-xl bg-muted p-1 mb-6">
        <button
          onClick={() => setActiveTab("buy")}
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
            activeTab === "buy"
              ? "bg-emerald-500 text-white"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Buy
        </button>
        <button
          onClick={() => setActiveTab("sell")}
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
            activeTab === "sell"
              ? "bg-red-500 text-white"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Sell
        </button>
      </div>

      {/* Outcome Selection */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setOutcome("yes")}
          className={cn(
            "p-4 rounded-xl border-2 transition-all",
            outcome === "yes"
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-border hover:border-emerald-500/50"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">Yes</span>
            <span className="text-emerald-500">65¢</span>
          </div>
        </button>
        <button
          onClick={() => setOutcome("no")}
          className={cn(
            "p-4 rounded-xl border-2 transition-all",
            outcome === "no"
              ? "border-red-500 bg-red-500/10"
              : "border-border hover:border-red-500/50"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold">No</span>
            <span className="text-red-500">35¢</span>
          </div>
        </button>
      </div>

      {/* Leverage Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Leverage</span>
          <span className="text-sm font-semibold">{leverage}x</span>
        </div>
        <input
          type="range"
          min="1"
          max={maxLeverage}
          step="0.5"
          value={leverage}
          onChange={(e) => setLeverage(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1x</span>
          <span>{maxLeverage}x</span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="text-sm text-muted-foreground mb-2 block">Amount (USDC)</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-lg"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            USDC
          </span>
        </div>
      </div>

      {/* Estimated Shares */}
      <div className="p-4 bg-muted rounded-xl mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Estimated Shares</span>
          <span className="font-semibold">
            {estimatedShares.toFixed(2)} {outcome.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Max Profit</span>
          <span className="font-semibold text-emerald-500">
            {formatCurrency(estimatedShares * (outcome === "yes" ? 0.35 : 0.65))}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        className={cn(
          "w-full py-4 rounded-xl font-semibold text-white transition-all",
          activeTab === "buy"
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-red-500 hover:bg-red-600",
          !amount && "opacity-50 cursor-not-allowed"
        )}
        disabled={!amount}
      >
        {activeTab === "buy" ? "Buy" : "Sell"} {outcome.toUpperCase()}
      </button>

      {/* Fee Info */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Fee: 2% • Slippage tolerance: 0.5%
      </p>
    </div>
  );
}
