"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Ticker } from "@/components/layout/Ticker";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <TopBar />
        <Ticker />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
