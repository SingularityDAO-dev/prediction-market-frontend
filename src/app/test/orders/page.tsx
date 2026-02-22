"use client";

import { useState } from "react";
import { useWallet } from "@/lib/wallet";
import { 
  fetchOrderbook, 
  fetchTrades
} from "@/lib/api";

interface OrderTestResult {
  endpoint: string;
  status: "idle" | "loading" | "success" | "error";
  data?: unknown;
  error?: string;
}

export default function TestOrdersPage() {
  const { address, isConnected } = useWallet();
  const [marketId, setMarketId] = useState(
    "0xabcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab"
  );
  const [results, setResults] = useState<OrderTestResult[]>([]);

  async function testOrderbook() {
    setResults((prev) => [
      ...prev,
      { endpoint: "GET /markets/:id/orderbook", status: "loading" },
    ]);
    
    try {
      const data = await fetchOrderbook(marketId);
      setResults((prev) =>
        prev.map((r) =>
          r.endpoint === "GET /markets/:id/orderbook"
            ? { ...r, status: "success", data }
            : r
        )
      );
    } catch (error) {
      setResults((prev) =>
        prev.map((r) =>
          r.endpoint === "GET /markets/:id/orderbook"
            ? { ...r, status: "error", error: String(error) }
            : r
        )
      );
    }
  }

  async function testTrades() {
    setResults((prev) => [
      ...prev,
      { endpoint: "GET /markets/:id/trades", status: "loading" },
    ]);
    
    try {
      const data = await fetchTrades(marketId);
      setResults((prev) =>
        prev.map((r) =>
          r.endpoint === "GET /markets/:id/trades"
            ? { ...r, status: "success", data }
            : r
        )
      );
    } catch (error) {
      setResults((prev) =>
        prev.map((r) =>
          r.endpoint === "GET /markets/:id/trades"
            ? { ...r, status: "error", error: String(error) }
            : r
        )
      );
    }
  }

  async function testUserOrders() {
    if (!address) {
      alert("Connect wallet first");
      return;
    }
    
    setResults((prev) => [
      ...prev,
      { endpoint: "GET /users/:address/orders", status: "loading" },
    ]);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${address}/orders`
      );
      const data = await response.json();
      setResults((prev) =>
        prev.map((r) =>
          r.endpoint === "GET /users/:address/orders"
            ? { ...r, status: "success", data }
            : r
        )
      );
    } catch (error) {
      setResults((prev) =>
        prev.map((r) =>
          r.endpoint === "GET /users/:address/orders"
            ? { ...r, status: "error", error: String(error) }
            : r
        )
      );
    }
  }

  async function testUserBalances() {
    if (!address) {
      alert("Connect wallet first");
      return;
    }
    
    setResults((prev) => [
      ...prev,
      { endpoint: "GET /users/:address/balances", status: "loading" },
    ]);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${address}/balances`
      );
      const data = await response.json();
      setResults((prev) =>
        prev.map((r) =>
          r.endpoint === "GET /users/:address/balances"
            ? { ...r, status: "success", data }
            : r
        )
      );
    } catch (error) {
      setResults((prev) =>
        prev.map((r) =>
          r.endpoint === "GET /users/:address/balances"
            ? { ...r, status: "error", error: String(error) }
            : r
        )
      );
    }
  }

  function clearResults() {
    setResults([]);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Test Orders & Trades</h1>

      {/* Market ID Input */}
      <section className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Market ID</h2>
        <input
          type="text"
          value={marketId}
          onChange={(e) => setMarketId(e.target.value)}
          className="w-full px-4 py-3 bg-muted rounded-xl border border-border"
          placeholder="Enter market conditionId"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Using: {marketId.slice(0, 30)}...
        </p>
      </section>

      {/* Test Buttons */}
      <section className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Run Tests</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={testOrderbook}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Test Orderbook
          </button>
          <button
            onClick={testTrades}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Test Trades
          </button>
          <button
            onClick={testUserOrders}
            disabled={!isConnected}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Test User Orders
          </button>
          <button
            onClick={testUserBalances}
            disabled={!isConnected}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Test User Balances
          </button>
          <button
            onClick={clearResults}
            className="px-6 py-3 bg-muted rounded-xl font-semibold hover:bg-muted/80 transition-colors"
          >
            Clear Results
          </button>
        </div>
        {!isConnected && (
          <p className="mt-4 text-sm text-amber-500">
            ⚠️ Connect wallet to test user-specific endpoints
          </p>
        )}
      </section>

      {/* Results */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Results</h2>
        {results.length === 0 && (
          <p className="text-muted-foreground">No tests run yet. Click a button above.</p>
        )}
        {results.map((result, index) => (
          <div
            key={index}
            className={`glass rounded-xl p-4 border-l-4 ${
              result.status === "success"
                ? "border-emerald-500"
                : result.status === "error"
                ? "border-red-500"
                : "border-amber-500"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{result.endpoint}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  result.status === "success"
                    ? "bg-emerald-500/20 text-emerald-500"
                    : result.status === "error"
                    ? "bg-red-500/20 text-red-500"
                    : "bg-amber-500/20 text-amber-500"
                }`}
              >
                {result.status === "loading" && "⏳ Loading..."}
                {result.status === "success" && "✅ Success"}
                {result.status === "error" && "❌ Error"}
              </span>
            </div>
            {result.data !== undefined && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-1">Response:</p>
                <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto max-h-64 overflow-y-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
            {result.error && (
              <div className="mt-2 text-red-500 text-sm">{result.error}</div>
            )}
          </div>
        ))}
      </section>

      {/* Order Submission Test */}
      <section className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Submit Order (Manual)</h2>
        <p className="text-muted-foreground mb-4">
          To test order submission, you need to:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Connect your wallet</li>
          <li>Go to a market detail page</li>
          <li>Use the trading panel to submit an order</li>
          <li>Sign the EIP-712 message in MetaMask</li>
        </ol>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Order Structure:</p>
          <pre className="text-xs overflow-x-auto">
{`{
  "order": {
    "salt": "unique-nonce",
    "maker": "0x...",
    "signer": "0x...",
    "taker": "0x0",
    "tokenId": "1001",
    "makerAmount": "600000",
    "takerAmount": "1000000",
    "expiration": 9999999999,
    "nonce": "0",
    "feeRateBps": 200,
    "side": 0, // 0=BUY, 1=SELL
    "signatureType": 0
  },
  "signature": "0x..."
}`}
          </pre>
        </div>
      </section>
    </div>
  );
}
