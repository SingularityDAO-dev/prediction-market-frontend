# Prediction Market - Frontend Integration Guide

## API Base URL
```
Production: https://prediction-market-backend-production-4e85.up.railway.app
Swagger UI: https://prediction-market-backend-production-4e85.up.railway.app/api
Scalar UI: https://prediction-market-backend-production-4e85.up.railway.app/scalar
```

## Core API Endpoints

### 1. Markets
```typescript
// List all markets
GET /markets
Response: Market[]

// Get single market
GET /markets/:conditionId
Response: Market

// Create market (admin/operator)
POST /markets
Body: {
  conditionId: string;  // bytes32
  questionId: string;   // bytes32  
  yesTokenId: string;   // uint256
  noTokenId: string;    // uint256
  collateral: string;   // ERC20 address
  oracle: string;       // oracle address
}

// Update market (set expiration)
PATCH /markets/:conditionId
Body: {
  expirationDate?: string; // ISO date
  status?: "ACTIVE" | "PAUSED" | "RESOLVED";
}

// Get orderbook
GET /markets/:conditionId/orderbook
Response: {
  market: string;
  timestamp: number;
  bids: [{ price: string; size: string; numOrders: number }];
  asks: [{ price: string; size: string; numOrders: number }];
}

// Get trades
GET /markets/:conditionId/trades
Response: Trade[]
```

### 2. Orders (Trading)
```typescript
// Submit order
POST /orders
Body: {
  order: {
    salt: string;           // unique nonce
    maker: string;          // wallet address
    signer: string;         // signing address
    taker: string;          // specific taker (0x0 for public)
    tokenId: string;        // YES or NO token ID
    makerAmount: string;    // amount in wei
    takerAmount: string;    // amount in wei
    expiration: number;     // unix timestamp
    nonce: string;          // cancellation nonce
    feeRateBps: number;     // 200 = 2%
    side: 0 | 1;            // 0=BUY, 1=SELL
    signatureType: 0;       // 0=EOA
  };
  signature: string;        // EIP-712 signature
}

// List orders
GET /orders?marketId=&side=&status=

// Get order by hash
GET /orders/:orderHash

// Cancel order
DELETE /orders/:orderHash
```

### 3. User Data
```typescript
// Get user balances (USDC + position tokens)
GET /users/:address/balances
Response: {
  address: string;
  balances: Record<string, string>;
}

// Get user orders
GET /users/:address/orders
Response: Order[]

// Get user trades  
GET /users/:address/trades
Response: Trade[]
```

### 4. Operator (Auto-resolution)
```typescript
// Operator status + job queue
GET /operator/status
Response: {
  isProcessing: boolean;
  pendingResolutions: number;
  queuedJobs: { waiting: number; active: number; completed: number; failed: number };
  lastSync: string;
}

// Markets pending resolution
GET /operator/pending-resolutions
Response: {
  count: number;
  markets: [{ conditionId: string; questionId: string; expirationDate: string }];
}

// Manual resolve (admin/operator)
POST /operator/resolve/:marketId
Response: { status: "resolved" | "pending"; transactionHash?: string; message?: string }

// Poll UMA oracle
POST /operator/poll-uma/:marketId
Response: number | null  // 0=NO, 1=YES, null=not settled

// Sync blockchain events
POST /operator/sync-events
Response: { marketEvents: number; orderEvents: number; fromBlock: number; toBlock: number }
```

## Web3 Integration

### 1. Connect Wallet
```typescript
import { ethers } from "ethers";

// Connect
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const address = await signer.getAddress();

// Get chain info
const network = await provider.getNetwork();
const chainId = network.chainId; // Should be 31337 for Anvil
```

### 2. EIP-712 Order Signing
```typescript
const DOMAIN = {
  name: "Polymarket CTF Exchange",
  version: "1",
  chainId: 31337,
  verifyingContract: "0x0165878A594ca255338adfa4d48449f69242Eb8F"
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

async function signOrder(signer, order) {
  return await signer.signTypedData(DOMAIN, ORDER_TYPES, order);
}
```

### 3. Submit Trade Example
```typescript
async function submitTrade(
  signer: ethers.JsonRpcSigner,
  market: Market,
  side: "buy" | "sell",
  outcome: "yes" | "no",
  amount: string  // in USDC wei (6 decimals)
) {
  const address = await signer.getAddress();
  
  // Calculate amounts
  const tokenId = outcome === "yes" ? market.yesTokenId : market.noTokenId;
  const price = outcome === "yes" ? market.yesPrice : market.noPrice;
  const makerAmount = side === "buy" ? amount : "0";
  const takerAmount = side === "sell" ? amount : "0";
  
  // Build order
  const order = {
    salt: Date.now().toString(),
    maker: address,
    signer: address,
    taker: "0x0000000000000000000000000000000000000000",
    tokenId,
    makerAmount,
    takerAmount,
    expiration: Math.floor(Date.now() / 1000) + 86400, // 24h
    nonce: "0",
    feeRateBps: 200,
    side: side === "buy" ? 0 : 1,
    signatureType: 0,
  };
  
  // Sign
  const signature = await signOrder(signer, order);
  
  // Submit
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order, signature }),
  });
  
  return response.json();
}
```

## Contract Addresses (Anvil Testnet)
```typescript
const CONTRACTS = {
  USDC: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  ConditionalTokens: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  CTFExchange: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
  UMAAdapter: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
  Finder: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  OptimisticOracle: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
};
```

## React Hook Example
```typescript
// hooks/useMarkets.ts
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useMarkets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/markets`)
      .then((res) => res.json())
      .then((data) => {
        setMarkets(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { markets, loading, error };
}

// hooks/useOrderbook.ts
export function useOrderbook(conditionId: string) {
  const [orderbook, setOrderbook] = useState(null);
  
  useEffect(() => {
    if (!conditionId) return;
    
    const fetchOrderbook = () => {
      fetch(`${API_URL}/markets/${conditionId}/orderbook`)
        .then((res) => res.json())
        .then(setOrderbook);
    };
    
    fetchOrderbook();
    const interval = setInterval(fetchOrderbook, 5000); // Refresh every 5s
    
    return () => clearInterval(interval);
  }, [conditionId]);
  
  return orderbook;
}
```

## Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://prediction-market-backend-production-4e85.up.railway.app
NEXT_PUBLIC_RPC_URL=https://anvil-production-5be1.up.railway.app
NEXT_PUBLIC_CHAIN_ID=31337
```

## Test Accounts (Anvil)
```
# Account 0 - Operator
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Account 1 - Test User
Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

# Account 2 - Test User
Address: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

## Test Market
```
Condition ID: 0xabcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab
Question ID: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd12
Yes Token: 1001
No Token: 1002
```

## Important Notes

1. **No real-time price updates**: Prices come from backend, not on-chain AMM
2. **Order matching**: Backend matches orders (MINT/MERGE/SWAP), you sign and submit
3. **Gasless trading**: Orders are gasless, only settlement requires gas
4. **Expiration**: Markets need expirationDate set for auto-resolution
5. **UMA oracle**: Markets resolve via UMA Optimistic Oracle (2-hour liveness)

## Error Handling

Common errors:
- `400` - Invalid order signature
- `404` - Market not found
- `500` - Internal error (check UMA oracle status)

## Questions?

Backend repo: https://github.com/jjsentinel/prediction-market-backend
