import { Market } from "./api";

/**
 * Test utilities for prediction market frontend
 */

// Mock market data for tests
export const mockMarket: Market = {
  id: "test-1",
  conditionId: "0xabcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
  questionId: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd12",
  title: "Test Market",
  description: "Test description",
  category: "Crypto",
  image: null,
  yesTokenId: "1001",
  noTokenId: "1002",
  collateral: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  oracle: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
  status: "ACTIVE",
  yesPrice: 0.65,
  noPrice: 0.35,
  volume: 1000000,
  liquidity: 500000,
  resolution: null,
  createdAt: "2026-02-20T00:00:00.000Z",
  resolvedAt: null,
  expirationDate: null,
  resolutionTx: null,
  resolvedOutcome: null,
};

// Test API response format
export function validateMarket(market: Market): boolean {
  return (
    typeof market.id === "string" &&
    typeof market.conditionId === "string" &&
    typeof market.yesPrice === "number" &&
    typeof market.noPrice === "number" &&
    market.yesPrice + market.noPrice <= 1.01 && // Allow small rounding errors
    market.yesPrice >= 0 &&
    market.yesPrice <= 1
  );
}

// Test price calculations
export function calculateProbability(yesPrice: number, noPrice: number): {
  yesPercent: number;
  noPercent: number;
} {
  const total = yesPrice + noPrice;
  if (total === 0) return { yesPercent: 50, noPercent: 50 };
  return {
    yesPercent: (yesPrice / total) * 100,
    noPercent: (noPrice / total) * 100,
  };
}

// Test wallet address formatting
export function formatAddress(address: string | null): string {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Test currency formatting
export function formatUSDC(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 1e6);
}

// Run tests
export function runTests(): { passed: number; failed: number; errors: string[] } {
  const errors: string[] = [];
  let passed = 0;
  let failed = 0;

  // Test 1: Market validation
  try {
    if (validateMarket(mockMarket)) {
      passed++;
    } else {
      failed++;
      errors.push("Market validation failed");
    }
  } catch (e) {
    failed++;
    errors.push(`Market validation error: ${e}`);
  }

  // Test 2: Probability calculation
  try {
    const result = calculateProbability(0.65, 0.35);
    if (result.yesPercent === 65 && result.noPercent === 35) {
      passed++;
    } else {
      failed++;
      errors.push(`Probability calculation failed: ${JSON.stringify(result)}`);
    }
  } catch (e) {
    failed++;
    errors.push(`Probability calculation error: ${e}`);
  }

  // Test 3: Address formatting
  try {
    const formatted = formatAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    if (formatted === "0x7099...79C8") {
      passed++;
    } else {
      failed++;
      errors.push(`Address formatting failed: ${formatted}`);
    }
  } catch (e) {
    failed++;
    errors.push(`Address formatting error: ${e}`);
  }

  // Test 4: Null address handling
  try {
    const formatted = formatAddress(null);
    if (formatted === "Not connected") {
      passed++;
    } else {
      failed++;
      errors.push(`Null address handling failed: ${formatted}`);
    }
  } catch (e) {
    failed++;
    errors.push(`Null address handling error: ${e}`);
  }

  // Test 5: USDC formatting
  try {
    const formatted = formatUSDC(1500000000); // 1500 USDC
    if (formatted === "$1,500") {
      passed++;
    } else {
      failed++;
      errors.push(`USDC formatting failed: ${formatted}`);
    }
  } catch (e) {
    failed++;
    errors.push(`USDC formatting error: ${e}`);
  }

  return { passed, failed, errors };
}

// Auto-run tests in browser console
if (typeof window !== "undefined") {
  console.log("Running unit tests...");
  const results = runTests();
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  if (results.errors.length > 0) {
    console.log("Errors:", results.errors);
  }
}
