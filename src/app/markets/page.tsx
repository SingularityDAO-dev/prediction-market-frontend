"use client";

import { useEffect, useState } from "react";
import { MarketCard } from "@/components/markets/MarketCard";
import { fetchMarkets, fetchCategories, Market } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [marketsData, categoriesData] = await Promise.all([
          fetchMarkets(),
          fetchCategories(),
        ]);
        setMarkets(marketsData);
        setCategories([{ category: "All", count: marketsData.length }, ...categoriesData]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load markets");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredMarkets = selectedCategory === "All" 
    ? markets 
    : markets.filter(m => m.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">All Markets</h1>
        <p className="text-muted-foreground">
          Browse and trade on prediction markets
        </p>
      </div>

      {/* Filters */}
      <section className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setSelectedCategory(cat.category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              selectedCategory === cat.category
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {cat.category} ({cat.count})
          </button>
        ))}
      </section>

      {/* Market Grid */}
      <section>
        {filteredMarkets.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No markets found in this category
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
