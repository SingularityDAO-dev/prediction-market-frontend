"use client";

import { useWallet } from "@/lib/wallet";
import { cn } from "@/lib/utils";
import { Wallet, LogOut, Loader2 } from "lucide-react";

interface ConnectButtonProps {
  className?: string;
}

export function ConnectButton({ className }: ConnectButtonProps) {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();

  if (isConnected && address) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className={cn(
        "px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold",
        "hover:bg-primary/90 transition-all flex items-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </>
      )}
    </button>
  );
}
