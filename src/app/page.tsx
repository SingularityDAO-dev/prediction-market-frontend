import { MarketCard } from "@/components/markets/MarketCard";
import { mockMarkets } from "@/data/mock";
import { cn } from "@/lib/utils";

const categories = ["All", "Crypto", "Politics", "Science", "Technology", "Sports"];

export default function HomePage() {
  const featuredMarket = mockMarkets[0];
  const otherMarkets = mockMarkets.slice(1);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-emerald-600/20 border border-white/10 p-8 lg:p-12">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Predict the Future{" "}
            <span className="text-gradient">Trade with Confidence</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Join the decentralized prediction market platform. Trade on politics, crypto, sports, and more.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
              Start Trading
            </button>
            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-emerald-500/30 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Filters */}
      <section className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <button
            key={category}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              index === 0
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {category}
          </button>
        ))}
      </section>

      {/* Featured Market */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Market</h2>
        <MarketCard market={featuredMarket} featured />
      </section>

      {/* Market Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">All Markets</h2>
          <button className="text-primary hover:text-primary/80 transition-colors">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </section>
    </div>
  );
}
