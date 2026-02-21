"use client";

import { useEffect, useState } from "react";
import { runTests, mockMarket, validateMarket } from "@/lib/test-utils";
import { fetchMarkets } from "@/lib/api";

export default function TestPage() {
  const [testResults, setTestResults] = useState<{
    passed: number;
    failed: number;
    errors: string[];
  } | null>(null);
  const [apiTest, setApiTest] = useState<{
    status: "idle" | "loading" | "passed" | "failed";
    message: string;
  }>({ status: "idle", message: "" });

  useEffect(() => {
    // Run unit tests
    const results = runTests();
    setTestResults(results);
  }, []);

  async function testApiConnection() {
    setApiTest({ status: "loading", message: "Testing API connection..." });
    try {
      const markets = await fetchMarkets();
      if (markets.length > 0 && validateMarket(markets[0])) {
        setApiTest({
          status: "passed",
          message: `✅ API connection successful! Found ${markets.length} markets`,
        });
      } else {
        setApiTest({
          status: "failed",
          message: "❌ API returned invalid data",
        });
      }
    } catch (error) {
      setApiTest({
        status: "failed",
        message: `❌ API connection failed: ${error}`,
      });
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Test Results</h1>

      {/* Unit Tests */}
      <section className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Unit Tests</h2>
        {testResults ? (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-emerald-500/20 text-emerald-500 rounded-lg">
                ✅ Passed: {testResults.passed}
              </div>
              <div className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg">
                ❌ Failed: {testResults.failed}
              </div>
            </div>
            {testResults.errors.length > 0 && (
              <div className="p-4 bg-red-500/10 rounded-lg">
                <h3 className="font-medium mb-2">Errors:</h3>
                <ul className="space-y-1 text-sm">
                  {testResults.errors.map((error, i) => (
                    <li key={i} className="text-red-400">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">Running tests...</p>
        )}
      </section>

      {/* API Test */}
      <section className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
        <div className="space-y-4">
          <button
            onClick={testApiConnection}
            disabled={apiTest.status === "loading"}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {apiTest.status === "loading" ? "Testing..." : "Test API Connection"}
          </button>
          {apiTest.status !== "idle" && (
            <p
              className={
                apiTest.status === "passed"
                  ? "text-emerald-500"
                  : apiTest.status === "failed"
                  ? "text-red-500"
                  : "text-muted-foreground"
              }
            >
              {apiTest.message}
            </p>
          )}
        </div>
      </section>

      {/* Mock Data Test */}
      <section className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Mock Data Validation</h2>
        <div className="space-y-2">
          <p>
            <span className="text-muted-foreground">Market ID:</span>{" "}
            {mockMarket.id}
          </p>
          <p>
            <span className="text-muted-foreground">Condition ID:</span>{" "}
            {mockMarket.conditionId.slice(0, 20)}...
          </p>
          <p>
            <span className="text-muted-foreground">Yes Price:</span>{" "}
            {mockMarket.yesPrice}
          </p>
          <p>
            <span className="text-muted-foreground">No Price:</span>{" "}
            {mockMarket.noPrice}
          </p>
          <p>
            <span className="text-muted-foreground">Valid:</span>{" "}
            {validateMarket(mockMarket) ? (
              <span className="text-emerald-500">✅ Yes</span>
            ) : (
              <span className="text-red-500">❌ No</span>
            )}
          </p>
        </div>
      </section>

      {/* Wallet Test */}
      <section className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Wallet Integration</h2>
        <div className="space-y-2">
          <p>
            <span className="text-muted-foreground">Ethereum Provider:</span>{" "}
            {typeof window !== "undefined" && window.ethereum ? (
              <span className="text-emerald-500">✅ Available</span>
            ) : (
              <span className="text-red-500">❌ Not found (MetaMask not installed)</span>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
