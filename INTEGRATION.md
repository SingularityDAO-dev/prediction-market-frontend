# Frontend Integration Guide

## API Base URL
```
Production: https://prediction-market-backend-production-4e85.up.railway.app
Local: http://localhost:3000
```

## API Endpoints

### Markets
```typescript
// List all markets
GET /markets

// Get market by condition ID
GET /markets/:conditionId

// Create new market
POST /markets
Body: {
  conditionId: string;
  questionId: string;
  yesTokenId: string;
  noTokenId: string;
  collateral: string;
  oracle: string;
}

// Update market (set expiration, etc)
PATCH /markets/:conditionId
Body: {
  expirationDate?: string;
  status?: "ACTIVE" | "PAUSED" | "RESOLVED";
}

// Get orderbook
GET /markets/:conditionId/orderbook

// Get trades
GET /markets/:conditionId/trades
```

### Orders
```typescript
// List all orders
GET /orders

// Get order by hash
GET /orders/:hash

// Create order
POST /orders
Body: {
  order: {
    salt: string;
    maker: string;
    signer: string;
    taker: string;
    tokenId: string;
    makerAmount: string;
    takerAmount: string;
    expiration: number;
    nonce: string;
    feeRateBps: number;
    side: 0 | 1;  // 0=BUY, 1=SELL
    signatureType: 0 | 1 | 2 | 3;
  };
  signature: string;
}

// Cancel order
DELETE /orders/:hash
```

### Users
```typescript
// Get user balances
GET /users/:address/balances

// Get user orders
GET /users/:address/orders

// Get user trades
GET /users/:address/trades
```

### Operator (Auto-resolution)
```typescript
// Get operator status
GET /operator/status

// Get pending resolutions
GET /operator/pending-resolutions

// Manual resolve market
POST /operator/resolve/:marketId

// Sync blockchain events
POST /operator/sync-events

// Poll UMA oracle
POST /operator/poll-uma/:marketId
```

## React Integration Example

### 1. API Client Setup
```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 
  "https://prediction-market-backend-production-4e85.up.railway.app";

export async function fetchMarkets() {
  const res = await fetch(`${API_BASE}/markets`);
  if (!res.ok) throw new Error("Failed to fetch markets");
  return res.json();
}

export async function fetchMarket(conditionId: string) {
  const res = await fetch(`${API_BASE}/markets/${conditionId}`);
  if (!res.ok) throw new Error("Failed to fetch market");
  return res.json();
}

export async function createOrder(orderData: any) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function fetchOrderbook(conditionId: string) {
  const res = await fetch(`${API_BASE}/markets/${conditionId}/orderbook`);
  if (!res.ok) throw new Error("Failed to fetch orderbook");
  return res.json();
}
```

### 2. React Hook Example
```typescript
// hooks/useMarkets.ts
import { useState, useEffect } from "react";
import { fetchMarkets } from "@/lib/api";

export function useMarkets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarkets()
      .then(setMarkets)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { markets, loading, error };
}
```

### 3. Component Integration
```typescript
// components/markets/MarketList.tsx
"use client";

import { useMarkets } from "@/hooks/useMarkets";
import { MarketCard } from "./MarketCard";

export function MarketList() {
  const { markets, loading, error } = useMarkets();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map((market) => (
        <MarketCard key={market.conditionId} market={market} />
      ))}
    </div>
  );
}
```

### 4. Trading Integration
```typescript
// components/trading/TradingPanel.tsx
"use client";

import { useState } from "react";
import { createOrder } from "@/lib/api";
import { useWallet } from "@/hooks/useWallet"; // Your wallet hook

export function TradingPanel({ marketId, tokenId }: { marketId: string; tokenId: string }) {
  const [amount, setAmount] = useState("");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const { address, signOrder } = useWallet();

  async function handleSubmit() {
    const order = {
      salt: Date.now().toString(),
      maker: address,
      signer: address,
      taker: "0x0000000000000000000000000000000000000000",
      tokenId,
      makerAmount: side === "buy" ? amount : "0",
      takerAmount: side === "sell" ? amount : "0",
      expiration: Math.floor(Date.now() / 1000) + 86400,
      nonce: "0",
      feeRateBps: 200,
      side: side === "buy" ? 0 : 1,
      signatureType: 0,
    };

    const signature = await signOrder(order);
    await createOrder({ order, signature });
  }

  return (
    <div>
      {/* Trading UI */}
    </div>
  );
}
```

## Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://prediction-market-backend-production-4e85.up.railway.app
NEXT_PUBLIC_RPC_URL=https://anvil-production-5be1.up.railway.app
NEXT_PUBLIC_CHAIN_ID=31337
```

## Web3 Integration

### EIP-712 Signing (for orders)
```typescript
// lib/signature.ts
const DOMAIN = {
  name: "Polymarket CTF Exchange",
  version: "1",
  chainId: 31337,
};

const ORDER_TYPES = {
  Order: [
    { name: "salt", type: "uint256" },
    { name: "maker", type: "address" },
    { name: "signer", type: "address" },
    { name: "taker", type: "address" },
    { name: "tokenId", type: "uint256" },
    { name: "makerAmount", type: "uint256" },
    { name: "takerAmount", type: "uint256" },
    { name: "expiration", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "feeRateBps", type: "uint256" },
    { name: "side", type: "uint8" },
    { name: "signatureType", type: "uint8" },
  ],
};

export async function signOrder(signer: any, order: any) {
  return signer._signTypedData(DOMAIN, ORDER_TYPES, order);
}
```

## Contract Addresses (Anvil Testnet)
```typescript
const CONTRACTS = {
  USDC: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  ConditionalTokens: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  CTFExchange: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  UMAAdapter: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
};
```

## Testing

### Test Accounts (Anvil)
```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
```

### Test Market
```
Condition ID: 0xabcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab
Question ID: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd12
Yes Token: 1001
No Token: 1002
```
