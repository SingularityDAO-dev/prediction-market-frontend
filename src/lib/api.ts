const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://prediction-market-backend-production-4e85.up.railway.app";

export interface Market {
  id: string;
  conditionId: string;
  questionId: string;
  title: string | null;
  description: string | null;
  category: string | null;
  image: string | null;
  yesTokenId: string;
  noTokenId: string;
  collateral: string;
  oracle: string;
  status: "ACTIVE" | "PAUSED" | "RESOLVED";
  yesPrice: number;
  noPrice: number;
  volume: number;
  liquidity: number;
  resolution: number | null;
  createdAt: string;
  resolvedAt: string | null;
  expirationDate: string | null;
  resolutionTx: string | null;
  resolvedOutcome: number | null;
}

export interface Orderbook {
  market: string;
  timestamp: number;
  bids: { price: string; size: string; numOrders: number }[];
  asks: { price: string; size: string; numOrders: number }[];
}

export interface Trade {
  id: string;
  marketId: string;
  price: string;
  amount: string;
  side: "BUY" | "SELL";
  timestamp: string;
}

export interface PriceHistory {
  market: string;
  interval: string;
  data: {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

// Fetch all markets
export async function fetchMarkets(): Promise<Market[]> {
  const response = await fetch(`${API_BASE_URL}/markets`);
  if (!response.ok) throw new Error("Failed to fetch markets");
  const data = await response.json();
  return data.markets || [];
}

// Fetch single market
export async function fetchMarket(conditionId: string): Promise<Market> {
  const response = await fetch(`${API_BASE_URL}/markets/${conditionId}`);
  if (!response.ok) throw new Error("Failed to fetch market");
  return response.json();
}

// Fetch orderbook
export async function fetchOrderbook(conditionId: string): Promise<Orderbook> {
  const response = await fetch(`${API_BASE_URL}/markets/${conditionId}/orderbook`);
  if (!response.ok) throw new Error("Failed to fetch orderbook");
  return response.json();
}

// Fetch trades
export async function fetchTrades(conditionId: string): Promise<Trade[]> {
  const response = await fetch(`${API_BASE_URL}/markets/${conditionId}/trades`);
  if (!response.ok) throw new Error("Failed to fetch trades");
  return response.json();
}

// Fetch price history
export async function fetchPriceHistory(
  conditionId: string,
  interval: "1h" | "1d" | "1w" = "1d"
): Promise<PriceHistory> {
  const response = await fetch(
    `${API_BASE_URL}/markets/${conditionId}/prices/history?interval=${interval}`
  );
  if (!response.ok) throw new Error("Failed to fetch price history");
  return response.json();
}

// Search markets
export async function searchMarkets(query: string): Promise<Market[]> {
  const response = await fetch(`${API_BASE_URL}/markets/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Failed to search markets");
  return response.json();
}

// Fetch categories
export async function fetchCategories(): Promise<{ category: string; count: number }[]> {
  const response = await fetch(`${API_BASE_URL}/markets/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
}
