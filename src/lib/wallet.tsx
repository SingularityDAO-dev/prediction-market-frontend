"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  chainId: number | null;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  chainId: null,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  // Check for existing connection on mount
  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      const ethereum = window.ethereum;
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);
      
      return () => {
        if (ethereum) {
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  async function checkConnection() {
    if (typeof window === "undefined") return;
    
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[];
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          const chain = await window.ethereum.request({ method: "eth_chainId" }) as string;
          setChainId(parseInt(chain, 16));
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  }

  function handleAccountsChanged(...args: unknown[]) {
    const accounts = args[0] as string[];
    if (accounts && Array.isArray(accounts)) {
      if (accounts.length === 0) {
        setAddress(null);
      } else {
        setAddress(accounts[0]);
      }
    }
  }

  function handleChainChanged(...args: unknown[]) {
    const chainId = args[0] as string;
    if (chainId && typeof chainId === "string") {
      setChainId(parseInt(chainId, 16));
      window.location.reload();
    }
  }

  async function connect() {
    if (typeof window === "undefined") return;
    
    if (!window.ethereum) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      }) as string[];
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        const chain = await window.ethereum.request({ method: "eth_chainId" }) as string;
        setChainId(parseInt(chain, 16));
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  }

  function disconnect() {
    setAddress(null);
    setChainId(null);
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        connect,
        disconnect,
        chainId,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}

// Extend Window interface for Ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

// Helper to safely get ethereum provider (handles multiple wallet conflicts)
export function getEthereumProvider() {
  if (typeof window === "undefined") return null;
  
  // Try to get the primary ethereum provider
  if (window.ethereum) {
    // If multiple providers, prefer MetaMask
    if (window.ethereum.isMetaMask) {
      return window.ethereum;
    }
    // Otherwise return the first one
    return window.ethereum;
  }
  
  return null;
}
