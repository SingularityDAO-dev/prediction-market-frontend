"use client";

import { Search, Bell, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

export function TopBar() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-20">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search markets..."
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          {/* Balance */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-muted rounded-xl">
            <span className="text-muted-foreground">Balance:</span>
            <span className="font-semibold">{formatCurrency(24580)}</span>
          </div>

          {/* Connect Wallet Button */}
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Wallet className="w-5 h-5" />
            <span className="hidden sm:inline">Connect Wallet</span>
          </button>

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
            JD
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Connect Wallet</h3>
              <button
                onClick={() => setIsWalletModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {["MetaMask", "Phantom", "WalletConnect", "Coinbase Wallet"].map(
                (wallet) => (
                  <button
                    key={wallet}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {wallet[0]}
                    </div>
                    <span className="font-medium">{wallet}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
