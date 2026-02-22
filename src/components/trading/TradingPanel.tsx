"use client";

import { useState } from "react";
import { useWallet } from "@/lib/wallet";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Market } from "@/lib/api";

interface TradingPanelProps {
  market: Market;
  yesPrice: number;
  noPrice: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://prediction-market-backend-production-4e85.up.railway.app";

export function TradingPanel({ market, yesPrice, noPrice }: TradingPanelProps) {
  const { address, isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [outcome, setOutcome] = useState<"yes" | "no">("yes");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const tokenId = outcome === "yes" ? market.yesTokenId : market.noTokenId;
  const price = outcome === "yes" ? yesPrice : noPrice;
  const estimatedShares = amount ? parseFloat(amount) / price : 0;
  const side = activeTab === "buy" ? 0 : 1; // 0=BUY, 1=SELL

  async function submitOrder() {
    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      // Get chain ID
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" }) as string;
      const chainId = parseInt(chainIdHex, 16);
      
      // Check if on correct network (Anvil: 31337)
      const EXPECTED_CHAIN_ID = 31337;
      if (chainId !== EXPECTED_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${EXPECTED_CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError: unknown) {
          // If chain doesn't exist, try to add it
          if ((switchError as { code: number }).code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: `0x${EXPECTED_CHAIN_ID.toString(16)}`,
                chainName: "Anvil Local",
                rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8545"],
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
              }],
            });
          } else {
            throw new Error(`Please switch to chain ID ${EXPECTED_CHAIN_ID} (Anvil)`);
          }
        }
        // Re-fetch chain ID after switch
        const newChainIdHex = await window.ethereum.request({ method: "eth_chainId" }) as string;
        const newChainId = parseInt(newChainIdHex, 16);
        if (newChainId !== EXPECTED_CHAIN_ID) {
          throw new Error(`Please switch to chain ID ${EXPECTED_CHAIN_ID} (Anvil)`);
        }
      }
      
      // Build order data
      const salt = Date.now().toString();
      const makerAmount = Math.floor(parseFloat(amount) * 1e6).toString(); // USDC has 6 decimals
      const takerAmount = Math.floor(estimatedShares * 1e6).toString();
      const expiration = Math.floor(Date.now() / 1000) + 86400; // 24 hours
      
      const orderData = {
        salt,
        maker: address,
        signer: address,
        taker: "0x0000000000000000000000000000000000000000", // Public order
        tokenId,
        makerAmount,
        takerAmount,
        expiration,
        nonce: "0",
        feeRateBps: 200, // 2%
        side,
        signatureType: 0, // EOA
      };

      // Create EIP-712 domain
      const domain = {
        name: "Polymarket CTF Exchange",
        version: "1",
        chainId: EXPECTED_CHAIN_ID,
        verifyingContract: "0x0165878A594ca255338adfa4d48449f69242Eb8F", // CTFExchange address
      };

      // EIP-712 types
      const types = {
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

      // Request signature from user - MetaMask expects object, not JSON string
      const signature = await window.ethereum.request({
        method: "eth_signTypedData_v4",
        params: [address, { domain, types, primaryType: "Order", message: orderData }],
      }) as string;

      // Submit order to API
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderData, signature }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit order");
      }

      const result = await response.json();
      setSuccess(`Order submitted! Hash: ${result.order?.orderHash?.slice(0, 20)}...`);
      setAmount("");
    } catch (err) {
      console.error("Order submission error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit order");
    } finally {
      setLoading(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Trade</h2>
        <p className="text-muted-foreground mb-4">Connect your wallet to start trading</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4">Trade</h2>

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
            <span className="text-emerald-500">{(yesPrice * 100).toFixed(0)}¢</span>
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
            <span className="text-red-500">{(noPrice * 100).toFixed(0)}¢</span>
          </div>
        </button>
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
            disabled={loading}
            className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-lg disabled:opacity-50"
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
          <span className="text-muted-foreground">Price</span>
          <span className="font-semibold">{(price * 100).toFixed(0)}¢</span>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-4 text-red-500 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-4 text-emerald-500 text-sm">
          {success}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={submitOrder}
        disabled={loading || !amount}
        className={cn(
          "w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2",
          activeTab === "buy"
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-red-500 hover:bg-red-600",
          (loading || !amount) && "opacity-50 cursor-not-allowed"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Signing...
          </>
        ) : (
          <>
            {activeTab === "buy" ? "Buy" : "Sell"} {outcome.toUpperCase()}
          </>
        )}
      </button>

      {/* Fee Info */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        Fee: 2% • Orders are signed with EIP-712
      </p>
    </div>
  );
}
